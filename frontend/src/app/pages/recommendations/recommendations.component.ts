import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {RecommendationService} from '../../services/recommendation.service';
import {HabitService} from '../../services/habit.service';
import {RoommateRecommendation} from '../../models/roommate-recommendation';
import {HabitResponse} from '../../models/habit';
import {HeaderComponent} from '../../components/shared/header/header.component';
import {StudentCardComponent} from '../../components/student-card/student-card.component';
import {FilterPanelComponent} from '../../components/filter-panel/filter-panel.component';
import {DEFAULT_FILTER_STATE, FilterState} from '../../models/filter-state';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, HeaderComponent, StudentCardComponent, FilterPanelComponent],
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.css',
})
export class RecommendationsComponent implements OnInit {
  private readonly recommendationService = inject(RecommendationService);
  private readonly habitService = inject(HabitService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  /** Mapa enum name → label (espelha o backend StudySchedule) */
  private readonly scheduleLabels: Record<string, string> = {
    MORNING: 'manhã',
    AFTERNOON: 'tarde',
    EVENING: 'noite',
    DAWN: 'madrugada',
  };

  /** Lista completa vinda da API (sem os ignorados) */
  allRecommendations: RoommateRecommendation[] = [];

  /** Hábitos do próprio usuário logado — usados como opções de filtro */
  myHabits: HabitResponse | null = null;

  isLoading = true;
  errorMessage = '';
  needsHabits = false;

  /** Estado do painel de filtros */
  filterPanelOpen = false;
  filterState: FilterState = { ...DEFAULT_FILTER_STATE };

  /** Guarda temporariamente a última recomendação ignorada para permitir "Desfazer" */
  lastIgnored: RoommateRecommendation | null = null;

  ngOnInit(): void {
    this.habitService.getMyHabits().subscribe({
      next: h => { this.myHabits = h; this.cdr.markForCheck(); },
      error: () => { /* sem hábitos — filtro ficará vazio */ }
    });
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.recommendationService.getFilteredRecommendations().subscribe({
      next: (data) => {
        this.allRecommendations = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 400) {
          this.needsHabits = true;
          this.errorMessage = '';
        } else if (err.status === 403) {
          this.errorMessage = 'Apenas estudantes podem ver recomendações de colegas.';
        } else {
          this.errorMessage = 'Erro ao carregar recomendações. Tente novamente.';
        }
      }
    });
  }

  // ─── Filtros ────────────────────────────────────────────────────────────────

  get filteredRecommendations(): RoommateRecommendation[] {
    const { majorSearch, minCompatibility, studySchedules, selectedHobbies, selectedLifeStyles, selectedCleaningPrefs } = this.filterState;
    const search = majorSearch.trim().toLowerCase();

    const norm = (s: string) => s.toLowerCase().trim();
    /** Converte enum name (MORNING) ou label (manhã) para label normalizado */
    const normSchedule = (s: string) => this.scheduleLabels[s.toUpperCase().trim()] ?? norm(s);

    return this.allRecommendations.filter(rec => {
      if (search && !rec.major.toLowerCase().includes(search)) return false;
      if (rec.compatibilityPercentage < minCompatibility) return false;
      if (studySchedules.length > 0 && !studySchedules.some(s => normSchedule(s) === normSchedule(rec.studySchedule ?? ''))) return false;
      if (selectedHobbies.length > 0 && !selectedHobbies.every(h => rec.hobbies.some(rh => norm(rh) === norm(h)))) return false;
      if (selectedLifeStyles.length > 0 && !selectedLifeStyles.every(l => rec.lifeStyles.some(rl => norm(rl) === norm(l)))) return false;
      if (selectedCleaningPrefs.length > 0 && !selectedCleaningPrefs.every(c => rec.cleaningPrefs.some(rc => norm(rc) === norm(c)))) return false;
      return true;
    });
  }

  get availableMajors(): string[] {
    return [...new Set(this.allRecommendations.map(r => r.major))].sort();
  }

  get availableStudySchedules(): string[] {
    if (!this.myHabits?.studySchedule) return [];
    const label = this.scheduleLabels[this.myHabits.studySchedule.toUpperCase()] ?? this.myHabits.studySchedule;
    return [label];
  }

  get availableHobbies(): string[] {
    return [...(this.myHabits?.hobbies ?? [])].sort();
  }

  get availableLifeStyles(): string[] {
    return [...(this.myHabits?.lifeStyles ?? [])].sort();
  }

  get availableCleaningPrefs(): string[] {
    return [...(this.myHabits?.cleaningPrefs ?? [])].sort();
  }

  get hasActiveFilters(): boolean {
    return (
      this.filterState.majorSearch.trim() !== '' ||
      this.filterState.minCompatibility > 0 ||
      this.filterState.studySchedules.length > 0 ||
      this.filterState.selectedHobbies.length > 0 ||
      this.filterState.selectedLifeStyles.length > 0 ||
      this.filterState.selectedCleaningPrefs.length > 0
    );
  }

  onFiltersChange(filters: FilterState): void {
    this.filterState = filters;
  }

  toggleFilterPanel(): void {
    this.filterPanelOpen = !this.filterPanelOpen;
  }

  // ─── Ignorar ────────────────────────────────────────────────────────────────

  ignoreRecommendation(rec: RoommateRecommendation): void {
    this.recommendationService.ignoreRecommendation(rec.studentId);
    this.allRecommendations = this.allRecommendations.filter(r => r.studentId !== rec.studentId);
    this.lastIgnored = rec;

    setTimeout(() => {
      if (this.lastIgnored?.studentId === rec.studentId) {
        this.lastIgnored = null;
      }
    }, 5000);
  }

  undoLastIgnore(): void {
    if (this.lastIgnored) {
      this.recommendationService.undoIgnore(this.lastIgnored.studentId);
      this.allRecommendations.push(this.lastIgnored);
      this.allRecommendations.sort((a, b) => b.compatibilityPercentage - a.compatibilityPercentage);
      this.lastIgnored = null;
    }
  }

  clearAllIgnored(): void {
    this.recommendationService.clearIgnored();
    this.loadRecommendations();
  }

  get ignoredCount(): number {
    return this.recommendationService.ignoredCount;
  }

  // ─── Navegação ──────────────────────────────────────────────────────────────

  goBack(): void {
    this.router.navigate(['/home']);
  }

  goToHabits(): void {
    this.router.navigate(['/habits']);
  }
}
