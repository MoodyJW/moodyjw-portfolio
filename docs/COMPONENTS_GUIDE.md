# Shared Components Usage Guide

This guide documents the 20 shared components available in the component library and how to use them effectively.

## Table of Contents

- [Layout Components](#layout-components)
- [UI Components](#ui-components)
- [Form Components](#form-components)
- [Navigation Components](#navigation-components)
- [Feedback Components](#feedback-components)
- [Component Composition Patterns](#component-composition-patterns)

---

## Layout Components

### ContainerComponent

**Purpose**: Provides consistent max-width constraints and horizontal centering for content.

**When to use**:
- Every page layout (wrap page content)
- Sections that need max-width constraints
- Content that should be centered horizontally

**Example**:
```html
<app-container maxWidth="lg" padding="md">
  <h1>Page Title</h1>
  <p>Page content with consistent max-width...</p>
</app-container>
```

**Props**:
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | 'full' (default: 'lg')
- `padding`: 'none' | 'sm' | 'md' | 'lg' (default: 'md')
- `centerContent`: boolean (default: true)

**Common Patterns**:
```html
<!-- Full-width hero section -->
<app-container maxWidth="full" padding="none">
  <!-- Hero content -->
</app-container>

<!-- Readable content width -->
<app-container maxWidth="md">
  <!-- Article or blog content -->
</app-container>

<!-- Wide layout for dashboards -->
<app-container maxWidth="xl" padding="lg">
  <!-- Dashboard content -->
</app-container>
```

---

### GridComponent

**Purpose**: Responsive grid layouts with flexible column configurations.

**When to use**:
- Card grids (projects, case studies, products)
- Dashboard layouts
- Image galleries
- Any responsive multi-column layout

**Example**:
```html
<app-grid [cols]="3" [colsMd]="2" gap="lg">
  <app-card>Project 1</app-card>
  <app-card>Project 2</app-card>
  <app-card>Project 3</app-card>
</app-grid>
```

**Props**:
- `cols`: 1-12 | 'auto' (base columns)
- `colsMd`: 1-12 | 'auto' (tablet breakpoint)
- `colsLg`: 1-12 | 'auto' (desktop breakpoint)
- `colsXl`: 1-12 | 'auto' (large desktop)
- `gap`: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
- `gapX`/`gapY`: Independent horizontal/vertical gaps
- `align`: 'start' | 'center' | 'end' | 'stretch'
- `justify`: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'

**Common Patterns**:
```html
<!-- Responsive project grid -->
<app-grid [cols]="1" [colsMd]="2" [colsLg]="3" gap="lg">
  @for (project of projects(); track project.id) {
    <app-card>{{ project.title }}</app-card>
  }
</app-grid>

<!-- 12-column system with utility classes -->
<app-grid [cols]="12" gap="md">
  <div class="col-span-8 col-span-md-12">Main content</div>
  <div class="col-span-4 col-span-md-12">Sidebar</div>
</app-grid>

<!-- Auto-fit columns -->
<app-grid cols="auto" minColWidth="250px" gap="md">
  <!-- Cards will automatically fit based on available space -->
</app-grid>
```

---

### StackComponent

**Purpose**: Consistent spacing between child elements (vertical or horizontal).

**When to use**:
- Form layouts (stack form fields vertically)
- Navigation items (horizontal toolbar)
- List items with consistent spacing
- Any linear layout with spacing needs

**Example**:
```html
<app-stack spacing="md" direction="vertical">
  <app-form-field label="Name">
    <app-input ariaLabel="Name" />
  </app-form-field>
  <app-form-field label="Email">
    <app-input type="email" ariaLabel="Email" />
  </app-form-field>
  <app-button>Submit</app-button>
</app-stack>
```

**Props**:
- `spacing`: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
- `direction`: 'vertical' | 'horizontal'
- `align`: 'start' | 'center' | 'end' | 'stretch'
- `justify`: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
- `fullWidth`: boolean
- `wrap`: boolean
- `inline`: boolean
- `divider`: boolean

**Common Patterns**:
```html
<!-- Form with vertical stack -->
<app-stack spacing="lg" direction="vertical" [fullWidth]="true">
  <!-- Form fields -->
</app-stack>

<!-- Horizontal toolbar with dividers -->
<app-stack spacing="sm" direction="horizontal" [divider]="true">
  <app-button variant="ghost">New</app-button>
  <app-button variant="ghost">Edit</app-button>
  <app-button variant="ghost">Delete</app-button>
</app-stack>

<!-- Centered action buttons -->
<app-stack spacing="md" direction="horizontal" justify="center">
  <app-button variant="secondary">Cancel</app-button>
  <app-button variant="primary">Save</app-button>
</app-stack>
```

---

### DividerComponent

**Purpose**: Visual separation between content sections.

**When to use**:
- Between major page sections
- In forms (e.g., "Or continue with")
- In toolbars (vertical dividers)
- In lists (horizontal dividers)

**Example**:
```html
<section>
  <h2>Section 1</h2>
  <p>Content...</p>
</section>

<app-divider spacing="lg" />

<section>
  <h2>Section 2</h2>
  <p>Content...</p>
</section>
```

**Props**:
- `orientation`: 'horizontal' | 'vertical'
- `variant`: 'solid' | 'dashed' | 'dotted'
- `spacing`: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
- `thickness`: 'thin' | 'medium' | 'thick'
- `label`: string (horizontal only)
- `inset`: boolean

**Common Patterns**:
```html
<!-- Section divider -->
<app-divider spacing="xl" />

<!-- Form divider with label -->
<app-divider label="Or continue with" spacing="lg" />

<!-- Vertical toolbar divider -->
<app-stack direction="horizontal" spacing="sm">
  <app-button>Action 1</app-button>
  <app-divider orientation="vertical" spacing="none" />
  <app-button>Action 2</app-button>
</app-stack>

<!-- Inset divider -->
<app-divider [inset]="true" variant="dashed" />
```

---

## UI Components

### ButtonComponent

**Purpose**: Clickable actions with various visual styles.

**When to use**:
- Form submissions
- Call-to-action buttons
- Navigation links
- Action triggers

**Example**:
```html
<app-button
  variant="primary"
  size="md"
  iconLeft="heroCheckCircle"
  (click)="handleSubmit()"
>
  Submit Form
</app-button>
```

**Props**:
- `variant`: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `iconLeft`/`iconRight`: Icon name from ICON_NAMES
- `iconOnly`: boolean
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `type`: 'button' | 'submit' | 'reset'

**Common Patterns**:
```html
<!-- Primary CTA -->
<app-button variant="primary" size="lg">
  Get Started
</app-button>

<!-- Button with icon -->
<app-button variant="secondary" iconLeft="heroArrowLeft">
  Back
</app-button>

<!-- Loading state -->
<app-button variant="primary" [loading]="isSubmitting()">
  {{ isSubmitting() ? 'Saving...' : 'Save' }}
</app-button>

<!-- Icon-only button -->
<app-button
  variant="ghost"
  iconOnly="heroXMark"
  ariaLabel="Close modal"
  size="sm"
/>

<!-- Full-width button (mobile) -->
<app-button variant="primary" [fullWidth]="true">
  Continue
</app-button>
```

---

### CardComponent

**Purpose**: Container for related content with visual hierarchy.

**When to use**:
- Project cards
- Case study previews
- Info panels
- Metric cards
- Feature highlights

**Example**:
```html
<app-card variant="elevated" padding="md" [clickable]="true">
  <div slot="header">
    <h3>Project Title</h3>
  </div>
  <div slot="body">
    <p>Project description...</p>
  </div>
  <div slot="footer">
    <app-button variant="primary" size="sm">View Details</app-button>
  </div>
</app-card>
```

**Props**:
- `variant`: 'default' | 'elevated' | 'outlined' | 'filled'
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `clickable`: boolean
- `hoverable`: boolean

**Slots**:
- `header`: Card header
- `media`: Image or media content
- `body`: Main content
- `footer`: Action buttons or metadata

**Common Patterns**:
```html
<!-- Project card -->
<app-card variant="elevated" [clickable]="true" (click)="viewProject()">
  <div slot="media">
    <img src="project-image.jpg" alt="Project screenshot" />
  </div>
  <div slot="body">
    <h3>{{ project.title }}</h3>
    <p>{{ project.description }}</p>
    <app-stack direction="horizontal" spacing="xs" [wrap]="true">
      @for (tech of project.technologies; track tech) {
        <app-badge variant="secondary" size="sm">{{ tech }}</app-badge>
      }
    </app-stack>
  </div>
  <div slot="footer">
    <app-stack direction="horizontal" spacing="sm" justify="space-between">
      <span>{{ project.date }}</span>
      <app-icon name="heroArrowRight" size="sm" />
    </app-stack>
  </div>
</app-card>

<!-- Metric card -->
<app-card variant="filled" padding="lg">
  <div slot="body">
    <app-stack spacing="xs">
      <app-icon name="heroUsers" size="lg" color="primary" />
      <h2>1,234</h2>
      <p>Active Users</p>
    </app-stack>
  </div>
</app-card>
```

---

### IconComponent

**Purpose**: Display icons with consistent sizing and colors.

**When to use**:
- Visual indicators
- Button icons
- Navigation icons
- Status indicators
- Social media links

**Example**:
```html
<app-icon
  name="heroCheckCircle"
  size="md"
  color="success"
  ariaLabel="Success"
/>
```

**Props**:
- `name`: Icon name from ICON_NAMES constants
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
- `color`: 'current' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
- `decorative`: boolean (aria-hidden)
- `spin`: boolean

**Common Patterns**:
```html
<!-- Success indicator -->
<app-icon name="heroCheckCircle" color="success" size="lg" />

<!-- Loading spinner -->
<app-icon name="heroArrowPath" [spin]="true" ariaLabel="Loading" />

<!-- Social media icon -->
<app-icon name="heroGithub" size="xl" color="current" />

<!-- Decorative icon -->
<app-icon name="heroSparkles" [decorative]="true" />
```

---

### BadgeComponent

**Purpose**: Small labels for tags, status, counts.

**When to use**:
- Technology tags
- Status indicators
- Notification counts
- Category labels

**Example**:
```html
<app-badge variant="primary" size="md">
  TypeScript
</app-badge>
```

**Props**:
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `content`: string | number
- `max`: number (for numeric badges, e.g., "99+")
- `dot`: boolean (show dot instead of content)
- `hideWhenZero`: boolean
- `position`: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

**Common Patterns**:
```html
<!-- Technology tag -->
<app-badge variant="secondary" size="sm">React</app-badge>

<!-- Status badge -->
<app-badge variant="success">Active</app-badge>

<!-- Notification count -->
<app-button variant="ghost" iconOnly="heroBell">
  <app-badge
    [content]="notificationCount()"
    variant="error"
    position="top-right"
    [hideWhenZero]="true"
  />
</app-button>

<!-- Dot indicator -->
<app-badge variant="success" [dot]="true" />
```

---

### ModalComponent

**Purpose**: Overlay dialogs for focused interactions.

**When to use**:
- Confirmation dialogs
- Forms that need focus
- Image lightboxes
- Complex interactions that need isolation

**Example**:
```html
<app-modal
  [isOpen]="isModalOpen()"
  (close)="closeModal()"
  variant="dialog"
  size="md"
>
  <div slot="header">
    <h2>Confirm Action</h2>
  </div>
  <div slot="body">
    <p>Are you sure you want to delete this item?</p>
  </div>
  <div slot="footer">
    <app-stack direction="horizontal" spacing="sm" justify="end">
      <app-button variant="secondary" (click)="closeModal()">Cancel</app-button>
      <app-button variant="danger" (click)="confirmDelete()">Delete</app-button>
    </app-stack>
  </div>
</app-modal>
```

**Or use ModalService**:
```typescript
const modalRef = this.modalService.open(MyDialogComponent, {
  variant: 'dialog',
  size: 'md',
  closeOnBackdropClick: true,
  closeOnEscape: true
});

const result = await modalRef.afterClosed();
```

**Props**:
- `isOpen`: boolean
- `variant`: 'default' | 'fullscreen' | 'dialog' | 'sidebar'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `closeOnBackdropClick`: boolean
- `closeOnEscape`: boolean

---

### ToastComponent / ToastService

**Purpose**: Non-blocking notification messages.

**When to use**:
- Success confirmations
- Error messages
- Info notifications
- Warnings

**Example (using service)**:
```typescript
// Success toast
this.toastService.success('Project saved successfully!');

// Error toast
this.toastService.error('Failed to load data. Please try again.');

// Custom toast
this.toastService.show({
  variant: 'info',
  message: 'New features available!',
  duration: 5000,
  position: 'top-right',
  showCloseButton: true
});
```

**Common Patterns**:
```typescript
// Form submission success
handleSubmit() {
  this.service.save().subscribe({
    next: () => {
      this.toastService.success('Form submitted successfully!');
      this.router.navigate(['/success']);
    },
    error: (err) => {
      this.toastService.error('Failed to submit form. Please try again.');
    }
  });
}

// Copy to clipboard
copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  this.toastService.success('Copied to clipboard!', {
    duration: 2000
  });
}
```

---

### LoadingSpinnerComponent

**Purpose**: Indicate loading state.

**When to use**:
- Page loading
- Button loading states
- Data fetching
- Processing states

**Example**:
```html
@if (isLoading()) {
  <app-loading-spinner size="lg" message="Loading projects..." />
} @else {
  <!-- Content -->
}
```

**Props**:
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `variant`: 'primary' | 'secondary' | 'light' | 'dark'
- `message`: string
- `center`: boolean
- `overlay`: boolean

**Common Patterns**:
```html
<!-- Page loading -->
<app-loading-spinner
  size="xl"
  [center]="true"
  message="Loading..."
/>

<!-- Button loading -->
<app-button [loading]="isSubmitting()">
  Submit
</app-button>

<!-- Overlay loading -->
<app-loading-spinner
  [overlay]="true"
  message="Processing payment..."
/>

<!-- Inline loading -->
<app-loading-spinner size="sm" />
```

---

### SkeletonComponent

**Purpose**: Loading placeholders that match content shape.

**When to use**:
- List loading states
- Card loading states
- Page loading (before data arrives)
- Image loading

**Example**:
```html
@if (isLoading()) {
  <app-skeleton shape="rectangular" width="100%" height="200px" />
  <app-skeleton shape="text" width="80%" />
  <app-skeleton shape="text" width="60%" />
} @else {
  <!-- Actual content -->
}
```

**Props**:
- `shape`: 'text' | 'circular' | 'rectangular'
- `animation`: 'wave' | 'pulse' | 'none'
- `width`: string (CSS value)
- `height`: string (CSS value)
- `count`: number (multiple skeletons)
- `spacing`: string
- `rounded`: boolean

**Common Patterns**:
```html
<!-- Card skeleton -->
<app-card>
  <div slot="body">
    <app-skeleton shape="rectangular" height="200px" [rounded]="true" />
    <app-skeleton shape="text" width="80%" />
    <app-skeleton shape="text" width="60%" />
  </div>
</app-card>

<!-- List skeleton -->
<app-stack spacing="md">
  @for (i of [1,2,3,4,5]; track i) {
    <app-skeleton shape="text" height="60px" />
  }
</app-stack>

<!-- Avatar + text skeleton -->
<app-stack direction="horizontal" spacing="md" align="center">
  <app-skeleton shape="circular" width="48px" height="48px" />
  <div style="flex: 1;">
    <app-skeleton shape="text" width="40%" />
    <app-skeleton shape="text" width="60%" />
  </div>
</app-stack>
```

---

## Form Components

### InputComponent

**Purpose**: Text input fields with validation.

**Example**:
```html
<app-input
  type="email"
  [(value)]="email"
  ariaLabel="Email address"
  placeholder="Enter your email"
  helperText="We'll never share your email"
  [maxLength]="100"
  [showCharCount]="true"
  validationState="default"
/>
```

**Props**:
- `type`: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number'
- `value`: string
- `ariaLabel`: string (required)
- `placeholder`: string
- `helperText`: string
- `validationState`: 'default' | 'success' | 'warning' | 'error'
- `disabled`: boolean
- `required`: boolean
- `maxLength`: number
- `showCharCount`: boolean
- `prefixText`/`suffixText`: string
- `prefixIcon`/`suffixIcon`: Icon name

### TextareaComponent

**Purpose**: Multi-line text input.

**Example**:
```html
<app-textarea
  [(value)]="message"
  ariaLabel="Message"
  placeholder="Enter your message"
  [rows]="4"
  [maxLength]="500"
  [showCharCount]="true"
  resize="vertical"
/>
```

**Props**:
- All InputComponent props, plus:
- `rows`: number
- `minRows`/`maxRows`: number (auto-resize)
- `resize`: 'none' | 'vertical' | 'horizontal' | 'both'

### SelectComponent

**Purpose**: Dropdown selection (single or multiple).

**Example**:
```html
<app-select
  [(value)]="selectedValue"
  [options]="options"
  ariaLabel="Select option"
  placeholder="Choose an option"
  [searchable]="true"
  [clearable]="true"
/>
```

**Props**:
- `options`: Array<{ value: any, label: string, disabled?: boolean }>
- `value`: any (single) or any[] (multiple)
- `multiple`: boolean
- `searchable`: boolean
- `clearable`: boolean
- `placeholder`: string
- `ariaLabel`: string (required)

### CheckboxComponent

**Purpose**: Boolean selection or indeterminate state.

**Example**:
```html
<app-checkbox
  [(checked)]="isChecked"
  label="I agree to the terms"
  helperText="Read our terms and conditions"
  [required]="true"
/>
```

**Props**:
- `checked`: boolean
- `indeterminate`: boolean
- `label`: string
- `helperText`: string
- `required`: boolean
- `disabled`: boolean
- `validationState`: 'default' | 'success' | 'warning' | 'error'

### RadioComponent

**Purpose**: Single selection from a group.

**Example**:
```html
<app-stack spacing="sm">
  @for (option of options; track option.value) {
    <app-radio
      name="paymentMethod"
      [value]="option.value"
      [checked]="selectedMethod() === option.value"
      [label]="option.label"
      (checkedChange)="selectMethod(option.value)"
    />
  }
</app-stack>
```

### FormFieldComponent

**Purpose**: Wrapper for form controls with label and error display.

**Example**:
```html
<app-form-field
  label="Email"
  [required]="true"
  [control]="emailControl"
  helperText="We'll never share your email"
>
  <app-input
    type="email"
    ariaLabel="Email address"
    [value]="emailControl.value"
  />
</app-form-field>
```

**Props**:
- `label`: string
- `required`: boolean
- `helperText`: string
- `errorMessage`: string | string[]
- `validationState`: 'default' | 'success' | 'warning' | 'error'
- `control`: FormControl (auto error detection)

---

## Navigation Components

### TabsComponent

**Purpose**: Organize content into switchable tabs.

**Example**:
```html
<app-tabs [(activeTabId)]="activeTab" variant="underline">
  <app-tab tabId="overview" label="Overview">
    <p>Overview content...</p>
  </app-tab>
  <app-tab tabId="details" label="Details">
    <p>Details content...</p>
  </app-tab>
</app-tabs>
```

**Props**:
- `activeTabId`: string
- `variant`: 'default' | 'pills' | 'underline' | 'boxed'
- `size`: 'sm' | 'md' | 'lg'
- `orientation`: 'horizontal' | 'vertical'
- `fullWidth`: boolean

### BreadcrumbComponent

**Purpose**: Show navigation hierarchy.

**Example**:
```html
<app-breadcrumb
  [items]="breadcrumbItems()"
  variant="chevron"
  size="md"
/>
```

Where `breadcrumbItems()` is:
```typescript
breadcrumbItems = computed(() => [
  { label: 'Home', route: '/' },
  { label: 'Projects', route: '/projects' },
  { label: project.title, route: `/projects/${project.slug}` }
]);
```

**Props**:
- `items`: Array<{ label: string, route?: string, icon?: string }>
- `variant`: 'default' | 'slash' | 'chevron' | 'arrow'
- `size`: 'sm' | 'md' | 'lg'
- `maxItems`: number (collapsing)

---

## Component Composition Patterns

### Pattern 1: Card Grid with Loading

```html
<app-container maxWidth="xl">
  @if (isLoading()) {
    <app-grid [cols]="1" [colsMd]="2" [colsLg]="3" gap="lg">
      @for (i of [1,2,3,4,5,6]; track i) {
        <app-card>
          <div slot="body">
            <app-skeleton shape="rectangular" height="200px" />
            <app-skeleton shape="text" width="80%" />
            <app-skeleton shape="text" width="60%" />
          </div>
        </app-card>
      }
    </app-grid>
  } @else {
    <app-grid [cols]="1" [colsMd]="2" [colsLg]="3" gap="lg">
      @for (item of items(); track item.id) {
        <app-card variant="elevated" [clickable]="true">
          <!-- Card content -->
        </app-card>
      }
    </app-grid>
  }
</app-container>
```

### Pattern 2: Form Layout

```html
<app-container maxWidth="md">
  <app-stack spacing="lg">
    <h1>Contact Us</h1>

    <form [formGroup]="contactForm" (ngSubmit)="handleSubmit()">
      <app-stack spacing="md">
        <app-form-field label="Name" [required]="true" [control]="nameControl">
          <app-input
            formControlName="name"
            ariaLabel="Name"
            placeholder="John Doe"
          />
        </app-form-field>

        <app-form-field label="Email" [required]="true" [control]="emailControl">
          <app-input
            type="email"
            formControlName="email"
            ariaLabel="Email"
            placeholder="john@example.com"
          />
        </app-form-field>

        <app-form-field label="Message" [required]="true" [control]="messageControl">
          <app-textarea
            formControlName="message"
            ariaLabel="Message"
            [rows]="6"
            [maxLength]="500"
            [showCharCount]="true"
          />
        </app-form-field>

        <app-stack direction="horizontal" spacing="sm" justify="end">
          <app-button variant="secondary" type="button">Cancel</app-button>
          <app-button
            variant="primary"
            type="submit"
            [loading]="isSubmitting()"
            [disabled]="contactForm.invalid"
          >
            Submit
          </app-button>
        </app-stack>
      </app-stack>
    </form>
  </app-stack>
</app-container>
```

### Pattern 3: Detail Page Layout

```html
<app-container maxWidth="lg">
  <!-- Breadcrumb -->
  <app-breadcrumb [items]="breadcrumbs()" />

  <!-- Header -->
  <app-stack spacing="md">
    <h1>{{ project().title }}</h1>

    <!-- Metadata -->
    <app-stack direction="horizontal" spacing="sm" [wrap]="true">
      <app-badge variant="primary">{{ project().category }}</app-badge>
      @for (tech of project().technologies; track tech) {
        <app-badge variant="secondary" size="sm">{{ tech }}</app-badge>
      }
    </app-stack>

    <!-- Actions -->
    <app-stack direction="horizontal" spacing="md">
      <app-button iconLeft="heroGlobe" variant="primary">
        View Live
      </app-button>
      <app-button iconLeft="heroGithub" variant="secondary">
        GitHub
      </app-button>
    </app-stack>
  </app-stack>

  <app-divider spacing="xl" />

  <!-- Content Tabs -->
  <app-tabs [(activeTabId)]="activeTab">
    <app-tab tabId="overview" label="Overview">
      <!-- Overview content -->
    </app-tab>
    <app-tab tabId="features" label="Features">
      <!-- Features content -->
    </app-tab>
  </app-tabs>
</app-container>
```

### Pattern 4: Search and Filter

```html
<app-container maxWidth="xl">
  <app-stack spacing="lg">
    <!-- Search and Filters -->
    <app-grid [cols]="1" [colsMd]="3" gap="md">
      <div class="col-span-2 col-span-md-3">
        <app-input
          type="search"
          ariaLabel="Search projects"
          placeholder="Search..."
          prefixIcon="heroMagnifyingGlass"
          [(value)]="searchQuery"
        />
      </div>
      <app-select
        ariaLabel="Filter by category"
        placeholder="All Categories"
        [options]="categoryOptions()"
        [(value)]="selectedCategory"
        [clearable]="true"
      />
      <app-select
        ariaLabel="Sort by"
        [options]="sortOptions()"
        [(value)]="sortBy"
      />
    </app-grid>

    <!-- Results -->
    @if (filteredResults().length === 0) {
      <app-stack spacing="md" align="center">
        <app-icon name="heroMagnifyingGlass" size="2xl" />
        <h3>No results found</h3>
        <app-button (click)="clearFilters()">Clear Filters</app-button>
      </app-stack>
    } @else {
      <app-grid [cols]="1" [colsMd]="2" [colsLg]="3" gap="lg">
        @for (item of filteredResults(); track item.id) {
          <!-- Results cards -->
        }
      </app-grid>
    }
  </app-stack>
</app-container>
```

---

## Best Practices

### 1. Always Use ContainerComponent for Pages
Every page should wrap content in ContainerComponent for consistent max-width:
```html
<app-container maxWidth="lg">
  <!-- Page content -->
</app-container>
```

### 2. Use StackComponent for Consistent Spacing
Instead of manual margins, use StackComponent:
```html
<!-- ❌ Avoid -->
<div style="margin-bottom: 16px;">Item 1</div>
<div style="margin-bottom: 16px;">Item 2</div>

<!-- ✅ Better -->
<app-stack spacing="md">
  <div>Item 1</div>
  <div>Item 2</div>
</app-stack>
```

### 3. Use SkeletonComponent for Loading States
Match skeleton shape to actual content:
```html
@if (isLoading()) {
  <app-skeleton shape="rectangular" height="200px" />
  <app-skeleton shape="text" count="3" />
} @else {
  <img src="{{ image }}" />
  <p>{{ description }}</p>
}
```

### 4. Leverage FormFieldComponent for Forms
Wrap form controls in FormFieldComponent for consistent styling and error handling:
```html
<app-form-field label="Email" [control]="emailControl">
  <app-input type="email" ariaLabel="Email" />
</app-form-field>
```

### 5. Use ToastService for Feedback
Don't use alerts - use ToastService:
```typescript
// ❌ Avoid
alert('Success!');

// ✅ Better
this.toastService.success('Project saved successfully!');
```

### 6. Responsive Grids with Mobile-First
Always define mobile layout first, then tablet/desktop:
```html
<app-grid [cols]="1" [colsMd]="2" [colsLg]="3" gap="lg">
  <!-- Content -->
</app-grid>
```

### 7. Accessibility First
- Always provide `ariaLabel` for inputs
- Use semantic HTML with components
- Test keyboard navigation
- Ensure color contrast (components handle this)

---

## Quick Reference

### Layout
- **ContainerComponent**: Max-width content wrapper
- **GridComponent**: Responsive grids
- **StackComponent**: Consistent spacing
- **DividerComponent**: Visual separation

### UI
- **ButtonComponent**: Actions and CTAs
- **CardComponent**: Content containers
- **IconComponent**: Visual indicators
- **BadgeComponent**: Tags and labels

### Forms
- **InputComponent**: Text input
- **TextareaComponent**: Multi-line input
- **SelectComponent**: Dropdowns
- **CheckboxComponent**: Boolean selection
- **RadioComponent**: Single selection
- **FormFieldComponent**: Form wrapper

### Navigation
- **TabsComponent**: Content organization
- **BreadcrumbComponent**: Hierarchy

### Feedback
- **ModalComponent/Service**: Dialogs
- **ToastService**: Notifications
- **LoadingSpinnerComponent**: Loading states
- **SkeletonComponent**: Content placeholders

---

For more details, see the Storybook documentation or individual component files.
