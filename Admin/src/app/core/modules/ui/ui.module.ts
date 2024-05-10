import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from '@services/layout/loader.service';
import { NgModule } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NoDataComponent } from './no-data/no-data.component';
import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SortableDirective } from '../../directives/tables/sortable.directive';

@NgModule({
  declarations: [
    SortableDirective,
    LoaderComponent,
    PagetitleComponent,
    NoDataComponent,
  ],
  exports: [
    SortableDirective,
    LoaderComponent,
    PagetitleComponent,
    NoDataComponent,
  ],
  imports: [
   NgbModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgxDropzoneModule,
    NgbNavModule,
    NgbModalModule

  ],
  providers: [LoaderService],
})
export class UiModule {}
