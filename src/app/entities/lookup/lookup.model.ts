export class Lookup {
    constructor(
        public id?: number,
        public code?: string,
        public lookupGroup?: string,
        public status ?: number,
        public name?: string,
        public isViewable?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.isViewable = 0;
    }
}

export class LookupPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: Lookup[],
        public error?: string,
        public errCode?: string,
        public errDesc?: string,
    ) {}
}


export class LookupDto {
    constructor(
        public id?: string,
        public lookupGroupString?: string,
        public name?: string,
        public code?: string,
    ) {}
}
