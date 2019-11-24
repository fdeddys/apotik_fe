import { Lookup } from '../lookup/lookup.model';
import { Brand } from '../brand/brand.model';
import { ProductGroup } from '../product-group/product-group.model';


export class Product {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,

        public productGroupId?: number,
        public ProductGroup?: ProductGroup,

        public brandId?: number,
        public Brand?: Brand,

        public smallUomId?: number,
        public SmallUom?: Lookup,

        public bigUomId?: number,
        public BigUom?: Lookup,

        public status?: number,
        public qtyStock?: number,
        public qtyUom?: number,
        public hpp?: number,
        public sellPrice?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.qtyUom = 1;
    }
}

export class ProductPageDto {
    constructor(
        public totalRow?: number,
        public page?: number,
        public count?: number,
        public contents?: Product[],
        public error?: string,
    ) {}
}

export class ProductDto {
    constructor(
        public errCode?: string,
        public errDesc?: string,
        public contents?: Product[],
    ) {}
}
