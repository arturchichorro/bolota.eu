export const speedToDelay = (speed: number): number => {
    return Math.round(201 - (speed * 2));
  };