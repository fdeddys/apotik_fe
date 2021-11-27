import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Lookup, LookupPageDto } from '../../lookup/lookup.model';
import { LookupService } from '../../lookup/lookup.service';
import { PaymentDetail } from '../../payment/payment.model';
import { Supplier, SupplierPageDto } from '../../supplier/supplier.model';
import { SupplierService } from '../../supplier/supplier.service';
import { PaymentSupplierDetailService } from '../payment-supplier-detail.service';
import { PaymentSupplierModalComponent } from '../payment-supplier-modal/payment-supplier-modal.component';
import { PaymentSupplierSearchReceiveModalComponent } from '../payment-supplier-search-receive-modal/payment-supplier-search-receive-modal.component';
import { PaymentSupplier, PaymentSupplierDetail, PaymentSupplierDetailPageDto } from '../payment-supplier.model';
import { PaymentSupplierService } from '../payment-supplier.service';
import * as _ from 'lodash';

@Component({
  selector: 'op-payment-supplier-edit',
  templateUrl: './payment-supplier-edit.component.html',
  styleUrls: ['./payment-supplier-edit.component.css']
})
export class PaymentSupplierEditComponent implements OnInit {

    selectedDate: NgbDateStruct;
    paymentSupplier: PaymentSupplier;
    paymentSupplierDetails: PaymentSupplierDetail[];
    // paymentSupplierDetailShow: PaymentSupplierDetail[];

    suppliers: Supplier[];
    supplierSelected: Supplier;
    total: number;

    paymentTypes: Lookup[];
    paymentTypeSelected: number = 0;
    
    closeResult: string;
    curPage =1;
    totalRecord =10;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private supplierService: SupplierService,
        private paymentSupplierService: PaymentSupplierService,
        private paymentSupplierDetailService: PaymentSupplierDetailService,
        private modalService: NgbModal,
        private spinner: NgxSpinnerService,
        private lookupService: LookupService,
    ) {
        this.total = 0;
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        const isValidParam = isNaN(+id);
        this.loadPaymentType();
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
        this.router.navigate(['/main/payment-supplier']);
    }

    setToday() {
        const today = new Date();
        this.selectedDate = {
            year: today.getFullYear(),
            day: today.getDate(),
            month: today.getMonth() + 1,
        };
    }
    
    loadPaymentType() {
        this.lookupService.findByName({
            groupName: 'Payment type',
        }).subscribe(
            (response: HttpResponse<LookupPageDto>) => {
                if (response.body.contents.length <= 0) {
                    Swal.fire('error', "failed get Payment type data !", 'error');
                    return;
                }
                this.paymentTypes = response.body.contents;
                if (this.paymentTypes.length>0) {
                    this.paymentTypeSelected = this.paymentTypes[0].id;
                }
            });
    }

    loadData(id: number) {

        console.log('id ==>?', id);
        if (id === 0) {
            this.loadSupplier();
            this.loadNewData();
            this.loadPaymentType();
            return;
        }
        this.loadDataById(id);
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
                if (this.paymentSupplier.id === 0) {
                    this.paymentSupplier.supplier = this.suppliers[0];
                    this.setSupplierDefault();
                }
            });
    }

    setSupplierDefault() {
        this.supplierSelected = this.paymentSupplier.supplier;
        console.log('set selected supplier =>', this.supplierSelected );
    }
    

    loadNewData() {
        this.addNew();
    }

    addNew() {
        this.total = 0;
        this.paymentSupplier= new PaymentSupplier();
        this.paymentSupplier.id = 0;
        this.paymentSupplier.status = 0;
        this.paymentSupplierDetails = [];
        this.setToday() ;
        if (this.suppliers !== undefined) {
            this.paymentSupplier.supplier = this.suppliers[0];
            this.setSupplierDefault();
        }        
    }

    loadDataById(id: number) {

        this.spinner.show();

        setTimeout(() => {
            this.spinner.hide();
        }, 10000);

        let paymentSupplierReq = this.paymentSupplierService.findById(id);

        let supplierReq = this.supplierService.filter({
            page: 1,
            count: 10000,
            filter: {
                code: '',
                name: '',
            }
        });

        let paymentSupplierDetailReq = this.paymentSupplierDetailService
            .findByPaymentId({
                count: 10,
                page: this.curPage,
                filter : {
                    paymentId: id,
                }
            });

        let lookupReq =    this.lookupService.findByName({
                groupName: 'Payment type',
            });

        const requestArray = [];
        requestArray.push(paymentSupplierReq);
        requestArray.push(supplierReq);
        requestArray.push(paymentSupplierDetailReq);
        requestArray.push(lookupReq);

        forkJoin(requestArray).subscribe(results => {
            this.processPaymnet(results[0]);
            this.processSupplier(results[1]);
            this.processPaymentDetail(results[2]);
            this.prosesLookup(results[3]);
            this.setSupplierDefault();
        },
        ()=> {
            
        },
        ()=> {
            this.spinner.hide();
        });

    }

    processPaymentDetail(result: HttpResponse<PaymentSupplierDetailPageDto>) {
        this.fillDetail(result);
    }

    processPaymnet(result: PaymentSupplier) {
        console.log('isi payment result', result);
        this.paymentSupplier = result;
    }

    calculateTotal() {
        this.total = 0;

        var subtotal = 0 ;
        this.paymentSupplierDetails.forEach(detail => {
            subtotal += detail.total ;
        });
        this.total = subtotal ;
    }


    processSupplier(result: HttpResponse<SupplierPageDto>) {
        if (result.body.contents.length < 0) {
            return;
        }
        this.suppliers = result.body.contents;
    }

    prosesLookup(result: HttpResponse<LookupPageDto>) {

        if (result.body.contents.length <= 0) {
            // Swal.fire('error', "failed get Payment type data !", 'error');
            return;
        }
        this.paymentTypes = result.body.contents;
        if (this.paymentTypes.length>0) {

            this.paymentTypeSelected = this.paymentTypes[0].id;
            if (this.paymentSupplier.paymentTypeId > 0) {
                this.paymentTypeSelected = this.paymentSupplier.paymentTypeId;
            }
            // let findIndex = _.findIndex(this.paymentTypes, function(paymentType){
            //     return paymentType.id == this.paymentSupplier.paymentType;
            // })
    
            // if (findIndex === undefined) {
            //     console.log('data undefined ');
            // } else {
            //     console.log('data found ', findIndex);
            //     this.paymentTypeSelected = this.paymentTypes[findIndex];
            // }
            
        }

    }
 
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


    reloadDetail(id: number) {
        this.paymentSupplierDetailService
            .findByPaymentId({
                count: 10,
                page: this.curPage,
                filter : {
                    paymentId: id,
                }
            }).subscribe(
                (res: HttpResponse<PaymentSupplierDetailPageDto>) => this.fillDetail(res),
                (res: HttpErrorResponse) => console.log(res.message),
                () => {}
            );
    }

    fillDetail(res: HttpResponse<PaymentSupplierDetailPageDto>) {
        this.paymentSupplierDetails = [];
        if (res.body.contents.length > 0) {
            
            this.paymentSupplierDetails = res.body.contents;
            console.log('isi detail ===>', this.paymentSupplierDetails);
            this.totalRecord = res.body.totalRow;
            
            // this.fillGridDetail();
            this.calculateTotal();
        }
    }


    // fillGridDetail() {

    //     var recKe =1;
    //     this.paymentSupplierDetailShow = [];
    //     this.paymentSupplierDetails.every(data => {
    //         if ((this.curPage-1) * 10 < recKe ) {
    //             this.paymentSupplierDetailShow.push(data);
    //             console.log('add .. ', this.paymentSupplierDetailShow.length);
    //             // jika sampe 10 rec, exit
    //             if (this.paymentSupplierDetailShow.length >= 10) {
    //                 return;
    //             }
    //         }
    //         recKe++;
    //         return true;
    //     })
    //     console.log('exit ya..');
    // }

    confirmDelItem (detail: PaymentSupplierDetail) {
        Swal.fire({
            title : 'Confirm',
            text : 'Are you sure to cancel [ ' + detail.receive.receiveNo + ' ] ?',
            type : 'info',
            showCancelButton: true,
            confirmButtonText : 'Ok',
            cancelButtonText : 'Cancel'
        })
        .then(
            (result) => {
            if (result.value) {
                    this.delItem(detail.id);
                }
            });
    }

    delItem(idDetail: number) {
        this.paymentSupplierDetailService
            .deleteById(idDetail)
            .subscribe(
                (res: PaymentSupplierDetail) => {
                    if (res.errCode === '00') {
                        Swal.fire('Success', 'Data cancelled', 'info');
                        this.reloadDetail(this.paymentSupplier.id);
                        // this.loadDataById(this.paymentSupplier.id);
                    } else {
                        Swal.fire('Failed', 'Data failed cancelled', 'info');
                    }
                },
            );
    }

    saveHdr() {
        this.paymentSupplier.supplier = null;
        this.paymentSupplier.supplierId = this.supplierSelected.id;
        this.paymentSupplier.paymentTypeId = +this.paymentTypeSelected;
        this.paymentSupplier.paymentDate = this.getSelectedDate();
        this.paymentSupplierService
            .save(this.paymentSupplier)
            .subscribe(
                (res => {
                    if (res.body.errCode === '00') {
                        this.paymentSupplier.id = res.body.id;
                        this.paymentSupplier.paymentNo = res.body.paymentNo;
                        this.paymentSupplier.status = res.body.status;
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
       
        this.paymentSupplierService.approve(this.paymentSupplier)
            .subscribe(
                (res) => {
                    if (res.body.errCode === '00'){
                        Swal.fire('OK', 'Save success', 'success');
                        this.router.navigate(['/main/payment-supplier']);
                    } else {
                        Swal.fire('Failed', res.body.errDesc, 'warning');
                    }
                }
            );
    }

    isValidDataApprove(): boolean {
        if (this.paymentSupplier.id ===0) {
            Swal.fire('Error', 'Data  belum di save !', 'error');
            return false;
        }
        if (this.paymentSupplierDetails.length <= 0) {
            Swal.fire('Error', 'Data  belum ada', 'error');
            return false;
        }
        return true;
    }

    preview() {
        // this.receiveService
        //     .preview(this.receive.id)
        //     .subscribe(dataBlob => {

        //         console.log('data blob ==> ', dataBlob);
        //         const newBlob = new Blob([dataBlob], { type: 'application/pdf' });
        //         const objBlob = window.URL.createObjectURL(newBlob);

        //         window.open(objBlob);
        //     });

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

    loadReceive(obj) {

        if (this.paymentSupplier.status != 10  ) {
            if (this.paymentSupplier.status != 1  ) {
                Swal.fire('Error', 'Status not allowed to add detail ! ', 'error');
                return
            }
        }

        const modalRef = this.modalService.open(PaymentSupplierSearchReceiveModalComponent, { size: 'lg' });
        modalRef.componentInstance.paymentSupplier = this.paymentSupplier;
        modalRef.componentInstance.supplier = this.supplierSelected;
        modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            this.reloadDetail(this.paymentSupplier.id);
            // console.log('result',result);
            // console.log(result.substring(0,2));
            // if (result.substring(0,2) == 'ok') {
                // var recvID = result.replace('ok:','');
            // }
            // this.curPage = 1;
            // this.loadAll(this.curPage);
        }, (reason) => {
            console.log('reason',reason);
            this.reloadDetail(this.paymentSupplier.id);
            // if ( reason === 0 ) {
            //     return;
            // }
            // // console.log(reason.substring(0,2));
            // if (reason.substring(0,2) == 'ok') {
            //     var recvID = reason.replace('ok:','');
            //     this.loadDataById(+recvID);
            // }
            // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            // console.log(this.closeResult);
            // this.loadAll(this.curPage);
        });
    }


    loadPage() {
        this.reloadDetail(this.paymentSupplier.id);
        // this.fillGridDetail();
    }



    rejectProccess(){
        this.paymentSupplierService.reject(this.paymentSupplier)
            .subscribe(
                (res) => { 
                    console.log('success');
                    this.router.navigate(['/main/payment-supplier']); 
                    Swal.fire('OK', 'Save success', 'success');
                }
            )
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

}