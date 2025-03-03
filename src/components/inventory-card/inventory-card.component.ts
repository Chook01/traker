import { Component, inject, input, OnInit, signal } from '@angular/core';
import { TuiPlatform } from '@taiga-ui/cdk';
import { TuiAlertService, TuiAppearance, TuiButton, tuiDialog, TuiIcon, TuiLink, TuiTitle } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { InventoryItem } from '../../interfaces/inventory-item.interface';
import { DataService } from '../../services/data.service';
import { LazyImgComponent } from '../lazy-img/lazy-img.component';
import { InventoryItemComponent } from '../inventory-item/inventory-item.component';

@Component({
  selector: 'app-inventory-card',
  imports: [
    TuiAppearance,
    TuiButton,
    TuiCardLarge,
    TuiHeader,
    TuiPlatform,
    TuiIcon,
    TuiBadge,
    LazyImgComponent
  ],
  templateUrl: './inventory-card.component.html',
  styleUrl: './inventory-card.component.scss',
})
export class InventoryCardComponent implements OnInit {

  private dataService = inject(DataService);
  private alerts = inject(TuiAlertService);

  item = input.required<InventoryItem>();
  thumbnail = "";

  isLoading = signal<boolean>(false);

  private readonly dialog = tuiDialog(InventoryItemComponent, {
    dismissible: true,
    label: 'Pregled inventara',
  });

  public ngOnInit(): void {
    this.thumbnail = this.getThumbnail(this.item());
  }

  private getThumbnail(item: InventoryItem): string {
    return this.dataService.getImage(item.collectionId, item.id, item.thumbnail, "150x200");
  }

  changeQuantity(type: 'add' | 'subtract'): void {
    this.isLoading.set(true);
    const newQuantity = type === 'add' ? this.item().quantity + 1 : this.item().quantity - 1;

    this.dataService.updateIventoryQuantity(this.item().id, newQuantity).subscribe({
      next: (response: InventoryItem) => {
        this.item().quantity = response.quantity;
        this.isLoading.set(false);
      },
    });
  }

  openItem(): void {
    this.showDialog();
  }

  protected showDialog(): void {
    if (!this.item()) return;

    this.dialog(this.item()).subscribe({
      next: (data) => {
        console.info(`Dialog emitted data = ${data}`);
        if(data == 'success') {
          this.alerts
          .open('Uspješno ažuriran inventar.', { label: 'Inventar', appearance: 'positive' })
          .subscribe();
        }
      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }

}