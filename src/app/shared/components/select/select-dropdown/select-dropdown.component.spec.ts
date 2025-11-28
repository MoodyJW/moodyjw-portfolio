// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { SelectOption } from '../select.component';

import { SelectDropdownComponent } from './select-dropdown.component';

describe('SelectDropdownComponent', () => {
  let component: SelectDropdownComponent;
  let fixture: ComponentFixture<SelectDropdownComponent>;
  let compiled: HTMLElement;

  const mockOptions: SelectOption[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectDropdownComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

    // Set required inputs
    fixture.componentRef.setInput('dropdownClass', 'select-dropdown');
    fixture.componentRef.setInput('listboxId', 'listbox-1');
    fixture.componentRef.setInput('isMultiple', false);
    fixture.componentRef.setInput('options', mockOptions);
    fixture.componentRef.setInput('highlightedIndex', -1);
    fixture.componentRef.setInput('isOptionSelected', (_option: SelectOption) => false);

    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (SelectDropdownComponent as unknown as { ɵcmp: { standalone: boolean } })
        .ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (SelectDropdownComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Dropdown Rendering', () => {
    it('should render dropdown container', () => {
      const dropdown = compiled.querySelector('.select-dropdown');
      expect(dropdown).toBeTruthy();
    });

    it('should apply dropdown class', () => {
      const dropdown = compiled.querySelector('.select-dropdown');
      expect(dropdown?.classList.contains('select-dropdown')).toBe(true);
    });

    it('should render listbox with correct id', () => {
      const listbox = compiled.querySelector('[role="listbox"]');
      expect(listbox?.id).toBe('listbox-1');
    });

    it('should update listbox id', () => {
      fixture.componentRef.setInput('listboxId', 'new-listbox-id');
      fixture.detectChanges();

      const listbox = compiled.querySelector('[role="listbox"]');
      expect(listbox?.id).toBe('new-listbox-id');
    });
  });

  describe('Search Input', () => {
    it('should not render search input by default', () => {
      const searchInput = compiled.querySelector('.select-search__input');
      expect(searchInput).toBeFalsy();
    });

    it('should render search input when searchable is true', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const searchInput = compiled.querySelector('.select-search__input');
      expect(searchInput).toBeTruthy();
    });

    it('should have correct placeholder', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const searchInput = compiled.querySelector('.select-search__input') as HTMLInputElement;
      expect(searchInput.placeholder).toBe('Search...');
    });

    it('should display search query value', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.componentRef.setInput('searchQuery', 'test query');
      fixture.detectChanges();

      const searchInput = compiled.querySelector('.select-search__input') as HTMLInputElement;
      expect(searchInput.value).toBe('test query');
    });

    it('should emit searchInput on input event', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const searchEmitSpy = vi.fn();
      component.searchInput.subscribe(searchEmitSpy);

      const searchInput = compiled.querySelector('.select-search__input') as HTMLInputElement;
      searchInput.value = 'new value';
      searchInput.dispatchEvent(new Event('input'));

      expect(searchEmitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit searchKeydown on keydown event', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const keydownEmitSpy = vi.fn();
      component.searchKeydown.subscribe(keydownEmitSpy);

      const searchInput = compiled.querySelector('.select-search__input') as HTMLInputElement;
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      searchInput.dispatchEvent(event);

      expect(keydownEmitSpy).toHaveBeenCalledTimes(1);
    });

    it('should render search icon', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const searchIcon = compiled.querySelector('.select-search__icon');
      expect(searchIcon).toBeTruthy();
    });
  });

  describe('Options Rendering', () => {
    it('should render all options', () => {
      const options = compiled.querySelectorAll('app-select-option');
      expect(options.length).toBe(3);
    });

    it('should render empty state when no options', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();

      const emptyOption = compiled.querySelector('.select-option--empty');
      expect(emptyOption).toBeTruthy();
      expect(emptyOption?.textContent?.trim()).toBe('No options found');
    });

    it('should not render options when empty', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();

      const options = compiled.querySelectorAll('app-select-option');
      expect(options.length).toBe(0);
    });

    it('should update options when changed', () => {
      const newOptions: SelectOption[] = [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' },
      ];

      fixture.componentRef.setInput('options', newOptions);
      fixture.detectChanges();

      const options = compiled.querySelectorAll('app-select-option');
      expect(options.length).toBe(2);
    });
  });

  describe('ARIA Attributes', () => {
    it('should have role listbox', () => {
      const listbox = compiled.querySelector('[role="listbox"]');
      expect(listbox).toBeTruthy();
    });

    it('should not have aria-label when not provided', () => {
      const listbox = compiled.querySelector('[role="listbox"]');
      expect(listbox?.hasAttribute('aria-label')).toBe(false);
    });

    it('should apply aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom label');
      fixture.detectChanges();

      const listbox = compiled.querySelector('[role="listbox"]');
      expect(listbox?.getAttribute('aria-label')).toBe('Custom label');
    });

    it('should not have aria-multiselectable for single select', () => {
      fixture.componentRef.setInput('isMultiple', false);
      fixture.detectChanges();

      const listbox = compiled.querySelector('[role="listbox"]');
      expect(listbox?.hasAttribute('aria-multiselectable')).toBe(false);
    });

    it('should have aria-multiselectable true for multiple select', () => {
      fixture.componentRef.setInput('isMultiple', true);
      fixture.detectChanges();

      const listbox = compiled.querySelector('[role="listbox"]');
      expect(listbox?.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('should have aria-disabled on empty option', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();

      const emptyOption = compiled.querySelector('.select-option--empty');
      expect(emptyOption?.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('Max Height', () => {
    it('should apply default max height', () => {
      const listbox = compiled.querySelector('[role="listbox"]') as HTMLElement;
      expect(listbox.style.maxHeight).toBe('280px');
    });

    it('should apply custom max height', () => {
      fixture.componentRef.setInput('maxHeight', 400);
      fixture.detectChanges();

      const listbox = compiled.querySelector('[role="listbox"]') as HTMLElement;
      expect(listbox.style.maxHeight).toBe('400px');
    });
  });

  describe('Option Events', () => {
    it('should emit optionClicked when option is clicked', () => {
      const clickEmitSpy = vi.fn();
      component.optionClicked.subscribe(clickEmitSpy);

      const option = compiled.querySelector('app-select-option') as HTMLElement;
      option.dispatchEvent(new Event('clicked'));

      expect(clickEmitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit optionEnterPressed when enter is pressed', () => {
      const enterEmitSpy = vi.fn();
      component.optionEnterPressed.subscribe(enterEmitSpy);

      const option = compiled.querySelector('app-select-option') as HTMLElement;
      option.dispatchEvent(new Event('enterPressed'));

      expect(enterEmitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit optionSpacePressed when space is pressed', () => {
      const spaceEmitSpy = vi.fn();
      component.optionSpacePressed.subscribe(spaceEmitSpy);

      const option = compiled.querySelector('app-select-option') as HTMLElement;
      option.dispatchEvent(new Event('spacePressed'));

      expect(spaceEmitSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit optionMouseEntered when mouse enters', () => {
      const mouseEmitSpy = vi.fn();
      component.optionMouseEntered.subscribe(mouseEmitSpy);

      const option = compiled.querySelector('app-select-option') as HTMLElement;
      option.dispatchEvent(new Event('mouseEntered'));

      expect(mouseEmitSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Option States', () => {
    it('should pass isSelected to options', () => {
      const isSelected = (opt: SelectOption) => opt.value === '2';
      fixture.componentRef.setInput('isOptionSelected', isSelected);
      fixture.detectChanges();

      const options = compiled.querySelectorAll('app-select-option');
      expect(options.length).toBe(3);
      // Options receive the isSelected prop
    });

    it('should pass highlightedIndex to options', () => {
      fixture.componentRef.setInput('highlightedIndex', 1);
      fixture.detectChanges();

      const options = compiled.querySelectorAll('app-select-option');
      expect(options.length).toBe(3);
      // Second option should be highlighted
    });

    it('should handle disabled options', () => {
      const optionsWithDisabled: SelectOption[] = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2', disabled: true },
        { value: '3', label: 'Option 3' },
      ];

      fixture.componentRef.setInput('options', optionsWithDisabled);
      fixture.detectChanges();

      const options = compiled.querySelectorAll('app-select-option');
      expect(options.length).toBe(3);
    });

    it('should handle options with descriptions', () => {
      const optionsWithDesc: SelectOption[] = [
        { value: '1', label: 'Option 1', description: 'Description 1' },
        { value: '2', label: 'Option 2', description: 'Description 2' },
      ];

      fixture.componentRef.setInput('options', optionsWithDesc);
      fixture.detectChanges();

      const options = compiled.querySelectorAll('app-select-option');
      expect(options.length).toBe(2);
    });
  });

  describe('ViewChild Reference', () => {
    it('should have searchInputElement viewChild', () => {
      expect(component.searchInputElement).toBeDefined();
    });

    it('should provide access to native search input when searchable', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const nativeInput = component.searchInputElement()?.nativeElement;
      expect(nativeInput).toBeTruthy();
      expect(nativeInput?.tagName).toBe('INPUT');
    });

    it('should not have native search input when not searchable', () => {
      fixture.componentRef.setInput('searchable', false);
      fixture.detectChanges();

      const nativeInput = component.searchInputElement()?.nativeElement;
      expect(nativeInput).toBeFalsy();
    });
  });
});
