import type { Meta, StoryObj } from '@storybook/angular';
import { InputFooterComponent } from './input-footer.component';

const meta: Meta<InputFooterComponent> = {
  title: 'Shared/Input/Footer',
  component: InputFooterComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<InputFooterComponent>;

export const Default: Story = {
  args: {
    helperText: 'This is helper text',
    helperTextId: 'helper-1',
    helperTextClasses: 'input-helper-text',
    showCharCount: true,
    maxLength: 20,
    charCountText: '5/20',
  },
};
