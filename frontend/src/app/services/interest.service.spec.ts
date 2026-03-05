import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { InterestService } from './interest.service';
import { InterestStatus } from '../models/interest-status.enum';
import { InterestSummary } from '../models/interest-summary';
import { environment } from '../../enviroments/enviroment';

describe('InterestService', () => {
  let service: InterestService;
  let httpMock: HttpTestingController;
  let router: Router;

  const BASE = `${environment.apiUrl}/announcements`;

  const mockInterests: InterestSummary[] = [
    {
      interestId: 1,
      studentId: 10,
      studentName: 'Maria Silva',
      major: 'Ciência da Computação',
      institution: 'UFAPE',
      status: InterestStatus.PENDING,
      interestDate: '2026-03-05T10:00:00'
    },
    {
      interestId: 2,
      studentId: 11,
      studentName: 'João Santos',
      major: 'Engenharia Civil',
      institution: 'UFPE',
      status: InterestStatus.ACCEPTED,
      interestDate: '2026-03-04T08:30:00'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InterestService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });

    service = TestBed.inject(InterestService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  // ── getInterests ────

  describe('getInterests()', () => {
    it('deve fazer GET em /announcements/{id}/interests e retornar lista de interessados', () => {
      service.getInterests(42).subscribe(interests => {
        expect(interests).toEqual(mockInterests);
        expect(interests.length).toBe(2);
      });

      const req = httpMock.expectOne(`${BASE}/42/interests`);
      expect(req.request.method).toBe('GET');
      req.flush(mockInterests);
    });

    it('deve redirecionar para /login ao receber 401', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

      service.getInterests(1).subscribe({ next: () => {}, error: () => {} });

      const req = httpMock.expectOne(`${BASE}/1/interests`);
      req.flush('Não autorizado', { status: 401, statusText: 'Unauthorized' });

      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });

    it('deve redirecionar para /unauthorized ao receber 403', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

      service.getInterests(1).subscribe({ next: () => {}, error: () => {} });

      const req = httpMock.expectOne(`${BASE}/1/interests`);
      req.flush('Acesso negado', { status: 403, statusText: 'Forbidden' });

      expect(navigateSpy).toHaveBeenCalledWith(['/unauthorized']);
    });

    it('deve propagar o erro com mensagem amigável (fallback) quando o body está vazio', () => {
      let receivedError: Error | undefined;

      service.getInterests(1).subscribe({
        next: () => {},
        error: (err: Error) => { receivedError = err; }
      });

      const req = httpMock.expectOne(`${BASE}/1/interests`);
      req.flush('', { status: 500, statusText: 'Server Error' });

      expect(receivedError).toBeDefined();
      expect(receivedError!.message).toContain('500');
    });

    it('deve usar a mensagem de erro do backend quando disponível', () => {
      let receivedError: Error | undefined;
      const backendMessage = 'Imóvel não encontrado.';

      service.getInterests(99).subscribe({
        next: () => {},
        error: (err: Error) => { receivedError = err; }
      });

      const req = httpMock.expectOne(`${BASE}/99/interests`);
      req.flush(backendMessage, { status: 404, statusText: 'Not Found' });

      expect(receivedError!.message).toBe(backendMessage);
    });
  });

  // ── updateInterestStatus ────

  describe('updateInterestStatus()', () => {
    it('deve fazer PATCH em /announcements/interests/{id}/status com query param', () => {
      service.updateInterestStatus(5, InterestStatus.ACCEPTED).subscribe(msg => {
        expect(msg).toBe('Status atualizado');
      });

      const req = httpMock.expectOne(r =>
        r.url === `${BASE}/interests/5/status` &&
        r.params.get('status') === 'ACCEPTED'
      );
      expect(req.request.method).toBe('PATCH');
      req.flush('Status atualizado');
    });

    it('deve fazer PATCH com status REJECTED', () => {
      service.updateInterestStatus(7, InterestStatus.REJECTED).subscribe();

      const req = httpMock.expectOne(r =>
        r.url === `${BASE}/interests/7/status` &&
        r.params.get('status') === 'REJECTED'
      );
      expect(req.request.method).toBe('PATCH');
      req.flush('Status atualizado');
    });

    it('deve redirecionar para /login ao receber 401', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

      service.updateInterestStatus(1, InterestStatus.ACCEPTED).subscribe({ next: () => {}, error: () => {} });

      const req = httpMock.expectOne(r => r.url === `${BASE}/interests/1/status`);
      req.flush('Não autorizado', { status: 401, statusText: 'Unauthorized' });

      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });

    it('deve redirecionar para /unauthorized ao receber 403', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

      service.updateInterestStatus(1, InterestStatus.ACCEPTED).subscribe({ next: () => {}, error: () => {} });

      const req = httpMock.expectOne(r => r.url === `${BASE}/interests/1/status`);
      req.flush('Apenas o dono pode alterar', { status: 403, statusText: 'Forbidden' });

      expect(navigateSpy).toHaveBeenCalledWith(['/unauthorized']);
    });
  });

  // ── expressInterest ───

  describe('expressInterest()', () => {
    it('deve fazer POST em /announcements/{id}/interest', () => {
      service.expressInterest(3).subscribe(msg => {
        expect(msg).toBe('Interesse registrado com sucesso. O administrador foi notificado.');
      });

      const req = httpMock.expectOne(`${BASE}/3/interest`);
      expect(req.request.method).toBe('POST');
      req.flush('Interesse registrado com sucesso. O administrador foi notificado.');
    });

    it('deve redirecionar para /login ao receber 401', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

      service.expressInterest(3).subscribe({ next: () => {}, error: () => {} });

      const req = httpMock.expectOne(`${BASE}/3/interest`);
      req.flush('Não autorizado', { status: 401, statusText: 'Unauthorized' });

      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });

    it('deve redirecionar para /unauthorized ao receber 403 (estudante tentando acionar como dono)', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

      service.expressInterest(3).subscribe({ next: () => {}, error: () => {} });

      const req = httpMock.expectOne(`${BASE}/3/interest`);
      req.flush('Apenas estudantes podem demonstrar interesse', { status: 403, statusText: 'Forbidden' });

      expect(navigateSpy).toHaveBeenCalledWith(['/unauthorized']);
    });

    it('deve propagar erro de conflito (409) com mensagem do backend', () => {
      let receivedError: Error | undefined;
      const backendMessage = 'Você já demonstrou interesse neste imóvel.';

      service.expressInterest(3).subscribe({
        next: () => {},
        error: (err: Error) => { receivedError = err; }
      });

      const req = httpMock.expectOne(`${BASE}/3/interest`);
      req.flush(backendMessage, { status: 409, statusText: 'Conflict' });

      expect(receivedError!.message).toBe(backendMessage);
    });
  });
});

