import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { tap, map } from 'rxjs/operators';
import { MerchantOutletWip } from './merchant-outlet-wip.model';

export type EntityResponseType = HttpResponse<MerchantOutletWip>;


// const HttpUploadOptions = {
//     headers: new HttpHeaders()
// };

@Injectable({
    providedIn: 'root'
})
export class MerchantOutletWipService {

    private serverUrl = SERVER_PATH + 'merchantoutletwip';

    constructor(private http: HttpClient) { }

    findByMerchantPage(req?: any): Observable<HttpResponse<MerchantOutletWip[]>> {

        let pageNumber = null;
        let pageCount = null;
        let newresourceUrl = null;
        let merchantId = 1;

        Object.keys(req).forEach((key) => {
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }
            if (key === 'merchantWipId') {
                merchantId = req[key];
            }
        });

        newresourceUrl = this.serverUrl + `/merchantwipid/${merchantId}/page/${pageNumber}/count/${pageCount}`;

        return this.http.get<MerchantOutletWip[]>(newresourceUrl, { observe: 'response' })
            .pipe();
    }

}
