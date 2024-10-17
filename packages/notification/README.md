### Prerequisites
1. Create Notification queue using following command
```
npx wrangler queues create notification-queue
```
2. Create secret for email provider (Brevo)

```
npx wrangler secret put BILLING_BREVO_API_KEY
```

### Avaiable Scripts

```
npm run dev
```

```
npm run deploy
```
