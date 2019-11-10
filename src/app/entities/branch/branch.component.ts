import { Component, OnInit } from '@angular/core';
import { AreaService } from '../area/area.service';
import { Area } from '../area/area.model';
import { BranchService } from './branch.service';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Branch } from './branch.model';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BranchModalComponent } from './branch.modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'op-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {

    area: Area;
    branchList: Branch[];
    totalData = 0;
    curPage = 1;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        name: ''
    };
    closeResult: string;



    constructor(private areaService: AreaService,
              private branchService: BranchService,
              private location: Location,
              private modalService: NgbModal,
              private router: Router) { }

    ngOnInit() {

        this.areaService.dataSharing.subscribe(
            data => this.area = data
        );

        if (!this.area.id) {
            this.router.navigate(['main/region']);
        } else {
            this.loadAll(this.curPage);
        }
    }

    loadPage() {
        this.loadAll(this.curPage);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    resetFilter() {
        this.searchTerm = {
            name: ''
        };
        this.loadAll(1);
    }

    loadAll(page) {
        this.branchService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
            areaId: this.area.id
        })
        .subscribe(
                    (res: HttpResponse<Branch[]>) => this.onSuccess(res.body, res.headers),
                    (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    private onSuccess(data, headers) {
        if ( data.content.length < 0 ) {
            return ;
        }
        this.branchList = data.content;
        this.totalData = data.totalElements;
        console.log(data.content);
    }

    private onError(error) {
        console.log('error', error);
    }

    open(status, message) {
        const modalRef = this.modalService.open(BranchModalComponent, { size: 'lg' });
        modalRef.componentInstance.statusRec = status;
        modalRef.componentInstance.objEdit = message;
        modalRef.componentInstance.area = this.area;
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
        return reason;
    }

    onBack() {
        this.location.back();
    }

}
