import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MyserviceService } from '../myservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(public fb: FormBuilder, public route: Router, private authservice: AuthService, private myservice: MyserviceService) { }
  wronguser: boolean = false;
  ngOnInit(): void {
    //if user manually types login after logging in it should navigate to main
    if (this.authservice.checkUser()) {
      this.route.navigate([""])
    }
    if (sessionStorage.getItem('username') && sessionStorage.getItem('password')) {
      this.loginform.patchValue({ username: sessionStorage.getItem('username'), password: sessionStorage.getItem('password') })
    }
  }
  loginform = this.fb.group({
    password: ['', [Validators.required]],
    username: ['', [Validators.required]],
    rememberMeChecked: [false]
  })
  onSubmit(loginform: any) {
    if (this.loginform.get('rememberMeChecked').value) {
      sessionStorage.setItem('username', this.loginform.value.username || "")
      sessionStorage.setItem('password', this.loginform.value.password || "");
    } else {
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('password');
    }
    const user = loginform?.value

    this.myservice.login(user).subscribe((res) => {
      if (res) {
        localStorage.setItem("currentUser", JSON.stringify(user))
        this.route.navigate(['']);
      }
    }, (err) => { this.wronguser = true })
  }
}
