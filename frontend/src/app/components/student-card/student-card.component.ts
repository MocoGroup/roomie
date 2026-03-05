import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoommateRecommendation } from '../../models/roommate-recommendation';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-card.component.html',
  styleUrl: './student-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCardComponent {
  @Input() recommendation!: RoommateRecommendation;
  @Output() ignore = new EventEmitter<RoommateRecommendation>();

  get initial(): string {
    return this.recommendation.name.charAt(0).toUpperCase();
  }

  get compatibilityColor(): string {
    const pct = this.recommendation.compatibilityPercentage;
    if (pct >= 75) return '#16a34a';
    if (pct >= 50) return '#d97706';
    if (pct >= 25) return '#ea580c';
    return '#9ca3af';
  }

  get compatibilityGradient(): string {
    const pct = this.recommendation.compatibilityPercentage;
    if (pct >= 75) return 'linear-gradient(90deg, #16a34a, #22c55e)';
    if (pct >= 50) return 'linear-gradient(90deg, #d97706, #fbbf24)';
    if (pct >= 25) return 'linear-gradient(90deg, #ea580c, #fb923c)';
    return 'linear-gradient(90deg, #9ca3af, #d1d5db)';
  }

  onIgnore(event: MouseEvent): void {
    event.stopPropagation();
    this.ignore.emit(this.recommendation);
  }
}
