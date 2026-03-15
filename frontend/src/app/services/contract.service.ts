import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { ContractRequest, ContractResponse } from '../models/contract.model';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private readonly apiUrl = `${environment.apiUrl}/api/contracts`;

  constructor(private readonly http: HttpClient) {}

  createContract(request: ContractRequest): Observable<ContractResponse> {
    return this.http.post<ContractResponse>(this.apiUrl, request);
  }

  acceptContract(contractId: number): Observable<ContractResponse> {
    return this.http.patch<ContractResponse>(`${this.apiUrl}/${contractId}/accept`, {});
  }

  rejectContract(contractId: number): Observable<ContractResponse> {
    return this.http.patch<ContractResponse>(`${this.apiUrl}/${contractId}/reject`, {});
  }

  getContractsByChat(chatId: number): Observable<ContractResponse[]> {
    return this.http.get<ContractResponse[]>(`${this.apiUrl}/chat/${chatId}`);
  }
}
