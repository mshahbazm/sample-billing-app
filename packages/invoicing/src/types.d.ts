import { ICustomer, INotificationInput, ISubscriptionPlan } from '../../shared/types';


export type Env = {
  Bindings: {
    INVOICING: KVNamespace;
    readonly NOTIFICATION_QUEUE: Queue<INotificationInput>;
  }
}

interface IGenerateInvoiceInput {
  customer: ICustomer;
  subscriptionPlan: ISubscriptionPlan;
}
