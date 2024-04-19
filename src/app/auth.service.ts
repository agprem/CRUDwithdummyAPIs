import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  checkUser() {
    let user = JSON.parse(localStorage.getItem("currentUser") || null);
    console.log(user, "User Authenticated")
    return user
  }


}
