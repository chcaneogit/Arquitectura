import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'envio',
    loadChildren: () => import('./page/envio/envio.module').then( m => m.EnvioPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./page/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./page/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'ver-campanha',
    loadChildren: () => import('./page/ver-campanha/ver-campanha.module').then( m => m.VerCampanhaPageModule)
  },
  {
    path: 'ver-reporte',
    loadChildren: () => import('./page/ver-reporte/ver-reporte.module').then( m => m.VerReportePageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./page/admin/admin.module').then( m => m.AdminPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
