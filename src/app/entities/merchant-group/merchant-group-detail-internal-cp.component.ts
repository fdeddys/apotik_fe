import { OnInit, Component, Input } from '@angular/core';


@Component({
    selector: 'op-merchant-group-internal-cp',
    templateUrl: './merchant-group-detail-internal-cp.component.html',
    styleUrls: []
  })
  export class MerchantGroupDetailInternalCpComponent implements OnInit {

    @Input() data: any;
    pesan: any;
    constructor() { }

    ngOnInit() {
        this.pesan = this.data;
        console.log(this.pesan , '  - ', this.data);
    }

}

