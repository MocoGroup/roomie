import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../auth/auth';
import { StudentService } from '../../services/student.service';
import { HeaderComponent } from '../shared/header/header.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  studentForm!: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private studentService = inject(StudentService);
  private router = inject(Router);

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      institution: ['', [Validators.required, Validators.minLength(3)]],
      major: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.auth.currentUser$.pipe(take(1)).subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      if (!user.id) {
        this.errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
        this.isLoading = false;
        setTimeout(() => {
          this.auth.logout();
          this.router.navigate(['/login']);
        }, 2000);
        return;
      }

      const dto = {
        userId: user.id,
        institution: this.studentForm.value.institution,
        major: this.studentForm.value.major
      };

      // Tenta criar; se já existir, atualiza
      this.studentService.createProfile(dto).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Perfil de estudante salvo com sucesso!';
        },
        error: () => {
          // Perfil já existe — tenta atualizar
          this.studentService.updateProfile(dto).subscribe({
            next: () => {
              this.isLoading = false;
              this.successMessage = 'Perfil de estudante atualizado com sucesso!';
            },
            error: () => {
              this.isLoading = false;
              this.errorMessage = 'Erro ao salvar perfil de estudante. Tente novamente.';
            }
          });
        }
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}

