import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerReportePage } from './ver-reporte.page';

const routes: Routes = [
  {
    path: '',
    component: VerReportePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerReportePageRoutingModule {}
