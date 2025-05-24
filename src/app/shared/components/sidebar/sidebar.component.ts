import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from 'src/app/interfaces/user';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  badge?: string;
  badgeColor?: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isCollapsed = false;
  private userSubscription?: Subscription;

  private allMenuItems: MenuItem[] = [
    {
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
      label: 'Tableau de bord',
      route: '/admin/dashboard',
      roles: ['ADMIN'],
    },
    {
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
      label: 'Utilisateurs',
      route: '/admin/users',
      roles: ['ADMIN'],
    },
    {
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
      label: 'Tableau de bord',
      route: '/teacher/dashboard',
      roles: ['TEACHER'],
    },
    {
      icon: 'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0z',
      label: 'Mes Classes',
      route: '/teacher/classes',
      roles: ['TEACHER'],
    },
    {
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
      label: 'Tableau de bord',
      route: '/student/dashboard',
      roles: ['STUDENT'],
    },
    {
      icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5',
      label: 'Mes Absences',
      route: '/student/absences',
      roles: ['STUDENT'],
    },
    {
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
      label: 'Tableau de bord',
      route: '/parent/dashboard',
      roles: ['PARENT'],
    },
    {
      icon: 'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0z',
      label: 'Mes Enfants',
      route: '/parent/children',
      roles: ['PARENT'],
    },
  ];

  menuItems: MenuItem[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSubscription = this.authService
      .getCurrentUser()
      .subscribe((user) => {
        this.currentUser = user;
        this.updateMenuItems();
      });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private updateMenuItems(): void {
    if (!this.currentUser?.role) {
      this.menuItems = [];
      return;
    }

    this.menuItems = this.allMenuItems.filter((item) =>
      item.roles.includes(this.currentUser!.role)
    );
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
  }

  getUserName(): string {
    if (!this.currentUser) return 'Utilisateur';

    if (this.currentUser.firstName && this.currentUser.lastName) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return this.currentUser.username;
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';

    if (this.currentUser.firstName && this.currentUser.lastName) {
      return `${this.currentUser.firstName.charAt(
        0
      )}${this.currentUser.lastName.charAt(0)}`.toUpperCase();
    }
    return this.currentUser.username.charAt(0).toUpperCase();
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
}
