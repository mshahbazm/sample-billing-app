import { ICustomer, ISubscriptionPlan } from '../../shared/types';


export type Env = {
  Bindings: {
    INVOICING: KVNamespace
  }
  Variables: {
  }
}

interface IGenerateInvoiceInput {
  customer: ICustomer;
  subscriptionPlan: ISubscriptionPlan;
}
