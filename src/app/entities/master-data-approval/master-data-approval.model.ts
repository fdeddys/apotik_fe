export class ApprovalReason {
    constructor(
        public id?: number,
        public masterDataApproval?: any,
        public message?: string,
    ) {}
}

export class MasterDataApproval {
    constructor(
        public id?: number,
        public moduleId?: string,
        public moduleName?: string,
        public masterDataId?: string,
        public name?: string,
        public action?: number,
        public status?: number,
        public latestMakerDate?: Date,
        public latestMaker?: string,
        public latestApprovalDate?: Date,
        public latestApprovalActor?: string,
        public approvalReasons?: ApprovalReason[],
        public jsonApprovalData?: any,
        public errCode?: string,
        public errDesc?: string,
    ) {
        this.approvalReasons = [];
    }
}
