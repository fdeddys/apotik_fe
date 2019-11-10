export class MerchantGroupFeeInfo {
    constructor(
        public id?: number,
        public processingFeeLookup?: any,
        public processingFeeValue?: number,
        public rentalEdcFee?: number,
        public mdrLookup?: any,
        public mdrEmoneyOnUs?: number,
        public mdrEmoneyOffUs?: number,
        public mdrDebitOnUs?: number,
        public mdrDebitOffUs?: number,
        public mdrCreditOnUs?: number,
        public mdrCreditOffUs?: number,
        public otherFee?: number,
        public fmsFee?: number,
    ) {}
}
