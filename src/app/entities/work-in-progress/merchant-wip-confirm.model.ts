import { MerchantWip } from './merchant-wip.model';

export class MerchantWipConfirmModel {
    constructor(
        public merchantWIP?: MerchantWip,
        public action?: number,
    ) { }
}
// action
// 0 = approve
// 1 = reject
// 2 = back to verifier

