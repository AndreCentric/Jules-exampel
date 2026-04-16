import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking, BookingStatus } from '../../models/booking.model';
import { LucideAngularModule } from 'lucide-angular';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <header class="mb-10">
      <h1 class="text-3xl font-bold text-white mb-2">Fleet Overview</h1>
      <p class="text-slate-400">Welcome back. Here's what's happening with your bookings today.</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <!-- Stats Cards -->
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
            <lucide-icon name="clipboard-list" class="w-6 h-6"></lucide-icon>
          </div>
        </div>
        <div class="text-3xl font-bold text-white mb-1">{{ stats.total }}</div>
        <div class="text-slate-400 text-sm">Total Bookings</div>
      </div>

      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
            <lucide-icon name="play-circle" class="w-6 h-6"></lucide-icon>
          </div>
        </div>
        <div class="text-3xl font-bold text-white mb-1">{{ stats.requested }}</div>
        <div class="text-slate-400 text-sm">Requested</div>
      </div>

      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-green-500/10 text-green-500 rounded-lg">
            <lucide-icon name="check-circle" class="w-6 h-6"></lucide-icon>
          </div>
        </div>
        <div class="text-3xl font-bold text-white mb-1">{{ stats.active }}</div>
        <div class="text-slate-400 text-sm">Currently Active</div>
      </div>

      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-slate-500/10 text-slate-400 rounded-lg">
            <lucide-icon name="history" class="w-6 h-6"></lucide-icon>
          </div>
        </div>
        <div class="text-3xl font-bold text-white mb-1">{{ stats.completed }}</div>
        <div class="text-slate-400 text-sm">Completed</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Bookings -->
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white">Recent Activity</h2>
          <a routerLink="/bookings" class="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1">
            View all <lucide-icon name="arrow-right" class="w-4 h-4"></lucide-icon>
          </a>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div *ngIf="recentBookings.length === 0" class="p-12 text-center">
            <div class="text-slate-500 mb-2">No bookings found yet.</div>
            <a routerLink="/bookings/new" class="text-primary-400 font-medium">Create your first booking</a>
          </div>

          <table *ngIf="recentBookings.length > 0" class="w-full text-left">
            <thead>
              <tr class="border-b border-slate-800">
                <th class="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Car ID</th>
                <th class="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                <th class="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr *ngFor="let booking of recentBookings" class="hover:bg-slate-800/50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="font-medium text-slate-200">{{ booking.carId }}</div>
                </td>
                <td class="px-6 py-4 text-slate-400 text-sm">{{ booking.userId }}</td>
                <td class="px-6 py-4">
                  <span [ngClass]="{
                    'bg-amber-500/10 text-amber-500': booking.status === 'REQUESTED',
                    'bg-green-500/10 text-green-500': booking.status === 'ACTIVE',
                    'bg-blue-500/10 text-blue-500': booking.status === 'COMPLETED',
                    'bg-rose-500/10 text-rose-500': booking.status === 'CANCELLED'
                  }" class="px-2.5 py-1 rounded-full text-xs font-bold border border-current/20 uppercase tracking-wider">
                    {{ booking.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <a [routerLink]="['/bookings', booking.id]" class="text-slate-400 hover:text-white transition-colors">
                    <lucide-icon name="arrow-right" class="w-5 h-5"></lucide-icon>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Actions / Mini Audit -->
      <div class="lg:col-span-1">
        <h2 class="text-xl font-bold text-white mb-6">Recent Events</h2>
        <div class="space-y-4">
          <div *ngFor="let log of recentLogs" class="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex gap-4">
            <div class="mt-1">
              <div class="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"></div>
            </div>
            <div>
              <div class="text-sm text-slate-200">
                Booking <span class="font-mono text-primary-400">#{{ log.entityId }}</span>
                moved to <span class="font-semibold">{{ log.newStatus }}</span>
              </div>
              <div class="text-xs text-slate-500 mt-1">{{ log.timestamp | date:'short' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  recentBookings: Booking[] = [];
  recentLogs: any[] = [];
  stats = {
    total: 0,
    requested: 0,
    active: 0,
    completed: 0
  };

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      bookings: this.bookingService.getBookings(),
      logs: this.bookingService.getAuditLogs()
    }).subscribe(({ bookings, logs }) => {
      this.recentBookings = bookings.slice(0, 5);
      this.recentLogs = logs.slice(0, 6);

      this.stats = {
        total: bookings.length,
        requested: bookings.filter(b => b.status === BookingStatus.REQUESTED).length,
        active: bookings.filter(b => b.status === BookingStatus.ACTIVE).length,
        completed: bookings.filter(b => b.status === BookingStatus.COMPLETED).length
      };
    });
  }
}
