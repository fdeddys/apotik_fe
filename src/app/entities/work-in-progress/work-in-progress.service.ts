import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { EntityResponseType } from '../apupt/apupt.service';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from 'src/app/shared/httpUtil';
import { MerchantWip, MerchantWipQueue } from './merchant-wip.model';
import { Merchant } from '../merchant/merchant.model';

import { MerchantOutlet } from '../merchant/merchant-outlet.model';

export type EntityResponseType = HttpResponse<MerchantWip>;

@Injectable({
    providedIn: 'root'
})
export class WorkInProgressService {

    private serverUrl = SERVER_PATH + 'merchantwip';
    private serverUrlOutlet = SERVER_PATH + 'merchantoutletwip';

    constructor(private http: HttpClient) { }

    saveWip(merchantWip: MerchantWip, action: number): Observable<EntityResponseType> {

        const newresourceUrl = this.serverUrl + `/action/${action}`;
        const result = this.http.post<MerchantWip>(newresourceUrl, merchantWip, { observe: 'response' });
        return result;
    }

    saveMchtOutlet(merchantOutlets: MerchantOutlet[], idMerchant: number): Observable<HttpResponse<any>> {
        const newresourceUrl = this.serverUrlOutlet + `/merchantwipid/${idMerchant}`;
        const result = this.http.post<any>(newresourceUrl, merchantOutlets, { observe: 'response' });
        return result;
    }

    getWip(action: number): Observable<EntityResponseType> {

        const newresourceUrl = this.serverUrl + `/action/${action}`;
        const result = this.http.post<MerchantWip>(newresourceUrl, {}, { observe: 'response' });
        return result;
    }

    getMerchantWIPQueue(): Observable<HttpResponse<MerchantWipQueue[]>> {
        return this.http.get<MerchantWipQueue[]>(`${this.serverUrl}/all-queue`, { observe: 'response' })
            .pipe(
                // map((res: HttpResponse<memberType[]>) => this.convertArrayResponse(res))
                tap(accessMatrixMenu => console.log('raw ', accessMatrixMenu))
                // console.log('observable ', accessMatrixMenu)
            );
    }

    setVip(merchantKey: string): Observable<HttpResponse<any>>  {

        const newresourceUrl = this.serverUrl + `/REGISTERED/setVip`;
        return this.http.post<any>(newresourceUrl, merchantKey, { responseType: 'text' as 'json' });
    }

    setVvip(merchantKey: string): Observable<HttpResponse<any>> {

        const newresourceUrl = this.serverUrl + `/REGISTERED/setvvip`;
        return this.http.post<any>(newresourceUrl, merchantKey, {responseType: 'text' as 'json' });
    }

    getStatusPriority(idMerchant: number): Observable<HttpResponse<string>>{
        const newresourceUrl = this.serverUrl + `/status-priority`;
        const result = this.http.get<any>(`${newresourceUrl}/${idMerchant}`, { responseType: 'text' as 'json' });
        return result;
        
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<MerchantWip>(`${this.serverUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    filter(req?: any): Observable<HttpResponse<MerchantWip[]>> {
        const options = createRequestOption(req);
        let allData = null;
        let pageNumber = null;
        let pageCount = null;
        let newresourceUrl = null;

        Object.keys(req).forEach((key) => {
            if (key === 'allData') {
                allData = req[key];
            }
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }
        });

        newresourceUrl = this.serverUrl + `/filter/page/${pageNumber}/count/${pageCount}`;
        return this.http.post<MerchantWip[]>(newresourceUrl, req['filter'], { observe: 'response' })
            .pipe(
                tap(results => console.log('raw ', results))
            );
    }

    /**
     * Dashboard
     * */
    getDataDashboard(): Observable<HttpResponse<Map<string, number>>> {
        const newresourceUrl = this.serverUrl + `/dashboard-wip`;
        const result =  this.http.get<Map<string, number>>(`${newresourceUrl}`, { observe: 'response' });


        return result;

    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        console.log('convert response');
        const body: MerchantWip = this.convertItemFromServer(res.body);
        return res.clone({ body });
    }

    /**
     * Convert a returned JSON object to memberBank.
     */
    private convertItemFromServer(teroris: MerchantWip): MerchantWip {
        const copyOb: MerchantWip = Object.assign({}, teroris);
        return copyOb;
    }

    /**
    * Convert a Member to a JSON which can be sent to the server.
    */
    private convert(teroris: MerchantWip): MerchantWip {
        const copy: MerchantWip = Object.assign({}, teroris);
        return copy;
    }

}
