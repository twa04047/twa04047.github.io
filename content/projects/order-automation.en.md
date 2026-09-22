## The current workflow
At a friend's company, employees manually enter order, inventory, and manufacturing quantities in Excel and an ERP system. I am developing an application to connect and automate this workflow.

The project uses the ERP Open API to obtain order quantities and aims to cover the flow from orders to production planning.

## What I am building
The goal is to provide visibility into orders, inventory, and manufacturing quantities, and automatically pass manufacturing quantities to the factory workflow. Development uses Python and the ERP API, with Codex assistance.

## Next implementation goals
**The production-quantity optimization model still needs to be developed.** It is not presented as a completed or production-validated model.

- Logic for determining manufacturing quantities from orders and inventory
- Passing the resulting quantities to the factory workflow
- Visibility into order, inventory, and production status

The optimization objective, constraints, and exact scope of automated updates will be defined against the actual business process.

## Why this project
I started this project to expand my experience across an end-to-end data application. It is an **ongoing personal project**. Completed features and real-user validation will be documented as development progresses.
