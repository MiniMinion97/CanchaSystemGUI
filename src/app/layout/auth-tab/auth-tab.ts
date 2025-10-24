import { Component, HostListener} from '@angular/core';
import { Login } from '../../auth/login/login';
import { Register } from '../../auth/register/register';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-tab',
  standalone: true,
  imports: [CommonModule, Login, Register],
  templateUrl: './auth-tab.html',
  styleUrls: ['./auth-tab.css']
})
export class AuthTab {
  isOpen = false;
  activeTab: 'login' | 'register' = 'login';

  togglePanel(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.isOpen = !this.isOpen;
  }

  closePanel() {
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.auth-panel') && !target.closest('.auth-trigger')) {
      this.closePanel();
    }
  }
}
