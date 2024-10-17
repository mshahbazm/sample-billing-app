export type Env = {
  Bindings: BindingEnvironment
  Variables: {
  }
}

export type BindingEnvironment = {
  readonly NOTIFICATION_QUEUE: Queue<INotificationInput>;
  readonly LOGS_BUCKET: R2Bucket;
  BILLING_BREVO_API_KEY: string
}

export interface INotificationInput {
  type: TNotificationType;
  id: string;
  variant?: TNotificationVariant
  invoice?: IInvoice;
}

type TNotificationType = "invoice" | "payment"
type TNotificationVariant = "success" | "failed"

export interface Message {
  id: string;
  retryCount: number;
  data: INotificationInput;
}

export interface MessageBatch {
  messages: Message[];
}