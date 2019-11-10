export class MerchantGroupSettlementInfo {
    constructor(
        public id?: number,
        public nomorRekening?: string,
        public namaBankTujuanSettlement?: string,
        public namaPemilikRekening?: string,
        public tipeRekening?: string,
        public reportSettlementConfigLookup?: string,
        public settlementExecutionConfigLookup?: string,
        public sendReportViaLookup?: string,
        public sendReportUrl?: string,
    ) {}
}
