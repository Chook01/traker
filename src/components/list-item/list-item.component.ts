import { Component, Input, OnInit } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { tuiDialog } from '@taiga-ui/core';
import { ItemComponent } from '../item/item.component';
import { Order } from '../../interfaces/order.interface';
import { NgIf } from '@angular/common';
import { DataService } from '../../services/data.service';
import CustomDate from '../../shared/customDate';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [TuiIcon, NgIf],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss',
})

export class ListItemComponent implements OnInit {

  @Input() data!: Order;
  @Input() first: boolean = false;
  @Input() last: boolean = false;

  icon = this.getIcon();
  timeAgo = { key: '', value: 0 }
  public locationVisible = true;

  public translatedContent = {
    shop: 'Web Shop',
    graver_elite: 'graver.elite',
    daske_za_rezanje: 'daske_za_rezanje',
    olx: 'OLX.ba',
    messenger: 'Messenger',
    unknown: '-',
    personal: 'Uživo'
  }

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.icon = this.getIcon();
    this.timeAgo = this.getTimeAgo();
    this.locationVisible = this.getLocationVisible();
  }

  private getTimeAgo(): { key: string, value: number } {
    if (!this.data.created) return { key: '', value: 0 };
    return CustomDate.calculateTimeAgo(this.data?.created);
  }

  private getLocationVisible(): boolean {
    return this.dataService && this.dataService.settings?.list_location_visible;
  }

  private getIcon(): { name: string, color: string } {
    let name;
    let color;

    if (!this.data) return { name: '', color: '' };

    if (this.data?.status === 'order') {
      name = '@tui.circle';
      color = 'gray';
    } else if (this.data?.status === 'done') {
      name = '@tui.check';
      color = 'orange';
    } else if (this.data?.status === 'delivery') {
      name = '@tui.package-check';
      color = 'blue';
    } else if (this.data?.status === 'payment') {
      name = '@tui.dollar-sign';
      color = 'green';
    } else {
      name = '@tui.circle';
      color = 'gray';
    }

    return { name, color };
  }

  private readonly dialog = tuiDialog(ItemComponent, {
    dismissible: true,
    label: 'Pregled narudžbe',
  });

  protected showDialog(): void {
    if (!this.data) return;
    this.data.thumbnails = this.getImages();

    this.dialog(this.data).subscribe({
      next: (data) => {
        console.info(`Dialog emitted data = ${data}`);
        this.dataService.orderUpdate$.emit(true);
      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }

  private getImages(): string[] {
    if (!this.data) return [''];

    return this.data.images.map((image: string) => {
      return this.dataService.getImage(this.data.collectionId, this.data.id, image, "64x128");
    });
  }

}
