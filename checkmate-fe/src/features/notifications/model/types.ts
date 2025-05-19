export type NotificationType =
  | 'SIGNATURE_COMPLETED'
  | 'CONTRACT_ANALYSIS'
  | 'QUESTION_GENERATION';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  target_url: string;
  created_at: string;
  read: boolean;
  user_id: number;
  contract_id: number;
}

// ✅ 서버 응답 형식 정의
export interface NotificationResponse {
  success: boolean;
  data: Notification[];
  error: string | null;
  timestamp: string;
}
