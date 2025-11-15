import { Component, inject } from '@angular/core';
import { EstablishmentService } from '../../services/establishment/establishment-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { StarRatingComponent } from '../../../layout/star-rating/star-rating';


@Component({
  selector: 'app-explore',
  imports: [StarRatingComponent],
  templateUrl: './explore.html',
  styleUrls: ['./explore.css']
})
export class Explore {
  private readonly establishmentService = inject(EstablishmentService);
    private readonly router = inject(Router);

  protected readonly establishments = toSignal(this.establishmentService.getEstablishments(),
    { initialValue: [] });

  protected navigateToEstablishmentDetails(establishmentId: number): void {
    this.router.navigateByUrl(`explorar/detalles/${establishmentId}`);
  }
}
