export const trackEvent = (event: string, data?: Record<string, unknown>) => {
  if (process.env.NODE_ENV === 'development') console.log('[Analytics]', event, data);
};
export const trackError = (error: unknown, context?: string) => {
  if (process.env.NODE_ENV === 'development') console.error('[Analytics Error]', context, error);
};
export default { trackEvent, trackError };
