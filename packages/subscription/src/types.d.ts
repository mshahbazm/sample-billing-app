import { Customer } from './durable-objects/customer'

export type Env = {
  Bindings: {
    SUBSCRIPTION_MANAGEMENT: KVNamespace
    CUSTOMER: DurableObjectNamespace<Customer>
    INVOICING_SERVICE: Service
  }
}

