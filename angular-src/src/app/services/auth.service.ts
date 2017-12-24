import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';

@Injectable()
export class AuthService {

  authToken:any;
  user:any;

  constructor(private http:Http) { }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('users/register',user,{headers:headers})
      .map(res=>res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('users/authenticate',user,{headers:headers})
      .map(res=>res.json());
  }
  loadToken(){
    this.authToken = localStorage.getItem('token');
  }
  storeUserData(token,user){
    if('localStorage' in window){
      localStorage.setItem('token',token);
      localStorage.setItem('user',JSON.stringify(user));
      this.authToken = token;
      this.user = user;
    }
  }
  getProfile(){
    let headers = new Headers();
    this.loadToken();
    console.log('token: ',this.authToken);
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('users/profile',{headers:headers})
      .map(res=>res.json());
  }
  loggedIn(){
    // console.log(tokenNotExpired());
    return tokenNotExpired();
  }
  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
