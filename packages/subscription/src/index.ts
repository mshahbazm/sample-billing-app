import { Hono } from 'hono';
import plans from './controllers/subscription-plans';
import { Env } from './types';


const app = new Hono<{ Bindings: Env }>()


app.route('/subscription-plans/', plans);



export default app

