# Product Pulse Dashboard

Role : You are a Senior Principal Product Designer & Frontend Architect.

Goal : Create a PM dashboard that shows the product analytics, which is a result of the synthesis of the product data ingested 

from support tickets, email and customer support slack channels. 



Key Capabilities: 



A PM may be managing multiple product line and may want to synthesize feedback for one or more of their products. They should be able to specify the product line or product lines they are interested in synthesizing the feedback for.



They should be able to run these synthesis reports on a pre-determined cadence - for example every monday or 1st of every month or request that these reports be run on demand. PM should be able to specify date ranges, so that stake feedback is not taken into consideration



The output should be presented in two formats : Summary and long form. Summary summarized the long form report in terms of how many customer provided feedback in what category and any callouts that may require immediate attention. How many time the same feature was requested bu how many customers etc



The report should categorize the feedback for example



Customer Name 

Feedback Category

Improvement requests (for example Customer Satisfaction issues, Bugs, New Fetaure Requests, Security Issue)

Description : Summary of the issue raised

Churn Risk : [N/A, High, Medium, Low]

Confidence Score : How confidently has the feedback been captured [High, Low]





User Interface considerations : 



The interface should have two panels 

Side Panel 

In the side panel allow the PM to filter the product they wish to populate the dashboard for.  The choices are All products ,  A single product  or a few products at a time 

In the side panel allow the PM to filter the customer they wish to populate the dashboard for.  The choices are All customers ,  A single customer  or a few customers at a time 

In the side panel allow the PM to filter the product hey wish to populate the dashboard for. The user should be able to choose The choices are All Customers/products ,  A single customer/product  or a few customers/products  at a time 

The PM should be able to pick a date range for which the analytics report should be displayed. The defaults date is the current dare, but PM should be able to pick a date range 

User should also be able to set a schedule or specify a cadence at which the report must automatically be created 

Main Panel

The main panel should be dividend into two section. The section at the top should show a summary of the insights gained from the analysis. 

The section at the bottom should show categorized raw data, with attributions and confidence rating. 

Specify churn risk, if the information predicts that the customer may be at churn risk.  Provide filter to filter on various extracted categories  

Provide citation for each piece of feedback summarized to it’s originating content

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/76032c7b-4bc1-4a99-b83e-9d7e39534f15).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
