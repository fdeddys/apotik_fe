import { Role } from '../role/role.model';

export class User {
    constructor(
        public id?: number,
        public name?: string,
        public email?: string,
        public status?: string,
        public area?: any,
        public fullName?: string,
        public mobileNo?: string,
        public role?: Role,
        public roleId?: number,
        public isLock?: number,
        public islogged?: number,
        public approvalStatus?: string,
        public lastLoginDate?: string,
        public lastLoginFrom?: string,
        public errCode?: string,
        public errDesc?: string,
        public curPass?: string,
    ) {}
}
