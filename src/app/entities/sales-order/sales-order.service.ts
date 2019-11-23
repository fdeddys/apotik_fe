import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityResponseType } from '../user/user.service';
import { SalesOrderPageDto, SalesOrder } from './sales-order.model';

@Injectable({
    providedIn: 'root'
})
export class SalesOrderService {

    private serverUrl = SERVER_PATH + 'sales-order';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<SalesOrderPageDto[]>> {
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

        return this.http.post<SalesOrderPageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    save(salesOrder: SalesOrder): Observable<EntityResponseType> {
        const copy = this.convert(salesOrder);
        return this.http.post<SalesOrder>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convert(salesOrder: SalesOrder): SalesOrder {
        const copy: SalesOrder = Object.assign({}, salesOrder);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: SalesOrder = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(salesOrder: SalesOrder): SalesOrder {
        const copyOb: SalesOrder = Object.assign({}, salesOrder);
        return copyOb;
    }
}
