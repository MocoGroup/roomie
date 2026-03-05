import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../enviroments/enviroment';
import { InterestSummary } from '../models/interest-summary';
import { InterestStatus } from '../models/interest-status.enum';

@Injectable({
  providedIn: 'root'
})
export class InterestService {
  private readonly apiUrl = `${environment.apiUrl}/announcements`;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  /**
   * Lista os estudantes interessados em um imóvel.
   * Somente o proprietário do imóvel pode acessar este endpoint.
   * @param propertyId ID do imóvel
   */
  getInterests(propertyId: number): Observable<InterestSummary[]> {
    return this.http
      .get<InterestSummary[]>(`${this.apiUrl}/${propertyId}/interests`)
      .pipe(catchError(err => this.handleError(err)));
  }

  /**
   * Atualiza o status de um interesse (ACCEPTED ou REJECTED).
   * Somente o proprietário do imóvel pode executar esta ação.
   * @param interestId ID do registro de interesse
   * @param status Novo status (ACCEPTED | REJECTED)
   */
  updateInterestStatus(interestId: number, status: InterestStatus): Observable<string> {
    return this.http
      .patch(`${this.apiUrl}/interests/${interestId}/status`, null, {
        params: { status },
        responseType: 'text'
      })
      .pipe(catchError(err => this.handleError(err)));
  }

  /**
   * Registra o interesse de um estudante em um imóvel.
   * Somente estudantes autenticados podem executar esta ação.
   * @param propertyId ID do imóvel
   */
  expressInterest(propertyId: number): Observable<string> {
    return this.http
      .post(`${this.apiUrl}/${propertyId}/interest`, null, { responseType: 'text' })
      .pipe(catchError(err => this.handleError(err)));
  }

  /**
   * Trata erros HTTP de forma centralizada.
   * - 401 Unauthorized → redireciona para /login
   * - 403 Forbidden     → redireciona para /unauthorized e encerra o observable
   * - Outros            → propaga o erro com mensagem amigável
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.router.navigate(['/login']);
      return EMPTY;
    }

    if (error.status === 403) {
      this.router.navigate(['/unauthorized']);
      return EMPTY;
    }

    const message =
      typeof error.error === 'string' && error.error.trim().length > 0
        ? error.error
        : `Erro inesperado (${error.status}). Tente novamente mais tarde.`;

    return throwError(() => new Error(message));
  }
}


