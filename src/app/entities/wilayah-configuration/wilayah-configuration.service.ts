import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WilayahConfiguration } from './wilayah-configuration.model';
import { tap, map } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<WilayahConfiguration>;

@Injectable(
    {
        providedIn: 'root'
    }
)


export class WilayahConfigurationService {

    private serverUrl = SERVER_PATH + 'wilayah-configuration';

    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<WilayahConfiguration[]>> {
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
        return this.http.post<WilayahConfiguration[]>(newresourceUrl, req['filter'], { observe: 'response' })
            .pipe(
                tap(results => console.log('raw ', results))
            );
    }

    save(wilayahConfig: WilayahConfiguration): Observable<EntityResponseType> {

        console.log('wilayah config data-->', wilayahConfig);

        const copy = this.convert(wilayahConfig);
        console.log('prepare post++', copy, '++', `${this.serverUrl}`);

        return this.http.post<WilayahConfiguration>(`${this.serverUrl}`, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));

    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        console.log('convert response');
        const body: WilayahConfiguration = this.convertItemFromServer(res.body);
        return res.clone({ body });
    }

    private convertItemFromServer(wilayahConfiguration: WilayahConfiguration): WilayahConfiguration {
        const copyOb: WilayahConfiguration = Object.assign({}, wilayahConfiguration);
        return copyOb;
    }

    private convert(wilayahConfig: WilayahConfiguration): WilayahConfiguration {
        const copy: WilayahConfiguration = Object.assign({}, wilayahConfig);
        return copy;
    }

}
