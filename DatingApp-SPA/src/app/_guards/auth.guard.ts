import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService
  ) {}
  canActivate(next: ActivatedRouteSnapshot): boolean {
    const roles = next.firstChild.data['roles'] as Array<string>; //Checking if there are variables (data) in the data of the route
    if (roles && this.authService.loggedIn()) { //When somebody accesses '/admin' they will receive a an awway of strings 'Admin' & "Moderator"
      const match = this.authService.roleMatch(roles); //and will check if he roles inside the token match these two
      if (match) {
        return true;
      } else {
        this.router.navigate(['members']);
        this.alertify.error('You are not authorised to acces this area');
      }
    }
    

    if (this.authService.loggedIn())
    return true;

    this.alertify.error('Unauthorized access');
    this.router.navigate(['/home']);
    return false;
  }
}
