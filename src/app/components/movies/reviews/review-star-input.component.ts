import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';

@Component({
  selector: 'app-review-star-input',
  standalone: true,
  template: `
    <div
      class="star-input"
      role="radiogroup"
      [attr.aria-label]="label()"
    >
      @for (star of stars; track star) {
        <button
          type="button"
          class="star"
          role="radio"
          [class.filled]="star <= displayValue()"
          [attr.aria-checked]="star === rating()"
          [attr.aria-label]="star + ' sur 5'"
          (mouseenter)="hovered.set(star)"
          (mouseleave)="hovered.set(0)"
          (focus)="hovered.set(star)"
          (blur)="hovered.set(0)"
          (click)="select(star)"
        >
          ★
        </button>
      }
      <span class="score" [class.visible]="rating() > 0">{{ rating() }}/5</span>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .star-input {
        display: inline-flex;
        align-items: center;
        gap: 2px;
      }

      .star {
        border: 0;
        background: transparent;
        color: #334155;
        font-size: 1.5rem;
        line-height: 1;
        cursor: pointer;
        padding: 0 2px;
        transition: color 0.15s ease, transform 0.15s ease;
      }

      .star:hover,
      .star:focus-visible {
        transform: scale(1.12);
        outline: none;
      }

      .star.filled {
        color: #ffd700;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.35);
      }

      .score {
        margin-left: 10px;
        font-size: 0.8rem;
        font-weight: 600;
        color: #ffd700;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .score.visible {
        opacity: 1;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewStarInputComponent {
  readonly rating = model.required<number>();
  readonly label = input('Votre note');

  readonly stars = [1, 2, 3, 4, 5] as const;
  readonly hovered = signal(0);

  displayValue(): number {
    return this.hovered() || this.rating();
  }

  select(value: number): void {
    this.rating.set(value);
  }
}
