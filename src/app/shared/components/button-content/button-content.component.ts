import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-button-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-content.component.html',
  styleUrls: ['./button-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonContentComponent {
  readonly loading = input<boolean>(false);
  readonly iconLeft = input<string | undefined>(undefined);
  readonly iconRight = input<string | undefined>(undefined);
  readonly iconOnly = input<boolean>(false);
}
