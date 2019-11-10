import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Teroris } from './teroris.model';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from 'src/app/shared/httpUtil';

export type EntityResponseType = HttpResponse<Teroris>;

@Injectable(
{
  providedIn: 'root'
}
)

// const httpOptions = {
//     headers: new HttpHeaders({
//       'Content-Type':  'application/json',
//       'Authorization': 'my-auth-token'
//     })
//   };
export class TerorisService {

    private dataSource = new BehaviorSubject<Teroris>({});
    dataSharing = this.dataSource.asObservable();

    private serverUrl = SERVER_PATH + 'teroris';

    constructor(private http: HttpClient) { }

    updateData(teroris: Teroris) {
        this.dataSource.next(teroris);
    }

    getAll(): Observable<HttpResponse<Teroris[]>> {
        let newResourceUrl = null;

        newResourceUrl = this.serverUrl + '/all';

        const result = this.http.get<Teroris[]>(newResourceUrl, { observe: 'response' }).pipe(
            tap(results => console.log('raw', results))
        );

        return result;
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Teroris>(`${this.serverUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Teroris[]>> {
      const options = createRequestOption(req);
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

        if (pageNumber !== null ) {
            newresourceUrl = this.serverUrl + `/page/${pageNumber}/count/${pageCount}`;
            return this.http.get<Teroris[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    tap(terorislist => console.log('raw ', terorislist ) )
                    );
        } else {
            return this.http.get<Teroris[]>(`${this.serverUrl}`, {  observe: 'response' })
            .pipe(
                tap(terorislist => console.log('raw ', terorislist ) )
                );
        }

    }

    save(teroris: Teroris): Observable<EntityResponseType> {
    // create(teroris: Teroris): Observable<Teroris> {
        const copy = this.convert(teroris);
        console.log('prepare post++', copy, '++', `${this.serverUrl}`);
        // return this.http.post<Teroris>(`${this.serverUrl}/`, copy);

        return this.http.post<Teroris>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    repair(teroris: Teroris, idMda: number): Observable<EntityResponseType> {
        const copy = this.convert(teroris);
        const newResourceUrl = this.serverUrl + `/repair/${idMda}`;
        console.log('prepare post++', copy, '++', `${this.serverUrl}`);

        return this.http.post<Teroris>(newResourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    filter(req?: any): Observable<HttpResponse<Teroris[]>> {
        const options = createRequestOption(req);
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
        return this.http.post<Teroris[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                tap(results => console.log('raw ', results ) )
            );
    }

    getFromMda(id): Observable<HttpResponse<Teroris[]>> {
        const newresourceUrl = this.serverUrl  + `/getFromMda/${id}`;
        return this.http.get<Teroris[]> (newresourceUrl, { observe: 'response'})
            .pipe(
                tap(result => console.log('hasil', result))
            );
    }

    approveFromMda(id): Observable<Teroris> {
        const newresourceUrl = this.serverUrl  + `/approveMda/${id}`;
        return this.http.post<Teroris> (newresourceUrl, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        console.log('convert response');
        const body: Teroris = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to memberBank.
     */
    private convertItemFromServer(teroris: Teroris): Teroris {
      const copyOb: Teroris = Object.assign({}, teroris);
      return copyOb;
    }

        /**
     * Convert a Member to a JSON which can be sent to the server.
     */
    private convert( teroris: Teroris): Teroris {
        const copy: Teroris = Object.assign({}, teroris);
        return copy;
    }



}
