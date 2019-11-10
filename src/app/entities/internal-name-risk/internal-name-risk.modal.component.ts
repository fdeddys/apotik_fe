import { Component, OnInit, Input } from '@angular/core';
import { InternalNameRisk } from './internal-name-risk.model';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InternalNameRiskService } from './internal-name-risk.service';

@Component({
  selector: 'op-internal-name-risk-modal',
  templateUrl: './internal-name-risk.modal.component.html',
  styleUrls: ['./internal-name-risk.modal.component.css']
})
export class InternalNameRiskModalComponent implements OnInit {
    @Input() statusRec;
    @Input() objEdit: InternalNameRisk;
    @Input() viewMsg;

    lookupIdType = [
        { name: 'KTP' },
        { name: 'SIM' },
    ];

    internalNameRisk: InternalNameRisk;

    tglLahir: NgbDateStruct;
    isFormDirty: Boolean = false;


    constructor(private modalService: NgbModal,
                private internalNameRiskService: InternalNameRiskService) { }

    ngOnInit() {
        if (this.statusRec === 'addnew') {
            this.internalNameRisk = {};
            this.internalNameRisk.id = 0;
            this.internalNameRisk.idType = this.lookupIdType[0].name;
        } else {
            this.internalNameRisk = this.objEdit;
            if (this.internalNameRisk.birthDate) {
                this.tglLahir = {
                    year: Number(this.internalNameRisk.birthDate.substr(0, 4)),
                    month: Number(this.internalNameRisk.birthDate.substr(5, 2)),
                    day: Number(this.internalNameRisk.birthDate.substr(8, 2))
                };
            }
        }
        console.log(this.internalNameRisk);
    }

    save(): void {
        this.internalNameRisk.birthDate = this.tglLahir.year + '-' +
            ('0' + this.tglLahir.month).slice(-2) + '-' +
            ('0' + this.tglLahir.day).slice(-2) + 'T00:00:00.000Z';
        this.internalNameRiskService.save(this.internalNameRisk).subscribe(result => {
            this.isFormDirty = true;
            if (result.body.errCode === '00') {
                this.closeForm();
            } else {
                console.log('error');
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

}
