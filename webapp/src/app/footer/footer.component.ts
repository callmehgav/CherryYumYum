import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor(private http: HttpClient) {}

  trackButtonClick(label: string) {
    this.http.post(environment.apiUrl + '/insights/track', { 
      eventType: "ButtonClick",
      label: label +" Link"
    }).subscribe({
      next: () => console.log(`Button click tracked: ${label}`),
      error: err => console.error('Button click tracking error:', err)
    });
  }
}

