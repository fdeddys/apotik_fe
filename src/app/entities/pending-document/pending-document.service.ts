import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { PendingDocument } from './pending-document';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PendingDocumentService {

    private serverUrl = SERVER_PATH + 'pending-document';


    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<PendingDocument[]>> {
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

        return this.http.post<PendingDocument[]>(newresourceUrl, req['filter'], { observe: 'response' })
            .pipe(
                tap(res => console.log('raw', res))
            );
    }

}
