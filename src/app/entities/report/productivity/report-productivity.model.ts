export class ReportProductivity {
    constructor(
        public proccessDate?: string,
        public userName?: string,
        public roleName?: string,
        public total?: string,
        public statusName?: string,
    ) { }
}

export class ReportProductivityView {
    constructor(
        public proccessDate?: string,
        public userName?: string,
        public roleName?: string,
        public verified?: number,
        public approved?: number,
        public rejected?: number,
    ) { }
}
