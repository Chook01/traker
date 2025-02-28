import { Component, inject, input, OnInit } from '@angular/core';
import { InventoryCardComponent } from '../../components/inventory-card/inventory-card.component';
import { DataService } from '../../services/data.service';
import { InventoryItem } from '../../interfaces/inventory-item.interface';

@Component({
  selector: 'app-inventory',
  imports: [InventoryCardComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
  standalone: true,
})
export class InventoryComponent implements OnInit {
  private dataService = inject(DataService);
  public inventory: InventoryItem[] = [];

  public ngOnInit(): void {
    this.getInventory();
  }

  private getInventory() {
    this.dataService.getInventory().subscribe((inventory: { items: InventoryItem[] }) => {
      this.inventory = inventory.items;
    });
  }
}
