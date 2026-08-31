import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-admin-login',
    imports: [FormsModule],
    templateUrl: './admin-login.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  username = "Admin";
  password = 'Password';
  loggedIn = false;
  message = '';          // Holds success/error messages
  messageColor = '';     // Controls text color ('red' or 'green')

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loggedIn = localStorage.getItem('isAdmin') === 'true';
  }

  closePanel() {
    // Implement closing logic as needed
  }
login() {
  const body = { username: this.username, password: this.password };

  this.http.post(environment.apiUrl+'/admin/login', body).subscribe({
    next: (res: any) => {
      if (res.success) {
        this.message = 'Admin login successful.';
        this.messageColor = 'green';
        localStorage.setItem('isAdmin', 'true');
      } else {
        this.message = 'Incorrect username or password.';
        this.messageColor = 'red';
      }
    },
    error: err => {
      console.error('Login error:', err);
      this.message = 'Incorrect username or password.';
      this.messageColor = 'red';
    }
  });
}


  logout() {
    this.loggedIn = false;
    localStorage.removeItem('isAdmin');
    alert('Logged out.');
  }
}
