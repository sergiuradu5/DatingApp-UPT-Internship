import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import { environment } from 'src/environments/environment';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import { User } from '../_models/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl;
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png'); //For ANY to ANY Comunication 
  currentPhotoUrl = this.photoUrl.asObservable();
  
  constructor(private http: HttpClient) { }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login (model: any)
  {
    return this.http.post(this.baseUrl + 'auth/' + 'login', model)
    .pipe(
      map((response: any) => {
        const user=response;
        if(user) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodedToken= this.jwtHelper.decodeToken(user.token);
          this.currentUser= user.user;
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      })
    )
  }

  register(user : User) {
    return this.http.post(this.baseUrl + 'auth/' + 'register', user);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  roleMatch(allowedRoles): boolean {
    let isMatch = false;
    const userRoles = this.decodedToken.role as Array<string>;
    allowedRoles.forEach(element => {
      if(userRoles.includes(element)) {
        isMatch = true;
        return;
      }
    });
    return isMatch;
  }

  getRoles() : Array<string>{
    const userRoles = this.decodedToken.role as Array<string>;
    return userRoles;
  }

}
