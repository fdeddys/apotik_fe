import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { Branch } from './branch.model';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { map } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<Branch>;


@Injectable({
  providedIn: 'root'
})
export class BranchService {

    private serverUrl = SERVER_PATH + 'branch';

    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<Branch[]>> {
        let pageNumber = null;
        let areaId = null;
        let pageCount = null;
        let newresourceUrl = null;

        Object.keys(req).forEach((key) => {
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }
            if (key === 'areaId') {
                areaId = req[key];
            }
        });

        newresourceUrl = this.serverUrl + `/area/${areaId}/filter/page/${pageNumber}/count/${pageCount}`;

        return this.http.post<Branch[]>(newresourceUrl, req['filter'], {  observe: 'response' });

    }

    getFromMda(id): Observable<HttpResponse<Branch[]>> {
        const newResourceUrl = this.serverUrl + `/getFromMda/${id}`;
        return this.http.get<Branch[]> (newResourceUrl, {observe: 'response'});
    }

    approveFromMda(id): Observable<Branch> {
        const newresourceUrl = this.serverUrl + `/approveMda/${id}`;
        return this.http.post<Branch> (newresourceUrl, {observe: 'response'});
    }

    save(branch: Branch): Observable<EntityResponseType> {
        const copy = this.convert(branch);
        const result = this.http.post<Branch>(`${this.serverUrl}`, copy, {observe: 'response'})
          .pipe(map((res: EntityResponseType) => this.convertResponse(res)));

        return result;
    }

    repair(branch: Branch, idMda: Number): Observable<EntityResponseType> {
        const copy = this.convert(branch);
        const newResourceUrl = this.serverUrl + `/repair/${idMda}`;
        const result = this.http.post<Branch>(newResourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));

        return result;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Branch = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(branch: Branch): Branch {
        const copyOb: Branch = Object.assign({}, branch);
        return copyOb;
    }

    private convert(branch: Branch ): Branch {
        const copy: Branch = Object.assign({}, branch);
        return copy;
    }

}
