import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { PurchasePriceMatrixResponse } from './purchase-price-history.model';

@Injectable({
  providedIn: 'root'
})
export class PurchasePriceHistoryService {

    private serverUrl = SERVER_PATH + 'receive-detail/purchase-price-history';

    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<PurchasePriceMatrixResponse>> {
        let pageNumber = 1;
        let pageCount = 25;
        let filterParam = {};

        if (req) {
            if (req.page) {
                pageNumber = req.page;
            }
            if (req.count) {
                pageCount = req.count;
            }
            if (req.filter) {
                filterParam = req.filter;
            }
        }

        const newresourceUrl = this.serverUrl + `/page/${pageNumber}/count/${pageCount}`;
        return this.http.post<PurchasePriceMatrixResponse>(newresourceUrl, filterParam, { observe: 'response' });
    }
}
