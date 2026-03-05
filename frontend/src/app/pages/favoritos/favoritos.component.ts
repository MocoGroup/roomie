import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FavoritesService, FavoriteProperty } from '../../services/favorites.service';
import { HeaderComponent } from '../../components/shared/header/header.component';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css',
})
export class FavoritosComponent implements OnInit {
  private readonly favoritesService = inject(FavoritesService);
  private readonly router = inject(Router);

  favorites: FavoriteProperty[] = [];

  ngOnInit(): void {
    this.favorites = this.favoritesService.getAllFavorites();
  }

  goToDetail(id: number): void {
    this.router.navigate(['/details', id]);
  }

  removeFavorite(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.favoritesService.removeFavorite(id);
    this.favorites = this.favoritesService.getAllFavorites();
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  typeLabel(type?: string): string {
    const map: Record<string, string> = {
      HOUSE: 'Casa', APARTMENT: 'Apartamento', STUDIO: 'Studio',
      ROOM: 'Quarto Individual', DORMITORY: 'Dormitório',
    };
    return type ? (map[type] ?? type) : '—';
  }
}
