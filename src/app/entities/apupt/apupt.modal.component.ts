import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Apupt } from './apupt.model';
import { NgbTypeahead, NgbCalendar, NgbDateStruct, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ApuptService } from './apupt.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonValidatorDirective } from '../../validators/common.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'op-apupt-modal-component',
  styles: [`
  :host >>> .alert-custom {
    color: #white;
    background-color: #blue;
    border-color: #800040;
  }
`],
  templateUrl: './apupt.modal.component.html' ,
})
export class ApuptModalComponent implements OnInit {
  @Input() statusRec;
  @Input() objEdit: Apupt;
  @Input() viewMsg;


  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  // focus$ = ne÷w
  model: any;
  apupt: Apupt;
  fromSend: Apupt;
  isFormDirty: Boolean = false;
  apuptForm: FormGroup;

  tglLahir: NgbDateStruct;
  constructor(private calendar: NgbCalendar,
              private apuptService: ApuptService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.apuptForm = this.formBuilder.group({
      name: ['', [CommonValidatorDirective.required]],
    });

    this.tglLahir = this.calendar.getToday();
    console.log(this.objEdit);
    if (this.statusRec === 'addnew') {
      this.apupt = {};
      this.apupt.id = 0;
      // this.model = this.listTypeIds[0];
      // console.log(this.model);
    } else {
      this.apupt = this.objEdit;
      if (this.apupt.birthDate !== null) {
        this.tglLahir = {
          year  : Number(this.apupt.birthDate.substr(0, 4)),
          month : Number(this.apupt.birthDate.substr(5, 2)),
          day : Number(this.apupt.birthDate.substr(8 , 2))
        };
      }
    }

    this.apuptService.dataSharing.subscribe(
      data => this.fromSend = data
    );
  }

  get form() { return this.apuptForm.controls; }

  save(): void {
    console.log('save');
    this.apupt.birthDate = this.tglLahir.year + '-' +
        ('0' + this.tglLahir.month).slice(-2) + '-' +
        ('0' + this.tglLahir.day).slice(-2) + 'T00:00:00.000Z';
    this.apuptService.save(this.apupt).subscribe(result => {
      this.isFormDirty = true;
      console.log(result);
      if (result.body.errCode === '00') {
        this.apupt.id = result.body.id;
        this.statusRec = 'edit';
        Swal.fire('Success', 'Save to data approval success !', 'info');
        this.closeForm();
      } else {
        console.log('error');
        Swal.fire('Error', result.body.errDesc, 'error');
      }
    });

  }

  closeForm(): void {
    if (this.isFormDirty === true) {
        this.modalService.dismissAll('refresh');

    } else {
        this.modalService.dismissAll('close');
    }
  }

  onSubmit() {
    console.log('.....');
  }

}
