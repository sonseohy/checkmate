export type NotificationType = 'SIGN_COMPLETE' | 'ANALYSIS_DONE';

export interface Notification {
  id: number;
  message: string;
  type: 'SIGNATURE_COMPLETED' | 'CONTRACT_ANALYSIS';
  target_url: string;
  created_at: string;
  read: boolean;
}
