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
export class MerchantStatusListService {

    private serverUrl = SERVER_PATH + 'statuslist/';

    constructor(private http: HttpClient) { }

    public pauseVerify(id): void {
        const newresourceUrl = this.serverUrl + `verifierpause/${id}`;

        this.http.post(newresourceUrl, null).toPromise();
    }

    public pauseApprover(id): void {
        const newresourceUrl = this.serverUrl + `approverpause/${id}`;

        this.http.post(newresourceUrl, null).toPromise();
    }

    public pauseEdd(id): void {
        const newresourceUrl = this.serverUrl + `eddpause/${id}`;

        this.http.post(newresourceUrl, null).toPromise();
    }

}
