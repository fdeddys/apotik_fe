import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Kelurahan } from './kelurahan.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KelurahanService {

    private serverUrl = SERVER_PATH + 'kelurahan';

    constructor(private http: HttpClient) { }

    getByKecamatanId(id: string): Observable<HttpResponse<Kelurahan[]>> {
        let newResourceUrl = null;

        newResourceUrl = this.serverUrl + `/kecamatan/${id}`;

        const result = this.http.get<Kelurahan[]>(newResourceUrl, { observe: 'response' }).pipe(
            tap(results => console.log('raw', results))
        );

        return result;
    }

}
