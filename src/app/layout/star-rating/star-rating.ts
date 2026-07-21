import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';

type StarType = 'full' | 'half' | 'empty';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div class="star-row" [attr.aria-label]="'Rating: ' + rating + ' out of 5'">
      <!-- define a unique clipPath id per component instance for half-star -->
      <svg style="height:0; width:0; position:absolute" aria-hidden="true">
        <defs>
          <clipPath [attr.id]="halfClipId">
            <!-- clip rect width is 50% to show half star -->
            <rect x="0" y="0" [attr.width]="clipWidth" height="24"></rect>
          </clipPath>
        </defs>
      </svg>

      @for(s of stars; track $index){
        @if(s === 'full'){
          <svg 
             class="star"
             [style.width.px]="size"
             [style.height.px]="size"
             viewBox="0 0 24 24"
             role="img"
             [attr.aria-hidden]="false"
             [attr.aria-label]="'Star '+($index+1)+' of 5 (full)'" >
          <path [attr.d]="starPath" [attr.fill]="color"></path>
        </svg>
        }
        @else if(s === 'half'){
          <svg 
             class="star"
             [style.width.px]="size"
             [style.height.px]="size"
             viewBox="0 0 24 24"
             role="img"
             [attr.aria-hidden]="false"
             [attr.aria-label]="'Star '+($index+1)+' of 5 (half)'" >
          <!-- empty/background -->
          <path [attr.d]="starPath" [attr.fill]="emptyColor"></path>
          <!-- clipped filled part -->
          <g [attr.clip-path]="'url(#' + halfClipId + ')'">
            <path [attr.d]="starPath" [attr.fill]="color"></path>
          </g>
          <!-- outline to keep consistent look -->
          <path [attr.d]="starPath" fill="none" stroke="rgba(0,0,0,0.08)"></path>
        </svg>
      }
      @else if(s === 'empty'){
        <svg 
             class="star"
             [style.width.px]="size"
             [style.height.px]="size"
             viewBox="0 0 24 24"
             role="img"
             [attr.aria-hidden]="false"
             [attr.aria-label]="'Star '+($index+1)+' of 5 (empty)'" >
          <path [attr.d]="starPath" [attr.fill]="emptyColor"></path>
        </svg>
      }
      }

      <!-- optionally show numeric rating -->
       @if(showNumber){ 
      <span class="rating-number">{{ rating | number:'1.1-1' }}</span>
       }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`
    :host { display: inline-block; }
    .star-row { display: inline-flex; align-items: center; gap: 4px; }
    .star { display: inline-block; vertical-align: middle; }
    .rating-number {
      margin-left: 8px;
      color: #221F20;
      font-weight: 600;
      font-size: 0.95rem;
    }
  `]
})
export class StarRatingComponent implements OnChanges {
  /** rating expected between 0 and 5 (may be fractional) */
  @Input() rating: number = 0;

  /** size in px for each star */
  @Input() size = 16;

  /** filled color */
  @Input() color = '#FFC107'; // amber

  /** empty star color (background) */
  @Input() emptyColor = '#E0E0E0';

  /** show numeric value to right */
  @Input() showNumber = false;

  /** internal array of 'full'|'half'|'empty' for ngFor */
  stars: StarType[] = ['empty','empty','empty','empty','empty'];

  /** unique id for clipPath to avoid collisions when multiple components exist */
  halfClipId = 'halfClip-' + Math.random().toString(36).slice(2,9);

  /** star path (5-point star) — keeps visuals crisp in 24x24 viewBox */
  readonly starPath = 'M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z';

  /** clip rect width in px — stays proportional to viewBox (24 wide) */
  clipWidth = 12; // 50% of 24

  ngOnChanges(changes: SimpleChanges): void {
    this.buildStars();
  }

  private buildStars() {
    const r = (this.rating ?? 0);
    const max = 5;
    // Defensive clamping
    const rating = Math.max(0, Math.min(max, Number(r) || 0));

    const full = Math.floor(rating);             // full star count
    const remainder = rating - full;
    const half = remainder >= 0.5 ? 1 : 0;      // half if >= 0.5
    const empty = max - full - half;

    const arr: StarType[] = [];
    for (let i = 0; i < full; i++) arr.push('full');
    if (half) arr.push('half');
    for (let i = 0; i < empty; i++) arr.push('empty');

    // ensure length is exactly 5
    while (arr.length < max) arr.push('empty');
    this.stars = arr.slice(0, max);
  }
}
