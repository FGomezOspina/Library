import { DetailPageComponent } from './pages/detail-page/detail-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    component: ListPageComponent,
  },
  {
    path:':id',
    component: DetailPageComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
