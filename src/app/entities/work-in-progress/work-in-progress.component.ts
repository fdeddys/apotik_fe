import { Component, OnInit, OnDestroy } from '@angular/core';
import { LookupDto } from '../lookup/lookup-dto.model';
import { LookupService } from '../lookup/lookup.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { LOOKUP_TIPE_MERCHANT } from 'src/app/shared/constants/base-constant';
import { Router } from '@angular/router';
import { WorkInProgressService } from './work-in-progress.service';
// import { Subscription, Observable } from 'rxjs';
import 'rxjs/add/observable/interval';


@Component({
  selector: 'op-work-in-progress',
  templateUrl: './work-in-progress.component.html',
  styleUrls: ['./work-in-progress.component.css']
})
export class WorkInProgressComponent implements OnInit, OnDestroy {

    constructor(private router: Router,
        private workInProgressService: WorkInProgressService) { }

    pieChartLabels: string[] = ['On Progress', 'Pending'];
    pieChartOptions: any = {
        legend: {
            display: true
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            displayColors: false,
        }
    };


    // pieChartData: number[] = [4, 3];
    pieChartType = 'pie';

    // onprogress, pending
    dataVerification: number[] = [0, 0];
    dataApprove: number[] = [0, 0];
    dataEdd: number[] = [0, 0];
    // subscription: Subscription;

    ngOnInit() {
        this.getData();
        // this.subscription = Observable.interval(10000)
        //     .subscribe((val) => {
        //         this.getData();
        //     });
    }

    ngOnDestroy(): void {
        // this.subscription.unsubscribe();
    }

    getData() {
        this.workInProgressService.getDataDashboard()
            .subscribe(
                (res: HttpResponse<Map<string, number>>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => console.log(res.message),
                () => {  }
            );
    }

    private onSuccess(data, headers) {
        if (data === null) {
            return;
        }
        console.log('dataaaaa Dashboard ---> ', data);
        this.dataVerification = [];
        this.dataApprove = [];
        this.dataEdd = [];

        this.dataVerification.push(data['REGISTERED']);
        this.dataVerification.push(data['VERIFIER_START_VIEW']);
        this.dataApprove.push(data['VERIFIED']);
        this.dataApprove.push(data['APPROVER_START_VIEW']);
        this.dataEdd.push(data['EDD']);
        this.dataEdd.push(data['EDD_START_VIEW']);
        console.log(this.dataApprove);
    }

    // events
    chartClicked(e: any): void {
        // console.log(e);
        // if (e.active.length > 0) {
        //     const datasetIndex = e.active[0]._datasetIndex;
        //     const dataIndex = e.active[0]._index;
        //     const dataObject = this.pieChartLabels[dataIndex];
        //     if (dataObject === 'Pending') {
        //         console.log('Pending');
        //     } else if (dataObject === 'On Progress') {
        //         console.log('On Progress');
        //     }
        //     console.log(dataObject);
            this.router.navigate(['/main/work-in-progress/detail']);
        // }
    }

    chartHovered(e: any): void {
        console.log(e);
    }

}
