export type Env = {
  SUBSCRIPTION_MANAGEMENT: KVNamespace
}

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