export class ReportFinished {
    constructor(
        public submitDate?: string,
        public merchantOutletId?: string,
        public merchantPan?: string,
        public deviceType?: string,
        public storeName?: string,
        public agentName?: string,
        public agentId?: string,
        public approveDate?: string,
        public approveCode?: string,
        public merchantType?: string,
    ) { }
}
