import { ActivatedRoute } from '@angular/router';
import { CommonApiService } from '@services/common/common-api.service';
import { CommonPageComponent } from '@components/abstract/common-page.component';
import { CommonVerbsApiService } from '@services/common/common-verbs-api.service';
import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { ModelService } from '@services/common/model.service';
import { OnInit } from '@angular/core';
import { ParamMap } from '@angular/router';
import { filter } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { switchMap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { tap } from 'rxjs';
import { validate as uuidValidate } from 'uuid';
import { Order } from '@models/orders/order.model';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  providers: [
    { provide: 'API_SERVICE', useValue: 'orders' },
    CommonApiService,
    CommonVerbsApiService,
    ModelService,
  ],
})
export class DetailPageComponent extends CommonPageComponent implements OnInit {
  active = 1;

  constructor(
    private api: CommonApiService,
    @Inject('OrderService')
    public orderService: ModelService<Order>,
    private route: ActivatedRoute
  ) {
    super('Orders', [
      { label: 'Orders', active: false, route: './../../' },
      { label: 'Detail', active: true },
    ]);
  }

  ngOnInit(): void {
    const subscribe = this.route.paramMap
      .pipe(
        map((params: ParamMap) => {
          if (params.get('id') && uuidValidate(params.get('id') || '')) {
            const actionLabel = 'Detail';
            this.breadCrumbs = [
              { label: 'Orders', active: false, route: './../../' },
              { label: actionLabel, active: true },
            ];
            return params.get('id');
          }
          return null;
        }),
        filter(i => i !== null),
        tap(() => (this.orderService.isLoading = true)),
        switchMap(id => this.api.get<Order>(`/${id}`, {}, [])),
        takeUntil(this.destroy$)
      )
      .subscribe((model: Order) => {
        this.orderService.isLoading = false;
        this.orderService.set(model);
      });
    this.unsubscribe.push(subscribe);
  }
}
