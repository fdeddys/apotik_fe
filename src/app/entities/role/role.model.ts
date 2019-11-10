export class Role {
    constructor(
        public id?: number,
        public name?: string,
        public code?: string,
        public type?: number,
        public isSuper?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {}
}

export class RoleMenuView {
    constructor(
        public menuId?: number,
        public status?: string,
        public menuDescription?: string,
        public nourut?: number,
    ) {
    }
}
