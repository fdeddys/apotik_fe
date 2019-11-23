import { Customer} from '../customer/customer.model';
import { User } from '../user/user.model';

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
    ) {
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

