import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { StarRatingComponent } from '../../../layout/star-rating/star-rating';
import { EstablishmentStore } from '../../services/establishment/establishment-store';
import { EstablishmentResponse } from '../../models/establishment-response';

type SortOption = 'none' | 'highest' | 'lowest';
type CanchaType = 'ALL' | 'FUTBOL_5' | 'FUTBOL_7' | 'FUTBOL_9' | 'FUTBOL_11';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [StarRatingComponent, FormsModule],
  templateUrl: './explore.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./explore.css']
})
export class Explore implements OnInit {
  protected readonly establishmentStore = inject(EstablishmentStore);
  private readonly router = inject(Router);
  
  // Raw data from store
  protected readonly establishments = this.establishmentStore.getEstablishments();
  protected readonly loading = this.establishmentStore.isLoading();
  
  // Filter signals
  protected readonly searchText = signal<string>('');
  protected readonly sortBy = signal<SortOption>('none');
  protected readonly canchaTypeFilter = signal<CanchaType>('ALL');
  
  // Cancha types for dropdown
  protected readonly canchaTypes: { value: CanchaType; label: string }[] = [
    { value: 'ALL', label: 'Todos los tipos' },
    { value: 'FUTBOL_5', label: 'Fútbol 5' },
    { value: 'FUTBOL_7', label: 'Fútbol 7' },
    { value: 'FUTBOL_9', label: 'Fútbol 9' },
    { value: 'FUTBOL_11', label: 'Fútbol 11' }
  ];
  
  // Filtered and sorted establishments
  protected readonly filteredEstablishments = computed(() => {
    let result = [...this.establishments()];
    
    // 1. Filter by search text
    const search = this.searchText().toLowerCase().trim();
    if (search) {
      result = result.filter(est => 
        est.name.toLowerCase().includes(search)
      );
    }
    
    // 2. Filter by cancha type
    const canchaType = this.canchaTypeFilter();
    if (canchaType !== 'ALL') {
      result = result.filter(est => 
        est.types && est.types.includes(canchaType)
      );
    }
    
    // 3. Sort by rating
    const sort = this.sortBy();
    if (sort === 'highest') {
      result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else if (sort === 'lowest') {
      result.sort((a, b) => (a.averageRating || 0) - (b.averageRating || 0));
    }
    
    return result;
  });
  
  ngOnInit(): void {
    this.setupVisibilityListener();
  }
  
  protected navigateToEstablishmentDetails(establishmentId: number): void {
    this.router.navigateByUrl(`explorar/detalles/${establishmentId}`);
  }
  
  protected onRefresh(): void {
    this.establishmentStore.refresh();
  }
  
  protected clearFilters(): void {
    this.searchText.set('');
    this.sortBy.set('none');
    this.canchaTypeFilter.set('ALL');
  }
  
  protected hasActiveFilters(): boolean {
    return this.searchText() !== '' || 
           this.sortBy() !== 'none' || 
           this.canchaTypeFilter() !== 'ALL';
  }

  /**
   * NUEVO — solo formatea el string de tipo de cancha para mostrar en los chips
   * de cada card (ej: "FUTBOL_5" -> "Fútbol 5"). No modifica ningún estado.
   */
  protected formatType(type: string): string {
    const found = this.canchaTypes.find(t => t.value === type);
    return found ? found.label : type;
  }
  
  private setupVisibilityListener(): void {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !this.establishmentStore.isCacheValid()) {
        this.establishmentStore.refresh();
      }
    });
  }
}