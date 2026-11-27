import { createContext, useContext } from 'react';

export const SoundContext = createContext({
  enabled: true,
  unlocked: false,
  volume: 0.68,
  toggleSound: () => {},
  setVolume: () => {},
  triggerChime: () => {},
});

export function useHorrorSound() {
  return useContext(SoundContext);
}
