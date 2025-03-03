import { Component, inject } from '@angular/core';
import { TuiButton, type TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { InventoryItem } from '../../interfaces/inventory-item.interface';
import { LazyImgComponent } from '../lazy-img/lazy-img.component';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { TuiInputModule } from '@taiga-ui/legacy';
import CustomDate from '../../shared/customDate';
import { TuiButtonLoading } from '@taiga-ui/kit';

@Component({
  selector: 'app-inventory-item',
  imports: [
    LazyImgComponent,
    FormsModule,
    TuiInputModule,
    TuiButton,
    TuiButtonLoading,
  ],
  templateUrl: './inventory-item.component.html',
  styleUrl: './inventory-item.component.scss',
})
export class InventoryItemComponent {
  public readonly context = injectContext<TuiDialogContext<string, InventoryItem>>();
  private dataService = inject(DataService);

  isSubmitLoading: boolean = false;

  protected get data(): InventoryItem {
    return this.context.data;
  }

  protected get thumbnail(): string {
    return this.dataService.getImage(this.data.collectionId, this.data.id, this.data.thumbnail, "150x200");
  }

  protected get timeAgo(): { key: string, value: number } {
    return CustomDate.calculateTimeAgo(this.data.updated);
  }

  protected close(): void {
    this.context.completeWith('close');
  }

  saveChanges() {
    if (isNaN(this.data.quantity)) return;
    this.isSubmitLoading = true;

    this.dataService.updateIventoryQuantity(this.data.id, this.data.quantity).subscribe({
      next: () => {
        this.isSubmitLoading = false;
        this.context.completeWith('success');
      },
    });

  }
}
