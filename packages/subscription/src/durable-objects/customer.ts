import { DurableObject } from 'cloudflare:workers';
import { ICustomer, ICustomerValue, TCustomerSubscriptionStatus } from '../types';

export class Customer extends DurableObject {
  async getCustomer() {
    const keys = ['name', 'email', 'subscription_plan_id', 'subscription_status', 'change_subscription_to'];
    const data = await this.ctx.storage.get(keys);
    return {
      name: data.get('name') as string,
      email: data.get('email') as string,
      subscription_plan_id: data.get('subscription_plan_id') as string,
      subscription_status: data.get('subscription_status') as TCustomerSubscriptionStatus,
      change_subscription_to: data.get('change_subscription_to') as string,
    } satisfies ICustomerValue
  }

  async putCustomerData(inputData: Partial<ICustomer>) {
   
    const updates = Object.entries(inputData).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    if (Object.keys(updates).length > 0) {
      await this.ctx.storage.put(updates);
    }
    return {
      ...updates as ICustomerValue,
    } satisfies ICustomerValue
  }

}