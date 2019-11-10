import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Lookup } from '../lookup/lookup.model';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { LookupGroup } from './lookup-group.model';
import { tap, map } from 'rxjs/operators';
import { EntityResponseType } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class LookupGroupService {
  private dataSource = new BehaviorSubject<string>("");
  dataSharing = this.dataSource.asObservable();

  
  private serverUrl = SERVER_PATH + 'lookup-group';

  constructor(private http: HttpClient) { }

  save(lookupGroup: LookupGroup): Observable<EntityResponseType> {

    lookupGroup.name = lookupGroup.name.toUpperCase(); //convert to Uppercase

    const copy = this.convert(lookupGroup);

    return this.http.post<LookupGroup>(`${this.serverUrl}`, copy, { observe: 'response'})
        .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
  }

  sendData(groupCode: string){
    this.dataSource.next(groupCode);
  }

  filter(req?: any): Observable<HttpResponse<Lookup[]>> {
    let pageNumber = null;
		let pageCount = null;
		let newResourceUrl = null;
		let result = null;

    Object.keys(req).forEach((key)=>{
      if(key==='page'){
        pageNumber = req[key];
      }
      if(key==='count'){
        pageCount = req[key];
      }
    });

    newResourceUrl = this.serverUrl + `/filter/page/${pageNumber}/count/${pageCount}`;
    result= this.http.post<LookupGroup[]>(newResourceUrl, req['filter'],
      { observe: 'response' });
    return result;
  }

  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: LookupGroup = this.convertItemFromServer(res.body);
    return res.clone({body});
  }

  private convertItemFromServer(lookupGroup: LookupGroup): LookupGroup {
    const copyOb: LookupGroup = Object.assign({}, lookupGroup);
    return copyOb;
  }

  private convert( lookupGroup: LookupGroup): LookupGroup {
    const copy: LookupGroup = Object.assign({}, lookupGroup);
    return copy;
  }


}
