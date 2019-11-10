import { Injectable } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { ReportReject } from './report-reject.model';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export type EntityResponseTypr = HttpResponse<ReportReject>;

@Injectable({
    providedIn: 'root'
})
export class ReportRejectService {

    private serverUrl = SERVER_PATH + 'report/reject';

    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<ReportReject[]>> {
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

        return this.http.post<ReportReject[]>(newresourceUrl, req['filter'], {observe: 'response'})
            .pipe(
                tap(results => console.log('raw ', results))
            );
    }

}
