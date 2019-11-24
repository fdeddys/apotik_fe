import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { EntityResponseType } from '../user/user.service';
import { SalesOrderPageDto, SalesOrder, SalesOrderDetail, SalesOrderDetailPageDto } from './sales-order.model';

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

    findById(id: number): Observable<any> {
        return this.http.get<SalesOrder>(`${this.serverUrl}/${id}`)
            .pipe(
                // map((salesOrder: any) => salesOrder),
                flatMap(
                    (salesOrder: any) => {
                        const filter = {
                            OrderNo : '',
                            orderId : salesOrder.id,
                        };
                        return this.http.post<SalesOrderDetailPageDto>(`${this.serverUrl}/detail/page/1/count/1000`, filter, { observe: 'response' })
                            .pipe
                            (
                                map( (resDetail) => {
                                    let details = resDetail.body.contents;
                                    salesOrder.detail = details;
                                    return salesOrder;
                                })
                            );
                    }
                )
            );
        // .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
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
