import { Customer } from './durable-objects/customer'

export type Env = {
  Bindings: {
    SUBSCRIPTION_MANAGEMENT: KVNamespace
    CUSTOMER: DurableObjectNamespace<Customer>
  }
  Variables: {
  }
}


/* =====================
Subscription Plans 
=========================*/
export interface ISubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billing_cycle: TBillingCycle;
  status: TSubscriptionStatus;
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

export interface ICustomer {
  id: string;
  name: string;
  email: string;
  subscription_plan_id: string;
  subscription_status: TCustomerSubscriptionStatus;
  change_subscription_to?: string;
}

export interface ICustomerValue {
  name: string;
  email: string;
  subscription_plan_id: string;
  subscription_status: TCustomerSubscriptionStatus;
  change_subscription_to?: string;
}


export type TCustomerSubscriptionStatus = "active" | "cancelled" | "past_due" | "unpaid"