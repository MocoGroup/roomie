import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

export interface StudentProfileDto {
  userId: number;
  major: string;
  institution: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/api/students`;

  constructor(private http: HttpClient) {}

  createProfile(dto: StudentProfileDto): Observable<string> {
    return this.http.post(`${this.apiUrl}/profile`, dto, { responseType: 'text' });
  }

  updateProfile(dto: StudentProfileDto): Observable<string> {
    return this.http.put(`${this.apiUrl}/profile`, dto, { responseType: 'text' });
  }
}

