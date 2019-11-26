import { Customer} from '../customer/customer.model';
import { User } from '../user/user.model';
import { Product } from '../product/product.model';
import { Lookup } from '../lookup/lookup.model';

export class SalesOrder {
    constructor(
        public id?: number,
        public salesOrderNo?: string,
        public orderDate ?: Date,

        public customerId?: number,
        public customer?: Customer,

        public note?: string,
        public tax?: number,
        public total?: number,
        public grandTotal?: number,

        public salesmanId?: number,
        public user?: User,

        public status?: number,
        public top?: number,
        public isCash?: number,
        public detail?: SalesOrderDetail[],
    ) {
        this.id = 0;
        this.top = 0;
        this.tax = 0;
        this.total = 0;
        this.grandTotal = 0;
    }
}

export class SalesOrderPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: SalesOrder[],
        public error?: string,
    ) {}
}

export class SalesOrderDetail {
    constructor(
        public id?: number,
        public salesOrderId?: number,

        public productId?: number,
        public product?: Product,

        public qty?: number,
        public price?: number,
        public disc?: number,

        public uomId?: number,
        public uom?: Lookup,
        public errCode?: string,
        public errDesc?: string,

    ) {
        this.id = 0;
    }
}


export class SalesOrderDetailPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: SalesOrderDetail[],
        public error?: string,
    ) {}
}