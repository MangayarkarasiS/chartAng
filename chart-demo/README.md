# Angular Chart Demo Project

This project demonstrates how to display a line chart in Angular (v19/v20+) using ng2-charts and chart.js, with data grouped by location and month.

---

## Project Setup and Troubleshooting (from Chat Log)

### 1. Project Requirements
- Angular 19 or 20 (no SSR, no Vite)
- ng2-charts and chart.js for charting
- Data: Meter readings by location and month

### 2. Common Issues & Solutions
- **SSR/Vite Error:** Chart.js/ng2-charts do not work with SSR or Vite. Always use `ng serve`.
- **Angular CLI Project Name:** You cannot use `.` as the project name. Use a valid folder name (e.g., `chart-demo`).
- **Peer Dependency Conflicts:** Use `npm install ng2-charts chart.js --legacy-peer-deps` if you see dependency errors.
- **Analytics Prompt:** You can safely answer `N` (no) to Angular analytics.

### 3. Setup Steps
1. Create a new Angular project:
   ```sh
   npx -p @angular/cli@19 ng new chart-demo --skip-git --skip-install --skip-tests --minimal --strict --routing=false --style=css
   ```
2. Change into the project directory:
   ```sh
   cd chart-demo
   ```
3. Install chart dependencies:
   ```sh
   npm install ng2-charts chart.js --legacy-peer-deps
   ```
4. Update `src/app/app.config.ts` to include:
   ```typescript
   import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
   export const appConfig: ApplicationConfig = {
     providers: [
       provideZoneChangeDetection({ eventCoalescing: true }),
       provideCharts(withDefaultRegisterables())
     ]
   };
   ```
5. Replace `src/app/app.component.ts` with:
   ```typescript
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
   ```
6. Run the app:
   ```sh
   ng serve
   ```
   Open http://localhost:4200 to view the chart.

---

## Troubleshooting
- If you see `NotYetImplemented` or SSR/Vite errors, make sure you are using `ng serve` and not SSR or Vite.
- If you see dependency errors, use `--legacy-peer-deps` with npm install.
- If you see analytics prompts, you can safely answer `N` (no).

---

## Data Used
| meternumber | Locationid | consumption | date        |
|-------------|------------|-------------|-------------|
| m1          | l1         | 1000        | 01-Apr-25   |
| m2          | l1         | 800         | 01-Apr-25   |
| m3          | l2         | 500         | 01-Apr-25   |
| m1          | l1         | 800         | 01-May-25   |
| m2          | l1         | 1000        | 01-May-25   |
| m3          | l2         | 700         | 01-May-25   |
| m1          | l1         | 800         | 01-Jun-25   |
| m2          | l1         | 1000        | 01-Jun-25   |
| m3          | l2         | 700         | 01-Jun-25   |

---

## Summary of Key Chat Steps
- Always use Angular CLI (`ng serve`), not SSR or Vite, for chart.js/ng2-charts.
- Use `--legacy-peer-deps` if you see npm dependency errors.
- Use a valid folder name for Angular CLI projects.
- Chart logic is in the main app component, with data grouped by location and month.

---

For any further issues, review the chat log or ask for help!
