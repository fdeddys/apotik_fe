import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { SalesOrderDetail } from './sales-order.model';

@Injectable({
    providedIn: 'root'
})
export class SalesOrderDetailService {

    private serverUrl = SERVER_PATH + 'sales-order-detail';
    constructor(private http: HttpClient) { }

    findByOrderId(req?: any) {
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

        return this.http.post<SalesOrderDetail>(`${this.serverUrl}`, req['filter'], { observe: 'response' });
        // .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }
}
