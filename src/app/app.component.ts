import { Component, inject, OnInit } from '@angular/core';
import { TuiRoot } from '@taiga-ui/core';
import { Router, RouterOutlet } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-root',
  imports: [TuiRoot, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private router = inject(Router);
  private apiService = inject(ApiService);
  private dataService = inject(DataService);

  ngOnInit(): void {
    this.handleStorage();
    this.redirectAuthenticated();
  }

  private redirectAuthenticated(): void {
    const userData = localStorage.getItem('userData');
    const route = this.router.url;

    if (userData) {
      this.apiService.userData = JSON.parse(userData);
      if (route == '/login') {
        this.router.navigateByUrl('/');
      }
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  private handleStorage(): void {
    const settingsStorage = localStorage.getItem('settings');
    if (settingsStorage) {
      const parsedStorage = JSON.parse(settingsStorage);
      this.dataService.settings = parsedStorage;
    } else {
      localStorage.setItem('settings', JSON.stringify(this.dataService.settings));
    }
  }

  title = 'traker';
}
