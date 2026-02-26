import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { UserResponseDto } from '../models/user/user-response.dto';
import { UpdateUserDto } from '../models/user/update-user.dto';
import { OwnerReportView } from '../models/owner-report-view';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) { }

  updateProfile(dto: UpdateUserDto): Observable<UserResponseDto> {
    return this.http.patch<UserResponseDto>(`${this.apiUrl}/profile`, dto);
  }

  getOwnersReport(): Observable<OwnerReportView[]> {
    return this.http.get<OwnerReportView[]>(`${this.apiUrl}/owners/report`);
  }
}
