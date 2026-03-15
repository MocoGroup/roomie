import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { HabitRequest, HabitResponse } from '../models/habit';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private readonly apiUrl = `${environment.apiUrl}/api/habits`;

  constructor(private readonly http: HttpClient) {}

  getMyHabits(): Observable<HabitResponse> {
    return this.http.get<HabitResponse>(this.apiUrl);
  }

  saveHabits(dto: HabitRequest): Observable<HabitResponse> {
    return this.http.post<HabitResponse>(this.apiUrl, dto);
  }
}
