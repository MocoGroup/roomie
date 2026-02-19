import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../auth/auth';
import { PropertyType } from '../models/property-type.enum';
import { PropertyService } from '../services/propertyService'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './property-form.html',
  styleUrls: ['./property-form.css']
})
export class PropertyFormComponent implements OnInit {
  propertyForm!: FormGroup;
  propertyTypes = Object.values(PropertyType);

  showImageUpload: boolean = false;
  isSubmitting: boolean = false; 


  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(Auth);
  private propertyService = inject(PropertyService);

  ngOnInit(): void {
    this.propertyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]], 
      description: [''],
      price: [null, [Validators.required, Validators.min(0.01)]], 
      availableVacancies: [null, [Validators.required, Validators.min(1)]], 
      type: [null, [Validators.required]],
      address: this.fb.group({
        street: ['', Validators.required],
        district: ['', Validators.required],
        cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]] 
      }),
      acceptAnimals: [false], 
      gender: ['ANY'] 
    });
  }

  toggleImageUpload(): void {
    this.showImageUpload = !this.showImageUpload;
  }

  // === INTEGRAÇÃO COM O BACK-END ===
  onSubmit(): void {
    if (this.propertyForm.valid) {
      this.isSubmitting = true;
      
      this.propertyService.createProperty(this.propertyForm.value).subscribe({
        next: (response) => {
          alert('Imóvel cadastrado com sucesso!');
          this.isSubmitting = false;
          this.router.navigate(['/home']); 
        },
        error: (err) => {
          console.error('Erro ao salvar imóvel:', err);
          alert('Erro ao cadastrar o imóvel. Tente novamente mais tarde.');
          this.isSubmitting = false;
        }
      });

    } else {
      this.propertyForm.markAllAsTouched();
    }
  }

  goBackHome() {
    this.router.navigate(['/home']);
  }

  goToProfile() {
    alert('Aqui abrirá o Perfil!');
  }

  onLogout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  getLabelForType(type: string): string {
    switch (type) {
      case PropertyType.HOUSE: return 'Casa';
      case PropertyType.APARTMENT: return 'Apartamento';
      case PropertyType.STUDIO: return 'República'; 
      case PropertyType.ROOM: return 'Quarto';
      default: return type;
    }
  }
}