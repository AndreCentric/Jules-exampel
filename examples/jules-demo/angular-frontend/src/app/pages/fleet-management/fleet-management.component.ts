import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/car.model';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-fleet-management',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <header class="mb-10">
      <h1 class="text-3xl font-bold text-white mb-2">Fleet Management</h1>
      <p class="text-slate-400">Manage your car sharing fleet vehicles.</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Car List -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-800/50 border-b border-slate-800">
                <th class="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vehicle</th>
                <th class="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">License Plate</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr *ngFor="let car of cars" class="hover:bg-slate-800/30 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-primary-400">
                      <lucide-icon name="car" class="w-6 h-6"></lucide-icon>
                    </div>
                    <div>
                      <div class="font-bold text-slate-200">{{ car.brand }} {{ car.model }}</div>
                      <div class="text-xs text-slate-500">ID: {{ car.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded border border-slate-700">
                    {{ car.licensePlate }}
                  </span>
                </td>
              </tr>
              <tr *ngIf="cars.length === 0">
                <td colspan="2" class="px-6 py-10 text-center text-slate-500">
                  No vehicles in the fleet yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add New Car Form -->
      <div class="space-y-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <lucide-icon name="plus-circle" class="w-5 h-5 text-primary-400"></lucide-icon>
            Add Vehicle
          </h2>

          <form #carForm="ngForm" (ngSubmit)="onSubmit(carForm)" class="space-y-4">
            <div class="space-y-1">
              <label for="brand" class="text-sm font-medium text-slate-400 ml-1">Brand</label>
              <input type="text" id="brand" name="brand" [(ngModel)]="model.brand" required
                placeholder="e.g. Tesla"
                class="block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all">
            </div>

            <div class="space-y-1">
              <label for="model" class="text-sm font-medium text-slate-400 ml-1">Model</label>
              <input type="text" id="model" name="model" [(ngModel)]="model.model" required
                placeholder="e.g. Model 3"
                class="block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all">
            </div>

            <div class="space-y-1">
              <label for="licensePlate" class="text-sm font-medium text-slate-400 ml-1">License Plate</label>
              <input type="text" id="licensePlate" name="licensePlate" [(ngModel)]="model.licensePlate" required
                placeholder="e.g. B-JS-2024"
                class="block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all">
            </div>

            <button type="submit" [disabled]="carForm.invalid || submitting"
              class="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold mt-4 transition-all">
              <span *ngIf="!submitting">Add to Fleet</span>
              <div *ngIf="submitting" class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class FleetManagementComponent implements OnInit {
  cars: Car[] = [];
  model: Car = { brand: '', model: '', licensePlate: '' };
  submitting = false;

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getCars().subscribe(data => this.cars = data);
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;
    this.submitting = true;
    this.carService.createCar(this.model).subscribe({
      next: () => {
        this.loadCars();
        this.model = { brand: '', model: '', licensePlate: '' };
        form.resetForm();
        this.submitting = false;
      },
      error: () => this.submitting = false
    });
  }
}
