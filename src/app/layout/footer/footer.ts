import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  protected readonly currentYear = new Date().getFullYear();

  protected openWhatsApp(): void {
    const phoneNumber = '5492235348845';
    const message = encodeURIComponent('¡Hola! Tengo una consulta sobre CanchaSystem.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  }
}