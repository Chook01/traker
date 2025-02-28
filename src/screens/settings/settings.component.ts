import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiLabel } from '@taiga-ui/core';
import { TuiSwitch } from '@taiga-ui/kit';
import { HeaderComponent } from '../../components/header/header.component';
import { Settings } from '../../interfaces/settings.interface';
@Component({
  selector: 'app-settings',
  imports: [FormsModule, ReactiveFormsModule, TuiSwitch, TuiLabel, TuiButton],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {

  public orderButtonSide: boolean = false;
  public listLocationVisible: boolean = true;

  ngOnInit(): void {
    const settingsStorage = localStorage.getItem('settings');
    if (settingsStorage) {
      const parsedStorage: Settings = JSON.parse(settingsStorage);
      this.orderButtonSide = parsedStorage.order_button_side_left;
      this.listLocationVisible = parsedStorage.list_location_visible;
    }
  }

  public updateSettings(): void {
    const localSettings = JSON.stringify({ order_button_side_left: this.orderButtonSide, list_location_visible: this.listLocationVisible });
    localStorage.setItem('settings', localSettings);
  }

  public logout(): void {
    localStorage.clear();
    location.reload();
  }
}
