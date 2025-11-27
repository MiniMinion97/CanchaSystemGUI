import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ReviewService } from '../../reviews/review-service';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/services/authservice';

@Component({
  selector: 'app-admin-reviews',
  imports: [],
  templateUrl: './admin-reviews.html',
  styleUrl: './admin-reviews.css'
})
export class AdminReviews implements OnInit {
private readonly reviewService = inject(ReviewService);
  private readonly router = inject(RouterOutlet);
  private readonly authService = inject(AuthService);

  protected loading = signal<boolean>(true);
  protected reviews = signal<any[]>([]);

  type = input<string>(); 
  protected id = this.router.activatedRoute.snapshot.paramMap.get('id');

  constructor() {
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  private loadReviews() {
    const adminId = this.authService.getCurrentClientId();

    if (!adminId) {
      console.error('❌ No hay admin logueado');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);

    let obs;
    console.log('type: ', this.type());
    console.log('id: ', this.id);
    if (this.type() === 'client') {
      console.log('client');
      obs = this.reviewService.getReviewsByClient(this.id!);
    } else if (this.type() === 'establishment') {
      console.log('establishment');
      obs = this.reviewService.getReviewsByEstablishment(Number(this.id));
    } else {
      obs = this.reviewService.getReviews();
    }
    obs.subscribe({
      next: (res) => {
        console.log('✅ Reviews cargadas:', res);
        this.reviews.set(res);
        this.loading.set(false);
        console.log('type: ', this.type());
      },
      error: (err) => {
        console.error('❌ Error cargando reviews:', err);
        this.reviews.set([]);
        this.loading.set(false);
      }
    });
    
  }
}
