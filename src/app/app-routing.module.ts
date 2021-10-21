import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Covid19Component } from './covid19/covid19.component';

const routes: Routes = [
  // Fallback when no prior route is matched
  { path: '', component: Covid19Component },
  { path: 'home', component: Covid19Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
