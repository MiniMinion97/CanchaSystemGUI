import { Component } from '@angular/core';

@Component({
  selector: 'app-owner-contact',
  imports: [],
  templateUrl: './owner-contact.html',
  styleUrl: './owner-contact.css'
})
export class OwnerContact {
   protected openWhatsApp(): void {
    const phoneNumber = '5492235348845';
    const message = encodeURIComponent('¡Hola! Me gustaría obtener más información sobre el servicio para dueños de canchas.');
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  }
}
