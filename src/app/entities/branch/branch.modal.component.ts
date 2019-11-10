import { Component, OnInit, Input } from '@angular/core';
import { Branch } from './branch.model';
import { Area } from '../area/area.model';
import { BranchService } from './branch.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'op-branch-modal-component',
  templateUrl: './branch.modal.component.html',
  styleUrls: ['./branch.modal.component.css']
})
export class BranchModalComponent implements OnInit {

    @Input() statusRec;
    @Input() objEdit: Branch;
    @Input() area: Area;
    @Input() viewMsg;



    branch: Branch;
    isFormDirty: Boolean = false;


    constructor(private branchService: BranchService,
                private modalService: NgbModal) { }

    ngOnInit() {
        if (this.statusRec === 'addnew') {
            this.branch = {};
            this.branch.id = 0;
            this.branch.area = this.area;
        } else {
            this.branch = this.objEdit;
        }
    }

    save(): void {
        this.branchService.save(this.branch).subscribe(result => {
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
