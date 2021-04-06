import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { Warehouse } from './warehouse.model';

@Injectable({
    providedIn: 'root'
})
export class WarehouseService {

    private serverUrl = SERVER_PATH + 'warehouse';
    constructor(private http: HttpClient) { }

    getSalesman(req?: any): Observable<HttpResponse<Warehouse>> {

        var newresourceUrl = this.serverUrl;
        return this.http.get<Warehouse>(newresourceUrl, { observe: 'response' });
    }
}
