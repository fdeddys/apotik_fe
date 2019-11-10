import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LookupService } from '../lookup/lookup.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Lookup } from '../lookup/lookup.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';

@Component({
  selector: 'op-lookup-risk-profiler',
  templateUrl: './lookup-risk-profiler.component.html',
  styleUrls: ['./lookup-risk-profiler.component.css']
})
export class LookupRiskProfilerComponent implements OnInit {

    @Input() statusRec;
    @Input() objEdit: Lookup[];
    @Input() viewMsg;

    lookupGroupString: string;
    private sub: any;
    riskProfilerList: Lookup[] = [];
    isFormDirty: Boolean = false;

    constructor(private route: ActivatedRoute,
                private lookupService: LookupService,
                private ngxService: NgxUiLoaderService) { }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.lookupGroupString = params['type'];
            this.loadAll();
        });
    }

    loadAll() {
        console.log(this.objEdit);
        console.log(this.statusRec);
        console.log(this.viewMsg);
        console.log(this.lookupGroupString);
        if (this.statusRec === 'View') {
            this.riskProfilerList = this.objEdit;
        } else {
            this.ngxService.start(); // start loader
            this.lookupService.findByName({
                groupName: this.lookupGroupString.toUpperCase()
            }).subscribe(
                (res: HttpResponse<Lookup[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finally'); }
            );
        }
    }

    save(): void {
        console.log(this.riskProfilerList);
        console.log(this.lookupGroupString);
        this.lookupService.saveRiskProfiler(this.lookupGroupString, this.riskProfilerList).subscribe(result => {
            this.isFormDirty = true;
            if (result.body.id) {
                this.loadAll();
                Swal.fire('Success', 'Save success to Data Approval', 'info');
                console.log('success');
            } else {
                Swal.fire('Error', result.body.errDesc, 'error');
                console.log('error');
            }
        });
    }

    private onSuccess(data, headers) {
        this.ngxService.stop(); // stop loader
        if ( data.length < 0 ) {
            return ;
        }
        console.log(data);
        this.riskProfilerList = data;
    }

    private onError(error) {
        this.ngxService.stop(); // stop loader
        console.log('error', error);
    }

}
