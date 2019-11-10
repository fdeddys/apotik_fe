import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SettlementConfigWipComment } from './settlement-config-wip-comment.model';
import { map } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<SettlementConfigWipComment>;

@Injectable({
    providedIn: 'root'
})
export class SettlementConfigWipCommentService {

    private serverUrl = SERVER_PATH + 'settlementconfigwipcomment';

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<SettlementConfigWipComment>(`${this.serverUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    save(comment: SettlementConfigWipComment): Observable<EntityResponseType> {

        const newresourceUrl = this.serverUrl;
        const result = this.http.post<SettlementConfigWipComment>(newresourceUrl, comment, { observe: 'response' });
        return result;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        console.log('convert response');
        const body: SettlementConfigWipComment = this.convertItemFromServer(res.body);
        return res.clone({ body });
    }

    private convertItemFromServer(comment: SettlementConfigWipComment): SettlementConfigWipComment {
        const copyOb: SettlementConfigWipComment = Object.assign({}, comment);
        return copyOb;
    }

}
