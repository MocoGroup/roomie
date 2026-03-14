import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../enviroments/enviroment';
import { InterestSummary } from '../models/interest-summary';
import { InterestStatus } from '../models/interest-status.enum';
import { PropertyDetailView } from '../models/property-detail-view';

export interface AnnouncementConfirmationResponse {
  id: number;
  status: string;
  confirmedStudentId: number;
  message: string;
}

export interface AnnouncementLocalState {
  properties: PropertyDetailView[];
  interestsMap: Map<number, InterestSummary[]>;
}

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
   * Confirma um estudante para uma vaga de um anúncio.
   * @param propertyId ID do imóvel/anúncio
   * @param studentId ID do estudante confirmado
   */
  confirmAnnouncement(propertyId: number, studentId: number): Observable<AnnouncementConfirmationResponse> {
    return this.http
      .patch<AnnouncementConfirmationResponse>(`${this.apiUrl}/${propertyId}/confirm`, null, {
        params: { studentId }
      })
      .pipe(catchError(err => this.handleError(err)));
  }

  /**
   * Atualiza estado local da vaga após confirmação, sem nova requisição de listagem.
   */
  applyConfirmationLocalState(
    properties: PropertyDetailView[],
    interestsMap: Map<number, InterestSummary[]>,
    propertyId: number,
    confirmedStudentId: number
  ): AnnouncementLocalState {
    const updatedProperties = properties.map(property => {
      if (property.idImovel !== propertyId) return property;
      return {
        ...property,
        status: 'RENTED',
        vagasDisponiveis: 0
      };
    });

    const updatedInterestsMap = new Map(interestsMap);
    const interests = updatedInterestsMap.get(propertyId);
    if (interests) {
      updatedInterestsMap.set(
        propertyId,
        interests.map(interest => {
          if (interest.studentId !== confirmedStudentId) return interest;
          return {
            ...interest,
            status: InterestStatus.ACCEPTED
          };
        })
      );
    }

    return {
      properties: updatedProperties,
      interestsMap: updatedInterestsMap
    };
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


