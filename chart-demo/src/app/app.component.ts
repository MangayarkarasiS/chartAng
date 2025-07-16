import { Component } from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div style="display: block; max-width: 700px; margin: 2rem auto;">
      <canvas baseChart
        [data]="chartData"
        [options]="chartOptions"
        chartType="line">
      </canvas>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  rawData = [
    { meter: 'm1', location: 'l1', consumption: 1000, date: '2025-04-01' },
    { meter: 'm2', location: 'l1', consumption: 800, date: '2025-04-01' },
    { meter: 'm3', location: 'l2', consumption: 500, date: '2025-04-01' },
    { meter: 'm1', location: 'l1', consumption: 800, date: '2025-05-01' },
    { meter: 'm2', location: 'l1', consumption: 1000, date: '2025-05-01' },
    { meter: 'm3', location: 'l2', consumption: 700, date: '2025-05-01' },
    { meter: 'm1', location: 'l1', consumption: 800, date: '2025-06-01' },
    { meter: 'm2', location: 'l1', consumption: 1000, date: '2025-06-01' },
    { meter: 'm3', location: 'l2', consumption: 700, date: '2025-06-01' }
  ];

  chartData: any;
  chartLabels: string[] = [];
  chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  };

  constructor() {
    // Get unique months
    const months = Array.from(new Set(this.rawData.map(d =>
      new Date(d.date).toLocaleString('default', { month: 'short', year: '2-digit' })
    )));
    this.chartLabels = months;

    // Get unique locations
    const locations = Array.from(new Set(this.rawData.map(d => d.location)));

    // Prepare datasets
    const datasets = locations.map(location => {
      const data = months.map(month => {
        // Sum consumption for this location and month
        return this.rawData
          .filter(d =>
            d.location === location &&
            new Date(d.date).toLocaleString('default', { month: 'short', year: '2-digit' }) === month
          )
          .reduce((sum, d) => sum + d.consumption, 0);
      });
      return {
        label: `Location ${location}`,
        data,
        fill: true
      };
    });

    this.chartData = { labels: this.chartLabels, datasets };
  }
}
