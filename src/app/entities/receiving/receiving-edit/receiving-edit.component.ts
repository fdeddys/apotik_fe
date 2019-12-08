import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Receive, ReceivingDetail, ReceivingDetailPageDto } from '../receiving.model';
import { Supplier, SupplierPageDto } from '../../supplier/supplier.model';
import { Observable, forkJoin, of } from 'rxjs';
import { Product, ProductPageDto } from '../../product/product.model';
import { SupplierService } from '../../supplier/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReceivingService } from '../receiving.service';
import { ReceivingDetailService } from '../receiving-detail.service';
import { HttpResponse, HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';

@Component({
    selector: 'op-receiving-edit',
    templateUrl: './receiving-edit.component.html',
    styleUrls: ['./receiving-edit.component.css']
})
export class ReceivingEditComponent implements OnInit {

    selectedDate: NgbDateStruct;
    receive: Receive;
    receiveDetails: ReceivingDetail[];

    suppliers: Supplier[];
    supplierSelected: Supplier;

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
        private supplierService: SupplierService,
        private http: HttpClient,
        private receiveService: ReceivingService,
        private receiveDetailService: ReceivingDetailService,
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


    backToLIst() {
        this.router.navigate(['/main/receive']);
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
            this.loadSupplier();
            this.loadNewData();
            return;
        }
        this.loadDataByOrderId(orderId);
    }

    loadSupplier() {
        this.supplierService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            },
        }).subscribe(
            (response: HttpResponse<SupplierPageDto>) => {
                if (response.body.contents.length <= 0) {
                    Swal.fire('error', 'failed get supplier data !', 'error');
                    return;
                }
                this.suppliers = response.body.contents;
                if (this.receive.id === 0) {
                    this.receive.supplier = this.suppliers[0];
                    this.setSupplierDefault();
                }
            });
    }

    setSupplierDefault() {
        this.supplierSelected = this.receive.supplier;
        console.log('set selected supplier =>', this.supplierSelected );
    }

    loadNewData() {
        this.addNew();
    }

    addNew() {
        this.total = 0;
        this.grandTotal = 0;
        this.taxAmount = 0;
        this.isTax = false;
        this.priceAdded = 0;
        this.receive = new Receive();
        this.receive.id = 0;
        this.receive.status = 0;
        this.receiveDetails = [];
        this.setToday() ;
        this.clearDataAdded();
        if (this.suppliers !== undefined) {
            this.receive.supplier = this.suppliers[0];
            this.setSupplierDefault();
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

    loadDataByOrderId(orderId: number) {

        let receiveReq = this.receiveService.findById(orderId);

        let supplierReq = this.supplierService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            }
        });

        const requestArray = [];
        requestArray.push(receiveReq);
        requestArray.push(supplierReq);

        forkJoin(requestArray).subscribe(results => {
            this.processReceive(results[0]);
            this.processSupplier(results[1]);
            this.setSupplierDefault();
        });

    }

    processReceive(result: Receive) {
        console.log('isi receive result', result);
        this.receive = result;

        this.receiveDetails = result.detail;
        console.log('isi receive detauil', this.receiveDetails);
        this.calculateTotal();

        this.receive.detail = null;
    }

    calculateTotal() {
        this.total = 0;

        this.receiveDetails.forEach(receiveDetail => {
            this.total = this.total + ( (receiveDetail.price * receiveDetail.qty) - receiveDetail.disc);
        });

        this.taxAmount = this.isTax === true ? Math.floor(this.total / 10) : 0;
        this.grandTotal = this.total + this.taxAmount;
    }

    processSupplier(result: HttpResponse<SupplierPageDto>) {
        if (result.body.contents.length < 0) {
            return;
        }
        this.suppliers = result.body.contents;
    }

    getItem(event: any) {
        // event.preventDefault();
        console.log('get item ==>', event);
        this.productIdAdded = event.item.id;
        this.priceAdded = 0;
        this.productNameAdded = event.item.name;
        this.uomAdded = event.item.smallUomId;
        this.uomAddedName = event.item.SmallUom.name;
    }


    // TYPE AHEAD PRODUCT
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
        const newresourceUrl = serverUrl + `/page/1/count/10`;
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
        return value.name ;
    }

    formatterProdInput(value: any) {
        if (value.name) {
            return value.name;
        }
        return value;
    }
    // TYPE AHEAD PRODUCT
    // *************************************************************************************


    // TYPE AHEAD SUPPLIER
    formatter = (result: Supplier) => result.name.toUpperCase();

    searchSupplier = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term === '' ? []
                : this.suppliers.filter
                    (v =>
                        v.name
                            .toLowerCase()
                            .indexOf(term.toLowerCase()) > -1
                    )
                    .slice(0, 10))
        )

    // TYPE AHEAD SUPPLIER
    // *************************************************************************************


    // Tomvol add item
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

       let receiveDetail = this.composeReceiveDetail();

       this.receiveDetailService
            .save(receiveDetail)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.reloadDetail(this.receive.id);
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                })
            );

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

    composeReceiveDetail(): ReceivingDetail {
        let receiveDetail = new ReceivingDetail();
        receiveDetail.receiveId = this.receive.id;
        receiveDetail.disc = this.discAdded;
        receiveDetail.price = this.priceAdded;
        receiveDetail.productId = this.productIdAdded;
        receiveDetail.qty = this.qtyAdded;
        receiveDetail.uomId = this.uomAdded;
        return receiveDetail;
    }

    reloadDetail(id: number) {
        this.receiveDetailService
            .findByReceiveId({
                count: 10,
                page: 1,
                filter : {
                    receiveId: id,
                }
            }).subscribe(
                (res: HttpResponse<ReceivingDetailPageDto>) => this.fillDetail(res),
                (res: HttpErrorResponse) => console.log(res.message),
                () => {}
            );
    }

    fillDetail(res: HttpResponse<ReceivingDetailPageDto>) {
        this.receiveDetails = [];
        if (res.body.contents.length > 0) {

            this.receiveDetails = res.body.contents;
            this.calculateTotal();
            this.clearDataAdded();
        }
    }
}
