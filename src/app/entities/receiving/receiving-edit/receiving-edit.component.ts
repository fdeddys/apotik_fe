import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { ReceivingSearchPoModalComponent } from '../receiving-search-po-modal/receiving-search-po-modal.component';
import { Warehouse, WarehouseDto } from '../../warehouse/warehouse.model';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { data } from 'jquery';
import { flatMap } from 'lodash';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'op-receiving-edit',
    templateUrl: './receiving-edit.component.html',
    styleUrls: ['./receiving-edit.component.css']
})
export class ReceivingEditComponent implements OnInit {

    selectedDate: NgbDateStruct;
    receive: Receive;
    receiveDetails: ReceivingDetail[];
    receiveDetailShow: ReceivingDetail[];

    suppliers: Supplier[];
    supplierSelected: Supplier;


    warehouses: Warehouse[];
    warehouseSelected: Warehouse;

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
    closeResult: string;
    curPage =1;
    totalRecord =0;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private supplierService: SupplierService,
        private http: HttpClient,
        private receiveService: ReceivingService,
        private receiveDetailService: ReceivingDetailService,
        private modalService: NgbModal,
        private warehouseService: WarehouseService,
        private spinner: NgxSpinnerService,
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
            this.loadWarehouse();
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

    loadWarehouse() {
        this.warehouseService.getWarehouse()
            .subscribe(
            (response: HttpResponse<WarehouseDto>) => {
                if (response.body.contents.length <= 0) {
                    Swal.fire('error', 'failed get warehouse data !', 'error');
                    return;
                }
                this.warehouses = response.body.contents;
                this.warehouseSelected = this.warehouses[0] ;
            });
    }

    setSupplierDefault() {
        this.supplierSelected = this.receive.supplier;
        console.log('set selected supplier =>', this.supplierSelected );
        this.warehouseSelected = this.receive.warehouse ;
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
            this.receive.warehouse = this.warehouses[0];
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

        this.spinner.show();

        setTimeout(() => {
            this.spinner.hide();
        }, 10000);

        let receiveReq = this.receiveService.findById(orderId);

        let supplierReq = this.supplierService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            }
        });

        let receiveDetailReq = this.receiveDetailService
            .findByReceiveId({
                count: 1000,
                page: 1,
                filter : {
                    receiveId: orderId,
                }
            });
        
        let warehouseReq = this.warehouseService.getWarehouse();

        const requestArray = [];
        requestArray.push(receiveReq);
        requestArray.push(supplierReq);
        requestArray.push(receiveDetailReq);
        requestArray.push(warehouseReq);

        forkJoin(requestArray).subscribe(results => {
            this.processReceive(results[0]);
            this.processSupplier(results[1]);
            this.processReceiveDtil(results[2]);
            this.processWarehouse(results[3]);
            this.setSupplierDefault();
        },
        ()=> {
            
        },
        ()=> {
            this.spinner.hide();
        });

    }

    processReceiveDtil(result: HttpResponse<ReceivingDetailPageDto>) {
        this.fillDetail(result);
    }

    processReceive(result: Receive) {
        console.log('isi receive result', result);
        this.receive = result;

        // this.receiveDetails = result.detail;
        // console.log('isi receive detauil', this.receiveDetails);
        // this.calculateTotal();

        // this.receive.detail = null;
    }

    calculateTotal() {
        this.total = 0;

        var subtotal = 0 ;
        var disc = 0;
        this.receiveDetails.forEach(receiveDetail => {
            subtotal = (receiveDetail.price * receiveDetail.qty);
            disc = (receiveDetail.disc1  * subtotal) /100
            subtotal -=disc;
            this.total += subtotal ;
        });

        this.taxAmount = this.isTax === true ? Math.floor(this.total / 10) : 0;
        this.grandTotal = this.total + this.taxAmount;
    }


    checkTax() {
        this.taxAmount = this.isTax === true ? Math.floor(this.total / 10) : 0;
        this.grandTotal = this.total + this.taxAmount;
    }


    processSupplier(result: HttpResponse<SupplierPageDto>) {
        if (result.body.contents.length < 0) {
            return;
        }
        this.suppliers = result.body.contents;
    }

    processWarehouse(result: HttpResponse<WarehouseDto>) {
        if (result.body.contents.length < 0) {
            return;
        }
        this.warehouses = result.body.contents;
    }

    getItem(event: any) {
        // event.preventDefault();
        console.log('get item ==>', event);
        this.productIdAdded = event.item.id;
        this.priceAdded = 0;
        this.productNameAdded = event.item.name;
        this.uomAdded = event.item.smallUomId;
        this.uomAddedName = event.item.smallUom.name;
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
        of(this.model).toPromise().then(
            (res) => {
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
        receiveDetail.disc1 = this.discAdded;
        receiveDetail.price = this.priceAdded;
        receiveDetail.productId = this.productIdAdded;
        receiveDetail.qty = this.qtyAdded;
        receiveDetail.uomId = this.uomAdded;
        return receiveDetail;
    }

    reloadDetail(id: number) {
        this.receiveDetailService
            .findByReceiveId({
                count: 1000,
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
            console.log('isi detail ===>', this.receiveDetails);
            this.totalRecord = this.receiveDetails.length;
            
            this.fillGridDetail();
            this.calculateTotal();
            this.clearDataAdded();
        }
    }


    fillGridDetail() {

        var recKe =1;
        this.receiveDetailShow = [];
        this.receiveDetails.every(data => {
            // page 1 rec 1 .. 10
            // page 2 rec 11 ..20
            if ((this.curPage-1) * 10 < recKe ) {
                this.receiveDetailShow.push(data);
                console.log('add .. ', this.receiveDetailShow.length);
                // jika sampe 10 rec, exit
                if (this.receiveDetailShow.length >= 10) {
                    return;
                }
            }
            recKe++;
            return true;
        })
        console.log('exit ya..');
    }

    confirmDelItem (receiveDtl: ReceivingDetail) {
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to cancel [ ' + receiveDtl.product.name + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.delItem(receiveDtl.id);
                }
            });
    }

    delItem(idDetail: number) {
        this.receiveDetailService
            .deleteById(idDetail)
            .subscribe(
                (res: ReceivingDetail) => {
                    if (res.errCode === '00') {
                        Swal.fire('Success', 'Data cancelled', 'info');
                        this.reloadDetail(this.receive.id);
                    } else {
                        Swal.fire('Failed', 'Data failed cancelled', 'info');
                    }
                },
            );
    }

    saveHdr() {
        this.receive.supplier = null;
        this.receive.supplierId = this.supplierSelected.id;
        this.receive.receiveDate = this.getSelectedDate();
        this.receive.warehouseId = this.warehouseSelected.id;
        // this.receive.supplierId = 0;
        this.receiveService
            .save(this.receive)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.receive.id = res.body.id;
                        this.receive.receiveNo = res.body.receiveNo;
                        this.receive.status = res.body.status;
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

        if (!this.isValidDataApprove()) {
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
        this.receiveService.approve(this.receive)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.router.navigate(['/main/receive']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                }
            );
    }

    isValidDataApprove(): boolean {
        if (this.receive.id ===0) {
            Swal.fire('Error', 'Data no order belum di save !', 'error');
            return false;
        }
        if (this.receiveDetails.length <= 0) {
            Swal.fire('Error', 'Data Barang belum ada', 'error');
            return false;
        }
        return true;
    }

    preview() {
        this.receiveService
            .preview(this.receive.id)
            .subscribe(dataBlob => {

                console.log('data blob ==> ', dataBlob);
                const newBlob = new Blob([dataBlob], { type: 'application/pdf' });
                const objBlob = window.URL.createObjectURL(newBlob);

                window.open(objBlob);
            });

    }

    getStatus(id): string {
        let statusName = 'Unknown';
        switch (id) {
            case 1:
            case 10:
                statusName = 'Outstanding';
                break;
            case 20:
                statusName = 'Approved';
                break;
            case 30:
                statusName = 'Rejected';
                break;
        }
        return statusName;
    }

    loadPO(obj) {

        if (this.receive.status != 10  ) {
            if (this.receive.status != 1  ) {
                Swal.fire('Error', 'Status not allowed to add/change PO ! ', 'error');
                return
            }
        }

        if (this.receive.poNo != '' ) {
            Swal.fire('Error', 'PO already found ! ', 'error');
            return
        }

        console.log('receive -->', this.receive);
        console.log('Receive date ', this.getSelectedDate());
        const modalRef = this.modalService.open(ReceivingSearchPoModalComponent, { size: 'lg' });
        modalRef.componentInstance.receive = this.receive;
        modalRef.componentInstance.supplier = this.supplierSelected;
        modalRef.componentInstance.receiveDate = this.getSelectedDate();
        modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            console.log('result',result);
            console.log(result.substring(0,2));
            if (result.substring(0,2) == 'ok') {
                var recvID = result.replace('ok:','');
                this.loadDataByOrderId(+recvID);
            }
            // this.curPage = 1;
            // this.loadAll(this.curPage);
        }, (reason) => {
            console.log('reason',reason);
            if ( reason === 0 ) {
                return;
            }
            // console.log(reason.substring(0,2));
            if (reason.substring(0,2) == 'ok') {
                var recvID = reason.replace('ok:','');
                this.loadDataByOrderId(+recvID);
            }
            // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            // console.log(this.closeResult);
            // this.loadAll(this.curPage);
        });
    }

    removePO() {

        if (this.receive.id ==0 ) {
            Swal.fire('Error', 'Receiving not found ! ', 'error');
            return
        }

        if (this.receive.status != 10 ) {
            Swal.fire('Error', 'Status not allowed to remove ! ', 'error');
            return
        }

        if (this.receive.poNo == '' ) {
            Swal.fire('Error', 'PO not found ! ', 'error');
            return
        }

        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to Remove PO ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.removePoProcess();
                }
        });        
        
    }
    
    removePoProcess() {
        let receive = new Receive();
        receive.id = this.receive.id
        receive.poNo = this.receive.poNo
        this.receiveService.removeByPO(receive)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.receive.poNo = ""
                        // this.router.navigate(['/main/receive']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                }
            );
    }

    loadPage() {
        this.copyDataToShowData();
        this.fillGridDetail();
    }

    copyDataToShowData() {

        this.receiveDetailShow.forEach(datashow =>{
            let findIndex = _.findIndex(this.receiveDetails, function(datadetail){
                        return datadetail.id == datashow.id;
                    })
            
            if (findIndex === undefined) {
                console.log('data undefined ');
            } else {
                console.log('data found ', findIndex);
                this.receiveDetails[findIndex].price = datashow.price;
                this.receiveDetails[findIndex].disc1 = datashow.disc1;
                this.receiveDetails[findIndex].qty = datashow.qty;
            }
        })
        this.calculateTotal();
        // _.forEach(this.receiveDetailShow, function(datashow) {
            
        //      _.find(this.receiveDetails, function(datadetail){
        //         return datadetail.id == datashow.id;
        //     })

        //     // console.log('data show ', dataFind);
        // });
    }

    updateDetail(){

        this.copyDataToShowData();
        this.spinner.show();

        setTimeout(() => {
            this.spinner.hide();
        }, 5000);

        this.receiveDetailService.updateDetail(this.receiveDetails)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        // this.router.navigate(['/main/receive']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                },
                (res: HttpErrorResponse) => {
                    // if (res.bod)
                },
                ()=> {
                    this.spinner.hide();
                }
            );
        
    }

}
