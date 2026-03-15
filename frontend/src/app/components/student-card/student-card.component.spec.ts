import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoommateRecommendation } from '../../models/roommate-recommendation';
import { StudentCardComponent } from './student-card.component';

const base: RoommateRecommendation = {
  studentId: 1,
  name: 'Alice Souza',
  major: 'Ciência da Computação',
  compatibilityPercentage: 80,
  commonInterests: ['Leitura'],
  studySchedule: 'manhã',
  hobbies: ['Games'],
  lifeStyles: ['Introvertido'],
  cleaningPrefs: ['Organizado'],
};

function make(patch: Partial<RoommateRecommendation> = {}): RoommateRecommendation {
  return {...base, ...patch};
}

describe('StudentCardComponent', () => {
  let component: StudentCardComponent;
  let fixture: ComponentFixture<StudentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentCardComponent);
    component = fixture.componentInstance;
    component.recommendation = make();
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('initial deve retornar primeira letra do nome em maiúsculo', () => {
    expect(component.initial).toBe('A');
  });

  describe('compatibilityColor', () => {
    it('>= 75 → verde', () => {
      component.recommendation = make({compatibilityPercentage: 75});
      expect(component.compatibilityColor).toBe('#16a34a');
    });

    it('>= 50 e < 75 → amarelo/laranja', () => {
      component.recommendation = make({compatibilityPercentage: 60});
      expect(component.compatibilityColor).toBe('#d97706');
    });

    it('>= 25 e < 50 → laranja', () => {
      component.recommendation = make({compatibilityPercentage: 30});
      expect(component.compatibilityColor).toBe('#ea580c');
    });

    it('< 25 → cinza', () => {
      component.recommendation = make({compatibilityPercentage: 10});
      expect(component.compatibilityColor).toBe('#9ca3af');
    });
  });

  describe('compatibilityGradient', () => {
    it('>= 75 → gradiente verde', () => {
      component.recommendation = make({compatibilityPercentage: 90});
      expect(component.compatibilityGradient).toContain('#16a34a');
    });

    it('>= 50 e < 75 → gradiente âmbar', () => {
      component.recommendation = make({compatibilityPercentage: 55});
      expect(component.compatibilityGradient).toContain('#d97706');
    });

    it('>= 25 e < 50 → gradiente laranja', () => {
      component.recommendation = make({compatibilityPercentage: 40});
      expect(component.compatibilityGradient).toContain('#ea580c');
    });

    it('< 25 → gradiente cinza', () => {
      component.recommendation = make({compatibilityPercentage: 5});
      expect(component.compatibilityGradient).toContain('#9ca3af');
    });
  });

  it('onIgnore deve emitir a recomendação e parar propagação do evento', () => {
    const emitted: RoommateRecommendation[] = [];
    component.ignore.subscribe(r => emitted.push(r));

    const mockEvent = {stopPropagation: jest.fn()} as unknown as MouseEvent;
    component.onIgnore(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toEqual(component.recommendation);
  });
});
