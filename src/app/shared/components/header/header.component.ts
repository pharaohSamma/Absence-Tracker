import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from 'src/app/interfaces/user';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  route?: string;
}

interface QuickAction {
  icon: string;
  label: string;
  route: string;
  color: string;
  roles: string[];
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private userSubscription?: Subscription;

  // UI State
  showNotifications = false;
  showUserMenu = false;
  showQuickActions = false;

  // Sample notifications (in real app, these would come from a service)
  notifications: NotificationItem[] = [
    {
      id: '1',
      title: 'Nouvelle absence signalée',
      message: 'Marie Dupont - Classe 3A',
      time: 'Il y a 5 minutes',
      read: false,
      type: 'warning',
      route: '/admin/absences',
    },
    {
      id: '2',
      title: 'Rapport mensuel disponible',
      message: 'Statistiques de Mars 2025',
      time: 'Il y a 1 heure',
      read: true,
      type: 'info',
      route: '/admin/reports',
    },
  ];

  // Quick actions based on user role
  private allQuickActions: QuickAction[] = [
    // Admin actions
    {
      icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
      label: 'Ajouter Utilisateur',
      route: '/admin/users/new',
      color: 'text-blue-600',
      roles: ['ADMIN'],
    },
    {
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      label: 'Générer Rapport',
      route: '/admin/reports/generate',
      color: 'text-green-600',
      roles: ['ADMIN'],
    },
    // Teacher actions
    {
      icon: 'M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4h3a2 2 0 012 2v1l-1 5a2 2 0 01-2 2H6a2 2 0 01-2-2l-1-5V9a2 2 0 012-2h3z',
      label: 'Marquer Absence',
      route: '/teacher/attendance/mark',
      color: 'text-red-600',
      roles: ['TEACHER'],
    },
    {
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      label: 'Mes Classes',
      route: '/teacher/classes',
      color: 'text-purple-600',
      roles: ['TEACHER'],
    },
    // Student actions
    {
      icon: 'M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4h3a2 2 0 012 2v1l-1 5a2 2 0 01-2 2H6a2 2 0 01-2-2l-1-5V9a2 2 0 012-2h3z',
      label: 'Justifier Absence',
      route: '/student/absences/justify',
      color: 'text-orange-600',
      roles: ['STUDENT'],
    },
    {
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      label: 'Mon Relevé',
      route: '/student/attendance/report',
      color: 'text-indigo-600',
      roles: ['STUDENT'],
    },
    // Parent actions
    {
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      label: 'Mes Enfants',
      route: '/parent/children',
      color: 'text-teal-600',
      roles: ['PARENT'],
    },
  ];

  quickActions: QuickAction[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSubscription = this.authService
      .getCurrentUser()
      .subscribe((user) => {
        this.currentUser = user;
        this.updateQuickActions();
        this.updateNotifications();
      });

    // Close dropdowns when clicking outside
    document.addEventListener('click', this.closeDropdowns.bind(this));
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    document.removeEventListener('click', this.closeDropdowns.bind(this));
  }

  private updateQuickActions(): void {
    if (!this.currentUser?.role) {
      this.quickActions = [];
      return;
    }

    this.quickActions = this.allQuickActions.filter((action) =>
      action.roles.includes(this.currentUser!.role)
    );
  }

  private updateNotifications(): void {
    // In a real app, you'd fetch notifications based on user role
    // For now, we'll filter existing notifications
    if (this.currentUser?.role === 'ADMIN') {
      // Admin sees all notifications
    } else {
      // Other roles see filtered notifications
      this.notifications = this.notifications.filter(
        (notif) => !notif.route?.includes('/admin/')
      );
    }
  }

  private closeDropdowns(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.showNotifications = false;
      this.showUserMenu = false;
      this.showQuickActions = false;
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
    this.showQuickActions = false;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
    this.showQuickActions = false;
  }

  toggleQuickActions(): void {
    this.showQuickActions = !this.showQuickActions;
    this.showNotifications = false;
    this.showUserMenu = false;
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

  getRoleDisplayName(): string {
    if (!this.currentUser?.role) return '';

    switch (this.currentUser.role) {
      case 'ADMIN':
        return 'Administrateur';
      case 'TEACHER':
        return 'Enseignant';
      case 'STUDENT':
        return 'Étudiant';
      case 'PARENT':
        return 'Parent';
      default:
        return this.currentUser.role;
    }
  }

  getUnreadNotificationsCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  markNotificationAsRead(notification: NotificationItem): void {
    notification.read = true;
    if (notification.route) {
      this.router.navigate([notification.route]);
    }
    this.showNotifications = false;
  }

  markAllNotificationsAsRead(): void {
    this.notifications.forEach((n) => (n.read = true));
  }

  navigateToQuickAction(action: QuickAction): void {
    this.router.navigate([action.route]);
    this.showQuickActions = false;
  }

  navigateToProfile(): void {
    const profileRoute = `/${this.currentUser?.role?.toLowerCase()}/profile`;
    this.router.navigate([profileRoute]);
    this.showUserMenu = false;
  }

  navigateToSettings(): void {
    const settingsRoute = `/${this.currentUser?.role?.toLowerCase()}/settings`;
    this.router.navigate([settingsRoute]);
    this.showUserMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
