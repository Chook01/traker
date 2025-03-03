import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { TuiButton } from '@taiga-ui/core/components/button';
import { TuiLink } from '@taiga-ui/core/components/link';
import { TuiNotification } from '@taiga-ui/core/components/notification';
import { TuiTitle } from '@taiga-ui/core/directives/title';
import { DataService } from '../../services/data.service';
import { NotificationItem } from '../../interfaces/notification.interface';

@Component({
  selector: 'app-notifications',
  imports: [TuiButton, TuiNotification, TuiTitle, TuiIcon],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {

  notifications = signal<NotificationItem[] | undefined>(undefined);

  private dataService = inject(DataService);

  public ngOnInit(): void {
    this.dataService.getNotifications().subscribe((notifications: { items: NotificationItem[] }) => {
      this.notifications.set(notifications.items);
    })
  }
}
