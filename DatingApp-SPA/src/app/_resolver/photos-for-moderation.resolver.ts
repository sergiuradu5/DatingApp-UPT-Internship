import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Photo } from '../_models/photo';
import { AdminService } from '../_services/admin.service';

@Injectable()
export class PhotosForModerationResolver implements Resolve<Photo[]> {

  pageNumber =1 ;
  pageSize = 5;
  constructor(
    private adminService: AdminService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

    resolve(route: ActivatedRouteSnapshot) : Observable<Photo[]> {
        return this.adminService.getPhotosForModeration(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertify.error('Problem retreiving photos for moderation');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }

}
