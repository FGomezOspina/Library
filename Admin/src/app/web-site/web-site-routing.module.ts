import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AgregarLibroComponent } from './pages/agregar-libro/agregar-libro.component';
import { TermsUseComponent } from './pages/terms-use/terms-use.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { LayoutComponent } from './modules/layout/layout.component';
const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'meta',
    component: LayoutComponent,
    children: [
      {
        path: 'terms-use',
        component: TermsUseComponent,
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
      },
    ]
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'users',
        component: AgregarLibroComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebSiteRoutingModule {}
