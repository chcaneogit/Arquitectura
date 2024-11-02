import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerReportePageRoutingModule } from './ver-reporte-routing.module';

import { VerReportePage } from './ver-reporte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerReportePageRoutingModule
  ],
  declarations: [VerReportePage]
})
export class VerReportePageModule {}
