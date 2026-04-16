import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking, BookingStatus } from '../../models/booking.model';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, FormsModule],
  template: `
    <header class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Bookings</h1>
        <p class="text-slate-400">Manage and track all car sharing sessions.</p>
      </div>

      <div class="flex items-center gap-3">
        <select
          [(ngModel)]="statusFilter"
          (change)="filterBookings()"
          class="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-3 min-w-[160px] outline-none transition-all">
          <option value="">All Statuses</option>
          <option value="REQUESTED">Requested</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <button (click)="loadBookings()" class="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
          <lucide-icon name="history" class="w-5 h-5"></lucide-icon>
        </button>
      </div>
    </header>

    <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div *ngIf="loading" class="p-20 flex flex-col items-center justify-center">
        <div class="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4"></div>
        <p class="text-slate-500 font-medium">Loading bookings...</p>
      </div>

      <div *ngIf="!loading && bookings.length === 0" class="p-20 text-center">
        <lucide-icon name="clipboard-list" class="w-16 h-16 text-slate-700 mx-auto mb-4"></lucide-icon>
        <h3 class="text-xl font-bold text-slate-300 mb-2">No bookings found</h3>
        <p class="text-slate-500 mb-6">Try adjusting your filters or create a new booking.</p>
        <button routerLink="/bookings/new" class="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all">
          New Booking
        </button>
      </div>

      <table *ngIf="!loading && bookings.length > 0" class="w-full text-left">
        <thead>
          <tr class="bg-slate-800/50 border-b border-slate-800">
            <th class="px-8 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
            <th class="px-8 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Car Details</th>
            <th class="px-8 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
            <th class="px-8 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
            <th class="px-8 py-5 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          <tr *ngFor="let booking of bookings" class="hover:bg-slate-800/30 transition-colors group">
            <td class="px-8 py-6">
              <span class="font-mono text-slate-500">#{{ booking.id }}</span>
            </td>
            <td class="px-8 py-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-primary-400">
                  <lucide-icon name="car" class="w-6 h-6"></lucide-icon>
                </div>
                <div>
                  <div class="font-bold text-slate-200">{{ booking.carId }}</div>
                  <div class="text-xs text-slate-500">{{ booking.startTime | date:'MMM d, HH:mm' }}</div>
                </div>
              </div>
            </td>
            <td class="px-8 py-6">
              <div class="text-sm font-medium text-slate-300">{{ booking.userId }}</div>
            </td>
            <td class="px-8 py-6">
              <span [ngClass]="{
                'bg-amber-500/10 text-amber-500 border-amber-500/20': booking.status === 'REQUESTED',
                'bg-green-500/10 text-green-500 border-green-500/20': booking.status === 'ACTIVE',
                'bg-blue-500/10 text-blue-500 border-blue-500/20': booking.status === 'COMPLETED',
                'bg-rose-500/10 text-rose-500 border-rose-500/20': booking.status === 'CANCELLED'
              }" class="px-3 py-1.5 rounded-lg text-xs font-bold border uppercase tracking-widest">
                {{ booking.status }}
              </span>
            </td>
            <td class="px-8 py-6 text-right">
              <button [routerLink]="['/bookings', booking.id]"
                      class="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: []
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  statusFilter: string = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    const filter = this.statusFilter ? (this.statusFilter as BookingStatus) : undefined;
    this.bookingService.getBookings(filter).subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filterBookings(): void {
    this.loadBookings();
  }
}
