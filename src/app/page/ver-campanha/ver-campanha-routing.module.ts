import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerCampanhaPage } from './ver-campanha.page';

const routes: Routes = [
  {
    path: '',
    component: VerCampanhaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerCampanhaPageRoutingModule {}
