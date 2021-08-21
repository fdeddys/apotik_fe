import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportSalesService } from './report-sales.service';

@Component({
  selector: 'op-report-sales',
  templateUrl: './report-sales.component.html',
  styleUrls: ['./report-sales.component.css']
})
export class ReportSalesComponent implements OnInit {

    selectedDate1: NgbDateStruct;
    selectedDate2: NgbDateStruct;
    constructor(
        private spinner: NgxSpinnerService,
        private reportSalesService: ReportSalesService,
    ) { }

    ngOnInit() {
        this.setToday()
    }

    setToday() {
        const today = new Date();
        this.selectedDate1 = {
            year: today.getFullYear(),
            day: today.getDate(),
            month: today.getMonth() + 1,
        };

        this.selectedDate2 = {
            year: today.getFullYear(),
            day: today.getDate(),
            month: today.getMonth() + 1,
        };

    }

    getSelectedDate1(): string{

        const month = ('0' + this.selectedDate1.month).slice(-2);
        const day = ('0' + this.selectedDate1.day).slice(-2);
        // const tz = 'T00:00:00+07:00';
        const tz = '';

        return this.selectedDate1.year + '-' + month + '-' + day + tz;
    }

    getSelectedDate2(): string{

        const month = ('0' + this.selectedDate2.month).slice(-2);
        const day = ('0' + this.selectedDate2.day).slice(-2);
        // const tz = 'T00:00:00+07:00';
        const tz = '';
            
        return this.selectedDate2.year + '-' + month + '-' + day + tz;
    }


    onPreview() {
        let tgl1 = this.getSelectedDate1();
        let tgl2 = this.getSelectedDate2();
        console.log('tg  bettwen ',tgl1, ' : ', tgl2);

        let filename = "report-sales" + tgl1 + "+" + tgl2 +  ".csv"; 
        this.spinner.show();
        setTimeout(() => {
            this.spinner.hide();
        }, 5000);

        this.reportSalesService.reportSales(tgl1, tgl2)
            .subscribe(dataBlob => {
                console.log('data blob ==> ', dataBlob);
                const newBlob = new Blob([dataBlob], { type: 'text/csv' });
                const objBlob = window.URL.createObjectURL(newBlob);
                const element = document.createElement("a");
                element.href = objBlob;
                element.download = filename
                element.click();
                this.spinner.hide();

                // window.open(objBlob);
            });
    }

}
