import { Region } from '../region/region.model';

export class Area {
  constructor(
      public id?: number,
      public region?: Region,
      public regionCode?: string,
      public code?: string,
      public name?: string,
      public latitude?: number,
      public longitude?: number,
      public branchDescription?: string,
      public areaUniqueCode?: string,
      public status ?: number,
      public approvalStatusDescription ?: string,
      public latestSuggestion ?: string,
      public latestSuggestor ?: string,
      public latestApproval ?: string,
      public latestApprover ?: string,
      public orderNo?: number,
      public lookupGroupString?: string,
      public isAlternateEntry?: boolean,
      public isHighRisk?: boolean,
      public errCode?: string,
      public errDesc?: string,
  ) {}
}
