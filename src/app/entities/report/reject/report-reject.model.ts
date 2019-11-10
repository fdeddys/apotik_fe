export class ReportReject {
    constructor(
        public submitDate?: string,
        public merchantOutletId?: string,
        public storeName?: string,
        public rejectedBy?: string,
        public rejectDate?: string,
        public rejectCode?: string,
        public notes?: string,
        public agentId?: string,
        public merchantType?: string,
        public deviceType?: string,
    ) { }
}
