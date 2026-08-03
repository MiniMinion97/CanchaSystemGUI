import { Component, HostListener, inject, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { Login } from '../../auth/login/login';
import { Register } from '../../auth/register/register';

import { AuthService } from '../../auth/services/authservice';

@Component({
  selector: 'app-auth-tab',
  standalone: true,
  imports: [Login, Register],
  templateUrl: './auth-tab.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./auth-tab.css']
})
export class AuthTab {
  private readonly authService = inject(AuthService);

  protected logged = this.authService.loggedIn;

  isOpen = signal(false);
  activeTab: 'login' | 'register' = 'login';

  constructor() {
    effect(() => {
      if (this.authService.loggedIn()) {
        this.isOpen.set(false);
      }
    });
  }
  togglePanel(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.isOpen.set(!this.isOpen());
  }

  closePanel() {
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.auth-panel') && !target.closest('.auth-trigger')) {
      this.closePanel();
    }
  }

  handleLogout(){
    this.authService.logout();
  }
}
