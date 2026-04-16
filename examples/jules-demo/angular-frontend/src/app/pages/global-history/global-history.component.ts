import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { AuditLogEntry } from '../../models/booking.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-global-history',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <header class="mb-10 text-center md:text-left">
      <h1 class="text-3xl font-bold text-white mb-2 tracking-tight">System Audit Log</h1>
      <p class="text-slate-400 max-w-2xl">A complete, immutable record of every state change across the entire fleet of bookings.</p>
    </header>

    <div class="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
      <div *ngIf="loading" class="p-20 flex flex-col items-center justify-center">
        <div class="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4"></div>
        <p class="text-slate-500 font-medium">Fetching global logs...</p>
      </div>

      <div *ngIf="!loading && logs.length === 0" class="p-20 text-center">
        <p class="text-slate-500">No events found yet.</p>
      </div>

      <div *ngIf="!loading && logs.length > 0" class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-800/30 border-b border-slate-800">
              <th class="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Timestamp</th>
              <th class="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Entity</th>
              <th class="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Change</th>
              <th class="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">User / Car</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/50">
            <tr *ngFor="let log of logs" class="hover:bg-slate-800/20 transition-colors">
              <td class="px-8 py-6 whitespace-nowrap">
                <div class="text-slate-200 font-medium">{{ log.timestamp | date:'medium' }}</div>
                <div class="text-[10px] text-slate-600 font-mono">{{ log.timestamp | date:'HH:mm:ss.SSS' }}</div>
              </td>
              <td class="px-8 py-6">
                <div class="inline-flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  <span class="text-xs text-slate-500 font-bold uppercase">Booking</span>
                  <span class="text-sm text-primary-400 font-black">#{{ log.entityId }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-3">
                  <span class="text-xs text-slate-600 font-bold uppercase">{{ log.oldStatus || 'Init' }}</span>
                  <lucide-icon name="arrow-right" class="w-4 h-4 text-slate-700"></lucide-icon>
                  <span [ngClass]="{
                    'text-amber-500': log.newStatus === 'REQUESTED',
                    'text-green-500': log.newStatus === 'ACTIVE',
                    'text-blue-500': log.newStatus === 'COMPLETED',
                    'text-rose-500': log.newStatus === 'CANCELLED'
                  }" class="text-sm font-black uppercase tracking-tight">{{ log.newStatus }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="text-xs text-slate-400 font-medium">Car: <span class="text-slate-200">{{ log.carId }}</span></span>
                  <span class="text-xs text-slate-400 font-medium">By: <span class="text-slate-200">{{ log.userId }}</span></span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class GlobalHistoryComponent implements OnInit {
  logs: AuditLogEntry[] = [];
  loading = true;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;
    this.bookingService.getAuditLogs().subscribe({
      next: (data) => {
        this.logs = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
