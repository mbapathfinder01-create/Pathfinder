import { isFirebaseConfigured } from './config';
import type { Backend } from './types';

let backendPromise: Promise<Backend> | null = null;

/** Loads the Firebase backend when configured, else the browser-only demo backend. The SDK is only downloaded when used. */
export function getBackend(): Promise<Backend> {
  backendPromise ??= isFirebaseConfigured
    ? import('./firebaseBackend').then((m) => m.createFirebaseBackend())
    : import('./demoBackend').then((m) => m.createDemoBackend());
  return backendPromise;
}

export { isFirebaseConfigured };
export type { Backend, BackendMode } from './types';
