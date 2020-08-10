import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../_models/user';
import { Observable } from 'rxjs';
import { Photo } from '../_models/photo';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
      baseUrl = environment.baseUrl;

    constructor(private http: HttpClient,
                private authService: AuthService
      ) { }

    getUsersWithRoles()
    {
      return this.http.get(this.baseUrl + 'admin/usersWithRoles');
    }

    updateUserRoles(user: User, roles: {}) {
        return this.http.post(this.baseUrl + 'admin/editRoles/' + user.userName, roles);
    }



    getPhotosForModeration(page?, itemsPerPage?, photosParams?) : Observable<PaginatedResult<Photo[]>>
    {
      const paginatedResult: PaginatedResult<Photo[]> = new PaginatedResult<Photo[]>();

      let params = new HttpParams();

      if(page != null && itemsPerPage != null) {
        params = params.append('pageNumber', page);
        params = params.append('pageSize', itemsPerPage);
      }
      if(photosParams != null)
      {
        params = params.append('orderBy', photosParams.orderBy);
      }

      return this.http.get<Photo[]>(this.baseUrl + 'admin/photosForModeration', {observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if(response.headers.get('Pagination')!=null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
    }

    approvePhoto(id: number)
    {
      return this.http.post(this.baseUrl + 'admin/' + 'photosForModeration/' + id + '/approve', {});
    }

    deletePhoto(photoId: number)
      {
        return this.http.delete(this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos/moderator/' + photoId);
      }

}