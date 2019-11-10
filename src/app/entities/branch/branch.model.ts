import { Area } from '../area/area.model';

export class Branch {
  constructor(
      public id?: number,
      public name?: string,
      public address?: string,
      public latitude?: number,
      public longitude?: number,
      public description?: string,
      public phoneNumber?: string,
      public area?: Area,
      public status ?: number,
      public approvalStatusDescription ?: string,
      public latestSuggestion ?: string,
      public latestSuggestor ?: string,
      public latestApproval ?: string,
      public latestApprover ?: string,
      public errCode?: string,
      public errDesc?: string,
  ) {}
}
