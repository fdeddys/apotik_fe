
export class MerchantOutletWip {
    constructor(
        public id?: number,
        public merchantWIP?: number,
        public merchantName?: number,
        public merchantOutletSign?: string,
        public deviceType?: string,
        public deviceGroup?: string,
        public deviceBrand?: string,
        public terminalLabel?: string,
        public terminalPhoneNumber?: string,
        public terminalProvider?: string,
        public registrationLongitude?: string,
        public registrationLatitude?: string,
        public metodePembayaran?: string,
        public deviceOwnerName?: string,
        public deviceOwnerAddress?: string,
        public hostStatus?: string,
        public errCode?: string,
        public errDesc?: string,
    ) { }
}
