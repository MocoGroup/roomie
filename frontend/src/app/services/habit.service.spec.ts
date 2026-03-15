import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../enviroments/enviroment';
import { HabitRequest, HabitResponse } from '../models/habit';
import { HabitService } from './habit.service';

describe('HabitService', () => {
  let service: HabitService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/api/habits`;

  const mockResponse: HabitResponse = {
    id: 1,
    studySchedule: 'MORNING',
    hobbies: ['Leitura', 'Games'],
    lifeStyles: ['Introvertido'],
    cleaningPrefs: ['Organizado'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HabitService,
      ],
    });
    service = TestBed.inject(HabitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar hábitos do próprio usuário via GET', () => {
    service.getMyHabits().subscribe(result => {
      expect(result).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('deve salvar hábitos via POST e retornar o DTO atualizado', () => {
    const payload: HabitRequest = {
      studySchedule: 'AFTERNOON',
      hobbies: ['Games'],
      lifeStyles: ['Noturno'],
      cleaningPrefs: ['Relaxado'],
    };

    const saved: HabitResponse = {...mockResponse, studySchedule: 'AFTERNOON'};

    service.saveHabits(payload).subscribe(result => {
      expect(result.studySchedule).toBe('AFTERNOON');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(saved);
  });
});
