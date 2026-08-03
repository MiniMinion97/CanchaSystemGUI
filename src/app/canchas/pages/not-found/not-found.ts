import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './not-found.css'
})
export class NotFound {
  private readonly router = inject(Router);

  protected goHome(): void {
    this.router.navigate(['/explorar']);
  }
}