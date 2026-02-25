import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PropertyType } from '../models/property-type.enum';
import { PropertyService } from '../services/propertyService';
import { HeaderComponent } from '../components/shared/header/header.component';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './property-form.html',
  styleUrls: ['./property-form.css']
})
export class PropertyFormComponent implements OnInit {
  propertyForm!: FormGroup;
  propertyTypes = Object.values(PropertyType);
  showImageUpload: boolean = false;
  isSubmitting: boolean = false;
  submitSuccess: boolean = false;
  submitError: string = '';

  selectedFiles: File[] = [];
  imagePreviews: string[] = [];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private propertyService = inject(PropertyService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.propertyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: [''],
      price: [null, [Validators.required, Validators.min(0.01)]],
      availableVacancies: [null, [Validators.required, Validators.min(1)]],
      type: [null, [Validators.required]],

      address: this.fb.group({
        street: ['', Validators.required],
        number: ['', Validators.required],
        district: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]]
      }),

      acceptAnimals: [false],
      gender: ['MIXED']
    });
  }

  toggleImageUpload(): void {
    this.showImageUpload = !this.showImageUpload;
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.selectedFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.propertyForm.valid) {
      this.isSubmitting = true;

      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(this.propertyForm.value)], {
        type: 'application/json'
      }));

      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('photos', this.selectedFiles[i]);
      }

      this.propertyService.createProperty(formData).subscribe({
        next: () => {
          this.submitSuccess = true;
          this.submitError = '';
          this.isSubmitting = false;
          setTimeout(() => this.router.navigate(['/home'], { queryParams: { from: 'create' } }), 1500);
        },
        error: (err) => {
          console.error('Erro ao salvar imóvel:', err);
          this.submitError = 'Erro ao cadastrar o imóvel. Tente novamente mais tarde.';
          this.submitSuccess = false;
          this.isSubmitting = false;
        }
      });
    } else {
      this.propertyForm.markAllAsTouched();
    }
  }


  getLabelForType(type: string): string {
    switch (type) {
      case PropertyType.HOUSE: return 'Casa';
      case PropertyType.APARTMENT: return 'Apartamento';
      case PropertyType.STUDIO: return 'Studio';
      case PropertyType.ROOM: return 'Quarto';
      case PropertyType.DORMITORY: return 'República';
      default: return type;
    }
  }
}
