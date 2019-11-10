import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Merchant } from './merchant.model';
import { SERVER_PATH, SERVER, PATH_IMAGES, PATH_UPLOAD_IMAGES_MERCHANT } from 'src/app/shared/constants/base-constant';
import { tap, map } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<Merchant>;


const HttpUploadOptions = {
    headers: new HttpHeaders()
};

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

    private serverUrl = SERVER_PATH + 'merchant';
    private serverMerchantWipUrl = SERVER_PATH + 'merchantwip';

    private dataSource = new BehaviorSubject<number>(0);
    dataSharing = this.dataSource.asObservable();

    constructor(private http: HttpClient) { }

    findPage(req?: any): Observable<HttpResponse<Merchant[]>> {

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

        newresourceUrl = this.serverUrl + `/page/${pageNumber}/count/${pageCount}`;

        return this.http.get<Merchant[]> (newresourceUrl, { observe: 'response'})
            .pipe();
    }

    filter(req?: any): Observable<HttpResponse<Merchant[]>> {

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

        newresourceUrl = this.serverUrl + `/filter/page/${pageNumber}/count/${pageCount}`;
        return this.http.post<Merchant[]>(newresourceUrl, req['filter'], { observe: 'response' })
            .pipe(
                tap(results => console.log('raw ', results))
            );
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Merchant>(`${this.serverUrl}/${id}`, { observe: 'response' })
            .pipe(
                map((res: EntityResponseType) => this.convertResponse(res))
            );
        return null;
    }

    suspense(id: number): Observable<EntityResponseType> {

        const newresourceUrl = this.serverUrl + `/suspense/${id}`;
        return this.http.get<Merchant>(newresourceUrl, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        console.log('convert response');
        const body: Merchant = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(merchant: Merchant): Merchant {
        const copyOb: Merchant = Object.assign({}, merchant);
        return copyOb;
      }

    sendData(idMerchant: number) {
        this.dataSource.next(idMerchant);
    }

    public uploadImage(file: File, tipeData: string, fileName: string): void {
        let pathServer = SERVER + PATH_IMAGES;
        const formData = new FormData();
        formData.append('file', file);

        // switch (tipeData) {
        //     case 'mr_ktp': {
        //         pathServer = pathServer + '/mr_ktp';
        //         break;
        //     }
        //     case 'mr_image_location': {
        //         pathServer = pathServer + '/mr_image_location';
        //         break;
        //     }
        //     case 'mr_image_location2': {
        //         pathServer = pathServer + '/mr_image_location2';
        //         break;
        //     }
        //     // case 'pks': {
        //     //     pathServer = pathServer + '/mgpks';
        //     //     break;
        //     // }
        //     // case 'groupPhoto': {
        //     //     pathServer = pathServer + '/mgPhoto';
        //     //     break;
        //     // }
        // }
        pathServer = pathServer + '/' + tipeData;
        pathServer = pathServer + '/MDA-' + tipeData + '-' + fileName;

        this.http.post(pathServer, formData, HttpUploadOptions)
            .subscribe(
                data => console.log('success'),
                error => console.log(error)
            );
    }

    public uploadImageMerchant(file: File, tipeData: string, fileName: string): void {
        let pathServer = SERVER + PATH_UPLOAD_IMAGES_MERCHANT;
        const formData = new FormData();
        formData.append('file', file);


        pathServer = pathServer + '/' + tipeData;
        pathServer = pathServer + '/MDA-' + tipeData + '-' + fileName;
        pathServer = pathServer + '/' + fileName;

        this.http.post(pathServer, formData, HttpUploadOptions)
            .subscribe(
                data => console.log('success'),
                error => console.log(error)
            );
    }

    save(merchant: Merchant, action: number): Observable<EntityResponseType> {

        const newresourceUrl = this.serverMerchantWipUrl + `/action/${action}` ;
        const result = this.http.post<Merchant>(newresourceUrl, merchant, { observe: 'response' });
        return result;
    }

    public copyFromMrToMda(tipeData: string, idMda: string, idMr: number): void {
        // let pathServer = 'http://localhost:8080/api/images/uploadFile';

        const newresourceUrl = SERVER_PATH + `images/copyFromMrToMDA/${tipeData}/idMr/${idMr}/idMda/${idMda}`;

        this.http.post(newresourceUrl, null, HttpUploadOptions)
            .subscribe(
                data => console.log('success'),
                error => console.log(error)
            );
    }

}
