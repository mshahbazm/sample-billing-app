import { INotificationInput } from '../../../shared/types';


// Function to generate invoice email HTML
export function generateInvoiceEmail(data: INotificationInput): string {
  return `
    <html>
      <body>
        <h1>Invoice #${data.invoice?.id}</h1>
        <p>Dear ${data.customer.name},</p>
        <p>We hope you are doing well. This is a reminder that your invoice is due.</p>
        <p><strong>Amount Due:</strong> ${data.invoice?.amount}</p>
        <p><strong>Due Date:</strong> ${data.invoice?.due_date}</p>
        <p>Please make the payment at your earliest convenience.</p>
        <br/>
        <p>Thank you for your business!</p>
      </body>
    </html>
  `;
}

/* 
export function generatePaymentSuccessNotificationEmail(data: INotificationInput): string {
  const statusMessage = `Your payment of ${data} was successfully processed.`

  return `
    <html>
      <body>
        <h1>Payment Successful</h1>
        <p>Dear ${data.customerName},</p>
        <p>${statusMessage}</p>
        <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
        <br/>
        <p>Thank you for using our service!</p>
      </body>
    </html>
  `;
}


export function generatePaymentFailureNotificationEmail(data: INotificationInput): string {
  const statusMessage = data.status === 'success'
    ? `Your payment of ${data.amount} was successfully processed.`
    : `Unfortunately, your payment of ${data.amount} could not be processed. Please try again or contact support.`;

  return `
    <html>
      <body>
        <h1>Payment ${data.status === 'success' ? 'Successful' : 'Failed'}</h1>
        <p>Dear ${data.customerName},</p>
        <p>${statusMessage}</p>
        <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
        <br/>
        <p>Thank you for using our service!</p>
      </body>
    </html>
  `;
}
 */