import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { TuiButton } from '@taiga-ui/core/components/button';
import { TuiLink } from '@taiga-ui/core/components/link';
import { TuiNotification } from '@taiga-ui/core/components/notification';
import { TuiTitle } from '@taiga-ui/core/directives/title';
import { DataService } from '../../services/data.service';
import { NotificationItem } from '../../interfaces/notification.interface';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [NgIf,TuiButton, TuiNotification, TuiTitle, TuiIcon],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {

  notifications = signal<NotificationItem[] | []>([]);

  private dataService = inject(DataService);

  public ngOnInit(): void {
    this.refreshNotifications();
  }

  public markNotificationAsRead(id: string): void {
    this.dataService.readNotification(id).subscribe({
      next: () => {
        this.refreshNotifications();
      }
    });
  }

  public markAllNotificationsAsRead(): void {
    if (this.notifications()?.length) {
      let apiCalls = {};
      this.notifications()?.forEach((noti: NotificationItem) => {
        apiCalls = {
          ...apiCalls,
          [noti.id]: this.dataService.readNotification(noti.id)
        }
      });

      forkJoin(apiCalls).subscribe({
        next: () => {
          this.refreshNotifications();
        }
      });
    }
  }

  public refreshNotifications(): void {
    this.dataService.getNotifications().subscribe((notifications: { items: NotificationItem[] }) => {
      this.notifications.set(notifications.items);
    })
  }
}
