import {Component, OnDestroy, OnInit, output} from '@angular/core';
import * as L from 'leaflet';
import {Map} from '../map/map';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {AddressRequest} from '../models/address-request';
import {debounceTime, distinctUntilChanged, filter, Subject, takeUntil} from 'rxjs';
import {MapService} from '../services/map/map-service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-address-input',
  imports: [Map, ReactiveFormsModule],
  templateUrl: './address-input.html',
  styleUrl: './address-input.css',
})
export class AddressInput implements OnInit, OnDestroy {
  protected addressControl = new FormControl('');
  protected suggestions: AddressRequest[] = [];

  selection = output<AddressRequest>();

  private selectedAddress?: AddressRequest;
  protected uploadedAddress?: AddressRequest;
  private destroy$ = new Subject<void>();

  constructor(
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.addressControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(value => {
        return !!value && value.length > 2;
      }),
      switchMap(street => {
        if (street === null) {
          console.error("Text is null!")
        }
        return this.mapService.getAutocomplete(street!)
      }),
      takeUntil(this.destroy$)
    ).subscribe(addresses => {
      this.suggestions = addresses;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  querySuggestion() {
    this.uploadedAddress = this.selectedAddress;
  }

  updateSuggestion(address: AddressRequest) {
    this.selection.emit(address);
    this.selectedAddress = address;
    this.addressControl.setValue(address.street, {});
  }

  selectSuggestion(address: AddressRequest) {
    this.updateSuggestion(address);
    this.querySuggestion();
    this.suggestions = [];
  }

  onMapClick(coords: L.LatLng) {
    this.suggestions = [];
    this.mapService.getReverseGeocoding(coords.lat, coords.lng)
      .subscribe(address => this.updateSuggestion(address));
  }
}
