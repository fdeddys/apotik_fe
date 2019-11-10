import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbDateStruct, NgbCalendar, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { SourceListMap } from 'source-list-map';
import { Teroris } from './teroris.model';
import { TerorisService } from './teroris.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Subject, Observable, merge } from 'rxjs';
import Swal from 'sweetalert2';
import * as _ from 'lodash';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};
@Component({
    selector: 'op-teroris-modal-component',
    styles: [`
  :host >>> .alert-custom {
    color: #white;
    background-color: #blue;
    border-color: #800040;
  }

  .is-invalid {
    border: 1px solid #FF0000;
  }
`],
    templateUrl: './teroris.modal.component.html',
})

export class TerorisModalComponent implements OnInit {
    @Input() statusRec;
    @Input() objEdit: Teroris;
    @Input() listTypeIds: string[];
    @Input() viewMsg;

    @ViewChild('instance') instance: NgbTypeahead;
    focus$ = new Subject<string>();
    click$ = new Subject<string>();
    model: any;
    fromSend: Teroris;

    isFormDirty: Boolean = false;
    teroris: Teroris;
    // statusRec: String = 'addnew';
    tglLahir: NgbDateStruct;

    submitted = false;
    tempObj = new Teroris();

    constructor(// public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        public terorisService: TerorisService,
        private http: HttpClient,
        private calendar: NgbCalendar) { }

    ngOnInit(): void {
        this.tglLahir = this.calendar.getToday();
        console.log('name', this.objEdit);
        if (this.statusRec === 'addnew') {
            this.teroris = {};
            this.teroris.id = 0;
            this.model = this.listTypeIds[0];
        } else {
            this.teroris = this.objEdit;
            this.model = this.objEdit.idType;
            if (this.teroris.birthDate === null) {
            } else {
                this.tglLahir = {
                    year: Number(this.teroris.birthDate.substr(0, 4)),
                    month: Number(this.teroris.birthDate.substr(5, 2)),
                    day: Number(this.teroris.birthDate.substr(8, 2))
                };
            }
        }
        console.log('send dari depan---->', this.listTypeIds, '[status rec]', this.statusRec, 'view msg', this.viewMsg);

        this.terorisService.dataSharing.subscribe(
            data => this.fromSend = data
        );

    }

    search = (text$: Observable<string>) => {
        const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
        const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
        const inputFocus$ = this.focus$;

        return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
            map(term => (term === '' ? this.listTypeIds
                : this.listTypeIds.filter(v =>
                    v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
        );
    }

    validate(): void {
        this.submitted = true;
        console.log(_.keys(this.tempObj));
        console.log(this.teroris);

        this.teroris.birthDate = this.tglLahir.year + '-' +
            ('0' + this.tglLahir.month).slice(-2) + '-' +
            ('0' + this.tglLahir.day).slice(-2) + 'T00:00:00.000Z';
        this.teroris.idType = this.model;

        // matiin sementara, karena tidak bisa proses jika data tidak lengkap
        /*
        if (_.keys(this.teroris).length < _.keys(this.tempObj).length) {
            console.log('kurang dari');
            return;
        }
        */

        let iter = 0;
        _.forOwn(this.teroris, function (value, key) {
            if (key === 'name' || key === 'nameAlias' || key === 'birthPlace' ||
                key === 'birthDate' || key === 'nationality' || key === 'address' ||
                key === 'idType' || key === 'idNumber' || key === 'job'
            ) {
                // console.log('test 1 ', value);
                if (value === '' || value === null || value === undefined) {
                    iter++;
                }
            }
        });

        console.log('iter : ', iter, ' isi teroris ->', this.teroris);
        if (iter > 0) {
            return;
        }

        this.save();
    }

    save(): void {
        console.log('masuk saving');
        // planned to removed
        // this.teroris.birthDate = this.tglLahir.year + '-' +
        //     ('0' + this.tglLahir.month).slice(-2) + '-' +
        //     ('0' + this.tglLahir.day).slice(-2) + 'T00:00:00.000Z';
        // this.teroris.idType = this.model;
        // -- until here

        console.log('masokk');
        this.terorisService.save(this.teroris).subscribe(result => {
            this.isFormDirty = true;
            console.log('Result==>' + result);
            if (result.body.errCode === '00') {
                console.log('Toast success');
                this.teroris.id = result.body.id;
                this.statusRec = 'edit';
                Swal.fire('Success', 'Success save to Data Approval', 'success');
            } else {
                Swal.fire('Failed', result.body.errDesc, 'error');
                // console.log('Toast err', result.body.errDesc);
            }
        });

        console.log('keluar');
        this.modalService.dismissAll('tutup save');
    }

    closeForm(): void {
        if (this.isFormDirty === true) {
            this.modalService.dismissAll('refresh');

        } else {
            this.modalService.dismissAll('close');

        }
    }
}
