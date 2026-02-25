import { Component, Input, Output, EventEmitter, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../auth/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  /** Exibe o botão "Cadastrar Imóvel" ao lado do avatar */
  @Input() showCreateProperty = true;


  @Output() logoClicked = new EventEmitter<void>();

  private auth = inject(Auth);
  private router = inject(Router);
  private elRef = inject(ElementRef);

  user$ = this.auth.currentUser$;
  isMenuOpen = false;

  /** Fecha o menu ao clicar fora do componente */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  onLogoClick(): void {
    if (this.logoClicked.observers.length > 0) {
      this.logoClicked.emit();
    } else {
      this.router.navigate(['/home']);
    }
  }

  goToProfile(): void {
    this.isMenuOpen = false;
    this.router.navigate(['/profile']);
  }

  goToCreateProperty(): void {
    this.isMenuOpen = false;
    this.router.navigate(['/properties/new']);
  }

  goToStudentProfile(): void {
    this.isMenuOpen = false;
    this.router.navigate(['/student-profile']);
  }

  onLogout(): void {
    this.isMenuOpen = false;
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}


