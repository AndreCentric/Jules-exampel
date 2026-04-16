import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-booking-create',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <header class="mb-10">
        <button routerLink="/bookings" class="flex items-center gap-2 text-slate-500 hover:text-slate-300 mb-6 transition-colors">
          <lucide-icon name="arrow-right" class="w-4 h-4 rotate-180"></lucide-icon>
          Back to list
        </button>
        <h1 class="text-3xl font-bold text-white mb-2">New Booking</h1>
        <p class="text-slate-400">Enter details to request a new car sharing session.</p>
      </header>

      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <!-- Decoration -->
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <form #bookingForm="ngForm" (ngSubmit)="onSubmit(bookingForm)" class="space-y-6 relative">
          <div class="space-y-2">
            <label for="carId" class="block text-sm font-semibold text-slate-300 ml-1">Car identifier</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary-400 transition-colors">
                <lucide-icon name="car" class="w-5 h-5"></lucide-icon>
              </div>
              <input
                type="text"
                id="carId"
                name="carId"
                [(ngModel)]="model.carId"
                required
                placeholder="e.g. TESLA-001"
                class="block w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-600 outline-none ring-primary-500/20 focus:ring-4 focus:border-primary-500 transition-all">
            </div>
          </div>

          <div class="space-y-2">
            <label for="userId" class="block text-sm font-semibold text-slate-300 ml-1">User ID</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary-400 transition-colors">
                <lucide-icon name="clipboard-list" class="w-5 h-5"></lucide-icon>
              </div>
              <input
                type="text"
                id="userId"
                name="userId"
                [(ngModel)]="model.userId"
                required
                placeholder="e.g. USER-123"
                class="block w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-600 outline-none ring-primary-500/20 focus:ring-4 focus:border-primary-500 transition-all">
            </div>
          </div>

          <div *ngIf="error" class="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl text-sm font-medium">
            {{ error }}
          </div>

          <div class="pt-4">
            <button
              type="submit"
              [disabled]="bookingForm.invalid || submitting"
              class="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary-900/20">
              <span *ngIf="!submitting">Create Booking</span>
              <div *ngIf="submitting" class="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class BookingCreateComponent {
  model = {
    carId: '',
    userId: ''
  };
  submitting = false;
  error = '';

  constructor(private bookingService: BookingService, private router: Router) {}

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    this.submitting = true;
    this.error = '';

    this.bookingService.createBooking(this.model).subscribe({
      next: (booking) => {
        this.router.navigate(['/bookings', booking.id]);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create booking. Please try again.';
        this.submitting = false;
      }
    });
  }
}
