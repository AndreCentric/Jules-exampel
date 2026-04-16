import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <div class="flex h-screen bg-slate-950 text-slate-50 font-sans">
      <!-- Sidebar -->
      <aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div class="p-6">
          <div class="flex items-center gap-3 text-primary-400 mb-8">
            <lucide-icon name="car" class="w-8 h-8"></lucide-icon>
            <span class="text-xl font-bold tracking-tight text-white">Jules sharing</span>
          </div>

          <nav class="space-y-1">
            <a routerLink="/dashboard" routerLinkActive="bg-slate-800 text-primary-400"
               class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all group">
              <lucide-icon name="layout-dashboard" class="w-5 h-5"></lucide-icon>
              <span class="font-medium">Dashboard</span>
            </a>

            <a routerLink="/bookings" routerLinkActive="bg-slate-800 text-primary-400"
               class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all">
              <lucide-icon name="clipboard-list" class="w-5 h-5"></lucide-icon>
              <span class="font-medium">Bookings</span>
            </a>

            <a routerLink="/history" routerLinkActive="bg-slate-800 text-primary-400"
               class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all">
              <lucide-icon name="history" class="w-5 h-5"></lucide-icon>
              <span class="font-medium">Global Audit</span>
            </a>
          </nav>
        </div>

        <div class="mt-auto p-6">
          <button routerLink="/bookings/new"
                  class="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-900/20">
            <lucide-icon name="plus-circle" class="w-5 h-5"></lucide-icon>
            <span>New Booking</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto bg-slate-950">
        <div class="container mx-auto p-8 max-w-6xl">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'angular-frontend';
}
