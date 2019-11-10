import { Injectable } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { ReportFinished } from './report-finished.model';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export type EntityResponseTypr = HttpResponse<ReportFinished>;

@Injectable({
    providedIn: 'root'
})
export class ReportFinishedService {

    private serverUrl = SERVER_PATH + 'report/finish';

    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<ReportFinished[]>> {
        let allData = null;
        let pageNumber = null;
        let pageCount = null;
        let newresourceUrl = null;

        Object.keys(req).forEach((key) => {
            if (key === 'allData') {
                allData = req[key];
            }
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }
        });

        newresourceUrl = this.serverUrl + `/filter/page/${pageNumber}/count/${pageCount}`;

        return this.http.post<ReportFinished[]>(newresourceUrl, req['filter'], {observe: 'response'})
            .pipe(
                tap(results => console.log('raw ', results))
            );
    }

}
