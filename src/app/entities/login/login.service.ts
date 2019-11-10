import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { AUTH_PATH } from 'src/app/shared/constants/base-constant';
import { map } from 'rxjs/operators';
import * as sha512 from 'js-sha512';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,
    private localStorage: LocalStorageService,
    private router: Router, ) { }

    verifyCaptcha(responseFromChaptcha): Observable<any> {
      return this.http.post(AUTH_PATH + 'verifyCaptcha', responseFromChaptcha, {observe: 'response'});
    }

  login(credentials): Observable<any> {

    console.log('hasil sha ', sha512.sha512(credentials.password));
    const data = {
        username: credentials.username,
        password: sha512.sha512(credentials.username + credentials.password)
    };
    return this.http.post(AUTH_PATH + 'authenticate', data, {observe : 'response'})
    .pipe(map(authenticateSuccess.bind(this)));

    function authenticateSuccess(resp ) {
        console.log('result from server ' , resp.body.token);
        const bearerToken = resp.headers.get('Authorization');
        if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
            console.log('masuk ke cek bearer token ');
            const jwt = bearerToken.slice(7, bearerToken.length);
            this.storeAuthenticationToken(jwt, credentials.rememberMe);
            return jwt;
        } else {
            const jwt = resp.body.token;
            this.localStorage.store('token', jwt);
            this.localStorage.store('err_login', resp.body.err);
            console.log(resp.body.err);
          // Swal.fire('Failed', resp.body.err  , 'error');
            return jwt;
        }
    }
  }

    logout(): void {
        this.localStorage.clear('token');
        this.router.navigate(['/']);
        // setTimeout( () => { /*Your Code*/ }, 3000 );
        // location.reload();
  }

}
