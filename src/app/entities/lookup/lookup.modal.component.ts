import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Lookup } from './lookup.model';
import { NgbTypeahead, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { LookupService } from './lookup.service';
import { LookupGroupService } from '../lookup-group/lookup-group.service';

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
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  model: any;
  groupName: string;

  lookup: Lookup;
  isFormDirty: Boolean = false;

  constructor(public lookupService: LookupService,
              public lookupGroupService: LookupGroupService,
              public modalService: NgbModal) { }

  ngOnInit() {
    console.log(this.objEdit);
    console.log(this.statusRec);
    this.lookupGroupService.dataSharing.subscribe(
      data => this.groupName = data
    );
    if (this.statusRec === 'addnew') {
      this.lookup = {};
      this.lookup.id = 0;
      this.lookup.lookupGroupString = this.groupName.toUpperCase();
    } else {
      this.lookup = this.objEdit;
    }
  }

  save(): void {
    this.lookupService.save(this.lookup).subscribe(result => {
      this.isFormDirty = true;
      if (result.body.id) {
        console.log('success');
        this.lookup.id = result.body.id;
        this.statusRec = 'edit';
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
