import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerCampanhaPageRoutingModule } from './ver-campanha-routing.module';

import { VerCampanhaPage } from './ver-campanha.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerCampanhaPageRoutingModule
  ],
  declarations: [VerCampanhaPage]
})
export class VerCampanhaPageModule {}
