import { Hono } from 'hono';
import customers from './controllers/customers';
import plans from './controllers/subscription-plans';
import { Customer } from './durable-objects/customer';
import { Env } from './types';


const app = new Hono<Env>()


app.route('/subscription-plans/', plans);
app.route('/customers/', customers);

export default app

export {
  Customer
};

