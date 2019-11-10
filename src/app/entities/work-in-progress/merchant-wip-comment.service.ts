import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MerchantWipComment } from './merchant-wip-comment.model';
import { map } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<MerchantWipComment>;

@Injectable({
    providedIn: 'root'
})
export class MerchantWipCommentService {

    private serverUrl = SERVER_PATH + 'merchantwipcomment';

    constructor(private http: HttpClient) { }

    save(comment: MerchantWipComment): Observable<EntityResponseType> {

        const newresourceUrl = this.serverUrl;
        const result = this.http.post<MerchantWipComment>(newresourceUrl, comment, { observe: 'response' });
        return result;
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<MerchantWipComment>(`${this.serverUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        console.log('convert response');
        const body: MerchantWipComment = this.convertItemFromServer(res.body);
        return res.clone({ body });
    }

    private convertItemFromServer(comment: MerchantWipComment): MerchantWipComment {
        const copyOb: MerchantWipComment = Object.assign({}, comment);
        return copyOb;
    }
}
