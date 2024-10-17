/* Don't have access to SendGrid or Mailgun, hence using following self hosted service. */
const EmailAPIURL = 'https://gf8pmj95r2.execute-api.us-west-2.amazonaws.com/dev/send-email'

const SendEmail = async ({ to, subject, html, token }: { to: string; subject: string; html: string, token: string }): Promise<void> => {

  try {
    const response = await fetch(EmailAPIURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Bearer token for authentication
      },
      body: JSON.stringify({ to, subject, html }), // Convert the email data to JSON
    });

    if (!response.ok) {
      // Handle errors based on response status
      const errorMessage = await response.text();
      throw new Error(`Failed to send email: ${response.status} - ${errorMessage}`);
    }

    const data = await response.json(); // Parse the response if needed
    console.log('Email sent successfully:', data);
  } catch (error) {
    throw error;
  }
};


export default SendEmail;