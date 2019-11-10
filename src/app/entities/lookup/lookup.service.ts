import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
// import { Lookup } from './lookup.model';
import { LookupDto } from './lookup-dto.model';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { map, tap } from 'rxjs/operators';
import { Lookup } from './lookup.model';

export type EntityResponseType = HttpResponse<Lookup>;
// export type EntityResponseTypeDto = HttpResponse<LookupDto>;


@Injectable({
    providedIn: 'root'
})
export class LookupService {

    private serverUrl = SERVER_PATH + 'lookup';

    constructor(private http: HttpClient) { }

    findForMerchantGroup():  Observable<HttpResponse<LookupDto[]>> {
        // return this.http.get<LookupDto[]>(this.serverUrl + `/all/redis`, {  observe: 'response' })
        return this.http.get<LookupDto[]>(this.serverUrl + `/merchantGroup`, {  observe: 'response' })
            .pipe(
                tap(merchantGrouplist => console.log('raw ', merchantGrouplist ) )
                );
    }

    save(lookup: Lookup): Observable<EntityResponseType> {
        const copy = this.convert(lookup);
        return this.http.post<Lookup>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    repair(lookup: Lookup, idMda: Number): Observable<EntityResponseType> {
        const copy = this.convert(lookup);
        const newResourceUrl = this.serverUrl + `/repair/${idMda}`;
        return this.http.post<Lookup>(newResourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }


    filter(req?: any): Observable<HttpResponse<Lookup[]>> {
        let pageNumber = null;
        let groupName = null;
        let pageCount = null;
        let newresourceUrl = null;

        Object.keys(req).forEach((key) => {
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }
            if (key === 'groupName') {
                groupName = req[key];
            }
        });

        newresourceUrl = this.serverUrl + `/name/${groupName}/filter/page/${pageNumber}/count/${pageCount}`;

        return this.http.post<Lookup[]>(newresourceUrl, req['filter'], {  observe: 'response' });
    }

    findByName(req?: any): Observable<HttpResponse<Lookup[]>> {
        let groupName = null;
        let newresourceUrl = null;


        Object.keys(req).forEach((key) => {
            if (key === 'groupName') {
                groupName = req[key];
            }
        });

        newresourceUrl = this.serverUrl + `/name/${groupName}`;

        return this.http.get<Lookup[]>(newresourceUrl, { observe: 'response' });

    }

    // find all job risk data
    findNameWithRisk(name?: String): Observable<HttpResponse<Lookup[]>> {
        let newresourceUrl = null;

        newresourceUrl = this.serverUrl + `/name/${name}/isHighRisk/1`;
        return this.http.get<Lookup[]>(newresourceUrl, { observe: 'response' });
    }

    getFromMda(id): Observable<HttpResponse<Lookup[]>> {
        const newresourceUrl = this.serverUrl + `/getFromMda/${id}`;
        return this.http.get<Lookup[]> (newresourceUrl, {observe: 'response'});
    }

    getRiskFromMda(id): Observable<HttpResponse<[]>> {
        const newresourceUrl = this.serverUrl + `/risk-profiler/getFromMda/${id}`;
        return this.http.get<[]> (newresourceUrl, {observe: 'response'});
    }

    approveFromMda(id): Observable<Lookup> {
        const newresourceUrl = this.serverUrl  + `/approveMda/${id}`;
        return this.http.post<Lookup> (newresourceUrl, { observe: 'response'});
    }

    private convert( lookup: Lookup): Lookup {
        const copy: Lookup = Object.assign({}, lookup);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Lookup = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(lookup: Lookup): Lookup {
        const copyOb: Lookup = Object.assign({}, lookup);
        return copyOb;
    }

}
