import { Component, inject } from '@angular/core';
import { BrandService } from '../../services/brand/brand-service';

@Component({
  selector: 'app-brand-form',
  imports: [],
  templateUrl: './brand-form.html',
  styleUrl: './brand-form.css'
})
export class BrandForm {
  private readonly brandService = inject(BrandService);
}
