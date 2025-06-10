import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import type { TuiDialogContext } from '@taiga-ui/core';
import { TuiAutoFocus, tuiAutoFocusOptionsProvider } from '@taiga-ui/cdk';
import { injectContext } from '@taiga-ui/polymorpheus';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonLoading, TuiFiles } from '@taiga-ui/kit';
import {
  TuiAlertService,
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiIcon,
} from '@taiga-ui/core';
import { TuiInputModule, TuiTextareaModule } from '@taiga-ui/legacy';
import { Order } from '../../interfaces/order.interface';
import { NgFor, NgIf } from '@angular/common';
import { TuiPreview, TuiPreviewDialogService } from '@taiga-ui/kit';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import {
  TuiSelectModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { ApiService } from '../../services/api.service';
import { OrderLocation, OrderStatus } from '../../types/order';
import { orderMap } from '../../shared/map';
import { TrackingInfo } from '../../interfaces/tracking-info.interface';
import { TuiTable } from '@taiga-ui/addon-table';
import CustomDate from '../../shared/customDate';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    TuiDataListWrapper,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiTextareaModule,
    ReactiveFormsModule,
    FormsModule,
    TuiInputModule,
    TuiDropdown,
    TuiIcon,
    TuiButton,
    TuiDataList,
    NgFor,
    NgIf,
    TuiPreview,
    TuiButtonLoading,
    TuiAutoFocus,
    TuiFiles,
    TuiTable,
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
  providers: [tuiAutoFocusOptionsProvider({ preventScroll: true })],
})
export class ItemComponent {
  public readonly context = injectContext<TuiDialogContext<string, Order>>();

  @ViewChild('preview')
  protected readonly preview?: TemplateRef<TuiDialogContext>;

  @ViewChild('tracking')
  protected readonly tracking?: TemplateRef<TuiDialogContext>;
  private readonly previewDialogService = inject(TuiPreviewDialogService);
  private readonly alerts = inject(TuiAlertService);

  private readonly apiService = inject(ApiService);

  protected get data(): Order {
    return this.context.data;
  }

  //Variables
  public client: string | undefined = this.getClientName();
  public trackingNumber: string = this.data.trackingNumber;
  public description: string = this.data.description;
  public previewImg: string = '';
  public images: File[] = [];

  public isSubmitLoading: boolean = false;
  public isDeleteLoading: boolean = false;
  public isTrackingLoading: boolean = false;

  public translatedStatus = orderMap.status;
  public translatedContent = orderMap.location;

  public trackingInfo: TrackingInfo[] = [];
  public trackingInfoColumns: any;

  protected close(): void {
    this.context.completeWith('close');
  }

  public onChangeFile(files: File[]) {
    this.images = files;

    let imageRow = document.getElementById('imageRow');
    if (!imageRow) return;

    files.forEach((file: File) => {
      let src = URL.createObjectURL(file);
      this.data.thumbnails.push(src);
    });
  }

  public showImage(image: string) {
    const fullImage = image.replace('?thumb=64x128', '');
    this.previewImg = fullImage;
    this.previewDialogService.open(this.preview || '').subscribe();
  }

  public status: OrderStatus = this.getStatus();
  public locationReferer: OrderLocation = this.getLocation();

  private getStatus(): OrderStatus {
    if (!this.data) return 'order';

    return this.data.status;
  }

  private getLocation(): OrderLocation {
    if (!this.data.location) return 'unknown';
    return this.data.location;
  }

  private getClientName(): string {
    if (!this.data) return '-';

    return this.data.client;
  }

  public saveChanges() {
    this.isSubmitLoading = true;

    if (!this.client) {
      //Canot submit without a name
      this.isSubmitLoading = false;
      return;
    }

    const formData = new FormData();

    for (const file of this.images) {
      formData.append('images+', file);
    }

    formData.append('client', this.client);
    formData.append('description', this.description);
    formData.append('location', this.locationReferer);
    formData.append('status', this.status);
    formData.append('trackingNumber', this.trackingNumber);

    if (this.data.id && this.data.id != '') {
      formData.append('id', this.data.id);

      this.apiService.updateOrder(formData, this.data.id).subscribe({
        next: (order: any) => {
          this.isSubmitLoading = false;
          this.context.completeWith('success');
        },
      });
    } else {
      if (!this.data) return;

      //Create new order
      this.apiService.createOrder(formData).subscribe({
        next: (order: any) => {
          console.info(`Created: ${order}`);
          this.isSubmitLoading = false;
          this.context.completeWith('success');
        },
        error: (error: any) => {
          this.handleError(error);
        },
      });
    }
  }

  public deleteOrder(): void {
    if (!this.data.id) return;

    this.isDeleteLoading = true;
    this.apiService.deleteOrder(this.data.id).subscribe({
      next: () => {
        console.log('[ DEBUG ] - Order deleted...');
        this.isDeleteLoading = false;
        this.context.completeWith('success');
      },
      error: (error: any) => {
        this.handleError(error);
      },
    });
  }

  public trackOrder() {
    if (this.trackingNumber.length == 0) return;

    this.isTrackingLoading = true;
    this.apiService.getTrackingInfo(this.trackingNumber).subscribe({
      next: (info: any) => {
        this.isTrackingLoading = false;

        let data: TrackingInfo[] = [];
        info.forEach((item: TrackingInfo) => {
          data.push({
            location: item.location,
            statusName: item.statusName,
            statusTime: CustomDate.humanizeDate(item.statusTime),
          });
        });
        
        this.trackingInfo = data;
        this.trackingInfoColumns = Object.keys(this.trackingInfo[0]);
        this.previewDialogService.open(this.tracking || '').subscribe();
      },
      error: (error: any) => {
        this.handleError(error);
      },
    });
  }

  private handleError(error: any) {
    const msg = error?.error?.message;
    if (msg) {
      if (msg.includes('Failed to create record.')) {
        this.alerts
          .open('Provjerite sva polja.', {
            label: 'Greška: kreiranje naružbe',
            appearance: 'error',
          })
          .subscribe();
      } else {
        this.alerts.open(msg, { label: 'Greška' }).subscribe();
      }
    }
  }
}
