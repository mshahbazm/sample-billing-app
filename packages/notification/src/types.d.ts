export type Env = {
  Bindings: BindingEnvironment
  Variables: {
  }
}

export type BindingEnvironment = {
  readonly NOTIFICATION_QUEUE: Queue<any>
}