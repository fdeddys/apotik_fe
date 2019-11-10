import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provinsi } from './provinsi.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProvinsiService {

    private serverUrl = SERVER_PATH + 'provinsi';


    constructor(private http: HttpClient) { }

    getAll(): Observable<HttpResponse<Provinsi[]>> {
        let newResourceUrl = null;

        newResourceUrl = this.serverUrl + '/all';

        const result = this.http.get<Provinsi[]>(newResourceUrl, { observe: 'response' }).pipe(
            tap(results => console.log('raw', results))
        );

        return result;
    }
}
