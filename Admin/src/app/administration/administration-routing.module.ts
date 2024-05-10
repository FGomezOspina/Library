import { LayoutComponent } from './modules/layout/layout.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/users/users.module').then(
            m => m.UsersModule
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./modules/categories/categories.module').then(
            m => m.CategoriesModule
          ),
      },
      {
        path: 'tags',
        loadChildren: () =>
          import('./modules/tags/tags.module').then(
            m => m.TagsModule
          ),
      },
      {
        path: 'books',
        loadChildren: () =>
          import('./modules/books/books.module').then(
            m => m.BooksModule
          ),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
