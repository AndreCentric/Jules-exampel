import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'bookings',
    loadComponent: () => import('./pages/booking-list/booking-list.component').then(m => m.BookingListComponent)
  },
  {
    path: 'bookings/new',
    loadComponent: () => import('./pages/booking-create/booking-create.component').then(m => m.BookingCreateComponent)
  },
  {
    path: 'bookings/:id',
    loadComponent: () => import('./pages/booking-detail/booking-detail.component').then(m => m.BookingDetailComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/global-history/global-history.component').then(m => m.GlobalHistoryComponent)
  },
  {
    path: 'fleet',
    loadComponent: () => import('./pages/fleet-management/fleet-management.component').then(m => m.FleetManagementComponent)
  }
];
