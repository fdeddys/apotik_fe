import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReceivingPageDto, Receive, ReceivingDetailPageDto } from './receiving.model';
import { flatMap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ReceivingService {

    private serverUrl = SERVER_PATH + 'receive';
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

    findById(id: number): Observable<any> {

        const pathReceiveDetailUrl = SERVER_PATH + 'receive-detail';

        return this.http
            .get<Receive>(`${this.serverUrl}/${id}`)
            .pipe(
                flatMap(
                    (receive: Receive) => {
                        const filter = {
                            receiveNo : '',
                            receiveId : receive.id,
                        };
                        return this.http
                            .post<ReceivingDetailPageDto>(`${pathReceiveDetailUrl}/page/1/count/1000`, filter, { observe: 'response' })
                            .pipe(
                                map( (resDetail) => {
                                    const details = resDetail.body.contents;
                                    receive.detail = details;
                                    return receive;
                                })
                            );
                    }
                )
            );
    }

}
