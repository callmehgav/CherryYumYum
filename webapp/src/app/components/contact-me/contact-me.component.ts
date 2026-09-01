import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-contact-me',
    imports: [FormsModule],
    templateUrl: './contact-me.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./contact-me.component.css']
})
export class ContactMeComponent {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  };

  loading = false;
  success = false;

  // separate flags for clarity
  fieldError = false;
  apiError = false;

  constructor(private http: HttpClient) {}

  submitForm() {
    this.success = false;
    this.fieldError = false;
    this.apiError = false;

    // validate required fields
    if (!this.formData.firstName.trim() || !this.formData.email.trim()) {
      this.fieldError = true;
      console.warn('Missing required fields.');
      return;
    }

    this.loading = true;

    this.http.post(`${environment.apiUrl}/contact`, this.formData)
      .subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          this.formData = { firstName: '', lastName: '', email: '', phone: '', message: '' };
        },
        error: err => {
          console.error('API request failed:', err);
          this.apiError = true;
          this.loading = false;
        }
      });
  }

}
