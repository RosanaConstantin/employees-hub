# EmployeeHub

## Overview

EmployeeHub is a modern Angular application for managing employee and department data. Built with Angular 17+ standalone components, it demonstrates advanced features like data grids with sorting and pagination, progress indicators and comprehensive accessibility support. This project serves as both a functional employee management dashboard and a showcase of Angular best practices.

## ✨ Features

- 📊 **Data Grid Component** - Sortable and paginated tables with keyboard accessibility
- 📈 **Progress Indicators** - Circular progress components for department capacity visualization  
- 🎯 **Employee Dashboard** - Comprehensive view of employees and departments
- ♿ **Accessibility First** - WCAG 2.1 AA compliant with keyboard navigation
- 🎨 **Responsive Design** - Mobile-friendly layout with CSS flexbox and media queries
- 🧪 **Unit Testing** - Comprehensive test coverage with Jasmine and Karma


## 🛠️ Technologies Used

- **Framework**: Angular 17+
- **Language**: TypeScript
- **Styling**: CSS3 with modern features
- **Testing**: Jasmine & Karma
- **Build Tool**: Angular CLI
- **Architecture**: Standalone Components, OnPush Change Detection
- **Accessibility**: ARIA, semantic HTML, keyboard navigation

## 📁 Project Structure

```
src/app/
├── components/
│   ├── data-grid/          # Reusable data grid with sorting & pagination
│   ├── employee-dashboard/ # Main dashboard component
│   └── progress-indicator/ # Circular progress component
├── models/                 # TypeScript interfaces and types
├── services/              # Data services for employees and departments
└── app.ts                 # Root application component
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v22.12+)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RosanaConstantin/employees-hub
   cd employee-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

### Available Scripts

```bash
# Development server
ng serve

# Build for production
ng build

# Run unit tests
ng test

# Generate new component
ng generate component component-name

# Lint the code
ng lint
```

## ♿ Accessibility Features

EmployeeHub prioritizes accessibility and inclusivity:

- ✅ **Keyboard Navigation** - Keyboard support for all interactive elements
- ✅ **Screen Reader Support** - ARIA labels, roles
- ✅ **Focus Management** - Visible focus indicators and logical tab order
- ✅ **Semantic HTML** - Proper heading hierarchy and landmark regions
- ✅ **Responsive Design** - Works on all devices and screen sizes

### Keyboard Shortcuts

- **Tab/Shift+Tab** - Navigate between focusable elements
- **Enter/Space** - Activate buttons and form controls
- **Arrow Keys** - Navigate within data grids and select dropdowns
- **Escape** - Close dropdowns and modal dialogs

## 🧪 Testing

The project includes comprehensive unit tests for all components:

```bash
# Run all tests
npm test

# Run tests in watch mode
ng test --watch

# Generate coverage report
ng test --code-coverage
```

### Test Coverage

- ✅ Component rendering and initialization
- ✅ User interactions (clicks, keyboard events)
- ✅ Service integration and data flow
- ✅ Accessibility features and ARIA attributes
- ✅ Edge cases and error handling

## 🎨 Component Library

### DataGrid Component (`t-grid`)

A reusable, accessible data grid with sorting and pagination:

```html
<t-grid [data]="employees$" [pageSize]="10" [sortable]="true">
  <t-column name="Name" property="name" [sortable]="true"></t-column>
  <t-column name="Department" property="department" [sortable]="true"></t-column>
</t-grid>
```

**Features:**
- Sorting by column (ascending/descending)
- Configurable page sizes
- Keyboard navigation
- Screen reader announcements

### Progress Indicator Component (`t-progress`)

Circular progress indicator for data visualization:

```html
<t-progress 
  [radius]="60" 
  [progress]="75" 
  [color]="'#007bff'">
</t-progress>
```

**Features:**
- Customizable size and colors
- Accessibility with ARIA attributes
- Smooth animations (respects reduced motion)
- Completion events


### Development Guidelines

- Follow Angular style guide
- Write unit tests for new components
- Ensure accessibility compliance
- Use TypeScript strict mode
- Follow semantic commit messages
