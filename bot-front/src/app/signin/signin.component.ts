import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  user = {'email':'','password':''};

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async signIn() {
    let res = await this.authService.signInUser(this.user).toPromise();
    localStorage.setItem('token', res.token);
    this.router.navigate(['/dashboard']);
  }
}
