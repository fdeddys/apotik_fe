import { Component, OnInit } from '@angular/core';
import { ProvinsiService } from '../provinsi/provinsi.service';
import { Provinsi } from '../provinsi/provinsi.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { WilayahConfigurationService } from './wilayah-configuration.service';
import { WilayahConfiguration } from './wilayah-configuration.model';
import { TOTAL_RECORD_PER_PAGE, WILAYAH_KELURAHAN, WILAYAH_KECAMATAN } from 'src/app/shared/constants/base-constant';
import { WILAYAH_DATI2, WILAYAH_PROVINSI } from 'src/app/shared/constants/base-constant';
import { Dati2Service } from '../dati2/dati2.service';
import { Dati2 } from '../dati2/dati2.model';
import { KecamatanService } from '../kecamatan/kecamatan.service';
import { Kecamatan } from '../kecamatan/kecamatan.model';
import { Kelurahan } from '../kelurahan/kelurahan.model';
import { KelurahanService } from '../kelurahan/kelurahan.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'op-wilayah-configuration',
  templateUrl: './wilayah-configuration.component.html',
  styleUrls: ['./wilayah-configuration.component.css']
})
export class WilayahConfigurationComponent implements OnInit {

    provinsiList: Provinsi[];
    dati2List: Dati2[];
    kecamatanList: Kecamatan[];
    kelurahanList: Kelurahan[];
    wilayahConfigList: WilayahConfiguration[];
    wilayahConfig: WilayahConfiguration;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;

    provinsiSelected = '0';
    dati2Selected = '0';
    kecamatanSelected = '0';
    kelurahanSelected = '0';
    searchTerm = {
        name: '',
    };
    constructor(
        private kelurahanService: KelurahanService,
        private kecamatanService: KecamatanService,
        private dati2Service: Dati2Service,
        private provinsiService: ProvinsiService,
        private wilayahConfigService: WilayahConfigurationService,
        private ngxService: NgxUiLoaderService
        ) { }

    ngOnInit() {
        this.loadAll(this.curPage);
        this.loadProvinsi();
    }


    loadAll(page) {
        this.ngxService.start();
        console.log('Start call function all header');
        this.wilayahConfigService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        })
            .subscribe(
                (res: HttpResponse<WilayahConfiguration[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
            );
    }

    private onSuccess(data, headers) {
        if (data.content.length < 0) {
            return;
        }
        this.wilayahConfigList = data.content;
        this.totalData = data.totalElements;
        this.ngxService.stop();
    }

    loadProvinsi() {
        this.ngxService.start();
        this.provinsiService.getAll().subscribe(
            (res: HttpResponse<Provinsi[]>) => this.onSuccessProvinsi(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    loadDati2() {
        this.dati2Selected = '0';
        this.kecamatanList = null;
        this.kecamatanSelected = '0';
        this.kelurahanList = null;
        this.kelurahanSelected = '0';

        console.log('prov-->', this.provinsiSelected);
        this.ngxService.start();
        this.searchTerm.name = this.provinsiSelected.toString();
        this.dati2Service.getByProvinsiId(this.provinsiSelected).subscribe(
            (res: HttpResponse<Dati2[]>) => this.onSuccessDati2(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );

    }

    loadKecamatan() {
        this.kecamatanSelected = '0';
        this.kecamatanList = null;
        this.kelurahanSelected = '0';

        console.log('dati2-->', this.dati2Selected);
        this.ngxService.start();
        this.searchTerm.name = this.dati2Selected.toString();
        this.kecamatanService.getByDati2Id(this.dati2Selected).subscribe(
            (res: HttpResponse<Kecamatan[]>) => this.onSuccessKecamatan(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );

    }

    loadKelurahan() {
        console.log('kecamatan-->', this.kecamatanSelected);
        this.kelurahanSelected = '0';
        this.ngxService.start();
        this.searchTerm.name = this.kelurahanSelected.toString();
        this.kelurahanService.getByKecamatanId(this.kecamatanSelected).subscribe(
            (res: HttpResponse<Kelurahan[]>) => this.onSuccessKelurahan(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );

    }

    clearSelected() {
        this.provinsiSelected = '0';
        this.dati2Selected = '0';
        this.dati2List = null;
        this.kecamatanSelected = '0';
        this.kecamatanList = null;
        this.kelurahanSelected = '0';
        this.kelurahanList = null;
    }

    add() {
        console.log('prov-->', this.provinsiSelected);
        console.log('dati2-->', this.dati2Selected);
        console.log('kecamatan-->', this.kecamatanSelected);
        console.log('keluarah-->', this.kelurahanSelected);

        const newWilayahConfig = new WilayahConfiguration;
        // tslint:disable-next-line:triple-equals
        if (this.kelurahanSelected !== '0') {
            newWilayahConfig.level = WILAYAH_KELURAHAN;
            newWilayahConfig.levelId = this.kelurahanSelected;
        } else if (this.kecamatanSelected !== '0') {
            newWilayahConfig.level = WILAYAH_KECAMATAN;
            newWilayahConfig.levelId = this.kecamatanSelected;
        } else if (this.dati2Selected !== '0') {
            newWilayahConfig.level = WILAYAH_DATI2;
            newWilayahConfig.levelId = this.dati2Selected;
        } else if (this.provinsiSelected !== '0') {
            newWilayahConfig.level = WILAYAH_PROVINSI;
            newWilayahConfig.levelId = this.provinsiSelected;
        } else {
            return null;
        }
        this.wilayahConfigService.save(newWilayahConfig).subscribe(result => {
            console.log('Result==>' + result.body);
            if (result.body.errCode === '00') {
                console.log('Toast success');
                Swal.fire('Success', 'Success save to Data Approval', 'success');
            } else {
                Swal.fire('Failed', result.body.errDesc, 'error');
            }
        });

    }

    private onSuccessKelurahan(data, headers) {
        this.ngxService.stop();
        this.loadAll(this.curPage);
        this.kelurahanList = data;
        console.log(data);
    }

    private onSuccessKecamatan(data, headers) {
        this.ngxService.stop();
        this.kecamatanList = data;
        this.loadAll(this.curPage);
        console.log(data);
    }

    private onSuccessDati2(data, headers) {
        this.ngxService.stop();
        this.dati2List = data;
        this.loadAll(this.curPage);
        console.log(data);
    }

    private onSuccessProvinsi(data, headers) {
        this.ngxService.stop();
        this.provinsiList = data;
        console.log(data);
    }

    private onError(error) {
        console.log('error..');
        this.ngxService.stop();
    }

    loadPage() {
        this.loadAll(this.curPage);
        console.log(this.curPage);
    }

    remove(wilayah: WilayahConfiguration) {
        wilayah.status = 0;
        this.wilayahConfigService.save(wilayah).subscribe(result => {
            console.log('Result==>' + result.body);
            if (result.body.errCode === '00') {
                console.log('Toast success');
                Swal.fire('Success', 'Success save to Data Approval', 'success');
            } else {
                Swal.fire('Failed', result.body.errDesc, 'error');
            }
        });
        console.log(wilayah);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }


}
