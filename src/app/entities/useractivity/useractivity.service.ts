import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Useractivity } from './useractivity.model';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UseractivityService {

    private serverUrl = SERVER_PATH + 'userloginhistory';

    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<Useractivity[]>> {
        let pageNumber = null;
        let pageCount = null;
        let newresourceUrl = null;

        Object.keys(req).forEach((key) => {
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }
        });

        newresourceUrl = this.serverUrl + `/filter/page/${pageNumber}/count/${pageCount}`;

        return this.http.post<Useractivity[]>(newresourceUrl, req['filter'], { observe: 'response' })
            .pipe(
                tap(results => console.log('raw ', results))
            );
    }
}
