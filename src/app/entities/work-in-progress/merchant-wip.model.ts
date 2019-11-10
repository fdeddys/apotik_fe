import { MerchantGroup } from '../merchant-group/merchant-group.model';
import { MerchantSettlementConfig } from '../merchant/merchant-settlement-config.model';
import { MerchantOutlet } from '../merchant/merchant-outlet.model';
import { MerchantOwner } from '../merchant/merchant-owner.model';
import { MerchantOutletWip } from './merchant-outlet-wip.model';

export class MerchantWip {
    constructor(
        public id?: number,
        public storeName?: string,
        public statusRegistration?: string,
        public merchantGroupId?: number,
        public settlementConfigWIP?: MerchantSettlementConfig,
        public listMerchantOutletWIP?: MerchantOutletWip[],
        public ownerWIP?: MerchantOwner,
        public ktpPath?: string,
        public selfiePath?: string,
        public merchantPhotoPath?: string,
        public merchantPhoto2Path?: string,
        public signPath?: string,
        public logoPath?: string,
        public merchantType?: string,
        public jenisUsaha?: string,
        public jenisUsahaName?: string,
        public alamat?: string,
        public kelurahan?: string,
        public kecamatan?: string,
        public provinsi?: string,
        public provinsiName?: string,
        public kabupatenKota?: string,
        public kabupatenKotaName?: string,
        public postalCode?: string,
        public longitude?: string,
        public latitude?: string,
        public storePhoneNumber?: string,
        public lokasiBisnis?: string,
        public jenisLokasiBisnis?: string,
        public jamOperasional?: string,
        public hostStatus?: string,
        public referralCode?: string,
        public agentName?: string,
        public agentID?: string,
        public institutionID?: string,
        public merchantCategoryCode?: string,
        public merchantOutletID?: string,
        public merchantPan?: string,
        public apiKey?: string,
        public secretID?: string,
        public secretQuestion?: string,
        public secretQuestionAnswer?: string,
        public notes?: string,
        public reason?: string,
        public approvalNote?: string,
        // public approvalStatus?: string,
        public errCode?: string,
        public errDesc?: string,
        public idMerchant?: number,
        public level?: string,
    ) {
        this.level = '0' ;
     }
}

export class MerchantWipQueue {
    constructor(
        public processDate?: string,
        public merchantOutletId?: string,
        public merchantType?: string,
        public storeName?: string,
        public stateName?: string,
        public priority?: string,
        public user?: string,
        public key?: string
    ) { }
}
