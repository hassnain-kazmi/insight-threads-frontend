export interface LogErrorContext {
  endpoint?: string;
  status?: number;
  [key: string]: unknown;
}

export const logError = (message: string, context?: LogErrorContext): void => {
  console.error("[Error]", message, context ?? "");
  // Optional: integrate with Sentry or similar (e.g. Sentry.captureMessage(message, { extra: context }))
};
