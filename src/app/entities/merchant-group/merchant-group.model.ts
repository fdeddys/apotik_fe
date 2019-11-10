import { MerchantGroupFeeInfo } from './merchant-group-fee-info.model';
import { InternalContactPerson } from './internal-contact-person.model';
import { MerchantGroupSettlementInfo } from './merchant-group-settlement-info.model';

export class MerchantGroup {
    constructor(
        public id?: number,
        public tipeMerchantLookup?: any,
        public tipeMerchantLookupName?: string,
        public groupPhoto?: string,
        public merchantGroupName?: string,
        public namaPT?: string,
        public jenisUsahaLookup?: any,
        public jenisUsahaLookupName?: string,
        public alamat?: string,
        public rt?: string,
        public rw?: string,
        public kelurahan?: string,
        public kecamatan?: string,
        public provinsiLookup?: any,
        public kabupatenKota?: any,

        public negara?: string,
        public siup?: string,
        public siupFlag?: string,
        public npwp?: string,
        public npwpFlag?: number,
        public pks?: string,
        public ktpDireksi?: string,
        public ktpPenanggungJawab?: string,
        public aktaPendirian?: string,
        public tandaDaftarPerusahaan?: string,
        public persetujuanMenkumham?: string,
        public picGroup?: string,
        public noTelpPic?: string,
        public emailPic?: string,
        public websitePerusahaan?: string,

        public merchantGroupSettlementInfo?: MerchantGroupSettlementInfo,
        public merchantGroupFeeInfo?: MerchantGroupFeeInfo,
        public internalContactPerson?: InternalContactPerson,

        public status?: string,
        public statusSuspense?: boolean,

        public errCode?: string,
        public errDesc?: string,

        public idMda?: string,
        public postalCode?: string,
    ) {
        this.merchantGroupSettlementInfo = {};
        this.merchantGroupFeeInfo = {};
        this.internalContactPerson = {};
    }
}
