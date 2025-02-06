import { Injectable } from '@angular/core';
import { HttpClient,HttpInterceptor } from '@angular/common/http'
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URI = environment.apiBack;

  constructor(private http: HttpClient, private router: Router) { }

  signInUser(user:any) {
    return this.http.post<any>(this.API_URI + '/signin', user);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  intercept(req:any, next:any) {
    let tokenizeReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return next.handle(tokenizeReq);
  }
}
