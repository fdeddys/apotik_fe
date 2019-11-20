import { Lookup } from '../lookup/lookup.model';


export class Supplier {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public address?: string,
        public city?: string,
        public status ?: number,

        public tax?: number,
        public picPhone?: string,
        public picName?: string,

        public bankId?: number,
        public bank?: Lookup,
        public bankAccNo ?: string,
        public bankAccName ?: string,

        public errCode?: string,
        public errDesc?: string,
    ) {
    }
}

export class SupplierPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: Supplier[],
        public error?: string,
    ) {}
}
