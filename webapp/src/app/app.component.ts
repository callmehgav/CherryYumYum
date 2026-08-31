import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { WebSocketService } from './services/websocket.service';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { FooterComponent } from './footer/footer.component';
import { InstagramSectionComponent } from './components/instagram-section/instagram-section.component';
import { AboutSectionComponent } from './components/about/about-section.component';
import { LinkTreeComponent } from './components/linkTree/link-tree.component';
import { ContactMeComponent } from './components/contact-me/contact-me.component';
import { AdminLoginComponent } from './components/login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

@Component({
    selector: 'app-root',
    imports: [
    HeaderComponent,
    HeroComponent,
    RouterModule,
    FooterComponent,
    AboutSectionComponent,
    LinkTreeComponent,
    ContactMeComponent,
    AdminLoginComponent,
    AdminDashboardComponent
],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showHeader = true;
  message: string = '';
  messageLog: string[] = [];
  isConnected = false;

  isAdminPanelOpen = false;
  isAdminDashboardVisible = false;
  isAdminLoggedIn = false;
  adminInsights = {};
  cdr: any;

  constructor(private webSocketService: WebSocketService, private router: Router) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));

    this.webSocketService.connect();
    this.webSocketService.connectionStatus.subscribe(status => this.isConnected = status);

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEnd = event as NavigationEnd;
        this.showHeader = navEnd.urlAfterRedirects !== '/';
      });
  }

  toggleAdminPanel() {
    this.isAdminPanelOpen = !this.isAdminPanelOpen;
  }

  toggleAdminDashboard() {
    this.isAdminDashboardVisible = !this.isAdminDashboardVisible;
  }

  handleAdminLoginSuccess() {
    this.isAdminLoggedIn = true;
    this.isAdminPanelOpen = false; // close login
    this.isAdminDashboardVisible = true; // open dashboard

    this.adminInsights = {
      visitsToday: 42,
      visitsThisWeek: 231,
      activeUsers: 17
    };
    this.cdr.detectChanges(); // force refresh
  }

  closeConnection() {
    this.webSocketService.close();
  }
}
