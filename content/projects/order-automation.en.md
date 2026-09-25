## Solo end-to-end development, starting with customer requirements

An **end-to-end project in active development** for KoreaFire's order and inventory workflow. **I am the sole developer**, responsible for everything from understanding customer requests to building the frontend, backend, API integration, data processing, and deployment preparation.

Employees check ERP orders, organize quantities by delivery date, and compare them with inventory in a daily dispatch workbook. I am connecting these steps in one browser application, designing the business rules, data flow, and performance alongside the interface and server.

| My responsibility | Implementation and ongoing work |
| --- | --- |
| Customer requirements | Translate the daily workflow into specifications for date conditions, aggregation, and inventory input |
| Frontend | Dashboard, query conditions, progress, table search and sorting, and inventory forms |
| Backend | Python server, request validation, background jobs, and feature orchestration |
| ERP API integration | Amaranth10 authentication and request contracts, header/detail retrieval, and up to 16 concurrent requests |
| Data processing and performance | Persisted CSV cache, reuse and selective refresh, weekly aggregation, XLS parsing, and XLSX output |
| Validation and deployment preparation | Feature checks, Windows launcher and installer configuration, and design of the next planning stage |

**Order retrieval, aggregation, Excel exports, and inventory input are implemented; the overall project remains in development.** Production planning optimization is next. I use Codex during development.

## From roughly a day of work to under three minutes

**Order review and preparation that took roughly a day can now be handled in under three minutes.** The main performance improvements combine up to 16 concurrent API requests with a persisted query cache that reuses previously collected data.

| Previous workflow | After automation | Main improvements |
| --- | --- | --- |
| Roughly a day | **Under 3 minutes** | 16 concurrent requests + stored-data reuse + selective refresh |

This is an approximate before-and-after workflow comparison based on user experience. It reflects the combined effect of concurrent requests, caching, and automated aggregation.

The aim is to **turn orders into usable inputs for production decisions**. Implemented features include Amaranth10 order retrieval, weekly aggregation, filtered Excel exports, and inventory input from dispatch workbooks. Production optimization is the next development stage.

## An application built around the daily workflow

The dashboard offers two entry points: **daily order quantities** and **production-plan preparation**. The first retrieves and summarizes orders; the second reads workbook inventory and collects minimum-stock levels.

These images were captured directly in a browser running the original application locally. All orders, products, business units, and quantities are synthetic portfolio examples. No customer records or live ERP responses are included.

![Original order-query interface, captured with synthetic data. Separate order-date and delivery-date ranges define the query.](../../../media/orders/query.jpg)

| Step | Implemented processing | User-facing result |
| --- | --- | --- |
| Set conditions | Validate four dates and freeze the query conditions | Results tied to a clear date range |
| Retrieve orders | Join ERP headers and details; filter dates; synchronize the pending-order cache | Order, product, and delivery details |
| Aggregate quantities | Sum the same detail snapshot by product and delivery week | Weekly demand table |
| Export work | Apply column filters and generate an XLSX for each table | Separate single-sheet detail and summary files |
| Prepare production inputs | Parse the dispatch XLS and collect minimum-stock levels | An input snapshot for a future planning engine |

## One result set, from details to weekly demand

The detail table includes order and product identifiers, order and delivery dates, specifications, department, approval status, and quantities. Wide tables support horizontal scrolling, with search and sorting on individual columns.

![Order details, column filters, and the Excel export action. This capture shows 12 synthetic order lines.](../../../media/orders/order-details.jpg)

The aggregation key is the **Monday-to-Sunday week containing the delivery date**, together with the product code. Weeks crossing a month or year boundary remain intact. Quantities use `Decimal`; invalid quantities are excluded and counted.

![Weekly demand by delivery week and product. All quantities shown are illustrative.](../../../media/orders/weekly-summary.jpg)

The browser and Excel export share filtering rules. Downloads contain the filtered rows in the table's specified default order, independently of temporary sorting in the browser. This keeps exported files consistent while allowing flexible exploration.

## Overlapping API waits with 16 concurrent requests

The order-detail endpoint accepts one order number per request. Sequential execution accumulates the response wait for every order. I implemented **multithreaded retrieval using Python's `ThreadPoolExecutor`, with up to 16 detail API requests running concurrently**.

While one thread waits for a response, other threads can make progress. The worker count is `min(number of requested orders, 16)`. Results are assembled in input order regardless of completion order, and one failed request does not stop the others.

**Overlapping response waits speeds up initial collection and changed-order refresh.** A bounded worker pool prevents unrestricted request growth, and completed requests drive the progress indicator.

## Reusing a persisted query table instead of repeating API calls

Another major performance improvement is **storing data already retrieved from the API and reusing it**. A CSV cache table combines ERP headers and details into a query-ready dataset, serving a role similar to a small data mart.

`pending_order_details.csv` stores order and line identifiers, products, order and delivery dates, quantities, and modification information. `sync_state.csv` stores the synchronization date and cache validation metadata. Filtering, weekly aggregation, and Excel output operate on this stored data.

The flow is **ERP retrieval → persisted query table → UI filtering, weekly summaries, and Excel output**. Reviewing different conditions does not require retrieving every order detail again.

| Query timing | Processing |
| --- | --- |
| Initial query or cache rebuild | Retrieve headers and details to construct a CSV cache |
| First query on a new date | Compare the full header snapshot for new, modified, cancelled, and deleted orders; refresh the required details |
| Another query on the same date | Filter and display the valid stored CSV snapshot |

On a new date, header information is compared with the stored state, and **only selected new or modified orders require detail requests**. Cancelled, deleted, and expired entries are also reconciled. In the specification's example, a cache containing 9,000 orders with three selected new or modified orders requires **three detail requests instead of 9,000**.

Concurrency overlaps waiting within a query; caching reduces the work required on subsequent queries. **A same-day query with a valid cache makes zero header and detail API calls.** A background job exposes its stage and completed count to the UI. Cancellation prevents new detail requests from starting.

Cache validation checks the company code, schema, query date, and a SHA-256 digest. A lock coordinates updates, and temporary files are replaced atomically. Partial failures and stale fallback results carry explicit completeness and freshness states; Excel export is restricted when the result is unsuitable for a current report.

## Turning a dispatch workbook into inventory inputs

The application accepts the existing `.xls` format. It verifies that the first sheet is the daily dispatch ledger and identifies inventory blocks by the consecutive **carryover → inbound → outbound → stock** labels. Product headers containing the target product-family name are extracted from those blocks.

Duplicate product names in different columns retain their source-cell identities. Formula cells use the workbook's saved calculation values; missing or erroneous results cause validation to fail.

![Six synthetic products read by the application's XLS parser. Users compare current stock with minimum-stock inputs and adjust values in steps of 100.](../../../media/orders/inventory-input.jpg)

Minimum stock must be a nonnegative integer. Changing the dates or file invalidates the previous result. The completed `ProductionPlanInputSnapshot` keeps conditions, source products, stock, and minimum-stock values together for a future calculation layer.

The current **Generate** action prepares those inputs. It does not yet produce a final production schedule or manufacturing instruction.

## Modular implementation and Windows delivery

Feature specifications map to independent implementation modules. An application layer controls execution order, while feature modules avoid direct dependencies on one another. Date validation, aggregation, and spreadsheet output can be verified separately.

| Layer | Responsibility |
| --- | --- |
| Web UI | HTML, CSS, and JavaScript for conditions, progress, table exploration, and inventory input |
| Python application layer | Request validation, background jobs, cache synchronization, and orchestration |
| Feature modules | Date rules, header/detail processing, Decimal aggregation, XLS parsing, and XLSX generation |
| ERP integration | Separate request contracts, HMAC-SHA256 signing, and credential/error-message masking |
| Windows packaging | PyInstaller, Inno Setup, a local-server launcher, and a pure-Python XLSX adapter |

ERP credentials remain on the server. The Windows configuration bundles the runtime and starts a server on `127.0.0.1`, allowing users to work through a browser without a development environment. Installer and launcher code exists; installation and production operation on customer PCs were not validated as part of this portfolio preparation.

## Next: balancing production runs and stored inventory

Combining several weeks of demand into one run reduces production runs but increases stored inventory. The next goal is to decide **which product to manufacture, in which week, and in what quantity**, using orders, stock, minimum stock, and capacity constraints.

Design documents examine delivery commitments, production runs, and inventory holding. The latest proposal considers a 17-week horizon, weekly product and capacity limits, and minimum batches. Differences from earlier documents in horizon and capacity interpretation still need a final specification. The optimization engine, schedule export, and factory integration remain future work.

The current result connects **ERP orders, a persisted query cache, reviewable summaries and Excel files, and inventory-based planning inputs**. Based on user experience, the workflow has moved from roughly a day to under three minutes. Inventory reduction is a future outcome to evaluate with the planning engine.
