import { AuthGuard } from '../core/guards/auth.guard';
import { CartPageComponent } from './pages/cart/cart-page.component';
import { DetailPageComponent } from './pages/detail-page/detail-page.component';
import { LayoutComponent } from './modules/layout/layout.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { UserPivotGuard } from '../core/guards/user-pivot.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ListPageComponent
      },
      {
        path: 'cart',
        component: CartPageComponent,
        canActivate: [UserPivotGuard]
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./modules/orders/orders.module').then(
            m => m.OrdersModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'detail',
        children: [
          {
            path: ':id',
            component: DetailPageComponent,

            children: [],
          },
        ],
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BooksRoutingModule {}
