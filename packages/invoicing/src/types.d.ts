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

interface IInvoice {
  id: string;
  customer_id: string;
  amount: number;
  due_date: Date
  payment_status: TInvoicePaymentSatus;
  payment_date?: Date
}

export type TInvoicePaymentSatus = "generated" | "pending" | "paid" | "failed"