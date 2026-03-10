// Mobile/native platform detection utilities
export const isNativePlatform = (): boolean => {
  return false; // Web-only for now — expand when Capacitor/React Native added
};

export const openPurchasePage = (url: string): void => {
  window.open(url, '_blank');
};
