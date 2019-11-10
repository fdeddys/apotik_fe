import { Injectable } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { OwnerWipComment } from './owner-wip-comment.model';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<OwnerWipComment>;

@Injectable({
    providedIn: 'root'
})
export class OwnerWipCommentService {

    private serverUrl = SERVER_PATH + 'ownerwipcomment';

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<OwnerWipComment>(`${this.serverUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    save(comment: OwnerWipComment): Observable<EntityResponseType> {

        const newresourceUrl = this.serverUrl;
        const result = this.http.post<OwnerWipComment>(newresourceUrl, comment, { observe: 'response' });
        return result;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        console.log('convert response');
        const body: OwnerWipComment = this.convertItemFromServer(res.body);
        return res.clone({ body });
    }

    private convertItemFromServer(comment: OwnerWipComment): OwnerWipComment {
        const copyOb: OwnerWipComment = Object.assign({}, comment);
        return copyOb;
    }
}
