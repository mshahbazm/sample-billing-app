
/* =====================
Subscription Plans 
=========================*/
export interface ISubscriptionPlan extends ISubscriptionPlanValue {
  id: string;
}

export interface ISubscriptionPlanValue {
  name: string;
  price: number;
  billing_cycle: TBillingCycle;
  status: TSubscriptionStatus;
}


export interface IResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
  details?: any;
}

export type TSubscriptionStatus = "active" | "inactive"
export type TBillingCycle = "monthly" | "yearly"


/* =====================
Customers 
=========================*/

export interface ICustomer extends ICustomerValue {
  id: string;
}

export interface ICustomerValue {
  name: string;
  email: string;
  subscription_plan_id: string;
  subscription_status: TCustomerSubscriptionStatus;
  subscription_start_date?: Date;
  next_billing_date?: Date;
  change_subscription_to?: string;
}


export type TCustomerSubscriptionStatus = "active" | "cancelled" | "past_due" | "unpaid"


/*======================
Invoice
========================= */
interface IInvoice {
  id: string;
  customer_id: string;
  amount: number;
  due_date: Date
  payment_status: TInvoicePaymentSatus;
  payment_date?: Date
}

export type TInvoicePaymentSatus = "generated" | "pending" | "paid" | "failed"


/*======================
Payment
========================= */