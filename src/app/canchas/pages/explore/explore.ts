import { Component, inject } from '@angular/core';
import { EstablishmentService } from '../../services/establishment-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';


@Component({
  selector: 'app-explore',
  imports: [],
  templateUrl: './explore.html',
  styleUrls: ['./explore.css']
})
export class Explore {
  private readonly establishmentService = inject(EstablishmentService);
    private readonly router = inject(Router);

  protected readonly establishments = toSignal(this.establishmentService.getEstablishments(),
    { initialValue: [] });

}
