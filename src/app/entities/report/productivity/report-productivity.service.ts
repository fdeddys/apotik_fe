import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ReportProductivity } from './report-productivity.model';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from 'src/app/shared/httpUtil';

// export type EntityResponseType = HttpResponse<Teroris>;

@Injectable(
    {
        providedIn: 'root'
    }
)

export class ReportProductivityService {
    private serverUrl = SERVER_PATH + 'report';

    constructor(private http: HttpClient) { }

    query(req?: any): Observable<HttpResponse<ReportProductivity[]>> {
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
            newresourceUrl = this.serverUrl + `/productivity/${start}/${end}`;
            return this.http.get<ReportProductivity[]>(newresourceUrl, { observe: 'response' })
                .pipe(
                    tap(reportlist => console.log('raw ', reportlist))
                );
        } else {
            return this.http.get<ReportProductivity[]>(`${this.serverUrl}`, { observe: 'response' })
                .pipe(
                    tap(reportlist => console.log('raw ', reportlist))
                );
        }

    }
}
