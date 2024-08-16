import { ActivatedRouteSnapshot } from '@angular/router';
import { CommonVerbsApiService } from '@services/common/common-verbs-api.service';
import { Tenant } from '@models/tenants/tenant.model';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { ModelService } from '@services/common/model.service';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { tap } from 'rxjs';
import { Plan } from '@models/plans/plan.model';

@Injectable()
export class PlanApiResolver  {
  constructor(
    @Inject('PlanService')
    public planService: ModelService<Plan>,
    private service: CommonVerbsApiService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Plan | null> {
    const id = route.queryParams.id || route.data.id;
    return this.service.get<Plan>(`plans/${id}`).pipe(
      tap(response => {
        this.planService.set(response);
      }),
      catchError(error => {
        this.router.navigate(['/404']);
        return of(null);
      })
    );
  }
}
