import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { Salesman, SupplierDto } from './salesman.model';

@Injectable({
    providedIn: 'root'
})
export class SalesmanService {

    private serverUrl = SERVER_PATH + 'salesman';
    constructor(private http: HttpClient) { }

    getSalesman(req?: any): Observable<HttpResponse<SupplierDto>> {

        var newresourceUrl = this.serverUrl;
        return this.http.get<SupplierDto>(newresourceUrl, { observe: 'response' });
    }

}
