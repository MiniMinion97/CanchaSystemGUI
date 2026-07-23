import { Component } from '@angular/core';
import * as L from 'leaflet';
import {LeafletDirective, LeafletLayersDirective} from '@bluehalo/ngx-leaflet';

@Component({
  selector: 'app-map',
  imports: [LeafletDirective, LeafletLayersDirective],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {
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

    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    zoomControl: false,
    touchZoom: false,
  };

  layers: L.Layer[] = [];

  onMapReady(map: L.Map): void {
    this.map = map;

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.selectedMarker) {
        this.selectedMarker.remove();
      }
      this.selectedMarker = L.marker(e.latlng);
      this.map.addLayer(this.selectedMarker);
    });
  }
}
