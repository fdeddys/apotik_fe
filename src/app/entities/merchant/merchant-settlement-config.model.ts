export class MerchantSettlementConfig {
    constructor(
        public id?: number,
        public settlementConfig?: string,
        public settlementConfigName?: string,
        public noRekeningToko?: string,
        public namaBankTujuanSettlement?: string,
        public namaPemilikRekening?: string,
        public tipeRekening?: string,
        public reportSettlementConfig?: string,
        public reportSettlementConfigName?: string,
        public settlementExecutionConfig?: string,
        public settlementExecutionConfigName?: string,
        public sendReportVia?: string,
        public sendReportUrl?: string,
        public processingConfiguration?: string,
        public processingConfigurationName?: string,
        public processingFee?: string,
        public processingFeeValue?: number,
        public rentalEdcFee?: number,
        public mdr?: string,
        public mdrEmoneyOnUs?: number,
        public mdrEmoneyOffUs?: number,
        public mdrDebitOnUs?: number,
        public mdrDebitOffUs?: number,
        public mdrCreditOnUs?: number,
        public mdrCreditOffUs?: number,
        public otherFee?: number,
        public fmsFee?: number,
        public status?: number,
        public errCode?: string,
        public errDesc?: string,
    ) { }
}
