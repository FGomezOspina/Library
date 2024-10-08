import { NgbDropdownModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PageHeaderUserDropdownComponent } from './page-header-user-dropdown/page-header-user-dropdown.component';
import { RouterModule } from '@angular/router';
import { SimplebarAngularModule } from '@modules/simplebar-angular/simplebar-angular.module';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '@environments/environment';

@NgModule({
  declarations: [PageHeaderUserDropdownComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    TranslateModule,
    SimplebarAngularModule,
    NgbPaginationModule,
    NgbTooltipModule,
    FormsModule,
  ],
  exports: [PageHeaderUserDropdownComponent],
})
export class HeaderModule {}
