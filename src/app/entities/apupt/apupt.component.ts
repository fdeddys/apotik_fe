import { Component, OnInit } from '@angular/core';
import { Apupt } from './apupt.model';
import { ApuptService } from './apupt.service';
import { SharedService } from 'src/app/shared/sidebar/share.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApuptModalComponent } from './apupt.modal.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'op-apupt',
  templateUrl: './apupt.component.html',
  styleUrls: ['./apupt.component.css']
})
export class ApuptComponent implements OnInit {

  apuptList: Apupt[];
  apupt: Apupt;
  curPage = 1;
  totalData = 0;
  totalRecord = TOTAL_RECORD_PER_PAGE;
  searchTerm = {
    name: '',
  };

  closeResult: string;


  constructor(private apuptService: ApuptService,
              private shareModule: SharedService,
              private modalService: NgbModal,
              private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    // this.loadAllDataWithoutFilter(this.currPage); //just for tes for get all apupt on load
    this.loadAll(this.curPage);
  }

  onFilter() {
    this.loadAll(this.curPage);
  }

  open(status, message) {
    this.apuptService.updateData(this.apuptList[0]);

    const modalRef = this.modalService.open(ApuptModalComponent, { size: 'lg' });
    modalRef.componentInstance.statusRec = status;
    modalRef.componentInstance.objEdit = message;
    modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
      this.curPage = 1;
      this.loadAll(this.curPage);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
      this.curPage = 1;
      this.loadAll(this.curPage);
    });

  }
  loadAll(page) {
    this.ngxService.start();
    console.log('Start call function all header');
    this.apuptService.filter({
      filter: this.searchTerm,
      page : page,
      count: this.totalRecord
    })
    .subscribe(
              (res: HttpResponse<Apupt[]>) => this.onSuccess(res.body, res.headers),
              (res: HttpErrorResponse) => this.onError(res.message),
              () => {
                console.log('finally');
              }
    );
  }

  private onSuccess(data, headers) {
    this.ngxService.stop();
    if (data.content.length < 0 ) {
      return ;
    }
    this.apuptList = data.content;
    this.totalData = data.totalElements;
  }

  private onError(error) {
    this.ngxService.stop();
    console.log('error..', error);
  }

  private getDismissReason(reason: any): string {
    console.log(reason);
    return reason;
  }

  loadAllDataWithoutFilter(page) {
    console.log('Start call function all header');
    this.apuptService.getAll()
    .subscribe(
      (res: HttpResponse<Apupt[]>) => {
        console.log('aye');
      }
    );
  }

  loadPage(event) {
    this.loadAll(this.curPage);
    console.log(this.curPage);
  }

}
