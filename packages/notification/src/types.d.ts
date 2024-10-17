export type Env = {
  Bindings: BindingEnvironment
}

export type BindingEnvironment = {
  readonly NOTIFICATION_QUEUE: Queue<INotificationInput>;
  readonly LOGS_BUCKET: R2Bucket;
  EMAIL_API_KEY: string
}
