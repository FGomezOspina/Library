import { ActivatedRoute, Router } from '@angular/router';

import { ApiResponse } from '@models/common/api-response.model';
import { AuthenticationService } from '@services/account/authentication.service';
import { CollectionComponent } from '@components/abstract/collection.component';
import { CollectionService } from '@services/common/collection.service';
import { CommonApiService } from '@services/common/common-api.service';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Order } from '@models/orders/order.model';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  providers: [
    CollectionService,
    { provide: 'API_SERVICE', useValue: 'orders' },
    CommonApiService,
  ],
})
export class ListPageComponent extends CollectionComponent<Order> {
  breadCrumbs = [
    { label: 'Model Bot', active: true },
    { label: 'Orders', active: true },
  ];


  TRANSLATE_KEY= 'MODEL_BOTS.MODULES.CRON-JOBS.PAGES.LIST-PAGE.';

  constructor(
    private route: ActivatedRoute,
    router: Router,
    location: Location,
    api: CommonApiService,
    service: CollectionService<Order>,
    private toastr: ToastrService,
    public authenticationService: AuthenticationService,
  ) {
    super(router, location, ``, api, service, 10, 'createdAt', [], [
      {
        key: 'users',
        values: [authenticationService.authService.model.id],
      }
    ]);
  }

  delete(model: Order) {
    Swal.fire({
      title: 'Are you sure?',
      text: `This action remove from Orders!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#07B59A',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Confirm',
    }).then(result => {
      if (result.value) {
        this.api.delete<ApiResponse>(`/${model.id}`).subscribe(
          orderDeletion => {
            this.clear();
            this.toastr.success(orderDeletion?.message || 'Changes applied.');
          },
          orderDeletion => {
            this.toastr.error(
              orderDeletion?.error.message || 'An error occurred.'
            );
          }
        );
      }
    });
  }
}
