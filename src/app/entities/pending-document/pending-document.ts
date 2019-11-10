export class PendingDocument {
    constructor(
        public id?: number,
        public merchantId?: string,
        public level?: string,
        public merchantName?: string,
        public documentPendingCode?: string,
        public documentPending?: string,
        public documentPendingData?: string[],
        public latestApproval?: string
    ) { }
}
