import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-footer.component.html',
  styleUrl: './input-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFooterComponent {
  readonly helperText = input<string>('');
  readonly helperTextId = input<string | undefined>(undefined);
  readonly helperTextClasses = input<string>('input-helper-text');

  readonly showCharCount = input<boolean>(false);
  readonly maxLength = input<number | undefined>(undefined);
  readonly charCountText = input<string>('');

  readonly shouldShowCharCount = computed(() => this.showCharCount() && !!this.maxLength());
}
