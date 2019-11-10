export class ReportSLA {
    constructor(
        public id?: number,
        public submitDate?: string,
        public merchantOutletId?: number,
        public storeName?: string,
        public deviceType?: string,
        public merchantType?: string,
        public verifier?: string,
        public verifyDuration?: number,
        public approver?: string,
        public approveDuration?: number,
        public edder?: string,
        public eddDuration?: number,
    ) { }
}
