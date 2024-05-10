import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { EditFormComponent } from './components/edit-form/edit-form.component';
import { EventService } from '@services/layout/event.service';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { ModelService } from '@services/common/model.service';
import { Ng5SliderModule } from 'ng5-slider';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { Tag } from '@models/tags/tag.model';
import { TagsRoutingModule } from './tags-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { UiModule } from '@modules/ui/ui.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { WidgetModule } from '@modules/widget/widget.module';

@NgModule({
  declarations: [
    ListPageComponent, FormPageComponent, EditFormComponent
  ],
  imports: [
    CommonModule,
    TagsRoutingModule,
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
    NgbTooltipModule,
    TranslateModule,
    Ng5SliderModule
  ],
  providers: [
    EventService,
    {
      provide: 'TagService',
      useFactory: () => new ModelService<Tag>(),
    },
  ],
})
export class TagsModule {}
