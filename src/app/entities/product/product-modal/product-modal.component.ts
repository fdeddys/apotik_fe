import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupService } from '../../lookup/lookup.service';
import Swal from 'sweetalert2';
import { BrandService } from '../../brand/brand.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { Lookup, LookupDto, LookupPageDto } from '../../lookup/lookup.model';
import { HttpResponse } from '@angular/common/http';
import { Brand, BrandPageDto } from '../../brand/brand.model';
import { ProductGroupService } from '../../product-group/product-group.service';
import { ProductGroupPageDto, ProductGroup } from '../../product-group/product-group.model';

@Component({
    selector: 'op-product-modal',
    templateUrl: './product-modal.component.html',
    styleUrls: ['./product-modal.component.css']
})
export class ProductModalComponent implements OnInit {

    @Input() statusRec;
    @Input() objEdit: Product;
    @Input() viewMsg;

    statuses = ['Active', 'Inactive'];
    product: Product;
    statusSelected: string;
    bankSelected: number;
    products: Product[];
    isFormDirty: Boolean = false;
    smallUoms: Lookup[];
    bigUoms: Lookup[];
    brands: Brand[];
    productGroups: ProductGroup[];
    productGroupSelected: number;
    brandSelected: number;
    smallUomSelected: number;
    bigUomSelected: number;

    constructor(
        public productService: ProductService,
        public modalService: NgbModal,
        public bankService: LookupService,
        public brandService: BrandService,
        public lookupService: LookupService,
        public productGroupService: ProductGroupService,
    ) { }

    ngOnInit() {
        console.log('obj to edit -> ', this.objEdit);
        console.log(this.statusRec);
        if (this.statusRec === 'addnew') {
            this.setDefaultValue();
        } else {
            this.product = this.objEdit;
            if (this.product.status === 1) {
                this.statusSelected = this.statuses[0];
            } else {
                this.statusSelected = this.statuses[1];
            }
        }
        this.findAllLookup();
    }

    findAllLookup() {
        let searchTerm = {
            code: '',
            name: '',
        };
        let brandReq = this.brandService.filter({
            page: 1,
            count: 10000,
            filter: searchTerm
        });
        let lookupReq = this.lookupService.findByName({
            groupName:  'SATUAN'
        });
        let productGroupReq = this.productGroupService.filter({
            page: 1,
            count: 10000,
            filter: searchTerm
        });

        const requestArray = [];
        requestArray.push(brandReq);
        requestArray.push(lookupReq);
        requestArray.push(productGroupReq);

        forkJoin(requestArray).subscribe(results => {
            this.processBrand(results[0]);
            this.processLookup(results[1]);
            this.processProductGroup(results[2]);
            this.setDefaultLookup();
        });

    }
    processLookup(result: HttpResponse<LookupPageDto>) {
        if (result.body.errCode === '00' ) {
            this.bigUoms = result.body.contents;
            this.smallUoms = result.body.contents;
        }
    }

    processBrand(result: HttpResponse<BrandPageDto>) {
        if (result.body.count > 0) {
            this.brands = result.body.contents;
        }
    }

    processProductGroup(result: HttpResponse<ProductGroupPageDto>) {
        if (result.body.count > 0) {
            this.productGroups = result.body.contents;
        }
    }

    setDefaultLookup(){
        if (this.statusRec === 'addnew') {
            this.bigUomSelected = this.bigUoms[0].id;
            this.smallUomSelected = this.smallUoms[0].id;
            this.brandSelected = this.brands[0].id;
            this.productGroupSelected = this.productGroups[0].id;
        } else {
            this.bigUomSelected = this.product.bigUomId;
            this.smallUomSelected = this.product.smallUomId;
            this.brandSelected = this.product.brandId;
            this.productGroupSelected = this.product.productGroupId;
        }
    }

    setDefaultValue() {
        this.product = {};
        this.product.qtyUom = 1;
        this.statusSelected = this.statuses[0];
    }

    save(): void {
        // this.lookup.lookupGroup = this.lookupGroupSelected;
        this.product.status = (this.statusSelected === 'Active' ? 1 : 0);
        // this.product.bankId = this.bankSelected;
        this.productService.save(this.product).subscribe(result => {
            this.isFormDirty = true;
            if (result.body.errCode === '00') {
                console.log('success');
                Swal.fire('Success', 'Save success ', 'info');
                this.modalService.dismissAll('refresh');
            } else {
                console.log('Toast err');
            }
        });
    }

    closeForm(): void {
        if (this.isFormDirty === true) {
            this.modalService.dismissAll('refresh');
        } else {
            this.modalService.dismissAll('close');
        }
    }

}
