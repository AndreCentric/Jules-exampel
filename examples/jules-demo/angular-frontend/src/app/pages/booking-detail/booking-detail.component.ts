import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking, BookingStatus, AuditLogEntry } from '../../models/booking.model';
import { LucideAngularModule } from 'lucide-angular';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div *ngIf="loading" class="flex flex-col items-center justify-center p-20">
      <div class="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4"></div>
      <p class="text-slate-500 font-medium">Loading booking details...</p>
    </div>

    <div *ngIf="!loading && booking" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <button routerLink="/bookings" class="flex items-center gap-2 text-slate-500 hover:text-slate-300 mb-6 transition-colors">
            <lucide-icon name="arrow-right" class="w-4 h-4 rotate-180"></lucide-icon>
            Back to list
          </button>
          <div class="flex items-center gap-4 mb-2">
            <h1 class="text-4xl font-black text-white tracking-tight">Booking #{{ booking.id }}</h1>
            <span [ngClass]="{
              'bg-amber-500/10 text-amber-500 border-amber-500/20': booking.status === 'REQUESTED',
              'bg-green-500/10 text-green-500 border-green-500/20': booking.status === 'ACTIVE',
              'bg-blue-500/10 text-blue-500 border-blue-500/20': booking.status === 'COMPLETED',
              'bg-rose-500/10 text-rose-500 border-rose-500/20': booking.status === 'CANCELLED'
            }" class="px-4 py-1.5 rounded-full text-sm font-black border uppercase tracking-widest shadow-lg shadow-current/5">
              {{ booking.status }}
            </span>
          </div>
          <p class="text-slate-400 font-medium">Detailed overview and control center.</p>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            *ngFor="let targetStatus of booking.allowedTransitions"
            (click)="updateStatus(targetStatus)"
            [disabled]="actionLoading"
            [ngClass]="{
              'bg-primary-600 hover:bg-primary-500': targetStatus === 'ACTIVE',
              'bg-green-600 hover:bg-green-500': targetStatus === 'COMPLETED',
              'bg-slate-800 hover:bg-slate-700 text-rose-400': targetStatus === 'CANCELLED'
            }"
            class="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-xl disabled:opacity-50">
            <lucide-icon [name]="getIconForStatus(targetStatus)" class="w-5 h-5"></lucide-icon>
            <span>{{ getLabelForStatus(targetStatus) }}</span>
          </button>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Details -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
             <div class="absolute -top-24 -left-24 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl pointer-events-none"></div>

             <h3 class="text-xl font-bold text-white mb-8 flex items-center gap-2">
               <lucide-icon name="car" class="w-6 h-6 text-primary-500"></lucide-icon>
               Metadata
             </h3>

             <div class="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-6 relative">
               <div class="space-y-1">
                 <div class="text-xs font-bold text-slate-500 uppercase tracking-widest">Car Identity</div>
                 <div class="text-2xl font-bold text-slate-200">{{ booking.carId }}</div>
               </div>
               <div class="space-y-1">
                 <div class="text-xs font-bold text-slate-500 uppercase tracking-widest">Renter / User</div>
                 <div class="text-2xl font-bold text-slate-200">{{ booking.userId }}</div>
               </div>
               <div class="space-y-1">
                 <div class="text-xs font-bold text-slate-500 uppercase tracking-widest">Start Time</div>
                 <div class="text-lg font-semibold text-slate-300">{{ booking.startTime | date:'medium' }}</div>
               </div>
               <div class="space-y-1" *ngIf="booking.endTime">
                 <div class="text-xs font-bold text-slate-500 uppercase tracking-widest">End Time</div>
                 <div class="text-lg font-semibold text-slate-300">{{ booking.endTime | date:'medium' }}</div>
               </div>
             </div>
          </div>

          <!-- Timeline -->
          <div>
            <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
               <lucide-icon name="history" class="w-6 h-6 text-primary-500"></lucide-icon>
               Activity History
            </h3>
            <div class="space-y-4">
              <div *ngFor="let log of history; let last = last" class="relative pl-8">
                <!-- Line -->
                <div *ngIf="!last" class="absolute left-[11px] top-6 bottom-[-20px] w-0.5 bg-slate-800"></div>
                <!-- Dot -->
                <div class="absolute left-0 top-1.5 w-[24px] h-[24px] rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center">
                  <div class="w-2 h-2 rounded-full bg-primary-500"></div>
                </div>

                <div class="bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl">
                  <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div class="text-slate-200">
                      Status changed from
                      <span class="text-slate-500 font-medium">{{ log.oldStatus || 'NONE' }}</span>
                      to
                      <span class="text-primary-400 font-bold uppercase tracking-tight">{{ log.newStatus }}</span>
                    </div>
                    <div class="text-xs font-bold text-slate-500 uppercase">{{ log.timestamp | date:'medium' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="lg:col-span-1">
          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl sticky top-8">
            <h4 class="font-bold text-white mb-4">Quick Insights</h4>
            <div class="space-y-4">
              <div class="flex items-start gap-3 p-4 bg-slate-800/40 rounded-2xl">
                <lucide-icon name="check-circle" class="w-5 h-5 text-green-500 mt-1"></lucide-icon>
                <div>
                  <div class="text-sm font-bold text-slate-200">System Verified</div>
                  <div class="text-xs text-slate-500">All state transitions follow core business rules.</div>
                </div>
              </div>
              <div class="flex items-start gap-3 p-4 bg-slate-800/40 rounded-2xl">
                <lucide-icon name="history" class="w-5 h-5 text-primary-500 mt-1"></lucide-icon>
                <div>
                  <div class="text-sm font-bold text-slate-200">Audit Trail</div>
                  <div class="text-xs text-slate-500">Immutable history of all lifecycle events.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Toast -->
    <div *ngIf="error" class="fixed bottom-8 right-8 bg-rose-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-rose-900/20 flex items-center gap-4 animate-in slide-in-from-right-full">
      <lucide-icon name="x-circle" class="w-6 h-6"></lucide-icon>
      <div class="font-bold">{{ error }}</div>
      <button (click)="error = ''" class="hover:bg-white/10 p-1 rounded-lg transition-colors">
        <lucide-icon name="arrow-right" class="w-5 h-5"></lucide-icon>
      </button>
    </div>
  `,
  styles: []
})
export class BookingDetailComponent implements OnInit {
  booking?: Booking;
  history: AuditLogEntry[] = [];
  loading = true;
  actionLoading = false;
  error = '';

  constructor(private route: ActivatedRoute, private bookingService: BookingService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(+id);
    }
  }

  loadData(id: number): void {
    this.loading = true;
    forkJoin({
      booking: this.bookingService.getBooking(id),
      history: this.bookingService.getAuditLogs(id)
    }).subscribe({
      next: ({ booking, history }) => {
        this.booking = booking;
        this.history = history;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load booking details.';
      }
    });
  }

  updateStatus(status: BookingStatus): void {
    if (!this.booking) return;

    this.actionLoading = true;
    this.error = '';

    this.bookingService.updateStatus(this.booking.id, status).subscribe({
      next: () => {
        this.loadData(this.booking!.id);
        this.actionLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Transition failed.';
        this.actionLoading = false;
      }
    });
  }

  getIconForStatus(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.ACTIVE: return 'play-circle';
      case BookingStatus.COMPLETED: return 'check-circle';
      case BookingStatus.CANCELLED: return 'x-circle';
      default: return 'play-circle';
    }
  }

  getLabelForStatus(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.ACTIVE: return 'Start Session';
      case BookingStatus.COMPLETED: return 'End Session';
      case BookingStatus.CANCELLED: return 'Cancel Booking';
      default: return status;
    }
  }
}
