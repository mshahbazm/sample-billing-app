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

export type TSubscriptionStatus = "active" | "inactive"
export type TBillingCycle = "monthly" | "yearly"