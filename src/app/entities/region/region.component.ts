import { Component, OnInit } from '@angular/core';
import { RegionService } from './region.service';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Region } from './region.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegionModalComponent } from './region.modal.component';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'op-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {

  regionList: Region[];
  curPage = 1;
  totalData = 0;
  totalRecord = TOTAL_RECORD_PER_PAGE;
  searchTerm = {
    code: '',
    name: '',
    areaDescription: '',
  };

  closeResult: string;
  constructor(private regionService: RegionService,
              private router: Router,
              private modalService: NgbModal,
              private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.loadAll(this.curPage);
  }

  loadAll(page) {
    this.ngxService.start();
    this.regionService.filter({
      filter: this.searchTerm,
      page: page,
      count : this.totalRecord
    })
    .subscribe(
              (res: HttpResponse<Region[]>) => this.onSucccess(res.body, res.headers),
              (res: HttpErrorResponse) => this.onError
    );
  }

  private onSucccess(data, headers) {
    if (data.content.length < 0) {
      return ;
    }
    this.regionList = data.content;
    this.totalData = data.totalElements;
    this.ngxService.stop();
  }

  private onError(error) {
    console.log('err..', error);
    this.ngxService.stop();
  }

  open(status, message) {
    const modalRef = this.modalService.open(RegionModalComponent, { size: 'lg' });
    modalRef.componentInstance.statusRec = status;
    modalRef.componentInstance.objEdit = message;
    modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
      this.curPage = 1;
      this.loadAll(this.curPage);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.curPage = 1;
      this.loadAll(this.curPage);
    });
  }

  private getDismissReason(reason: any): string {
    console.log(reason);
    return reason;
  }

  resetFilter() {
    this.searchTerm = {
      code: '',
      name: '',
      areaDescription: '',
    };
    this.loadAll(1);
  }

  onFilter() {
    this.loadAll(this.curPage);
  }

  loadPage() {
    this.loadAll(this.curPage);
  }

  openDetail(msgObj) {
    console.log(msgObj);
    this.regionService.senData(msgObj);
    this.router.navigate(['main/area']);
  }

}
