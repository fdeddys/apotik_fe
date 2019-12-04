import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReceivingPageDto } from './receiving.model';

@Injectable({
    providedIn: 'root'
})
export class ReceivingService {

    private serverUrl = SERVER_PATH + 'receiving';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<ReceivingPageDto[]>> {
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

        newresourceUrl = this.serverUrl + `/page/${pageNumber}/count/${pageCount}`;

        return this.http.post<ReceivingPageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }

}
