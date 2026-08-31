import { Component, EventEmitter, HostListener, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-header',
    imports: [RouterModule],
    templateUrl: './header.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  lastScrollTop = 0;
  isVisible = true;

  @Input() showAdminButton = false;
  @Output() adminToggle = new EventEmitter<void>();

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const st = window.scrollY || document.documentElement.scrollTop;
    this.isVisible = st <= this.lastScrollTop;
    this.lastScrollTop = st <= 0 ? 0 : st;
  }

  onAdminClick() {
    this.adminToggle.emit();
  }
}
