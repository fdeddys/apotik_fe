import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap, debounceTime, distinctUntilChanged, map, tap, catchError, flatMap } from 'rxjs/operators';
import { Observable, Subject, of, concat, forkJoin, empty } from 'rxjs';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SalesOrder, SalesOrderDetail } from '../sales-order.model';
import { Customer, CustomerPageDto } from '../../customer/customer.model';
import { CustomerService } from '../../customer/customer.service';
import { HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { ProductService } from '../../product/product.service';
import { Product, ProductDto, ProductPageDto } from '../../product/product.model';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { SalesOrderService } from '../sales-order.service';
import { SalesOrderDetailService } from '../sales-order-detail.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'op-sales-order-edit',
    templateUrl: './sales-order-edit.component.html',
    styleUrls: ['./sales-order-edit.component.css']
})
export class SalesOrderEditComponent implements OnInit {

    selectedDate: NgbDateStruct;
    salesOrder: SalesOrder;
    salesOrderDetails: SalesOrderDetail[];

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

    productIdAdded = 0;
    productNameAdded = '';
    priceAdded = 0;
    discAdded = 0;
    qtyAdded = 0;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private customerService: CustomerService,
        private http: HttpClient,
        private orderService: SalesOrderService,
        private orderDetailService: SalesOrderDetailService,
    ) {
        this.total = 0;
        this.grandTotal = 0;
        this.taxAmount = 0;
        this.isTax = false;

        this.priceAdded =0;
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        const isValidParam = isNaN(+id);
        console.log('Param ==>', id, ' nan=>', isValidParam);
        if (isValidParam) {
            console.log('Invalid parameter ');
            this.backToLIst();
            return;
        }
        this.loadData(+id);
        this.setToday();
    }

    // checkIsNumber(numb): any {
    //     return isNaN(numb);
    // }

    backToLIst() {
        this.router.navigate(['/main/sales-order']);
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
        this.loadCustomer();
        console.log('id ==>?', orderId);
        if (orderId === 0) {
            this.loadNewData();
            return;
        }
        this.loadDataByOrderId(orderId);
    }

    loadNewData() {
        this.salesOrder = new SalesOrder();
    }

    getItem(event: any) {
        // event.preventDefault();
        console.log('get item ==>', event);
        this.productIdAdded = event.item.id;
        this.priceAdded = event.item.sellPrice;
        this.productNameAdded = event.item.name;
    }

    loadDataByOrderId(orderId: number) {

        let orderReq = this.orderService.findById(orderId);

        let customerReq = this.customerService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            }
        });

        const requestArray = [];
        requestArray.push(orderReq);
        requestArray.push(customerReq);

        forkJoin(requestArray).subscribe(results => {
            this.processOrder(results[0]);
            this.processCustomer(results[1]);
            this.setCustomerDefault();
        });

        // this.orderService.findById(orderId)
        //     .subscribe(
        //         (res) => {
        //             console.log("isisisisisi ", res);
        //             this.salesOrder = res;
        //         }
        //     );
    }

    processOrder(result: SalesOrder) {
        console.log('isi sales order result', result);
        this.salesOrder = result;

        this.salesOrderDetails = result.detail;
        console.log('isi sales order detauil', this.salesOrderDetails);

        this.salesOrder.detail = null;

    }

    processCustomer(result: HttpResponse<CustomerPageDto>) {
        if (result.body.contents.length < 0) {
            return;
        }
        this.customers = result.body.contents;
    }

    setCustomerDefault() {
        this.customerSelected = this.salesOrder.customer;
        console.log('set selected customer =>', this.customerSelected );
    }

    loadCustomer() {
        this.customerService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            },
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

    formatter = (result: Customer) => result.name.toUpperCase();

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



    // formatterProd = (result: { name: string }) => result.name.toUpperCase();

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


    formatterProdList(value: any) {
        return value.name + ' Sell Price { ' + value.sellPrice + ' } ';
    }

    formatterProdInput(value: any) {
        if (value.name) {
            return value.name;
        }
        return value;
    }

    addNewItem() {
        console.log('isisisiisis ', this.productIdAdded );

        // if (this.checkInputValid() === false) {
        //     return ;
        // }
        if (this.checkInputProductValid() == false ) {
            Swal.fire('Error', 'Product belum terpilih ! ', 'error');
        }

        if (this.checkInputNumberValid() == false ) {
            Swal.fire('Error', 'Check price / disc / qty must be numeric, price and qty must greater than 0 ! ', 'error');
        }

    }

    checkInputNumberValid(): boolean {
        let result = true;

        if ( (isNaN(this.qtyAdded)) || (this.qtyAdded === null) ) {
            result = false;
            return result;
        }

        if ( (isNaN(this.priceAdded)) || (this.priceAdded === null) ) {
            result = false;
            return result;
        }

        if ((isNaN(this.discAdded)) || (this.discAdded === null) ) {
            result = false;
            return result;
        }

        if (this.priceAdded <= 0 || this.qtyAdded <= 0 || this.discAdded < 0 ) {
            result = false;
            return result;
        }

        if ( (this.priceAdded * this.qtyAdded ) < this.discAdded ) {
            result = false;
            return result;
        }

        return result;
    }

    checkInputProductValid(): boolean {

        let result = false;
        // 1. jika belum pernah di isi
        if ( this.model === undefined )  {
            // return false ;
            result = false;
            return result;
        }

        // 2.  sudah diisi 
        // 2.a lalu di hapus
        // 2.b bukan object karena belum memilih lagi, masih type string 
        of(this.model).subscribe(
            res => {
                console.log('observable model ', res);
                if ( !res ) {
                    Swal.fire('Error', 'Product belum terpilih, silahlan pilih lagi ! ', 'error');
                    // return false ;
                    result = false;
                }
                const product =  res;
                console.log('obser hasil akhir => ', product);
                console.log('type [', typeof(product), '] ');
                const typeObj = typeof(product);
                if (typeObj == 'object') {
                    result = true;
                }

                console.log(typeof(product) , '] [', typeof('product'))
                if (typeof(product) == typeof('product')) {
                    // console.log('masok pakeo 2');
                    Swal.fire('Error', 'Product belum terpilih, silahlan pilih lagi [x,x ]! ', 'error');
                    result = false;
                    return result;
                }
            }
        );
        // Swal.fire('Error', 'Product belum terpilih, silahlan pilih lagi [x]! ', 'error');
        return result;
    }
}