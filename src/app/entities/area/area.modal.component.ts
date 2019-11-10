import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Area } from './area.model';
import { NgbTypeahead, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Region } from '../region/region.model';
import { AreaService } from './area.service';

@Component({
  selector: 'op-area-modal-component',
  templateUrl: './area.modal.component.html',
  styleUrls: ['./area.modal.component.css']
})
export class AreaModalComponent implements OnInit {
    @Input() statusRec;
    @Input() objEdit: Area;
    @Input() allRegion: Region[];
    @Input() region: Region;
    @Input() viewMsg;

    @ViewChild('instance') instance: NgbTypeahead;


    area: Area;
    isFormDirty: Boolean = false;

    constructor(private areaService: AreaService,
                private modalService: NgbModal) { }

    ngOnInit() {
        console.log(this.allRegion);
        console.log(this.statusRec, this.objEdit, this.viewMsg);
        if (this.statusRec === 'addnew') {
            this.area = {};
            this.area.id = 0;
            this.area.region = this.region;
        } else {
            console.log('dfsf');
            this.area = this.objEdit;
        }

    }

    save(): void {
        this.areaService.save(this.area).subscribe(result => {
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
