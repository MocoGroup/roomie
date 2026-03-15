import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { EvaluationRequest, EvaluationResponse, EvaluationSummary } from '../models/evaluation.model';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private readonly apiUrl = `${environment.apiUrl}/api/properties`;

  constructor(private readonly http: HttpClient) {}

  getEvaluations(propertyId: number): Observable<EvaluationSummary> {
    return this.http.get<EvaluationSummary>(`${this.apiUrl}/${propertyId}/evaluations`);
  }

  createEvaluation(propertyId: number, data: EvaluationRequest): Observable<EvaluationResponse> {
    return this.http.post<EvaluationResponse>(`${this.apiUrl}/${propertyId}/evaluations`, data);
  }

  hasEvaluated(propertyId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${propertyId}/evaluations/check`);
  }
}
