/**
 * Global navigation reference for programmatic navigation outside React tree.
 * Used by services (WebSocket, etc.) that need to navigate without prop drilling.
 *
 * Usage:
 *   In NavigationContainer: ref={navigationRef}
 *   Anywhere else: import { navigate, reset } from './navigationRef'
 */
import {createRef} from 'react';

export const navigationRef = createRef();

export function navigate(name, params) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}

export function reset(state) {
  if (navigationRef.current) {
    navigationRef.current.reset(state);
  }
}

export function isReady() {
  return navigationRef.current != null;
}
