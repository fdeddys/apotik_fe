import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { Warehouse, WarehouseDto } from './warehouse.model';

@Injectable({
    providedIn: 'root'
})
export class WarehouseService {

    private serverUrl = SERVER_PATH + 'warehouse';
    constructor(private http: HttpClient) { }

    getWarehouse(req?: any): Observable<HttpResponse<WarehouseDto>> {

        var newresourceUrl = this.serverUrl;
        return this.http.get<WarehouseDto>(newresourceUrl, { observe: 'response' });
    }
}
