import { create } from 'zustand';

export const useWeatherStore = create((set) => ({
  temp: 28,
  condition: 'Sunny',
}));
