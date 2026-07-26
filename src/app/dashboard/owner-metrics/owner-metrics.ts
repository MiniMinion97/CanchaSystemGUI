import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { StatisticsService } from '../services/statistics-service';
import { AuthService } from '../../auth/services/authservice';

@Component({
  selector: 'app-owner-metrics',
  imports: [BaseChartDirective],
  templateUrl: './owner-metrics.html',
  styleUrl: './owner-metrics.css'
})
export class OwnerMetrics implements OnInit {
  private readonly statisticsService = inject(StatisticsService);
  private readonly authService = inject(AuthService);

  protected loading = signal<boolean>(true);
  protected hasData = signal<boolean>(false);

  // Señal que avanza en cada cambio de tema, para forzar recálculo real de los computed
  private readonly themeTick = signal<number>(0);

  private getThemeTextColor(): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--text-primary').trim() || '#221F20';
  }

  private getThemeGridColor(): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--surface-sunken').trim() || '#E9E8E5';
  }

  protected readonly barOptions = computed<ChartConfiguration<'bar'>['options']>(() => {
    this.themeTick();
    const textColor = this.getThemeTextColor();
    const gridColor = this.getThemeGridColor();
    return {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } }
      }
    };
  });

  protected readonly horizontalBarOptions = computed<ChartConfiguration<'bar'>['options']>(() => {
    this.themeTick();
    const textColor = this.getThemeTextColor();
    const gridColor = this.getThemeGridColor();
    return {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { color: gridColor } }
      }
    };
  });

  protected ratingData = signal<ChartData<'bar'>>({ labels: [], datasets: [] });
  protected reservationData = signal<ChartData<'bar'>>({ labels: [], datasets: [] });
  protected peakHoursData = signal<ChartData<'bar'>>({ labels: [], datasets: [] });
  protected cancellationData = signal<ChartData<'bar'>>({ labels: [], datasets: [] });
  protected revenueData = signal<ChartData<'bar'>>({ labels: [], datasets: [] });

  constructor() {
    const observer = new MutationObserver(() => {
      this.themeTick.update(v => v + 1);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  ngOnInit(): void {
    const ownerId = this.authService.getCurrentClientId();

    if (!ownerId) {
      this.loading.set(false);
      return;
    }

    this.statisticsService.getRatingRanking(ownerId).subscribe({
      next: (res) => {
        this.ratingData.set({
          labels: res.map(r => r.name),
          datasets: [{ data: res.map(r => r.value), label: 'Promedio de reviews', backgroundColor: '#4b7c3f' }]
        });
        this.hasData.set(this.hasData() || res.length > 0);
      },
      error: (err) => console.error('Error obteniendo ranking de reviews:', err)
    });

    this.statisticsService.getReservationRanking(ownerId).subscribe({
      next: (res) => {
        this.reservationData.set({
          labels: res.map(r => r.name),
          datasets: [{ data: res.map(r => r.value), label: 'Cantidad de reservas', backgroundColor: '#3f6b7c' }]
        });
        this.hasData.set(this.hasData() || res.length > 0);
      },
      error: (err) => console.error('Error obteniendo ranking de reservas:', err)
    });

    this.statisticsService.getPeakHours(ownerId).subscribe({
      next: (res) => {
        this.peakHoursData.set({
          labels: res.map(r => `${r.hour}:00`),
          datasets: [{ data: res.map(r => r.reservationCount), label: 'Reservas', backgroundColor: '#7c5a3f' }]
        });
        this.hasData.set(this.hasData() || res.length > 0);
      },
      error: (err) => console.error('Error obteniendo horas pico:', err)
    });

    this.statisticsService.getCancellationRate(ownerId).subscribe({
      next: (res) => {
        this.cancellationData.set({
          labels: res.map(r => r.name),
          datasets: [{ data: res.map(r => Math.round(r.value * 1000) / 10), label: 'Tasa de cancelación (%)', backgroundColor: '#7c3f3f' }]
        });
        this.hasData.set(this.hasData() || res.length > 0);
      },
      error: (err) => console.error('Error obteniendo tasa de cancelación:', err)
    });

    this.statisticsService.getRevenue(ownerId).subscribe({
      next: (res) => {
        this.revenueData.set({
          labels: res.map(r => r.name),
          datasets: [{ data: res.map(r => r.value), label: 'Ingresos ($)', backgroundColor: '#5a7c3f' }]
        });
        this.hasData.set(this.hasData() || res.length > 0);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error obteniendo ingresos:', err);
        this.loading.set(false);
      }
    });
  }
}