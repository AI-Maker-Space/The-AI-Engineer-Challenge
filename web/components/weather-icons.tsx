import type { SVGProps } from "react";

/**
 * Inline SVG icons for weather metric widgets (no external icon dependency).
 */

export function IconMapPin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}

export function IconClock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

/** Classic bulb thermometer — air temperature */
export function IconThermometer(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M10 15.5V5a2 2 0 1 1 4 0v10.5a4 4 0 1 1-4 0z" />
      <path d="M12 18v-5" strokeWidth={2.25} />
    </svg>
  );
}

/** Apparent temperature — thermometer plus sparkle strokes for “feels like”. */
export function IconThermometerFeels(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M8 15.2V6a2 2 0 1 1 4 0v9.2a4 4 0 1 1-4 0z" />
      <path d="M16.5 6.5l1.2 1.2M18.2 4.8l1.1 1.1M16.5 3.2l1.3 1.3" opacity={0.75} />
      <circle cx="10" cy="17.3" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Wind speed — stylized gust lines */
export function IconWind(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M4 10h11a2.5 2.5 0 0 0 0-5" />
      <path d="M4 14h15a2 2 0 1 1 0 4" opacity={0.9} />
      <path d="M4 18h8.5a2 2 0 1 1 0 4" opacity={0.75} />
    </svg>
  );
}
