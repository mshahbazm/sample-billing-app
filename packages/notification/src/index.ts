import { Hono } from 'hono';
import { BindingEnvironment, Env } from './types';

const app = new Hono<Env>();

const MAX_RETRIES = 3;

export default {
  fetch: app.fetch,
  async queue(batch: MessageBatch<Error>, env: BindingEnvironment) {
    let file = ''
    for (const message of batch.messages) {
      console.log(message);
    }
    await env.ERROR_BUCKET.put(`errors/${Date.now()}.log`, file)
  },
}

