import { Component, HostListener, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-hero',
    imports: [
    RouterModule,
    HeroComponent
],
    templateUrl: './hero.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  scrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }
}