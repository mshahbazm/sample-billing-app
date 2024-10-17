### System Design
System will have 5 services, each with its own concern.

#### Subscription Management: 
Manages customers and Pricing plans. And Plan assignment 
Customers are being saved as durable objects, and pricing plans in KV.
Durable objects alarms will trigger the invoice generations at the end of billing cycle. 
Invocing service is bound with subscription service with "service binding", and easy to communicate between each other, to request invoice generations.

#### Invocing: Generates Invoices
Generates invoices and with the help of queue communicates with Notification service to send email notification 

#### Notification Services
Listens to messages on NOTIFICATION_QUEUE, as per the input data it sends email notifications.

#### Billing Engine (Not coded)
Needs to save rules for prorated billing i.e. how much to charge if updagraded from starter plan to pro etc.

5.Payments (Not Coded)
Handles payments

## Notes:
Its not compelte by any means. Most complete service is Subscription and it can demonstrate my skills, and understanding of the system. Rest of services are partial. and 2 are missing.

Every service has its own workspace (sub-directory) and readme file explains the steps needed to make it work.

