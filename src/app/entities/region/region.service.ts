import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { Region } from './region.model';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { tap, map } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<Region>;

@Injectable({
  providedIn: 'root'
})
export class RegionService {
    private dataSource = new BehaviorSubject<Region>({});
    dataSharing = this.dataSource.asObservable();
    private serverUrl = SERVER_PATH + 'region';
    constructor(private http: HttpClient) { }

    save(region: Region): Observable<EntityResponseType> {
        const copy = this.convert(region);
        const result = this.http.post<Region>(`${this.serverUrl}`, copy, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));

        return result;
    }

    repair(region: Region, idMda: number): Observable<EntityResponseType> {
        const copy = this.convert(region);
        const newResourceUrl = this.serverUrl + `/repair/${idMda}`;
        const result = this.http.post<Region>(newResourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));

        return result;
    }

    getAllRegion(req?: any): Observable<HttpResponse<Region[]>> {

        const newResourceUrl = this.serverUrl + `/all`;

        return this.http.get<Region[]> (newResourceUrl, {observe: 'response'});
    }

    filter(req ?: any): Observable<HttpResponse<Region[]>> {
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

        result = this.http.post<Region[]>(newResourceUrl, req['filter'], { observe: 'response' })
            .pipe(
            tap(
                results => console.log(results)
            )
            );
        return result;
    }

    getFromMda(id): Observable<HttpResponse<Region[]>> {
        console.log(id);
        const newResourceUrl = this.serverUrl + `/getFromMda/${id}`;
        return this.http.get<Region[]> (newResourceUrl, {observe: 'response'});
    }

    approveFromMda(id): Observable<Region> {
        const newresourceUrl = this.serverUrl + `/approveMda/${id}`;
        return this.http.post<Region> (newresourceUrl, {observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Region = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(region: Region): Region {
        const copyOb: Region = Object.assign({}, region);
        return copyOb;
    }

    private convert(region: Region ): Region {
        const copy: Region = Object.assign({}, region);
        return copy;
    }

    senData(region: Region) {
        this.dataSource.next(region);
    }

}
