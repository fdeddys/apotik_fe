

export class Warehouse {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,

        public whIn?: number,
        public whOut ?: number,
        public status ?: number,

        public errCode?: string,
        public errDesc?: string,
    ) {
    }
}
