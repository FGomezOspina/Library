import { AuthenticationService } from '@services/account/authentication.service';
import { BaseTopBarComponent } from '@components/abstract/base-top-bar.component';
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DOCUMENT } from '@angular/common';
import { EventService } from '@services/layout/event.service';
import { Inject } from '@angular/core';
import { InjectionToken } from '@angular/core';
import { LanguageService } from '@services/layout/language.service';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '@services/layout/theme-service.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  providers: [LanguageService],
})
export class TopbarComponent extends BaseTopBarComponent implements OnInit {
  attribute: string;
  mode: string;
  TRANSLATE_KEY = 'ADMIN.LAYOUT.COMPONENTS.TOPBAR.';
  constructor(
    @Inject(DOCUMENT) document: InjectionToken<Document>,
    router: Router,
    languageService: LanguageService,
    cookiesService: CookieService,
    authenticationService: AuthenticationService,
    private eventService: EventService,
    private themeService: ThemeService
  ) {
    super(
      document,
      router,
      languageService,
      cookiesService,
      authenticationService
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();
    const attributeAux = this.themeService.getLayout();;
    this.attribute = attributeAux !== '' ? attributeAux : 'horizontal';
    const modeAttribute = this.themeService.getTheme();
    this.mode= modeAttribute !== '' ? modeAttribute : 'light';
  }

  changeMode(themeMode: string) {
    this.mode = themeMode;
    this.themeService.setTheme(themeMode);
  }

  changeLayout() {
    this.themeService.setLayout('horizontal');
    this.eventService.broadcast('changeLayout', 'horizontal');
  }
}
