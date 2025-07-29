import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

if (typeof process !== 'undefined' && process.listeners) {
  const originalUnhandledRejection = process.listeners('unhandledRejection');
  process.removeAllListeners('unhandledRejection');
  process.on('unhandledRejection', (reason) => {
    if (reason instanceof Error && reason.message.includes('Request failed with status')) {
      return;
    }
    originalUnhandledRejection.forEach(listener => {
      if (typeof listener === 'function') {
        listener(reason, Promise.resolve());
      }
    });
  });
}

afterEach(() => {
  cleanup();
})