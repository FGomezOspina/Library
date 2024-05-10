import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';

import { Book } from '@models/books/book.model';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { BooksRoutingModule } from './books-routing.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CartPageComponent } from './pages/cart/cart-page.component';
import { CommonModule } from '@angular/common';
import { DetailPageComponent } from './pages/detail-page/detail-page.component';
import { EventService } from '@services/layout/event.service';
import { FilterProductsPipe } from '../core/pipes/filter.pipe';
import { LayoutModule } from './modules/layout/layout.module';
import { LightboxModule } from 'ngx-lightbox';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { ModelService } from '@services/common/model.service';
import { Ng5SliderModule } from 'ng5-slider';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TranslateModule } from '@ngx-translate/core';
import { UiModule } from '@modules/ui/ui.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { WidgetModule } from '@modules/widget/widget.module';

@NgModule({
  declarations: [
    ListPageComponent, DetailPageComponent, BookDetailComponent, CartPageComponent, FilterProductsPipe
  ],
  imports: [
    CommonModule,
    BooksRoutingModule,
    NgApexchartsModule,
    NgSelectModule,
    NgbPaginationModule,
    NgbDropdownModule,
    NgbNavModule,
    ReactiveFormsModule,
    FormsModule,
    NgxDropzoneModule,
    UiSwitchModule,
    NgbModule,
    UiModule,
    WidgetModule,
    LayoutModule,
    NgbTooltipModule,
    TranslateModule,
    Ng5SliderModule,
    LightboxModule,
    CKEditorModule
  ],
  providers: [
    EventService,
    {
      provide: 'BookService',
      useFactory: () => new ModelService<Book>(),
    },
  ],
})
export class BooksModule {}
