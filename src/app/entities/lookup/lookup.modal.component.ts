import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
// import { Subject } from 'rxjs';
import { Lookup } from './lookup.model';
import { LookupService } from './lookup.service';
import { LookupGroupService } from '../lookup-group/lookup-group.service';
import { LookupGroup } from '../lookup-group/lookup-group.model';
import * as _ from 'lodash';
import Swal from 'sweetalert2';



@Component({
    selector: 'op-lookup-modal-component',
    templateUrl: './lookup.modal.component.html',
    styleUrls: ['./lookup.modal.component.css'],
})


export class LookupModalComponent implements OnInit {
    @Input() statusRec;
    @Input() objEdit: Lookup;
    @Input() viewMsg;
    @ViewChild('instance') instace: NgbTypeahead;

    // focus$ = new Subject<string>();
    // click$ = new Subject<string>();
    // model: any;
    // groupName: string;
    statuses = ['Active', 'Inactive'];
    lookup: Lookup;
    isFormDirty: Boolean = false;
    statusSelected: string;
    lookupGroups: LookupGroup[];
    lookupGroupSelected: string;

    constructor(public lookupService: LookupService,
                public modalService: NgbModal,
                public lookupGroupService: LookupGroupService) { }

    ngOnInit() {
        console.log(this.objEdit);
        console.log(this.statusRec);
        this.findAllGroup();
        if (this.statusRec === 'addnew') {
            this.setDefaultValue();
        } else {
            this.setSelectedLookup(this.objEdit);
            // this.findAllGroup();
            // this.setSelectedGroup(this.objEdit.lookupGroup);
        }
    }
    // setSelectedGroup(currLookup: string) {
    //     console.log('isi dari pencarian ', currLookup);
    //     var res = _.find(this.lookupGroups, ['name', currLookup]);
    //     // if (res !== null) {
    //         console.log('isi res ', res);
    //     // }
    // }

    setSelectedLookup(lookupData: Lookup) {
        this.lookup = lookupData;
        if (lookupData.status === 1) {
            this.statusSelected = this.statuses[0];
        } else {
            this.statusSelected = this.statuses[1];
        }
        this.lookupGroupSelected =  lookupData.lookupGroup;
    }

    findAllGroup() {
        this.lookupGroupService.findForMerchantGroup()
            .subscribe(
                result => {
                    this.lookupGroups = result.body.contents;
                    this.lookupGroupSelected = this.lookupGroups[0].name;
                }
            );
    }

    setDefaultValue(){
        this.lookup = {};
        this.lookup.id = 0;
        this.statusSelected = this.statuses[0];
    }

    save(): void {
        this.lookup.lookupGroup = this.lookupGroupSelected;
        this.lookup.status = (this.statusSelected === 'Active' ? 1 : 0 );
        this.lookupService.save(this.lookup).subscribe(result => {
            this.isFormDirty = true;
            if (result.body.errCode === '00') {
                console.log('success');
                Swal.fire('Success', 'Save success ', 'info');
                // this.lookup.id = result.body.id;
                // this.statusRec = 'edit';
                this.modalService.dismissAll('refresh');
            } else {
                console.log('Toast err');
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
