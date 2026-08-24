export class Pelanggan {
    constructor(
        public id?: number,
        public tglMasuk?: string,
        public nama?: string,
        public instansi?: string,
        public noStr?: string,
        public profesi?: string,
        public noHp?: string,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.id = 0;
        this.nama = '';
        this.instansi = '';
        this.noStr = '';
        this.profesi = '';
        this.noHp = '';
    }
}

export class PelangganPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: Pelanggan[],
        public error?: string,
    ) {}
}
