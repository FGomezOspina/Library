import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@services/layout/theme-service.service';
import { AuthenticationService } from '@services/account/authentication.service';

@Component({
  selector: 'app-confirmmail',
  templateUrl: './confirmmail.component.html',
  styleUrls: ['./confirmmail.component.scss']
})
export class ConfirmmailComponent implements OnInit {
  // set the currenr year
  mode: string;
  year: number = new Date().getFullYear();
  constructor(public authenticationService: AuthenticationService,  private themeService: ThemeService,) { }

  ngOnInit(): void {
    document.body.classList.remove('auth-body-bg')
    const modeAttribute = this.themeService.getTheme();
    this.mode= modeAttribute !== '' ? modeAttribute : 'light';
  }

}
