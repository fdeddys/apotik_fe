import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap, debounceTime, distinctUntilChanged, map, tap, catchError, flatMap } from 'rxjs/operators';
import { Observable, Subject, of, concat, forkJoin, empty, pipe } from 'rxjs';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SalesOrder, SalesOrderDetail, SalesOrderDetailPageDto } from '../sales-order.model';
import { Customer, CustomerPageDto } from '../../customer/customer.model';
import { CustomerService } from '../../customer/customer.service';
import { HttpResponse, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product, ProductPageDto } from '../../product/product.model';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { SalesOrderService } from '../sales-order.service';
import { SalesOrderDetailService, EntityResponseType } from '../sales-order-detail.service';
import Swal from 'sweetalert2';
import { ThrowStmt } from '@angular/compiler';


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
    uomAdded = 0;
    uomAddedName = '';

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
        this.priceAdded = 0;
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

        console.log('id ==>?', orderId);
        if (orderId === 0) {
            this.loadCustomer();
            this.loadNewData();
            return;
        }
        this.loadDataByOrderId(orderId);
    }

    loadNewData() {
        this.addNew();
    }

    getItem(event: any) {
        // event.preventDefault();
        console.log('get item ==>', event);
        this.productIdAdded = event.item.id;
        this.priceAdded = event.item.sellPrice;
        this.productNameAdded = event.item.name;
        this.uomAdded = event.item.smallUomId;
        this.uomAddedName = event.item.SmallUom.name;
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
        this.calculateTotal();

        this.salesOrder.detail = null;
    }

    calculateTotal() {
        this.total = 0;

        this.salesOrderDetails.forEach(salesOrderDetail => {
            this.total = this.total + ( (salesOrderDetail.price * salesOrderDetail.qty) - salesOrderDetail.disc);
        });

        this.taxAmount = this.isTax === true ? Math.floor(this.total / 10) : 0;
        this.grandTotal = this.total + this.taxAmount;
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
                if (response.body.contents.length <= 0) {
                    Swal.fire('error', "failed get Customer data !", 'error');
                    return;
                }
                this.customers = response.body.contents;
                if (this.salesOrder.id === 0) {
                    this.salesOrder.customer = this.customers[0];
                    this.setCustomerDefault();
                }
            });
    }

    checkTax() {
        // return this.taxAmount = this.isTax === true ? Math.floor(this.total / 10) : 0;
        this.calculateTotal();
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
        if (this.checkInputProductValid() === false ) {
            Swal.fire('Error', 'Product belum terpilih ! ', 'error');
            return ;
        }

        if (this.checkInputNumberValid() === false ) {
            Swal.fire('Error', 'Check price / disc / qty must be numeric, price and qty must greater than 0 ! ', 'error');
            return ;
        }

       let orderDetail = this.composeOrderDetail();

       this.orderDetailService
            .save(orderDetail)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.reloadDetail(this.salesOrder.id);
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                })
            );

    }

    composeOrderDetail(): SalesOrderDetail {
        let orderDetail = new SalesOrderDetail();
        orderDetail.salesOrderId = this.salesOrder.id;
        orderDetail.disc = this.discAdded;
        orderDetail.price = this.priceAdded;
        orderDetail.productId = this.productIdAdded;
        orderDetail.qty = this.qtyAdded;
        orderDetail.uomId = this.uomAdded;
        return orderDetail;
    }

    checkInputNumberValid(): boolean {
        // let result = true;

        if ( (isNaN(this.qtyAdded)) || (this.qtyAdded === null) ) {
            // result = false;
            return false;
        }

        if ( (isNaN(this.priceAdded)) || (this.priceAdded === null) ) {
            // result = false;
            return false;
        }

        if ((isNaN(this.discAdded)) || (this.discAdded === null) ) {
            // result = false;
            return false;
        }

        if (this.qtyAdded <= 0 || this.discAdded < 0 ) {
            // this.priceAdded <= 0 ||
            // result = false;
            return false;
        }

        if ( (this.priceAdded * this.qtyAdded ) < this.discAdded ) {
            // result = false;
            return false;
        }

        return true;
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

    reloadDetail(orderId: number) {
        this.orderDetailService
            .findByOrderId({
                count: 10,
                page: 1,
                filter : {
                    orderId: orderId,
                }
            }).subscribe(
                (res: HttpResponse<SalesOrderDetailPageDto>) => this.fillDetail(res),
                (res: HttpErrorResponse) => console.log(res.message),
                () => {}
            );
    }

    fillDetail(res: HttpResponse<SalesOrderDetailPageDto>) {
        this.salesOrderDetails = [];
        if (res.body.contents.length > 0) {

            this.salesOrderDetails = res.body.contents;
            this.calculateTotal();
            this.clearDataAdded();
        }
    }

    clearDataAdded() {
        this.productIdAdded = null;
        this.priceAdded = 0;
        this.productNameAdded = null;
        this.uomAdded = 0;
        this.qtyAdded = 1;
        this.model = null;
        this.uomAddedName = '';
    }

    confirmDelItem (salesOrderDetail: SalesOrderDetail) {
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to cancel [ ' + salesOrderDetail.product.name + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.delItem(salesOrderDetail.id);
                }
            });
    }

    delItem(idDetail: number) {
        this.orderDetailService
            .deleteById(idDetail)
            .subscribe(
                (res: SalesOrderDetail) => {
                    if (res.errCode === '00') {
                        Swal.fire('Success', 'Data cancelled', 'info');
                        this.reloadDetail(this.salesOrder.id);
                    } else {
                        Swal.fire('Failed', 'Data failed cancelled', 'info');
                    }
                },
            );
    }

    addNew() {
        this.total = 0;
        this.grandTotal = 0;
        this.taxAmount = 0;
        this.isTax = false;
        this.priceAdded = 0;
        this.salesOrder = new SalesOrder();
        this.salesOrder.id = 0;
        this.salesOrder.status = 0;
        this.salesOrderDetails = [];
        this.setToday() ;
        this.clearDataAdded();
        if (this.customers !== undefined) {
            console.log('this customers xxx ', this.salesOrder.customer);
            this.salesOrder.customer = this.customers[0];
            this.setCustomerDefault();
        }
    }

    saveHdr() {
        this.salesOrder.customer = null;
        this.salesOrder.customerId = this.customerSelected.id;
        this.salesOrder.orderDate = this.getSelectedDate();
        this.salesOrder.salesmanId = 0;
        this.orderService
            .save(this.salesOrder)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.salesOrder.id = res.body.id;
                        this.salesOrder.salesOrderNo = res.body.salesOrderNo;
                        this.salesOrder.status = res.body.status;
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                })
            );
    }

    getSelectedDate(): string{

        const month = ('0' + this.selectedDate.month).slice(-2);
        const day = ('0' + this.selectedDate.day).slice(-2);
        const tz = 'T00:00:00+07:00';

        return this.selectedDate.year + '-' + month + '-' + day + tz;
    }

    approve() {

        if (!this.isValidDataApprove()){
            return;
        }

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to approve ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.approveProccess();
                }
            });
    }


    approveProccess() {
        this.orderService.approve(this.salesOrder)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.router.navigate(['/main/sales-order']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                }
            );
    }

    isValidDataApprove(): boolean {
        if (this.salesOrder.id ===0) {
            Swal.fire('Error', 'Data no order belum di save !', 'error');
            return false;
        }
        if (this.salesOrderDetails.length <= 0) {
            Swal.fire('Error', 'Data Barang belum ada', 'error');
            return false;
        }
        return true;
    }

    rejectProccess(){
        this.orderService.reject(this.salesOrder)
            .subscribe(
                (res) => { console.log('success'); }
            )

        Swal.fire('OK', 'Save success', 'success');
    }

    reject() {

        if (!this.isValidDataApprove()){
            return;
        }

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to Reject ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.rejectProccess();
                }
            });
    }

    preview() {
        this.orderService
            .preview(this.salesOrder.id)
            .subscribe(dataBlob => {

                console.log('data blob ==> ', dataBlob);
                const newBlob = new Blob([dataBlob], { type: 'application/pdf' });
                const objBlob = window.URL.createObjectURL(newBlob);

                window.open(objBlob);
            });

    }

}
