type Breakpoint = 'desktop' | 'tablet' | 'mobile' | 'mobile_s';

export const BREAKPOINTS = {
  desktop: 1280,
  tablet: 1023,
  mobile: 767,
  mobile_s: 480,
} satisfies Record<Breakpoint, number>;
