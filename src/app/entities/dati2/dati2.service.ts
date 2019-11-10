import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dati2 } from './dati2.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Dati2Service {

    private serverUrl = SERVER_PATH + 'dati2';
    constructor(private http: HttpClient) { }


    getByProvinsiId(id: string): Observable<HttpResponse<Dati2[]>> {
        let newResourceUrl = null;

        newResourceUrl = this.serverUrl + `/provinsi/${id}`;

        const result = this.http.get<Dati2[]>(newResourceUrl, { observe: 'response' }).pipe(
            tap(results => console.log('raw', results))
        );

        return result;
    }

}
