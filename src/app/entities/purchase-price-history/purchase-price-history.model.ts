export class SupplierHeader {
    constructor(
        public id?: number,
        public name?: string
    ) {}
}

export class PriceDetail {
    constructor(
        public netPrice?: number,
        public price?: number,
        public disc1?: number,
        public disc2?: number,
        public tax?: number,
        public receiveDate?: string,
        public receiveNo?: string
    ) {}
}

export class ProductMatrixRow {
    constructor(
        public productId?: number,
        public productCode?: string,
        public productName?: string,
        public uomName?: string,
        public prices?: { [supplierId: number]: PriceDetail }
    ) {}
}

export class PurchasePriceMatrixResponse {
    constructor(
        public suppliers?: SupplierHeader[],
        public products?: ProductMatrixRow[],
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public error?: string
    ) {}
}
