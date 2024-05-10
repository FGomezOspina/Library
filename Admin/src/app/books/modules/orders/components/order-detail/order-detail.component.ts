import { CommonApiService } from '@services/common/common-api.service';
import { CommonComponent } from '@components/abstract/common-component.component';
import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { ModelService } from '@services/common/model.service';
import { OnInit } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { AuthenticationService } from '@services/account/authentication.service';
import { Router } from '@angular/router';
import { PaginatedCollection } from '@models/collection/paginated-collection';
import { ToastrService } from 'ngx-toastr';
import { includes, map, some } from 'lodash';
import { alertFire } from '@functions/alerts';
import { CommonVerbsApiService } from '@services/common/common-verbs-api.service';
import { Order } from '@models/orders/order.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent extends CommonComponent implements OnInit {
  orderDetail: Order = <Order>{};
  roleNames: string[] = [];


  constructor(
    private router: Router,
    @Inject('OrderService')
    public orderService: ModelService<Order>,
    public api: CommonApiService,
    private lightbox: Lightbox,
    public authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private api2: CommonVerbsApiService
  ) {
    super();
  }

  ngOnInit(): void {
    const subscribe = this.orderService.model$.subscribe(value => {
      if (value != null) {
        this.load(value);
      }
    });
    this.unsubscribe.push(subscribe);
  }

  private load(model: Order) {
    this.orderDetail = model;
    if (this.authenticationService?.authService?.model) {
      this.checkRole();
    }
  }


  checkRole(){
    const user = this.authenticationService?.authService?.model;
    const roleNames = map(user.roles, r => r.name);
    this.roleNames = roleNames;
  }


  lightboxImage(url: string, caption = '') {
    const src = url;
    const thumb = 'tumb';
    const album =
      caption === ''
        ? { src: src, thumb: thumb }
        : { src: src, caption: caption, thumb: thumb };
    const _albums = [];
    _albums.push(album);
    this.lightbox.open(_albums, 0);
  }
}
