import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Kecamatan } from './kecamatan.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KecamatanService {

    private serverUrl = SERVER_PATH + 'kecamatan';

    constructor(private http: HttpClient) { }

    getByDati2Id(id: string): Observable<HttpResponse<Kecamatan[]>> {
        let newResourceUrl = null;

        newResourceUrl = this.serverUrl + `/dati2/${id}`;

        const result = this.http.get<Kecamatan[]>(newResourceUrl, { observe: 'response' }).pipe(
            tap(results => console.log('raw', results))
        );

        return result;
    }

}
