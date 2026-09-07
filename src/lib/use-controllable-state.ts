import * as React from "react";

/**
 * Supports both controlled and uncontrolled usage from a single hook.
 *
 * When `value` is `undefined` the component owns its state and seeds it from
 * `defaultValue`. When `value` is provided the parent owns it and every render
 * reflects the prop, so external changes propagate.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<T>(defaultValue);

  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const current = isControlled ? value : uncontrolled;

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChangeRef.current?.(next);
    },
    [isControlled],
  );

  return [current, setValue];
}
