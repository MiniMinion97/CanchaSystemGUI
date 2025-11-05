import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/services/authservice';

@Component({
  selector: 'app-view',
  imports: [],
  templateUrl: './view.html',
  styleUrl: './view.css'
})
export class View {
  private readonly authservice = inject(AuthService);
  protected readonly role = this.authservice.getRole();

  
}
