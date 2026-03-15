import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DEFAULT_FILTER_STATE, FilterState } from '../../models/filter-state';
import { FilterPanelComponent } from './filter-panel.component';

describe('FilterPanelComponent', () => {
  let component: FilterPanelComponent;
  let fixture: ComponentFixture<FilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterPanelComponent);
    component = fixture.componentInstance;
    component.availableMajors = ['BCC', 'Letras', 'Pedagogia', 'Física', 'Química', 'Matemática', 'Biologia'];
    component.availableStudySchedules = ['manhã'];
    component.availableHobbies = ['Games', 'Leitura'];
    component.availableLifeStyles = ['Introvertido', 'Noturno'];
    component.availableCleaningPrefs = ['Organizado', 'Relaxado'];
    component.filters = {...DEFAULT_FILTER_STATE};
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  describe('visibleMajors', () => {
    it('deve exibir no máximo 5 cursos por padrão', () => {
      expect(component.visibleMajors.length).toBe(5);
    });

    it('deve exibir todos os cursos quando showAllMajors = true', () => {
      component.showAllMajors = true;
      expect(component.visibleMajors.length).toBe(7);
    });
  });

  describe('hiddenMajorsCount', () => {
    it('deve retornar diferença entre total e limite', () => {
      expect(component.hiddenMajorsCount).toBe(2);
    });

    it('deve retornar 0 quando não há cursos ocultos', () => {
      component.availableMajors = ['BCC', 'Letras'];
      expect(component.hiddenMajorsCount).toBe(0);
    });
  });

  describe('isSelected', () => {
    it('deve retornar false para valor não selecionado', () => {
      expect(component.isSelected('selectedHobbies', 'Games')).toBe(false);
    });

    it('deve retornar true para valor selecionado', () => {
      component.local = {...component.local, selectedHobbies: ['Games']};
      expect(component.isSelected('selectedHobbies', 'Games')).toBe(true);
    });
  });

  describe('toggle', () => {
    it('deve adicionar valor quando não estiver selecionado', () => {
      const emitted: FilterState[] = [];
      component.filtersChange.subscribe(f => emitted.push(f));

      component.toggle('selectedHobbies', 'Games');

      expect(component.local.selectedHobbies).toContain('Games');
      expect(emitted.length).toBe(1);
    });

    it('deve remover valor quando já estiver selecionado', () => {
      component.local = {...component.local, selectedHobbies: ['Games']};
      component.toggle('selectedHobbies', 'Games');

      expect(component.local.selectedHobbies).not.toContain('Games');
    });

    it('deve emitir ao alternar horário de estudo', () => {
      const emitted: FilterState[] = [];
      component.filtersChange.subscribe(f => emitted.push(f));

      component.toggle('studySchedules', 'manhã');

      expect(emitted.length).toBe(1);
      expect(emitted[0].studySchedules).toContain('manhã');
    });
  });

  describe('hasActiveFilters', () => {
    it('deve retornar false com estado padrão', () => {
      expect(component.hasActiveFilters).toBe(false);
    });

    it('deve retornar true quando há hobby selecionado', () => {
      component.local = {...component.local, selectedHobbies: ['Games']};
      expect(component.hasActiveFilters).toBe(true);
    });

    it('deve retornar true quando há compatibilidade mínima', () => {
      component.local = {...component.local, minCompatibility: 50};
      expect(component.hasActiveFilters).toBe(true);
    });

    it('deve retornar true quando há busca por curso', () => {
      component.local = {...component.local, majorSearch: 'bcc'};
      expect(component.hasActiveFilters).toBe(true);
    });
  });

  describe('onMajorChange', () => {
    it('deve atualizar majorSearch e emitir', () => {
      const emitted: FilterState[] = [];
      component.filtersChange.subscribe(f => emitted.push(f));

      component.onMajorChange('engenharia');

      expect(component.local.majorSearch).toBe('engenharia');
      expect(emitted[0].majorSearch).toBe('engenharia');
    });
  });

  describe('onCompatibilityChange', () => {
    it('deve atualizar minCompatibility e emitir', () => {
      const emitted: FilterState[] = [];
      component.filtersChange.subscribe(f => emitted.push(f));

      component.onCompatibilityChange(75);

      expect(component.local.minCompatibility).toBe(75);
      expect(emitted[0].minCompatibility).toBe(75);
    });
  });

  it('clearFilters deve resetar os filtros e emitir estado vazio', () => {
    component.local = {
      ...DEFAULT_FILTER_STATE,
      selectedHobbies: ['Games'],
      minCompatibility: 50,
    };
    const emitted: FilterState[] = [];
    component.filtersChange.subscribe(f => emitted.push(f));

    component.clearFilters();

    expect(component.local.selectedHobbies).toEqual([]);
    expect(component.local.minCompatibility).toBe(0);
    expect(emitted.length).toBe(1);
  });

  it('ngOnChanges deve sincronizar local com filters de entrada', () => {
    const newFilters: FilterState = {
      ...DEFAULT_FILTER_STATE,
      selectedHobbies: ['Leitura'],
      minCompatibility: 50,
    };

    component.filters = newFilters;
    component.ngOnChanges({filters: {currentValue: newFilters, previousValue: DEFAULT_FILTER_STATE, firstChange: false, isFirstChange: () => false}});

    expect(component.local.selectedHobbies).toContain('Leitura');
    expect(component.local.minCompatibility).toBe(50);
  });
});
