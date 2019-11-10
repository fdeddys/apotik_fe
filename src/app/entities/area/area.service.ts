import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { Area } from './area.model';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { map } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<Area>;

@Injectable({
  providedIn: 'root'
})
export class AreaService {
    private dataSource = new BehaviorSubject<Area>({});
    dataSharing = this.dataSource.asObservable();

    private serverUrl = SERVER_PATH + 'area';

    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<Area[]>> {
        let pageNumber = null;
        let regionId = null;
        let pageCount = null;
        let newresourceUrl = null;

        Object.keys(req).forEach((key) => {
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }
            if (key === 'regionId') {
                regionId = req[key];
            }
        });

        newresourceUrl = this.serverUrl + `/region/${regionId}/filter/page/${pageNumber}/count/${pageCount}`;

        return this.http.post<Area[]>(newresourceUrl, req['filter'], {  observe: 'response' });
    }

    getFromMda(id): Observable<HttpResponse<Area[]>> {

        const newResourceUrl = this.serverUrl + `/getFromMda/${id}`;
        return this.http.get<Area[]> (newResourceUrl, {observe: 'response'});
    }

    approveFromMda(id): Observable<Area> {
        const newresourceUrl = this.serverUrl + `/approveMda/${id}`;
        return this.http.post<Area> (newresourceUrl, {observe: 'response'});
    }

    save(area: Area): Observable<EntityResponseType> {
        const copy = this.convert(area);
        const result = this.http.post<Area>(`${this.serverUrl}`, copy, {observe: 'response'})
          .pipe(map((res: EntityResponseType) => this.convertResponse(res)));

        return result;
    }

    repair(area: Area, idMda: Number): Observable<EntityResponseType> {
        const copy = this.convert(area);
        const newResourceUrl = this.serverUrl + `/repair/${idMda}`;
        const result = this.http.post<Area>(newResourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));

        return result;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Area = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(area: Area): Area {
        const copyOb: Area = Object.assign({}, area);
        return copyOb;
    }

    private convert(area: Area ): Area {
        const copy: Area = Object.assign({}, area);
        return copy;
    }

    senData(area: Area) {
        this.dataSource.next(area);
    }
}
