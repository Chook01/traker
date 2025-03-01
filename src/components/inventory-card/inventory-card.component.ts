import { Component, inject, input, OnInit, signal } from '@angular/core';
import { TuiPlatform } from '@taiga-ui/cdk';
import { TuiAppearance, TuiButton, TuiIcon, TuiLink, TuiTitle } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { InventoryItem } from '../../interfaces/inventory-item.interface';
import { DataService } from '../../services/data.service';
import { LazyImgComponent } from '../lazy-img/lazy-img.component';

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

  item = input.required<InventoryItem>();
  thumbnail = "";

  isLoading = signal<boolean>(false);

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

}