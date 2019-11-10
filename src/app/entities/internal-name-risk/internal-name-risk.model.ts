
export class InternalNameRisk {
    constructor(
        public id?: number,
        public name?: string,
        public idNumber?: string,
        public idType?: string,
        public birthDate?: string,
        public storeName?: string,
        public mobileNo?: string,
        public approvalStatusDescription?: string,
        public latestSuggestion?: string,
        public latestSuggestor?: string,
        public latestApproval?: string,
        public latestApprover?: string,
        public errCode?: string,
        public errDesc?: string,
        public imei?: string,
    ) { }
}
