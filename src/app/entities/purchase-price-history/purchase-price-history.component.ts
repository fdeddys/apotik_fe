import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'ngx-webstorage';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import Swal from 'sweetalert2';
import { PriceDetail, ProductMatrixRow, PurchasePriceMatrixResponse, SupplierHeader } from './purchase-price-history.model';
import { PurchasePriceHistoryService } from './purchase-price-history.service';

@Component({
  selector: 'op-purchase-price-history',
  templateUrl: './purchase-price-history.component.html',
  styleUrls: ['./purchase-price-history.component.css']
})
export class PurchasePriceHistoryComponent implements OnInit {

    Math = Math;
    searchProductName: string = '';

    totalRecord = 25;
    pageSizes: number[] = [25, 50, 100];
    totalData = 0;
    curPage = 1;

    suppliers: SupplierHeader[] = [];
    products: ProductMatrixRow[] = [];

    constructor(
        private spinner: NgxSpinnerService,
        private purchasePriceService: PurchasePriceHistoryService,
        private localStorage: LocalStorageService,
    ) {}

    ngOnInit(): void {
        const savedTotal = this.localStorage.retrieve('purchase_price_matrix_total_record');
        if (savedTotal && !isNaN(savedTotal) && Number(savedTotal) > 0) {
            this.totalRecord = Number(savedTotal);
        }
        this.loadPage(this.curPage);
    }

    onSearch(): void {
        this.curPage = 1;
        this.loadPage(this.curPage);
    }

    onChangePageSize(): void {
        if (!this.totalRecord || isNaN(this.totalRecord) || this.totalRecord < 1) {
            this.totalRecord = 25;
        }
        this.totalRecord = Number(this.totalRecord);
        this.localStorage.store('purchase_price_matrix_total_record', this.totalRecord);
        this.curPage = 1;
        this.loadPage(this.curPage);
    }

    resetFilters(): void {
        this.searchProductName = '';
        this.curPage = 1;
        this.loadPage(this.curPage);
    }

    onMouseDownResize(event: MouseEvent, thElement: HTMLElement) {
        event.preventDefault();
        event.stopPropagation();
        const startX = event.pageX;
        const startWidth = thElement.offsetWidth;

        const onMouseMove = (e: MouseEvent) => {
            const diff = e.pageX - startX;
            const newWidth = Math.max(15, startWidth + diff);
            thElement.style.width = `${newWidth}px`;
            thElement.style.minWidth = `${newWidth}px`;
            thElement.style.maxWidth = `${newWidth}px`;
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    loadPage(page: number) {
        this.curPage = page;
        const filter = {
            productName: this.searchProductName ? this.searchProductName.trim() : ''
        };

        this.spinner.show();
        this.purchasePriceService.filter({
            filter: filter,
            page: this.curPage,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<PurchasePriceMatrixResponse>) => {
                this.spinner.hide();
                this.onSuccess(res.body);
            },
            (res: HttpErrorResponse) => {
                this.spinner.hide();
                this.onError(res.message);
            }
        );
    }

    getTooltip(price: PriceDetail): string {
        if (!price) {
            return '';
        }
        let tglStr = '-';
        if (price.receiveDate) {
            const d = new Date(price.receiveDate);
            if (!isNaN(d.getTime())) {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                const day = ('0' + d.getDate()).slice(-2);
                const month = months[d.getMonth()];
                const year = d.getFullYear();
                tglStr = `${day}-${month}-${year}`;
            }
        }
        const noRecv = price.receiveNo || '-';
        const bruto = price.price ? Math.round(price.price).toLocaleString('id-ID') : '0';
        const disc1 = price.disc1 ? `${price.disc1}%` : '0%';
        const disc2 = price.disc2 ? ` + ${price.disc2}%` : '';
        const tax = price.tax ? `${price.tax}%` : '0%';
        return `Tgl: ${tglStr} | No: ${noRecv} | Hrg: ${bruto} | Disc: ${disc1}${disc2} | PPN: ${tax}`;
    }

    private onSuccess(data: PurchasePriceMatrixResponse) {
        if (!data) {
            this.suppliers = [];
            this.products = [];
            this.totalData = 0;
            return;
        }
        this.suppliers = data.suppliers || [];
        this.products = data.products || [];
        this.totalData = data.totalRow || 0;
    }

    private onError(error: any) {
        console.log('error fetching purchase price matrix..', error);
        Swal.fire('error', 'Gagal memuat data riwayat harga beli', 'error');
    }
}
