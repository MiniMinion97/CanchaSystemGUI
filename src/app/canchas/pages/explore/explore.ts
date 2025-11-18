import { Component, inject, OnInit } from '@angular/core';
import { EstablishmentService } from '../../services/establishment/establishment-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { StarRatingComponent } from '../../../layout/star-rating/star-rating';
import { EstablishmentStore } from '../../services/establishment/establishment-store';


@Component({
  selector: 'app-explore',
  imports: [StarRatingComponent],
  templateUrl: './explore.html',
  styleUrls: ['./explore.css']
})
export class Explore implements OnInit {
  protected readonly establishmentStore = inject(EstablishmentStore);
  //private readonly establishmentService = inject(EstablishmentService);
  private readonly router = inject(Router);

  protected readonly establishments = this.establishmentStore.getEstablishments();
  protected readonly loading = this.establishmentStore.isLoading();

  ngOnInit(): void {
    // Optional: Set up auto-refresh when user returns to the page
    this.setupVisibilityListener();
  }

  protected navigateToEstablishmentDetails(establishmentId: number): void {
    this.router.navigateByUrl(`explorar/detalles/${establishmentId}`);
  }

  protected onRefresh(): void {
    this.establishmentStore.refresh();
  }
  
  /**
   * Set up listener to refresh when user returns to the page
   * This handles the case where data changed elsewhere
   */
  private setupVisibilityListener(): void {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !this.establishmentStore.isCacheValid()) {
        console.log('🔄 Page became visible, refreshing stale data');
        this.establishmentStore.refresh();
      }
    });
  }
}
