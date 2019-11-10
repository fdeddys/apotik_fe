export class Lookup {
    constructor(
        public id?: number,
        public code?: string,
        public description?: string,
        public status ?: number,
        public approvalStatusDescription ?: string,
        public latestSuggestion ?: string,
        public latestSuggestor ?: string,
        public latestApproval ?: string,
        public latestApprover ?: string,
        public orderNo?: number,
        public lookupGroupString?: string,
        public name?: string,
        public isAlternateEntry?: boolean,
        public isHighRisk?: boolean,
        public errCode?: string,
        public errDesc?: string,
    ) {}
}
