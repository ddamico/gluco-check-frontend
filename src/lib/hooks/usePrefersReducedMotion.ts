import React from "react";

const MEDIA_QUERY = `(prefers-reduced-motion: no-preference)`;

export const getInitialState = () => !window.matchMedia(MEDIA_QUERY).matches;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(
    getInitialState
  );

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(MEDIA_QUERY);
    const listener = (
      thing: MediaQueryList,
      event: MediaQueryListEvent
    ): any => {
      setPrefersReducedMotion(!thing.matches);
    };

    // @ts-expect-error - doesn't like this param name
    mediaQueryList.addEventListener("change", listener);

    return () => {
      // @ts-expect-error - doesn't like this param name
      mediaQueryList.removeEventListener("change", listener);
    };
  }, []);

  return prefersReducedMotion;
}

export default usePrefersReducedMotion;
