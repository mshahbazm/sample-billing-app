import { INotificationInput } from '../../../shared/types';
import { BindingEnvironment } from '../types';
import { generateInvoiceEmail } from './email-templates';
import SendEmail from './send-email';

const sendInvoiceNotification = async (data: INotificationInput, env: BindingEnvironment) => {
  try {
    const html = generateInvoiceEmail(data);
    const email = {
      to: data.customer.email,
      subject: 'New Invoice to pay',
      html
    }
    await SendEmail({ ...email, token: env.EMAIL_API_KEY })
  } catch (error) {
    throw error
  }
};

const sendPaymentSuccessNotification = async (data: INotificationInput, env: BindingEnvironment) => {
};

const sendPaymentFailedNotification = async (data: INotificationInput, env: BindingEnvironment) => {
};

const notificationHandlers: Record<string, (data: INotificationInput, env: BindingEnvironment) => Promise<void>> = {
  'invoice': sendInvoiceNotification,
  'payment-success': sendPaymentSuccessNotification,
  'payment-failure': sendPaymentFailedNotification,
};

// Process Notification
const ProcessNotification = async (data: INotificationInput, env: BindingEnvironment) => {
  try {
    const key = data.type === 'payment' ? `payment-${data.variant}` : data.type;
    const handler = notificationHandlers[key];

    if (handler) {
      await handler(data, env);
    } else {
      console.error(`No handler found for notification type: ${data.type}`);
    }
  } catch (error) {
    throw error;
  }
};


export default ProcessNotification;