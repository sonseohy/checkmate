export type NotificationType = 'SIGN_COMPLETE' | 'ANALYSIS_DONE';

export interface Notification {
  id: number;
  message: string;
}
