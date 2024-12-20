import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-loading',
  imports: [TuiIcon],
  template: `<tui-icon icon="@tui.loader-circle" [style.color]="'blue'" />`,
  styleUrl: './loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent { }
