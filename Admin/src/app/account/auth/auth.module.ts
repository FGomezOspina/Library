import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CommonApiService } from '@services/common/common-api.service';
import { CommonModule } from '@angular/common';
import { ConfirmmailComponent } from './confirmmail/confirmmail.component';
import { Login2Component } from './login2/login2.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { Recoverpwd2Component } from './recoverpwd2/recoverpwd2.component';
import { Register2Component } from './register2/register2.component';
import { SignupComponent } from './signup/signup.component';
import { UiModule } from '@modules/ui/ui.module';
import { VerificationComponent } from './verification/verification.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [LoginComponent, Login2Component, SignupComponent, PasswordresetComponent, Register2Component, Recoverpwd2Component, ConfirmmailComponent, VerificationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbAlertModule,
    UiModule,
    NgSelectModule,
    AuthRoutingModule,
    CarouselModule,
    TranslateModule
  ]
})
export class AuthModule { }
