import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { Apupt } from './apupt.model';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { tap, map } from 'rxjs/operators';
// import { type } from 'os';

export type EntityResponseType = HttpResponse<Apupt>;

@Injectable({
  providedIn: 'root'
})
export class ApuptService {

    private dataSource = new BehaviorSubject<Apupt>({});
    dataSharing = this.dataSource.asObservable();
    private serverUrl = SERVER_PATH + 'apupt';
    constructor(private http: HttpClient) { }


    updateData(apupt: Apupt) {
        this.dataSource.next(apupt);
    }

    save(apupt: Apupt): Observable<EntityResponseType> {
        const copy = this.convert(apupt);
        console.log(copy, `${this.serverUrl}`);
        // return null;
        const result = this.http.post<Apupt>(`${this.serverUrl}`, copy, {observe: 'response'})
        .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
        // return this.http.post<Apupt>(`${this.serverUrl}`, copy, {});
        return result;
    }

    repair(apupt: Apupt, idMda: number): Observable<EntityResponseType> {
        const copy = this.convert(apupt);
        const newResourceUrl = this.serverUrl + `/repair/${idMda}`;
        const result = this.http.post<Apupt>(newResourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));

        return result;
    }

    filter(req ?: any): Observable<HttpResponse<Apupt[]>> {
        let pageNumber = null;
        let pageCount = null;
        let newResourceUrl = null;
        let result = null;


        Object.keys(req).forEach((key) => {
        if (key === 'page') {
        pageNumber = req[key];
        }
        if (key === 'count') {
        pageCount = req[key];
        }
        });

        newResourceUrl = this.serverUrl + `/filter/page/${pageNumber}/count/${pageCount}`;

        result = this.http.post<Apupt[]>(newResourceUrl, req['filter'], { observe: 'response' })
        .pipe(
            tap(
            // console.log('sdad')
            results => console.log('raw', results)
            )
        );
        // console.log(result);
        return result;
    }

    getAll(): Observable<HttpResponse<Apupt[]>> {
        let newResourceUrl = null;

        newResourceUrl = this.serverUrl + '/all';

        const result = this.http.get<Apupt[]>(newResourceUrl, {observe: 'response'}).pipe(
        tap(results => console.log('raw', results))
        );

        return result;
    }

    getFromMda(id): Observable<HttpResponse<Apupt[]>> {
        const newResourceUrl = this.serverUrl + `/getFromMda/${id}`;
        return this.http.get<Apupt[]> (newResourceUrl, {observe: 'response'});
    }

    approveFromMda(id): Observable<Apupt> {
        const newresourceUrl = this.serverUrl  + `/approveMda/${id}`;
        return this.http.post<Apupt> (newresourceUrl, { observe: 'response'});

        // result = this.http.post<Apupt>(`${this.serverUrl}`, copy, {observe: 'response'})
        // 	.pipe(map((res: EntityResponseType) => this.convertResponse(res)))


    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Apupt = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(apupt: Apupt): Apupt {
        const copyOb: Apupt = Object.assign({}, apupt);
        return copyOb;
    }

    private convert(apupt: Apupt): Apupt {
        const copy: Apupt = Object.assign({}, apupt);
        return copy;
    }


}
