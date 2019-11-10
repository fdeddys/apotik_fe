export class WilayahConfiguration {
    constructor(
        public id?: number,
        public status?: number,
        public version?: number,
        public level?: string,
        public levelId?: string,
        public name?: string,
        public provinsi?: string,
        public dati2?: string,
        public kecamatan?: string,
        public kelurahan?: string,
        public approvalStatus?: number,
        public latestSuggestion?: string,
        public latestSuggestor?: string,
        public latestApproval?: string,
        public latestApprover?: string,
        public errCode?: string,
        public errDesc?: string,
    ) {}
}
