import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-lazy-img',
  imports: [],
  templateUrl: './lazy-img.component.html',
  styleUrl: './lazy-img.component.scss',
})
export class LazyImgComponent {

  src = input<string>('');
  width = input<string>('100%');
  height = input<string>('7rem');
  hasLoaded = signal<boolean>(false);

  public onImgLoad() {
    this.hasLoaded.set(true);
  }
}
