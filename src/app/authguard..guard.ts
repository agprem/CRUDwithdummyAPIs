import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(public authService: AuthService, public route: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.checkUser();
    console.log(user, "inauthguard", user != null)
    if (user != null) {
      return true;
    }
    else {
      console.log("unauthorised user")
      this.route.navigate(['/login'], { queryParams: { returnUrl: state.url } })
      return false
    }
  }
}
