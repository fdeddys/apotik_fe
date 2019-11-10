import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ReportSLA } from './report-sla.model';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from 'src/app/shared/httpUtil';

// export type EntityResponseType = HttpResponse<Teroris>;

@Injectable(
    {
        providedIn: 'root'
    }
)

export class ReportSLAService {
    private serverUrl = SERVER_PATH + 'report';

    constructor(private http: HttpClient) { }

    getDataReportSLAMock(): Observable<any> {
        return this.http.get('./assets/mockdata/report-sla.json');
    }

    query(req?: any): Observable<HttpResponse<ReportSLA[]>> {
        const options = createRequestOption(req);
        let start = null;
        let end = null;
        let newresourceUrl = null;

        Object.keys(req).forEach((key) => {
            if (key === 'filter') {
                start = req[key].dateStart;
                end = req[key].dateEnd;
            }
        });

        if (start !== null) {
            newresourceUrl = this.serverUrl + `/sla/${start}/${end}`;
            return this.http.post<ReportSLA[]>(newresourceUrl, {}, { observe: 'response' })
                .pipe(
                    tap(reportlist => console.log('raw ', reportlist))
                );
        } else {
            return this.http.get<ReportSLA[]>(`${this.serverUrl}`, { observe: 'response' })
                .pipe(
                    tap(reportlist => console.log('raw ', reportlist))
                );
        }

    }
}
