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
