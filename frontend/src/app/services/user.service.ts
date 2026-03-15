import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OwnerReportView } from '../models/owner-report-view';
import { UpdateUserDto } from '../models/user/update-user.dto';
import { UserResponseDto } from '../models/user/user-response.dto';

import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/api/user`;

  constructor(private readonly http: HttpClient) {
  }

  updateProfile(dto: UpdateUserDto): Observable<UserResponseDto> {
    return this.http.patch<UserResponseDto>(`${this.apiUrl}/profile`, dto);
  }

  getOwnersReport(): Observable<OwnerReportView[]> {
    return this.http.get<OwnerReportView[]>(`${this.apiUrl}/owners/report`);
  }
}
