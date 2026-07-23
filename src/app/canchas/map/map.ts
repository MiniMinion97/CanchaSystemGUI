import {Component, Input} from '@angular/core';
import * as L from 'leaflet';
import {LeafletDirective, LeafletLayersDirective} from '@bluehalo/ngx-leaflet';
import {LatLngExpression} from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [LeafletDirective, LeafletLayersDirective],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {
  @Input() editable = false;
  @Input() coords?: LatLngExpression;

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

      if (map.tapHold) {
        map.tapHold.disable();
      }
    } else {
      map.on('click', e => this.putMarker(e.latlng));
    }

    if (this.coords) {
      this.putMarker(this.coords);
      map.setView(this.coords);
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
