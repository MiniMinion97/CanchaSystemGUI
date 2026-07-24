import { Component, inject, signal, computed } from '@angular/core';
import { AdminService } from '../admin-service';
import { StatsResponse } from '../../canchas/models/stats-response';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-admin-stats',
  imports: [BaseChartDirective],
  templateUrl: './admin-stats.html',
  styleUrl: './admin-stats.css'
})
export class AdminStats {
  private readonly adminService = inject(AdminService);

  protected loading = signal<boolean>(true);
  protected stats = signal<StatsResponse | null>(null);
  protected error = signal<string | null>(null);

  protected fromDate = signal<string>('');
  protected untilDate = signal<string>('');

  // ---- Pie chart: canchas por tipo ----
  protected pieChartType: ChartConfiguration<'pie'>['type'] = 'pie';
  protected pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#fff' } }
    }
  };
  protected pieChartData = computed<ChartData<'pie'>>(() => {
    const s = this.stats();
    if (!s) return { labels: [], datasets: [{ data: [] }] };

    return {
      labels: s.canchasByType.map(c => this.formatCanchaType(c.canchaType)),
      datasets: [{
        data: s.canchasByType.map(c => c.count),
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#E91E63']
      }]
    };
  });

  // ---- Pie chart: reservas por estado ----
  protected statusPieChartData = computed<ChartData<'pie'>>(() => {
    const s = this.stats();
    if (!s) return { labels: [], datasets: [{ data: [] }] };

    return {
      labels: ['Completadas', 'Pendientes', 'Canceladas'],
      datasets: [{
        data: [s.completedReservations, s.pendingReservations, s.canceledReservations],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
      }]
    };
  });

  // ---- Bar chart: top 5 establecimientos ----
  protected barChartType: ChartConfiguration<'bar'>['type'] = 'bar';
  protected barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { ticks: { color: '#fff' } },
      y: { ticks: { color: '#fff' } }
    }
  };
  protected barChartData = computed<ChartData<'bar'>>(() => {
    const s = this.stats();
    if (!s) return { labels: [], datasets: [{ data: [] }] };

    return {
      labels: s.topEstablishments.map(e => e.establishmentName),
      datasets: [{
        label: 'Reservas',
        data: s.topEstablishments.map(e => e.reservationCount),
        backgroundColor: '#2196F3'
      }]
    };
  });

  constructor() {
    this.loadStats();
  }

  private loadStats(from?: string, until?: string) {
    this.loading.set(true);
    this.error.set(null);

    this.adminService.getStats(from, until).subscribe({
      next: (res) => {
        this.stats.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando estadísticas:', err);
        this.error.set('No se pudieron cargar las estadísticas');
        this.loading.set(false);
      }
    });
  }

  formatCanchaType(type: string): string {
    return type.replace('FUTBOL_', 'Fútbol ');
  }

  onFromChange(value: string) {
    this.fromDate.set(value);
  }

  onUntilChange(value: string) {
    this.untilDate.set(value);
  }

  applyFilter() {
    const from = this.fromDate();
    const until = this.untilDate();
    if (!from || !until) return;
    this.loadStats(`${from}T00:00:00`, `${until}T23:59:59`);
  }

  clearFilter() {
    this.fromDate.set('');
    this.untilDate.set('');
    this.loadStats();
  }
}