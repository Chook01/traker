import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import type { TuiDialogContext } from '@taiga-ui/core';
import { TuiAutoFocus, tuiAutoFocusOptionsProvider } from '@taiga-ui/cdk';
import { injectContext } from '@taiga-ui/polymorpheus';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonLoading, TuiFiles } from '@taiga-ui/kit';
import { TuiAlertService, TuiButton, TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { TuiInputModule, TuiTextareaModule } from '@taiga-ui/legacy';
import { Order } from '../../interfaces/order.interface';
import { NgFor, NgIf } from '@angular/common';
import { TuiPreview, TuiPreviewDialogService } from '@taiga-ui/kit';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { ApiService } from '../../services/api.service';

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
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
  providers: [tuiAutoFocusOptionsProvider({ preventScroll: true })],

})
export class ItemComponent {

  public readonly context = injectContext<TuiDialogContext<string, Order>>();

  @ViewChild('preview')
  protected readonly preview?: TemplateRef<TuiDialogContext>;
  private readonly previewDialogService = inject(TuiPreviewDialogService);
  private readonly alerts = inject(TuiAlertService);

  private readonly apiService = inject(ApiService);

  protected get data(): Order {
    return this.context.data;
  }

  //Variables
  public client: string | undefined = this.getClientName();
  public description: string = this.data.description;
  public previewImg: string = "";
  public images: File[] = [];

  public isSubmitLoading: boolean = false;
  public isDeleteLoading: boolean = false;

  public translatedStatus = {
    order: 'Naručeno',
    done: 'Gotovo',
    delivery: 'Poslano',
    payment: 'Plaćeno',
  }

  public translatedContent = {
    shop: 'Web Shop',
    graver_elite: 'graver.elite',
    daske_za_rezanje: 'daske_za_rezanje',
    olx: 'OLX.ba',
    messenger: 'Messenger',
    unknown: '-',
    personal: 'Uživo'
  }


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

  public status: 'order' | 'done' | 'delivery' | 'payment' = this.getStatus();
  public locationReferer: 'shop' | 'graver_elite' | 'daske_za_rezanje' | 'olx' | 'messenger' | 'unknown' | 'personal' = this.getLocation();

  private getStatus(): 'order' | 'done' | 'delivery' | 'payment' {
    if (!this.data) return 'order';

    return this.data.status;
  }

  private getLocation(): 'shop' | 'graver_elite' | 'daske_za_rezanje' | 'olx' | 'messenger' | 'unknown' | 'personal' {
    if (!this.data.location) return 'unknown';
    return this.data.location;
  }

  private getClientName(): string {
    if (!this.data) return '-';

    return this.data.client;
  }

  public saveChanges() {
    this.isSubmitLoading = true;

    if (!this.client) { //Canot submit without a name
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
        }
      });
    }
  }

  public deleteOrder(): void {
    if(!this.data.id) return;
    
    this.isDeleteLoading = true;
    this.apiService.deleteOrder(this.data.id).subscribe({
      next: () => {
        console.log("[ DEBUG ] - Order deleted...");
        this.isDeleteLoading = false;
        this.context.completeWith('success');
      },
      error: (error: any) => {
        this.handleError(error);
      }
    });
  }

  private handleError(error: any) {
    const msg = error?.error?.message;
    if (msg) {
      if (msg.includes('Failed to create record.')) {
        this.alerts
          .open('Provjerite sva polja.', { label: 'Greška: kreiranje naružbe', appearance: 'error' })
          .subscribe();
      } else {
        this.alerts
          .open(msg, { label: 'Greška' })
          .subscribe();
      }
    }
  }

}
