import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
// import { authGuard } from './guards';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Portfolio - Full Stack Developer'
  },
  // Future admin routes can be added here with guards:
  // {
  //   path: 'admin',
  //   loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
  //   canActivate: [authGuard],
  //   title: 'Admin Panel'
  // },
  {
    path: '**',
    redirectTo: ''
  }
];
