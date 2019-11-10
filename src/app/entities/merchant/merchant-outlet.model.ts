import { MerchantGroup } from '../merchant-group/merchant-group.model';

export class MerchantOutlet {
    constructor(
        public id?: number,
        public merchant?: number,
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
        public terminalSerialNo?: string,
        public hostType?: string,
        public mid?: string,
        public tid?: string,
        public errCode ?: string,
        public errDesc ?: string,
    ) {}
}
