// establishment-store.service.ts
import { inject, Injectable, signal, effect } from '@angular/core';
import { EstablishmentService } from './establishment-service';
import { EstablishmentResponse } from '../../models/establishment-response';
import { EstablishmentRequest } from '../../models/establishment-request';
import { of, tap, catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentStore {
  
  private readonly service = inject(EstablishmentService);
  
  // State signals
  private readonly establishments = signal<EstablishmentResponse[]>([]);
  private readonly loading = signal<boolean>(false);
  private readonly lastFetch = signal<number>(0);
  
  // Cache duration: 5 minutes
  private readonly CACHE_DURATION = 5 * 60 * 1000;
  
  /**
   * Get all establishments with caching
   * Only fetches from server if cache is expired or empty
   */
  getEstablishments(forceRefresh = false) {
    const now = Date.now();
    const cacheIsValid = !forceRefresh && 
                         this.establishments().length > 0 && 
                         (now - this.lastFetch() < this.CACHE_DURATION);
    
    if (cacheIsValid) {
      console.log('📦 Using cached establishments');
      return this.establishments.asReadonly();
    }
    
    console.log('🌐 Fetching establishments from server');
    this.loading.set(true);
    
    this.service.getEstablishments().subscribe({
      next: (establishments) => {
        this.establishments.set(establishments);
        this.lastFetch.set(Date.now());
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching establishments:', error);
        this.loading.set(false);
      }
    });
    
    return this.establishments.asReadonly();
  }
  
  /**
   * Get establishment by ID
   * First checks cache, then fetches from server if not found
   */
  getEstablishmentById(id: number): Observable<EstablishmentResponse> {
    const cached = this.establishments().find(e => e.id === id);
    
    if (cached) {
      console.log('📦 Using cached establishment:', id);
      return of(cached);
    }
    
    console.log('🌐 Fetching establishment from server:', id);
    return this.service.getEstablishmentById(id).pipe(
      tap(establishment => {
        // Add to cache
        this.establishments.update(establishments => {
          // Check if already exists to avoid duplicates
          const exists = establishments.some(e => e.id === establishment.id);
          if (!exists) {
            return [...establishments, establishment];
          }
          return establishments;
        });
      }),
      catchError(error => {
        console.error('Error fetching establishment:', error);
        throw error;
      })
    );
  }
  
  /**
   * Get establishments by brand ID
   * Always fetches fresh data since this is a filtered view
   */
  getEstablishmentsByBrand(brandId: number): Observable<EstablishmentResponse[]> {
    return this.service.getEstablishmentsByBrand(brandId).pipe(
      tap(establishments => {
        // Update cache with these establishments
        this.establishments.update(current => {
          const updated = [...current];
          establishments.forEach(newEst => {
            const index = updated.findIndex(e => e.id === newEst.id);
            if (index >= 0) {
              updated[index] = newEst;
            } else {
              updated.push(newEst);
            }
          });
          return updated;
        });
      })
    );
  }
  
  /**
   * Create new establishment and add to cache
   */
  createEstablishment(establishment: EstablishmentRequest): Observable<EstablishmentResponse> {
    return this.service.createEstablishment(establishment).pipe(
      tap(newEstablishment => {
        this.establishments.update(establishments => 
          [...establishments, newEstablishment]
        );
        console.log('✅ Establishment created and added to cache');
      })
    );
  }
  
  /**
   * Update establishment and refresh cache
   */
  updateEstablishment(id: number, establishment: EstablishmentRequest): Observable<EstablishmentResponse> {
    return this.service.updateEstablishment(id, establishment).pipe(
      tap(updatedEstablishment => {
        this.findAndUpdateEstablishment(updatedEstablishment);
        console.log('✅ Establishment updated in cache');
      })
    );
  }
  
  /**
   * Delete establishment and remove from cache
   */
  deleteEstablishment(id: number): Observable<void> {
    return this.service.deleteEstablishment(id).pipe(
      tap(() => {
        this.establishments.update(establishments => 
          establishments.filter(e => e.id !== id)
        );
        console.log('✅ Establishment deleted from cache');
      })
    );
  }
  
  /**
   * Force refresh all establishments
   */
  refresh(): void {
    this.getEstablishments(true);
  }
  
  /**
   * Clear cache
   */
  clearCache(): void {
    this.establishments.set([]);
    this.lastFetch.set(0);
    console.log('🗑️ Cache cleared');
  }
  
  /**
   * Get loading state
   */
  isLoading() {
    return this.loading.asReadonly();
  }
  
  /**
   * Get cache age in milliseconds
   */
  getCacheAge(): number {
    return Date.now() - this.lastFetch();
  }
  
  /**
   * Check if cache is valid
   */
  isCacheValid(): boolean {
    return this.establishments().length > 0 && 
           this.getCacheAge() < this.CACHE_DURATION;
  }
  
  // Private helper methods
  
  private findAndUpdateEstablishment(establishment: EstablishmentResponse): void {
    this.establishments.update((establishments) => {
      const index = establishments.findIndex(e => e.id === establishment.id);
      if (index >= 0) {
        const updated = [...establishments];
        updated[index] = { ...establishment };
        return updated;
      }
      return establishments;
    });
  }
}