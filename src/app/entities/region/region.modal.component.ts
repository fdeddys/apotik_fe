import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Region } from './region.model';
import { NgbTypeahead, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { RegionService } from './region.service';

@Component({
  selector: 'op-region-modal-component',
  styles: [`
    :host >>> .alert-custom {
      color: #white;
      background-color: #blue;
      border-color: #800040;
    }
  `],
  templateUrl: './region.modal.component.html',
})
export class RegionModalComponent implements OnInit {
    @Input() statusRec;
    @Input() objEdit: Region;
    @Input() viewMsg;

    @ViewChild('instance') instance: NgbTypeahead;
    focus$ = new Subject<string>();
    click$ = new Subject<string>();

    region: Region;
    isFormDirty: Boolean = false;

    constructor(private regionService: RegionService,
                private modalService: NgbModal) { }

    ngOnInit() {
        if (this.statusRec === 'addnew') {
            this.region = {};
            this.region.id = 0;
        } else {
            this.region = this.objEdit;
        }
        console.log(this.region);
    }

    save(): void {
        this.regionService.save(this.region).subscribe(result => {
            this.isFormDirty = true;
            if (result.body.errCode === '00') {
            this.closeForm();
            } else {
            console.log('error');
            }
        });
    }

    closeForm(): void {
        // this.activeModal.close('close');
        if (this.isFormDirty === true) {
            this.modalService.dismissAll('refresh');

        } else {
            this.modalService.dismissAll('close');

        }
    }

}
