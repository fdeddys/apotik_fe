import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { InternalNameRisk } from './internal-name-risk.model';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { map, tap } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<InternalNameRisk>;


@Injectable({
  providedIn: 'root'
})
export class InternalNameRiskService {

    private serverUrl = SERVER_PATH + 'internal-name-risk';


    constructor(private http: HttpClient) { }

    filter(req ?: any): Observable<HttpResponse<InternalNameRisk[]>> {
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

        result = this.http.post<InternalNameRisk[]>(newResourceUrl, req['filter'], { observe: 'response' });

        return result;
    }

    getAll(): Observable<HttpResponse<InternalNameRisk[]>> {
        let newResourceUrl = null;

        newResourceUrl = this.serverUrl + '/all';

        const result = this.http.get<InternalNameRisk[]>(newResourceUrl, { observe: 'response' }).pipe(
            tap(results => console.log('raw', results))
        );

        return result;
    }

    save(internalNameRisk: InternalNameRisk): Observable<EntityResponseType> {
        const copy = this.convert(internalNameRisk);
        const result = this.http.post<InternalNameRisk>(`${this.serverUrl}`, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));

        return result;
    }

    repair(internalNameRisk: InternalNameRisk, idMda: number): Observable<EntityResponseType> {
        const copy = this.convert(internalNameRisk);
        const newResourceUrl = this.serverUrl + `/repair/${idMda}`;
        const result = this.http.post<InternalNameRisk>(newResourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));

        return result;
    }

    getFromMda(id): Observable<HttpResponse<InternalNameRisk[]>> {
        const newresourceUrl = this.serverUrl + `/getFromMda/${id}`;
        return this.http.get<InternalNameRisk[]>(newresourceUrl, { observe: 'response' })
            .pipe(
                tap(result => console.log('hasil', result))
            );
    }

    approveFromMda(id): Observable<InternalNameRisk> {
        const newresourceUrl = this.serverUrl + `/approveMda/${id}`;
        return this.http.post<InternalNameRisk>(newresourceUrl, { observe: 'response' });
    }

    private convert(internalNameRisk: InternalNameRisk): InternalNameRisk {
        const copy: InternalNameRisk = Object.assign({}, internalNameRisk);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: InternalNameRisk = this.convertItemFromServer(res.body);
        return res.clone({ body });
    }

    private convertItemFromServer(internalNameRisk: InternalNameRisk): InternalNameRisk {
        const copyOb: InternalNameRisk = Object.assign({}, internalNameRisk);
        return copyOb;
    }
}
