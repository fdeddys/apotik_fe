import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap, debounceTime, distinctUntilChanged, map, tap, catchError } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SalesOrder } from '../sales-order.model';
import { Customer, CustomerPageDto } from '../../customer/customer.model';
import { CustomerService } from '../../customer/customer.service';
import { HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { ProductService } from '../../product/product.service';
import { Product, ProductDto, ProductPageDto } from '../../product/product.model';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';

@Component({
    selector: 'op-sales-order-edit',
    templateUrl: './sales-order-edit.component.html',
    styleUrls: ['./sales-order-edit.component.css']
})
export class SalesOrderEditComponent implements OnInit {

    selectedDate: NgbDateStruct;
    salesOrder: SalesOrder;

    /* Untuk search customer
     * local search
     */
    customers: Customer[];
    customerSelected: Customer;

    total: number;
    grandTotal: number;
    isTax: Boolean;
    taxAmount: number;

    /* Untuk search product
     * http
     */
    model: Observable<Product[]>;
    searching = false;
    searchFailed = false;

    constructor(
        private route: ActivatedRoute,
        private customerService: CustomerService,
        private productService: ProductService,
        private http: HttpClient,
    ) {
        this.total = 0;
        this.grandTotal = 0;
        this.taxAmount = 0;
        this.isTax = false;
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.loadData(+id);
        this.setToday();
    }

    setToday() {
        const today = new Date();
        this.selectedDate = {
            year: today.getFullYear(),
            day: today.getDate(),
            month: today.getMonth() + 1,
        };
    }

    loadData(orderId: number) {
        console.log('id ==>?', orderId);
        if (orderId === 0) {
            this.loadNewData();
            return;
        }
    }

    loadNewData() {
        this.salesOrder = new SalesOrder();
        this.salesOrder.tax = 0;
        this.loadCustomer();
    }

    loadCustomer() {
        const searchTerm = {
            code: '',
            name: '',
        };
        this.customerService.filter({
            page: 1,
            count: 10000,
            filter: searchTerm,
        }).subscribe(
            (response: HttpResponse<CustomerPageDto>) => {
                if (response.body.contents.length < 0) {
                    return;
                }
                this.customers = response.body.contents;
            });
    }

    checkTax() {
        return this.taxAmount = this.isTax === true ? Math.floor(this.total / 10) : 0;
    }

    // formatter = (x: {name: string}) => x.name;

    searchCustomer = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term === '' ? []
                : this.customers.filter
                    (v =>
                        v.name
                            .toLowerCase()
                            .indexOf(term.toLowerCase()) > -1
                    )
                    .slice(0, 10))
        )




    // text$.pipe(
    //     debounceTime(200),
    //     distinctUntilChanged(),
    //     map(term =>
    //             term.length < 1 ? [] :
    //                 this.customers.filter(
    //                     v => v.name.toLowerCase().
    //                         indexOf(term.toLowerCase()) > -1)
    //                 .slice(0, 10)
    //         )
    // )
    formatter = (result: Customer) => result.name.toUpperCase();

    // searchProduct = (text$: Observable<string>) => {
    //     text$.pipe(
    //         debounceTime(300),
    //         distinctUntilChanged(),
    //         tap(() => this.searching = true),
    //         switchMap(term =>
    //             this.productService.filter({
    //                 filter : {
    //                     name : '',
    //                     code : '',
    //                 },
    //                 page: 1,
    //                 count: 1000,
    //             }).pipe(
    //                 tap(() => this.searchProductFailed = false),
    //                 catchError(() => {
    //                     this.searchProductFailed = true;
    //                     return of([]);
    //                 }))
    //         ),
    //         tap(() => this.searching = false)
    //     );
    // }

    formatterProd = (result: { name: string }) => result.name.toUpperCase();

    // search = (text$: Observable<string>) =>
    //     text$.pipe(
    //         debounceTime(300),
    //         distinctUntilChanged(),
    //         tap(() => this.searching = true),
    //         switchMap(term =>
    //             this.productService.filter(
    //                 {
    //                     filter: {
    //                         name: '',
    //                         code: '',
    //                     },
    //                     page: 1,
    //                     count: 1000,
    //                 }
    //             ).pipe(
    //                 tap((res) => {
    //                     this.searchFailed = true;
    //                     console.log('====>', res.body.contents);
    //                     return of(res.body.contents);
    //                 }),
    //                 catchError(() => {
    //                     this.searchFailed = true;
    //                     return of([]);
    //                 }))
    //         ),
    //         tap(() => {
    //             this.searching = false;
    //         })
    //     )

    search = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            // tap(() => this.searching = true),
            switchMap((term) => this.searchProd(term)
                .pipe(
                    catchError(
                        () => {
                            return of([]);
                        }
                    )
                ),
            )
        );
    }

    searchProd(term): Observable<any> {

        const filter = {
                    name: term,
                    code: '',
                };

        const serverUrl = SERVER_PATH + 'product';
        const newresourceUrl = serverUrl + `/page/1/count/1000`;
        return  this.http.post(newresourceUrl, filter, { observe: 'response' })
            .pipe(
                map(
                    (response: HttpResponse<ProductPageDto>) => {
                        return response.body.contents;
                    }
                )
            );
    }
    searchProd2(term): Observable<any> {

        this.productService.filter({
            filter: {
                name: term,
            },
            page: 1,
            count: 1000,
        }).pipe(
                map(
                    (response: HttpResponse<ProductPageDto>) => {
                        return response.body.contents;
                    }
                )
                // return (res.body.contents);
        );
        return of([]);
    }

    formatterProdList(value: any) {
        return value.name;
    }

    formatterProdInput(value: any) {
        if (value.name) {
            return value.name;
        }
        return value;
    }
    // this.productService.filter({
    //         filter: {
    //             name: '',
    //             code: '',
    //         },
    //         page: 1,
    //         count: 1000,
    //     }).subscribe(
    //         (res: HttpResponse<ProductPageDto>) => this.onSuccess(res.body, res.headers),
    //         (res: HttpErrorResponse) => this.onError(res.message),
    //         () => { }
    //     );


    // .subscribe(
    // (response: HttpResponse<CustomerPageDto>) => {
    //     if (response.body.contents.length < 0) {
    //         return;
    //     }
    //     this.customers = response.body.contents;
    // });

}
