import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { tap, map } from 'rxjs/operators';
import { MerchantOutlet } from './merchant-outlet.model';

export type EntityResponseType = HttpResponse<MerchantOutlet>;


// const HttpUploadOptions = {
//     headers: new HttpHeaders()
// };

@Injectable({
  providedIn: 'root'
})
export class MerchantDetailOutletService {

    private serverUrl = SERVER_PATH + 'merchantoutlet';

    constructor(private http: HttpClient) { }

    findByMerchantPage(req?: any): Observable<HttpResponse<MerchantOutlet[]>> {

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
            if (key === 'merchantId') {
                merchantId = req[key];
            }
        });

        newresourceUrl = this.serverUrl + `/merchant/${merchantId}/page/${pageNumber}/count/${pageCount}`;

        return this.http.get<MerchantOutlet[]> (newresourceUrl, { observe: 'response'})
            .pipe();
    }

}
