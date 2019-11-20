import { Injectable } from '@angular/core';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ProductPageDto, Product } from './product.model';
import { Observable } from 'rxjs';
import { EntityResponseType } from '../user/user.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private serverUrl = SERVER_PATH + 'product';
    constructor(private http: HttpClient) { }

    filter(req?: any): Observable<HttpResponse<ProductPageDto[]>> {
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

        return this.http.post<ProductPageDto[]>(newresourceUrl, req['filter'], { observe: 'response' });
    }

    save(product: Product): Observable<EntityResponseType> {
        const copy = this.convert(product);
        return this.http.post<Product>(`${this.serverUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convert( product: Product): Product {
        const copy: Product = Object.assign({}, product);
        return copy;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Product = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertItemFromServer(product: Product): Product {
        const copyOb: Product = Object.assign({}, product);
        return copyOb;
    }
}
