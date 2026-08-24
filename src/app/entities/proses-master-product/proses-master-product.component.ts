import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ProductService } from '../product/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
    selector: 'op-proses-master-product',
    templateUrl: './proses-master-product.component.html',
    styleUrls: ['./proses-master-product.component.css']
})
export class ProsesMasterProductComponent implements OnInit {

    productList: any[] = [];
    fileUpload: File = null;

    @ViewChild('fileInput') myInputVariable: ElementRef;

    constructor(
        private productService: ProductService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.loadGrid();
    }

    loadGrid() {
        this.spinner.show();
        this.productService.getTemplateProducts().subscribe(
            (res: HttpResponse<any>) => {
                this.spinner.hide();
                if (res.body && res.body.errCode === '00') {
                    this.productList = res.body.contents || [];
                } else {
                    console.error('Failed to load grid from template table', res.body);
                }
            },
            (err) => {
                this.spinner.hide();
                console.error(err);
            }
        );
    }

    clearData() {
        this.spinner.show();
        this.productService.clearTemplate().subscribe(
            (res: HttpResponse<any>) => {
                this.spinner.hide();
                if (res.body && res.body.errCode === '00') {
                    this.productList = [];
                    this.fileUpload = null;
                    if (this.myInputVariable) {
                        this.myInputVariable.nativeElement.value = '';
                    }
                    Swal.fire('Cleared', 'Data template table on server and grid have been cleared.', 'success');
                } else {
                    Swal.fire('Error', res.body ? res.body.errDesc : 'Failed to clear data on server', 'error');
                }
            },
            (err) => {
                this.spinner.hide();
                console.error(err);
                Swal.fire('Error', 'Failed to hit backend to clear data!', 'error');
            }
        );
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        this.fileUpload = file;
    }

    uploadToServer() {
        if (!this.fileUpload) {
            Swal.fire('Error', 'Please choose a CSV file first!', 'error');
            return;
        }

        if (this.fileUpload.size > (1024 * 1024 * 2)) {
            Swal.fire('Error', 'File > 2MB not allowed!', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', this.fileUpload);

        this.spinner.show();
        this.productService.uploadCSV(formData).subscribe(
            (res: HttpResponse<any>) => {
                this.spinner.hide();
                if (res.body && res.body.errCode === '00') {
                    Swal.fire('Success', 'Success upload file to server!', 'success');
                    this.productList = res.body.contents || [];
                } else {
                    Swal.fire('Error', res.body ? res.body.errDesc : 'Failed to upload file to server', 'error');
                }
            },
            (err) => {
                this.spinner.hide();
                console.error(err);
                Swal.fire('Error', 'Failed to upload file to server!', 'error');
            }
        );
    }

    prosesToDatabase() {
        this.spinner.show();
        this.productService.processUpdate().subscribe(
            (res: HttpResponse<any>) => {
                this.spinner.hide();
                if (res.body && res.body.errCode === '00') {
                    Swal.fire('Success', 'Success process data into database!', 'success');
                } else {
                    Swal.fire('Success', 'Process completed: ' + (res.body ? res.body.errDesc : 'Success'), 'success');
                }
                this.loadGrid();
            },
            (err) => {
                this.spinner.hide();
                console.error(err);
                Swal.fire('Error', 'Failed to process data into database!', 'error');
            }
        );
    }
}
