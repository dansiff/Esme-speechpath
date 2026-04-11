/**
 * Layout Configuration
 * 
 * This file centralizes all layout-related values (spacing, widths, colors)
 * to make it easy for you to adjust the placement and feel of the app.
 */

export const LAYOUT_CONFIG = {
  // Main Container Spacing
  containerPadding: 'p-6',
  maxContainerWidth: 'max-w-7xl',
  
  // Sidebar (Exercise List)
  sidebarWidthDesktop: '33.333333%', // 1/3 of the screen
  sidebarGap: 'gap-8',
  sidebarCollapsedMargin: -32,
  
  // Practice Area
  practiceAreaWidthDesktop: '66.666667%', // 2/3 of the screen
  practiceAreaPadding: 'p-8',
  
  // Navigation
  navbarHeight: 'py-4',
  navbarHorizontalPadding: 'px-6',
  
  // Spacing Units (Tailwind classes)
  spacing: {
    xs: 'space-y-2',
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
    xl: 'space-y-12',
  },
  
  // Focus Mode Settings
  focusMode: {
    hideSidebar: true,
    hideNavbar: true,
    maximizePracticeArea: true,
    simplifiedHeader: true,
  },
  
  // Z-Index Layers
  zIndex: {
    navbar: 50,
    sidebarToggle: 20,
    modal: 100,
    toast: 110,
  }
};

export type LayoutConfig = typeof LAYOUT_CONFIG;
