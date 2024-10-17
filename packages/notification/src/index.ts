import { Hono } from 'hono';
import { BindingEnvironment, Env, INotificationInput } from './types';

const MAX_RETRIES = 3;

const app = new Hono<Env>();

app.get('/', async (c) => {
  const exampleNotif = {
    type: 'invoice' as any,
    variant: 'success' as any,
    id: 'asdasdsaaddas',
    data: {
      a: 1
    }
  }
  console.log('#####0', c.env.BILLING_BREVO_API_KEY);
  // await c.env.NOTIFICATION_QUEUE.send(exampleNotif);
  return c.json({ success: true });
})


export default {
  fetch: app.fetch,
  async queue(batch: MessageBatch<INotificationInput>, env: BindingEnvironment) {
    for (const message of batch.messages) {
      console.log('#####1', message);
      try {
        // Process the message
        // await processMessage(message.body);
        console.log(`Processed message: ${message.id}`);
      } catch (error) {
        console.error(`Error processing message ${message.id}: ${error}`);

        // If the message has been retried less than MAX_RETRIES, we can re-queue it
        if (message.attempts < MAX_RETRIES) {
          message.retry({ delaySeconds: 60 });
          console.log(`Requeued message: ${message.id}`);
        } else {
          await pushToLogsBucket(message.body, env);
          console.error(`Max retries reached for message: ${message.id}`);
        }
      }
    }
  },
};



async function pushToLogsBucket(message: INotificationInput, env: BindingEnvironment) {
  await env.LOGS_BUCKET.put(`${message.type}:${message.id}`, JSON.stringify(message));
}