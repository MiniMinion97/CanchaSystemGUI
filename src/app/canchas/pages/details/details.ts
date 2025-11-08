import { Component, inject, linkedSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentService } from '../../services/establishment/establishment-service';
import { ReviewService } from '../../../reviews/review-service';
import { AuthService } from '../../../auth/services/authservice';
import { toSignal } from '@angular/core/rxjs-interop';
import { Form } from '../../../reviews/form/form';
import { ReviewList } from '../../../reviews/review-list/review-list';

@Component({
  selector: 'app-details',
  imports: [Form, ReviewList],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details {

  private readonly establishmentService = inject(EstablishmentService);
  private readonly reviewService = inject(ReviewService);
  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);


  private readonly establishmentId = this.route.snapshot.paramMap.get('id');
  protected readonly establishmentSource = toSignal(this.establishmentService.getEstablishmentById(Number(this.establishmentId)));
  protected readonly establishment = linkedSignal(() => this.establishmentSource());

  //protected clientId = this.authService.getCurrentClientId();


}
