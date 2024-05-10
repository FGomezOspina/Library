import {
  NgbAccordionModule,
  NgbAlertModule,
  NgbCarouselModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';

import { AgregarLibroComponent } from './pages/agregar-libro/agregar-libro.component';
import { AuthenticationModule } from '@modules/authentication/authentication.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CategoriesListPageComponent } from './pages/home-page/components/categories/list-page/list-page.component';
import { CommonModule } from '@angular/common';
import { EventService } from '@services/layout/event.service';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from '@modules/header/header.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LayoutModule } from './modules/layout/layout.module';
import { ListPageComponent as NewsListPageComponent } from './pages/home-page/components/news/list-page/list-page.component';
import { Ng5SliderModule } from 'ng5-slider';
import { NgModule } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ScrollspyDirective } from './pages/home-page/scrollspy.directive';
import { SimplebarAngularModule } from '@modules/simplebar-angular/simplebar-angular.module';
import { TermsUseComponent } from './pages/terms-use/terms-use.component';
import { TopbarComponent } from './modules/layout/components/topbar/topbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { UiModule } from '@modules/ui/ui.module';
import { WebSiteRoutingModule } from './web-site-routing.module';

@NgModule({
  declarations: [
    HomePageComponent,
    AgregarLibroComponent,
    ScrollspyDirective,
    TermsUseComponent,
    PrivacyPolicyComponent,
    CategoriesListPageComponent,
    NewsListPageComponent
  ],
  imports: [
    TranslateModule,
    CommonModule,
    WebSiteRoutingModule,
    NgxDropzoneModule,
    NgbCarouselModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbTooltipModule,
    NgbNavModule,
    NgbTooltipModule,
    ScrollToModule.forRoot(),
    NgbModule,
    CarouselModule,
    AuthenticationModule,
    RouterModule,
    TranslateModule,
    NgbDropdownModule,
    SimplebarAngularModule,
    HeaderModule,
    NgbAccordionModule,
    UiModule,
    LayoutModule,
    Ng5SliderModule
  ],
  providers: [EventService,]
})
export class WebSiteModule {}
