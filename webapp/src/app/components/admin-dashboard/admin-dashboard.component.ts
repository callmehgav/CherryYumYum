import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'app-admin-dashboard',
    imports: [],
    templateUrl: './admin-dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  @Input() insights: any;
  @Output() closeDashboard = new EventEmitter<void>();

  close() {
    this.closeDashboard.emit();
  }
}
