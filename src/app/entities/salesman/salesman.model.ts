

export class SupplierDto {
    constructor(
        public errCode?: string,
        public errDesc?: string,
        public contents?: Salesman[],
    ) {}
}


export class Salesman {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public description?: string,
        public status ?: number,

    ) {
    }
}
