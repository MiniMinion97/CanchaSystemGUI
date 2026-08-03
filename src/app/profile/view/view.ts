import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../auth/services/authservice';
import { Client } from '../client/client';
import { Owner } from '../owner/owner';
import { Admin } from '../admin/admin';

@Component({
  selector: 'app-view',
  imports: [Client, Owner, Admin],
  templateUrl: './view.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './view.css'
})
export class View {
  private readonly authservice = inject(AuthService);
  protected readonly role = this.authservice.role;

  protected logged = this.authservice.loggedIn;
  

  
}
