import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/sidebar/share.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { LookupGroup } from './lookup-group.model';
import { Router } from '@angular/router';
import { LookupGroupService } from './lookup-group.service';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LookupGroupModalComponent } from './lookup-group.modal.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'op-lookup-group',
  templateUrl: './lookup-group.component.html',
  styleUrls: ['./lookup-group.component.css']
})
export class LookupGroupComponent implements OnInit {

  lookupGroupList: LookupGroup[];
  curPage = 1;
  totalData = 0;
  totalRecord = TOTAL_RECORD_PER_PAGE;
  searchTerm = {
    name: '',
  };
  closeResult: string;

  constructor(private shareModule: SharedService,
              private router: Router,
              private modalService: NgbModal,
              private lookupGroupService: LookupGroupService,
              private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.loadAll(this.curPage);
  }

  onFilter() {
    this.loadAll(this.curPage);
  }

  loadAll(page) {
    this.ngxService.start(); // start loader
    this.lookupGroupService.filter({
      filter: this.searchTerm,
      page: page,
      count: this.totalRecord,
    })
    .subscribe(
          (res: HttpResponse<LookupGroup[]>) => this.onSuccess(res.body, res.headers),
          (res: HttpErrorResponse) => this.onError(res.message),
          () => {}
    );
  }

  private onSuccess(data, headers) {
    this.ngxService.stop(); // stop loader
    if (data.content.length < 0 ) {
      return ;
    }
    this.lookupGroupList = data.content;
    this.totalData = data.totalElements;
  }

  private onError(error) {
    this.ngxService.stop(); // stop loader
    console.log('error..', error);
  }

  open(status, obj) {

    const modalRef = this.modalService.open(LookupGroupModalComponent, { size: 'lg' } );
    modalRef.componentInstance.statusRec = status;
    modalRef.componentInstance.objEdit = obj;

    modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
      this.curPage = 1 ;
      this.loadAll(this.curPage);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
      this.loadAll(this.curPage);
    });

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  openDetail(obj) {
    this.lookupGroupService.sendData(obj.name.toLowerCase());
    this.router.navigate(['main/lookup']);
  }

  loadPage() {
    this.loadAll(this.curPage);
  }

}
