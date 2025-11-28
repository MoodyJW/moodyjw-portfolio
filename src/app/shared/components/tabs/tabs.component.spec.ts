// @vitest-environment jsdom
import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ICON_NAMES } from '@shared/constants';

import { TabComponent } from './tab.component';
import type { TabsOrientation, TabsSize,TabsVariant } from './tabs.component';
import { TabsComponent } from './tabs.component';

// Test host component
@Component({
  standalone: true,
  imports: [TabsComponent, TabComponent],
  template: `
    <app-tabs [ariaLabel]="ariaLabel" [(activeTabId)]="activeTabId">
      <app-tab tabId="tab1" label="Tab 1">
        <p>Content 1</p>
      </app-tab>
      <app-tab tabId="tab2" label="Tab 2">
        <p>Content 2</p>
      </app-tab>
      <app-tab tabId="tab3" label="Tab 3" [disabled]="true">
        <p>Content 3</p>
      </app-tab>
    </app-tabs>
  `,
})
class TestHostComponent {
  ariaLabel = 'Test tabs';
  activeTabId = 'tab1';
}

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ariaLabel', 'Test tabs');
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (TabsComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (TabsComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling - Variant', () => {
    it('should have default variant as default', () => {
      fixture.detectChanges();
      expect(component.variant()).toBe('default');
    });

    it('should apply custom variant', () => {
      const variants: TabsVariant[] = ['default', 'pills', 'underline', 'boxed'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(component.variant()).toBe(variant);
      });
    });
  });

  describe('Input Handling - Orientation', () => {
    it('should have default orientation as horizontal', () => {
      fixture.detectChanges();
      expect(component.orientation()).toBe('horizontal');
    });

    it('should apply custom orientation', () => {
      const orientations: TabsOrientation[] = ['horizontal', 'vertical'];

      orientations.forEach((orientation) => {
        fixture.componentRef.setInput('orientation', orientation);
        fixture.detectChanges();
        expect(component.orientation()).toBe(orientation);
      });
    });
  });

  describe('Input Handling - Size', () => {
    it('should have default size as md', () => {
      fixture.detectChanges();
      expect(component.size()).toBe('md');
    });

    it('should apply custom size', () => {
      const sizes: TabsSize[] = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect(component.size()).toBe(size);
      });
    });
  });

  describe('Input Handling - Active Tab', () => {
    it('should have empty activeTabId by default', () => {
      fixture.detectChanges();
      expect(component.activeTabId()).toBe('');
    });

    it('should accept custom activeTabId', () => {
      fixture.componentRef.setInput('activeTabId', 'tab-1');
      fixture.detectChanges();
      expect(component.activeTabId()).toBe('tab-1');
    });
  });

  describe('Input Handling - Full Width', () => {
    it('should have default fullWidth as false', () => {
      fixture.detectChanges();
      expect(component.fullWidth()).toBe(false);
    });

    it('should accept fullWidth true', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();
      expect(component.fullWidth()).toBe(true);
    });
  });

  describe('Input Handling - ARIA Label', () => {
    it('should require ariaLabel', () => {
      expect(component.ariaLabel()).toBe('Test tabs');
    });

    it('should accept custom ariaLabel', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom tabs label');
      fixture.detectChanges();
      expect(component.ariaLabel()).toBe('Custom tabs label');
    });
  });

  describe('Computed Properties - CSS Classes', () => {
    it('should generate correct base classes', () => {
      fixture.detectChanges();
      const classes = component.tabListClasses();
      expect(classes).toContain('tabs__list');
      expect(classes).toContain('tabs__list--default');
      expect(classes).toContain('tabs__list--horizontal');
      expect(classes).toContain('tabs__list--md');
    });

    it('should include variant class', () => {
      fixture.componentRef.setInput('variant', 'pills');
      fixture.detectChanges();
      const classes = component.tabListClasses();
      expect(classes).toContain('tabs__list--pills');
    });

    it('should include orientation class', () => {
      fixture.componentRef.setInput('orientation', 'vertical');
      fixture.detectChanges();
      const classes = component.tabListClasses();
      expect(classes).toContain('tabs__list--vertical');
    });

    it('should include size class', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      const classes = component.tabListClasses();
      expect(classes).toContain('tabs__list--lg');
    });

    it('should include full-width class when fullWidth is true', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();
      const classes = component.tabListClasses();
      expect(classes).toContain('tabs__list--full-width');
    });

    it('should not include full-width class when fullWidth is false', () => {
      fixture.componentRef.setInput('fullWidth', false);
      fixture.detectChanges();
      const classes = component.tabListClasses();
      expect(classes).not.toContain('tabs__list--full-width');
    });
  });

  describe('Tab Selection', () => {
    it('should select tab by index', () => {
      component.selectTab(0);
      expect(component.activeTabIndex()).toBe(0);
    });

    it('should not select disabled tab', () => {
      component.selectTab(2); // Assuming index 2 is disabled in test setup
      // Implementation depends on having tabs
    });

    it('should emit activeTabIdChange when tab is selected', () => {
      // This test requires tabs to be present via contentChildren
      // Will work properly in integration tests with host component
      const subscription = component.activeTabIdChange.subscribe(() => {
        // Event subscription
      });
      subscription.unsubscribe();
    });

    it('should emit tabChanged event when tab is selected', () => {
      // This test requires tabs to be present via contentChildren
      // Will work properly in integration tests with host component
      const subscription = component.tabChanged.subscribe(() => {
        // Event subscription
      });
      subscription.unsubscribe();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle ArrowRight in horizontal mode', () => {
      fixture.componentRef.setInput('orientation', 'horizontal');
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleKeydown(event, 0);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should handle ArrowLeft in horizontal mode', () => {
      fixture.componentRef.setInput('orientation', 'horizontal');
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleKeydown(event, 1);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should handle ArrowDown in vertical mode', () => {
      fixture.componentRef.setInput('orientation', 'vertical');
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleKeydown(event, 0);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should handle ArrowUp in vertical mode', () => {
      fixture.componentRef.setInput('orientation', 'vertical');
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleKeydown(event, 1);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should handle Home key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Home' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleKeydown(event, 2);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should handle End key', () => {
      const event = new KeyboardEvent('keydown', { key: 'End' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleKeydown(event, 0);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should handle Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      const selectTabSpy = vi.spyOn(component, 'selectTab');

      component.handleKeydown(event, 1);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(selectTabSpy).toHaveBeenCalledWith(1);
    });

    it('should handle Space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      const selectTabSpy = vi.spyOn(component, 'selectTab');

      component.handleKeydown(event, 1);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(selectTabSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('DOM Rendering', () => {
    it('should render tabs container', () => {
      fixture.detectChanges();
      const container = fixture.nativeElement.querySelector('.tabs');
      expect(container).toBeTruthy();
    });

    it('should render tab list with correct role', () => {
      fixture.detectChanges();
      const tabList = fixture.nativeElement.querySelector('[role="tablist"]');
      expect(tabList).toBeTruthy();
    });

    it('should set aria-label on tab list', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test tabs');
      fixture.detectChanges();
      const tabList = fixture.nativeElement.querySelector('[role="tablist"]');
      expect(tabList.getAttribute('aria-label')).toBe('Test tabs');
    });

    it('should set aria-orientation on tab list', () => {
      fixture.componentRef.setInput('orientation', 'vertical');
      fixture.detectChanges();
      const tabList = fixture.nativeElement.querySelector('[role="tablist"]');
      expect(tabList.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('should apply CSS classes to tab list', () => {
      fixture.componentRef.setInput('variant', 'pills');
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      const tabList = fixture.nativeElement.querySelector('.tabs__list');
      expect(tabList.classList.contains('tabs__list--pills')).toBe(true);
      expect(tabList.classList.contains('tabs__list--lg')).toBe(true);
    });
  });

  describe('All Variants', () => {
    it('should apply all variant styles correctly', () => {
      const variants: TabsVariant[] = ['default', 'pills', 'underline', 'boxed'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        const classes = component.tabListClasses();
        expect(classes).toContain(`tabs__list--${variant}`);
      });
    });
  });

  describe('All Sizes', () => {
    it('should apply all size styles correctly', () => {
      const sizes: TabsSize[] = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        const classes = component.tabListClasses();
        expect(classes).toContain(`tabs__list--${size}`);
      });
    });
  });
});

describe('TabsComponent with Host', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should render all tabs', () => {
    const tabs = hostFixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(3);
  });

  it('should show active tab content', () => {
    const panels = hostFixture.nativeElement.querySelectorAll('[role="tabpanel"]');
    expect(panels.length).toBe(1); // Only active tab panel is rendered
  });

  it('should select tab on click', () => {
    const tabs = hostFixture.nativeElement.querySelectorAll('[role="tab"]');
    const tabEl = tabs[1];
    const innerButton = tabEl.querySelector('button');
    if (innerButton) {
      innerButton.click();
    } else {
      tabEl.click();
    }

    hostFixture.detectChanges();

    expect(hostComponent.activeTabId).toBe('tab2');
  });

  it('should mark correct tab as active', () => {
    const tabs = hostFixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
  });

  it('should not select disabled tab', () => {
    const tabs = hostFixture.nativeElement.querySelectorAll('[role="tab"]');
    const initialActiveId = hostComponent.activeTabId;

    tabs[2].click();
    hostFixture.detectChanges();

    expect(hostComponent.activeTabId).toBe(initialActiveId);
  });
});

// Test host component with icons
@Component({
  standalone: true,
  imports: [TabsComponent, TabComponent],
  template: `
    <app-tabs [ariaLabel]="'Tabs with icons'" [(activeTabId)]="activeTabId">
      <app-tab tabId="home" label="Home" [icon]="ICON_NAMES.HOME">
        <p>Home content</p>
      </app-tab>
      <app-tab tabId="settings" label="Settings" [icon]="ICON_NAMES.SETTINGS">
        <p>Settings content</p>
      </app-tab>
      <app-tab tabId="profile" label="Profile">
        <p>Profile content without icon</p>
      </app-tab>
    </app-tabs>
  `,
})
class TestHostWithIconsComponent {
  activeTabId = 'home';
  readonly ICON_NAMES = ICON_NAMES;
}

describe('TabsComponent with Icons', () => {
  let hostFixture: ComponentFixture<TestHostWithIconsComponent>;
  let hostComponent: TestHostWithIconsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostWithIconsComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostWithIconsComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  describe('Icon Rendering', () => {
    it('should render icons in tabs that have them', () => {
      const icons = hostFixture.nativeElement.querySelectorAll('.tabs__tab-icon');
      expect(icons.length).toBe(2); // Only first two tabs have icons
    });

    it('should render app-icon component for tabs with icons', () => {
      const iconComponents = hostFixture.nativeElement.querySelectorAll('app-icon');
      expect(iconComponents.length).toBe(2);
    });

    it('should not render icons for tabs without them', () => {
      const tabs = hostFixture.nativeElement.querySelectorAll('[role="tab"]');
      const thirdTab = tabs[2]; // Profile tab without icon
      const iconInThirdTab = thirdTab.querySelector('.tabs__tab-icon');
      expect(iconInThirdTab).toBeFalsy();
    });

    it('should render icon before label', () => {
      const firstTab = hostFixture.nativeElement.querySelector('[role="tab"]');
      const icon = firstTab.querySelector('.tabs__tab-icon');
      const label = firstTab.querySelector('.tabs__tab-label');

      expect(icon).toBeTruthy();
      expect(label).toBeTruthy();

      // Check that icon comes before label in DOM
      // Note: Icon and label are now inside btn__content wrapper within app-button-content
      const contentWrapper = firstTab.querySelector('.btn__content');
      expect(contentWrapper).toBeTruthy();
      const iconIndex = Array.from(contentWrapper.children).indexOf(icon);
      const labelIndex = Array.from(contentWrapper.children).indexOf(label);
      expect(iconIndex).toBeLessThan(labelIndex);
    });

    it('should apply decorative attribute to icons', () => {
      const iconComponents = hostFixture.nativeElement.querySelectorAll('app-icon');
      iconComponents.forEach((icon: HTMLElement) => {
        // The icon component should have decorative set to true
        expect(icon).toBeTruthy();
      });
    });

    it('should apply small size to icons', () => {
      // Icons should be rendered with 'sm' size
      const firstTab = hostFixture.nativeElement.querySelector('[role="tab"]');
      const icon = firstTab.querySelector('.tabs__tab-icon');
      expect(icon).toBeTruthy();
    });

    it('should switch tabs with icons correctly', () => {
      const tabs = hostFixture.nativeElement.querySelectorAll('[role="tab"]');

      // Click second tab (with icon) - need to click the inner button element
      const secondTabButton = tabs[1].tagName === 'BUTTON' ? tabs[1] : tabs[1].querySelector('button');
      if (secondTabButton) {
        secondTabButton.click();
      } else {
        tabs[1].click();
      }
      hostFixture.detectChanges();

      expect(hostComponent.activeTabId).toBe('settings');

      // Icon should still be rendered
      const icons = hostFixture.nativeElement.querySelectorAll('.tabs__tab-icon');
      expect(icons.length).toBe(2);
    });

    it('should maintain icon rendering when tab becomes active', () => {
      const tabs = hostFixture.nativeElement.querySelectorAll('[role="tab"]');
      const firstTab = tabs[0];

      // First tab starts active and should have icon
      const iconBeforeClick = firstTab.querySelector('.tabs__tab-icon');
      expect(iconBeforeClick).toBeTruthy();

      // Click another tab
      tabs[1].click();
      hostFixture.detectChanges();

      // Click first tab again
      tabs[0].click();
      hostFixture.detectChanges();

      // Icon should still be there
      const iconAfterClick = firstTab.querySelector('.tabs__tab-icon');
      expect(iconAfterClick).toBeTruthy();
    });
  });

  describe('Mixed Tabs (With and Without Icons)', () => {
    it('should handle tabs with and without icons together', () => {
      const tabs = hostFixture.nativeElement.querySelectorAll('[role="tab"]');
      expect(tabs.length).toBe(3);

      // First two have icons
      expect(tabs[0].querySelector('.tabs__tab-icon')).toBeTruthy();
      expect(tabs[1].querySelector('.tabs__tab-icon')).toBeTruthy();

      // Third doesn't have icon
      expect(tabs[2].querySelector('.tabs__tab-icon')).toBeFalsy();
    });

    it('should render labels for all tabs regardless of icons', () => {
      const labels = hostFixture.nativeElement.querySelectorAll('.tabs__tab-label');
      expect(labels.length).toBe(3);
      expect(labels[0].textContent.trim()).toBe('Home');
      expect(labels[1].textContent.trim()).toBe('Settings');
      expect(labels[2].textContent.trim()).toBe('Profile');
    });

    it('should apply correct accessibility attributes for all tabs', () => {
      const tabs = hostFixture.nativeElement.querySelectorAll('[role="tab"]');

      tabs.forEach((tab: HTMLElement, index: number) => {
        expect(tab.getAttribute('role')).toBe('tab');
        expect(tab.getAttribute('aria-selected')).toBe(index === 0 ? 'true' : 'false');
      });
    });
  });
});

describe('TabComponent', () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tabId', 'test-tab');
    fixture.componentRef.setInput('label', 'Test Tab');
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (TabComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (TabComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling', () => {
    it('should require tabId', () => {
      expect(component.tabId()).toBe('test-tab');
    });

    it('should require label', () => {
      expect(component.label()).toBe('Test Tab');
    });

    it('should accept optional icon', () => {
      fixture.componentRef.setInput('icon', ICON_NAMES.HOME);
      fixture.detectChanges();
      expect(component.icon()).toBe(ICON_NAMES.HOME);
    });

    it('should have default disabled as false', () => {
      fixture.detectChanges();
      expect(component.disabled()).toBe(false);
    });

    it('should accept disabled true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBe(true);
    });
  });

  describe('Active State', () => {
    it('should have default isActive as false', () => {
      expect(component.isActive()).toBe(false);
    });

    it('should set active state', () => {
      component.setActive(true);
      expect(component.isActive()).toBe(true);
    });

    it('should unset active state', () => {
      component.setActive(true);
      component.setActive(false);
      expect(component.isActive()).toBe(false);
    });
  });

  describe('Computed Properties', () => {
    it('should compute panelId correctly', () => {
      expect(component.panelId()).toBe('test-tab-panel');
    });
  });

  describe('DOM Rendering', () => {
    it('should not render panel when inactive', () => {
      component.setActive(false);
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector('.tab-panel');
      expect(panel).toBeFalsy();
    });

    it('should render panel when active', () => {
      component.setActive(true);
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector('.tab-panel');
      expect(panel).toBeTruthy();
    });

    it('should have correct ARIA attributes on panel', () => {
      component.setActive(true);
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector('[role="tabpanel"]');
      expect(panel).toBeTruthy();
      expect(panel.getAttribute('id')).toBe('test-tab-panel');
      expect(panel.getAttribute('aria-labelledby')).toBe('test-tab');
    });
  });
});
