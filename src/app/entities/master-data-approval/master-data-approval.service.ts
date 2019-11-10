import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { MasterDataApproval } from './master-data-approval.model';
import { createRequestOption } from 'src/app/shared/httpUtil';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MasterDataApprovalService {

    private dataSourceIdMda = new BehaviorSubject<number>(0);
    private dataSourceModuleName = new BehaviorSubject<string>('');
    private dataSourceActionRec = new BehaviorSubject<number>(0);

    private serverUrl = SERVER_PATH + 'masterDataApproval';
    dataSharingIdMda = this.dataSourceIdMda.asObservable();
    dataSharingModuleName = this.dataSourceModuleName.asObservable();
    dataSharingActionRec = this.dataSourceActionRec.asObservable();

    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<MasterDataApproval[]>> {
        // const options = createRequestOption(req);
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
        return this.http.post<MasterDataApproval[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                tap(results => console.log('raw ', results ) )
            );
    }

    query(req?: any): Observable<HttpResponse<MasterDataApproval[]>> {
        const options = createRequestOption(req);
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

        if (pageNumber !== null) {
            newresourceUrl = this.serverUrl + `/page/${pageNumber}/count/${pageCount}`;
            return this.http.get<MasterDataApproval[]>(newresourceUrl, { observe: 'response' })
                .pipe(
                    tap(merchantGrouplist => console.log('raw ', merchantGrouplist))
                );
        } else {
            return this.http.get<MasterDataApproval[]>(`${this.serverUrl}`, { observe: 'response' })
                .pipe(
                    tap(merchantGrouplist => console.log('raw ', merchantGrouplist))
                );
        }

    }

    reject(id): Observable<MasterDataApproval> {
        const newresourceUrl = this.serverUrl + `/reject/${id}`;
        return this.http.post<MasterDataApproval> (newresourceUrl, { observe: 'response'});
    }

    requestRepair(id): Observable<MasterDataApproval> {
        const newresourceUrl = this.serverUrl + `/request-repair/${id}`;
        return this.http.post<MasterDataApproval>(newresourceUrl, { observe: 'response' });
    }

    sendData(id: number, moduleName: string, actionRec: number) {
        this.dataSourceIdMda.next(id);
        this.dataSourceModuleName.next(moduleName);
        this.dataSourceActionRec.next(actionRec);
    }

}
