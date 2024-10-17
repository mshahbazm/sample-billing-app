Flow:
Customer is added with a subscription plan id. 
This shall trigger invoice generation worker to send email to the customer
Customer pays the invoice, and its subscription status will be set to active is payment is passed
If payment failed, 3 retry attemps will be made (once a day).



Assumptions:
When Creating customers, subscription status will be set to 'unpaid' so that invoice can be sent.
Customer gets activated once payment has been made against the invoice.

