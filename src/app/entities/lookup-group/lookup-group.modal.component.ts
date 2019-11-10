import { Component, OnInit, Input } from '@angular/core';
import { LookupGroup } from './lookup-group.model';
import { LookupGroupService } from './lookup-group.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'op-lookup-group-modal-component',
  templateUrl: './lookup-group.modal.component.html',
  styleUrls: ['./lookup-group.modal.component.css']
})
export class LookupGroupModalComponent implements OnInit {
  @Input() statusRec;
  @Input() objEdit: LookupGroup;

  lookupGroup: LookupGroup;
  fromSend: LookupGroup;
  isFormDirty: Boolean = false;


  constructor(public lookupGroupService: LookupGroupService,
              public activeModal: NgbActiveModal,
              ) { }

  ngOnInit() {
    console.log(this.statusRec, this.objEdit);
    if (this.statusRec === 'addnew') {
      this.lookupGroup = {};
      this.lookupGroup.updateable = true;
      this.lookupGroup.viewable = true;
    } else {
      this.lookupGroup = this.objEdit;
    }


  }

  save(): void {
    this.lookupGroupService.save(this.lookupGroup).subscribe(result => {
      this.isFormDirty = true;
      if (result.body.errCode === '00') {
        this.statusRec = 'edit';
      } else {
        console.log('Toast err');
      }
    });

    console.log('keluar');
    this.activeModal.close('refresh');
  }

  closeForm(): void {
    this.activeModal.dismiss();
  }

}
