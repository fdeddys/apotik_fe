import { Component, OnInit } from '@angular/core';
import { RegionService } from '../region/region.service';
import { AreaService } from './area.service';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Area } from './area.model';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AreaModalComponent } from './area.modal.component';
import { Region } from '../region/region.model';
import { Router } from '@angular/router';

@Component({
  selector: 'op-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {

    region: Region;
    curPage = 1;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    areaList: Area[];
    totalData = 0;
    searchTerm = {
        code: '',
        name: '',
        branchDescription: ''
    };
    allRegion: Region[];

    closeResult: string;

    constructor(private regionService: RegionService,
                private areaService: AreaService,
                private location: Location,
                private modalService: NgbModal,
                private router: Router) { }

    ngOnInit() {

        this.regionService.dataSharing.subscribe(
            data => this.region = data
        );

        if (!this.region.id) {
            this.router.navigate(['main/region']);
        } else {
            this.regionService.getAllRegion()
            .subscribe(
                (res: HttpResponse<Region[]>) => {
                    this.allRegion = res.body;
                    console.log(this.allRegion);
                }
            );

            this.loadAll(this.curPage);
        }

    }

    loadAll(page) {
        console.log(this.region);
        this.areaService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
            regionId: this.region.id
        })
        .subscribe(
                    (res: HttpResponse<Area[]>) => this.onSuccess(res.body, res.headers),
                    (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    private onSuccess(data, headers) {
        if ( data.content.length < 0 ) {
            return ;
        }
        this.areaList = data.content;
        this.totalData = data.totalElements;
        console.log(data.content);
    }

    private onError(error) {
        console.log('error', error);
    }

    open(status, message) {
        const modalRef = this.modalService.open(AreaModalComponent, { size: 'lg' });
        modalRef.componentInstance.statusRec = status;
        modalRef.componentInstance.objEdit = message;
        modalRef.componentInstance.allRegion = this.allRegion;
        modalRef.componentInstance.region = this.region;
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

    loadPage() {
        this.loadAll(this.curPage);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    resetFilter() {
        this.searchTerm = {
            code: '',
            name: '',
            branchDescription: ''
        };
        this.loadAll(1);
    }

    onBack() {
        this.location.back();
    }

    openDetail(msgObj) {
        console.log(msgObj);
        this.areaService.senData(msgObj);
        this.router.navigate(['main/branch']);
    }
}
