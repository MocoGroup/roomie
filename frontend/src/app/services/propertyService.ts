import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../models/property';
import { PropertyDetailView } from '../models/property-detail-view';
import { environment } from '../../enviroments/enviroment';


@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private apiUrl = `${environment.apiUrl}/api/properties`;

  constructor(private http:HttpClient){}

  getAll(): Observable<Property[]> {
    return this.http.get<Property[]>(this.apiUrl);
  }

  createProperty(propertyData: any): Observable<any> {
    return this.http.post(this.apiUrl, propertyData, { responseType: 'text' as 'json' });
  }

  getMyProperties(){
    return this.http.get<Property[]>(`${this.apiUrl}/meus`);
  }

  publishProperty(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/publish`, {});
  }

  getAllDetails(): Observable<PropertyDetailView[]> {
    return this.http.get<PropertyDetailView[]>(`${this.apiUrl}/details`);
  }

  getDetailById(id: number): Observable<PropertyDetailView> {
    return this.http.get<PropertyDetailView>(`${this.apiUrl}/${id}/details`);
  }

}

