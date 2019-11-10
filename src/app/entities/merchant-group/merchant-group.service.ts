import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MerchantGroup } from './merchant-group.model';
import { SERVER_PATH, SERVER, PATH_IMAGES } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from 'src/app/shared/httpUtil';
import { LookupDto } from '../lookup/lookup-dto.model';


export type EntityResponseType = HttpResponse<MerchantGroup>;

const HttpUploadOptions = {
    headers: new HttpHeaders()
};

@Injectable({
  providedIn: 'root'
})
export class MerchantGroupService {



    private dataSource = new BehaviorSubject<MerchantGroup>({});
    dataSharing = this.dataSource.asObservable();

    private dataSource2 = new BehaviorSubject<LookupDto[]>([]);
    dataSharingLookupDto = this.dataSource2.asObservable();

    private serverUrl = SERVER_PATH + 'merchantGroup';

    constructor(private http: HttpClient) { }

    updateData(merchantGroup: MerchantGroup) {
        this.dataSource.next(merchantGroup);
    }

    insertLookupData(lookupDtoArr: LookupDto[]) {
        this.dataSource2.next(lookupDtoArr);
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<MerchantGroup>(`${this.serverUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    suspense(id: number): Observable<EntityResponseType> {

        const newresourceUrl = this.serverUrl + `/suspense/${id}`;
        return this.http.get<MerchantGroup>(newresourceUrl, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<MerchantGroup[]>> {
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
            return this.http.get<MerchantGroup[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    tap(merchantGrouplist => console.log('raw ', merchantGrouplist ) )
                    );
        } else {
            return this.http.get<MerchantGroup[]>(`${this.serverUrl}`, {  observe: 'response' })
            .pipe(
                tap(merchantGrouplist => console.log('raw ', merchantGrouplist ) )
                );
        }

    }

    save(merchantGroup: MerchantGroup): Observable<EntityResponseType> {
    // create(merchantGroup: MerchantGroup): Observable<MerchantGroup> {
        const copy = this.convert(merchantGroup);
        console.log('prepare post++', copy, '++', `${this.serverUrl}`);
        // return this.http.post<MerchantGroup>(`${this.serverUrl}/`, copy);

        return this.http.post<MerchantGroup>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    repair(merchantGroup: MerchantGroup, idMda: number): Observable<EntityResponseType> {

        const copy = this.convert(merchantGroup);
        const newResourceUrl = this.serverUrl + `/repair/${idMda}`;
        return this.http.post<MerchantGroup>(newResourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    filter(req?: any): Observable<HttpResponse<MerchantGroup[]>> {
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
        return this.http.post<MerchantGroup[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                tap(results => console.log('raw ', results ) )
            );
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        console.log('convert response');
        const body: MerchantGroup = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to memberBank.
     */
    private convertItemFromServer(merchantGroup: MerchantGroup): MerchantGroup {
      const copyOb: MerchantGroup = Object.assign({}, merchantGroup);
      return copyOb;
    }

        /**
     * Convert a Member to a JSON which can be sent to the server.
     */
    private convert( merchantGroup: MerchantGroup): MerchantGroup {
        const copy: MerchantGroup = Object.assign({}, merchantGroup);
        return copy;
    }

    public uploadImage(file: File, tipeData: string, fileName: string): void {
        // let pathServer = 'http://localhost:8080/api/images/uploadFile';
        let pathServer = SERVER + PATH_IMAGES;
        const formData = new FormData();
        formData.append('file', file);

        switch (tipeData) {
            case 'ktp': {
                pathServer = pathServer + '/mgktp';
                break;
            }
            case 'siup': {
                pathServer = pathServer + '/mgsiup';
                break;
            }
            case 'npwp': {
                pathServer = pathServer + '/mgnpwp';
                break;
            }
            case 'pks': {
                pathServer = pathServer + '/mgpks';
                break;
            }
            case 'groupPhoto': {
                pathServer = pathServer + '/mgPhoto';
                break;
            }
            case 'ktpPenanggungJawab': {
                pathServer = pathServer + '/mgktppenanggungjawab';
                break;
            }
            case 'aktaPendirian': {
                pathServer = pathServer + '/mgaktapendirian';
                break;
            }
            case 'tandaDaftarPerusahaan': {
                pathServer = pathServer + '/mgtandadaftarperusahaan';
                break;
            }
            case 'persetujuanMenkumham': {
                pathServer = pathServer + '/mgpersetujuanmenkumham';
                break;
            }
        }
        pathServer = pathServer + '/MDA-' + tipeData + '-' + fileName + '/' + fileName;

        this.http.post(pathServer, formData, HttpUploadOptions )
             .subscribe(
                 data => console.log('success'),
                 error => console.log(error)
             );
    }

    getFromMda(id): Observable<HttpResponse<MerchantGroup[]>> {
        const newresourceUrl = this.serverUrl  + `/getFromMda/${id}`;
        return this.http.get<MerchantGroup[]> (newresourceUrl, { observe: 'response'})
            .pipe(
                tap(result => console.log('hasil', result))
            );
    }

    public copyFromMgToMda(tipeData: string, idMda: string, idMg: number): void {
        // let pathServer = 'http://localhost:8080/api/images/uploadFile';

        const newresourceUrl = SERVER_PATH  + `images/copyFromMgToMDA/${tipeData}/idMg/${idMg}/idMda/${idMda}`;

        this.http.post(newresourceUrl, null, HttpUploadOptions )
             .subscribe(
                 data => console.log('success'),
                 error => console.log(error)
             );
    }

    approveFromMda(id): Observable<MerchantGroup> {
        const newresourceUrl = this.serverUrl  + `/approveMda/${id}`;
        return this.http.post<MerchantGroup> (newresourceUrl, { observe: 'response'});
    }
}
