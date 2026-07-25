import {Component, Input, output} from '@angular/core';
import * as L from 'leaflet';
import {LeafletDirective, LeafletLayersDirective} from '@bluehalo/ngx-leaflet';
import {LatLng, LatLngExpression} from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [LeafletDirective, LeafletLayersDirective],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {
  @Input() editable = false;
  @Input() coords?: LatLngExpression;

  ngOnChanges() {
    if (this.coords) {
      this.putMarker(this.coords);
    }
  }

  markerClicked = output<LatLng>();

  map!: L.Map;

  selectedMarker?: L.Marker;

  options: L.MapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],

    zoom: 13,
    center: L.latLng(-38.003838, -57.556553),
  };

  layers: L.Layer[] = [];

  onMapReady(map: L.Map): void {
    this.map = map;

    if (!this.editable) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      map.touchZoom.disable();
      map.zoomControl.remove();

      if (map.tapHold) {
        map.tapHold.disable();
      }
    } else {
      map.on('click', e => this.putMarker(e.latlng));
    }

    if (this.coords) {
      this.putMarker(this.coords);
      map.setView(this.coords);
      if (this.coords instanceof L.LatLng) {
        this.markerClicked.emit(this.coords);
      } else {
        this.markerClicked.emit(L.latLng(this.coords));
      }
    }
  }

  putMarker(coords: LatLngExpression): void { // When non-editable, should be called only once with set latitude and longitude
    if (this.selectedMarker) {
      this.selectedMarker.remove();
    }
    this.selectedMarker = L.marker(coords);
    this.map.addLayer(this.selectedMarker);
  }
}
