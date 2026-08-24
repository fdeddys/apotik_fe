import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PelangganPageDto, Pelanggan } from './pelanggan.model';
import { EntityResponseType } from '../user/user.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PelangganService {

    private serverUrl = SERVER_PATH + 'pelanggan';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<PelangganPageDto>> {
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

        return this.http.post<PelangganPageDto>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    save(pelanggan: Pelanggan): Observable<EntityResponseType> {
        const copy = this.convert(pelanggan);
        return this.http.post<Pelanggan>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete(`${this.serverUrl}/${id}`, { observe: 'response' });
    }

    private convert(pelanggan: Pelanggan): Pelanggan {
        const copy: Pelanggan = Object.assign({}, pelanggan);
        if (copy.tglMasuk === '') {
            copy.tglMasuk = null;
        }
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Pelanggan = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(pelanggan: Pelanggan): Pelanggan {
        const copyOb: Pelanggan = Object.assign({}, pelanggan);
        return copyOb;
    }
}
