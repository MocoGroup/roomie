import { Injectable, inject } from '@angular/core';
import { Auth } from '../auth/auth';

export interface FavoriteProperty {
  id: number;
  titulo: string;
  preco: number;
  tipo: string;
  bairro: string;
  cidade: string;
  estado: string;
  addedAt: string;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly auth = inject(Auth);

  private getStorageKey(): string | null {
    const user = (this.auth as any).currentUserSubject?.value;
    return user ? `roomie_favorites_${user.id}` : null;
  }

  private loadFavorites(): FavoriteProperty[] {
    const key = this.getStorageKey();
    if (!key) return [];
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveFavorites(favorites: FavoriteProperty[]): void {
    const key = this.getStorageKey();
    if (key) {
      localStorage.setItem(key, JSON.stringify(favorites));
    }
  }

  isFavorite(propertyId: number): boolean {
    return this.loadFavorites().some(f => f.id === propertyId);
  }

  addFavorite(property: FavoriteProperty): void {
    const favorites = this.loadFavorites();
    if (favorites.some(f => f.id === property.id)) return;
    favorites.push({ ...property, addedAt: new Date().toISOString() });
    this.saveFavorites(favorites);
  }

  removeFavorite(propertyId: number): void {
    const favorites = this.loadFavorites().filter(f => f.id !== propertyId);
    this.saveFavorites(favorites);
  }

  toggleFavorite(property: FavoriteProperty): boolean {
    if (this.isFavorite(property.id)) {
      this.removeFavorite(property.id);
      return false;
    }
    this.addFavorite(property);
    return true;
  }

  getAllFavorites(): FavoriteProperty[] {
    return this.loadFavorites();
  }
}
