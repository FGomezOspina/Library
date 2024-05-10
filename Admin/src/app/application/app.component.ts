import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit  {
  constructor() {}
  ngOnInit() {
    // document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
  }
}
