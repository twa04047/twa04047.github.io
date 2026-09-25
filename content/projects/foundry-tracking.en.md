## Project overview

I developed a **Palantir Foundry monitoring PoC** for examining mobile femtocell activity and movement history. The workflow processes telecom events into indicators, narrows down candidates and presents their movement over time on a map.

Raw logs make it difficult to see which cells warrant attention, what supports an anomaly flag, and how observations at different times connect. I organized these tasks into **anomaly flag monitoring** and **route exploration** views.

This public case study uses dummy data. Cell and target identifiers, coordinates, dates and values illustrate the workflow. They do not represent actual operational results.

## My contribution

I developed location-processing logic and preprocessing, and built the Workshop UI/UX for exploring the results. This included preparing coordinates and route structures for the map and connecting them to selection and filtering interactions.

| Area | Implementation | Use in the interface |
| --- | --- | --- |
| Data processing | Organize telecom event times and cell information into daily indicators and flags | Inspect anomaly candidates and supporting indicators |
| Location processing | Combine surrounding connection history with location metadata and build visit segments | Explore visited areas and sequence |
| Ontology integration | Connect processed data through objects and relationships | Retrieve summaries and details for a selected cell |
| Workshop UI/UX | Build target lists, indicator details, a map, timeline and charts | Review candidates and examine routes |

## From events to the interface

The monitoring pipeline transforms dummy telecom events into daily data marts, then **separates final flags from detailed indicators**. These outputs feed linked Ontology objects, which Workshop displays together.

![Data Lineage for the dummy-data PoC. Daily marts feed flag and detail datasets, which become two linked objects consumed by the Workshop monitoring module.](../../../media/foundry/data-lineage.png)

| Stage | Processing |
| --- | --- |
| Input | Dummy events with cell identifiers, connection start and end times, subscriber references and message types |
| Pipeline Builder | Event preparation, time- and target-based aggregation, detailed indicators and final flags |
| Ontology | Linked anomaly summary and daily detail objects |
| Workshop | Flags, details and configuration values for the selected target |

![Pipeline Builder workflow using dummy data. Indicator calculations branch and feed the monitoring outputs.](../../../media/foundry/pipeline-builder.png)

The explicit processing stages make it possible to trace a displayed result back to its inputs and transformations. [Open the full-resolution pipeline screenshot](../../../media/foundry/pipeline-builder.png)

## Inspecting anomaly flags and their basis

The monitoring view places all cells and anomaly candidates on the left, with final flags, detailed flags and indicators in the center. This supports moving from a selected candidate to the information behind its flags.

![Anomaly monitoring with dummy data: cell lists on the left, final and detailed flags in the center, and a configuration panel on the right.](../../../media/foundry/flag-monitoring.png)

Connection-time, subscriber-count and message-related indicators provide context beyond a single anomaly label. A configuration panel and an entry point for changing settings are also present. Values shown in the screenshot are PoC examples.

Flags identify **candidates for further review**, with detailed indicators and movement history providing context for that review.

## Exploring movement over time

The location-processing workflow combines connection history before and after a target event with location metadata. The archived PySpark implementation includes coordinate conversion, time ordering, segmentation when the visited area changes, representative coordinates and route segments.

1. **Link observations:** connect relevant events around a target connection to assemble evidence for location estimation.
2. **Build visit segments:** group consecutive visits within an area and calculate start and end times and representative coordinates.
3. **Prepare spatial properties:** normalize coordinates and generate GeoPoints, bearings and GeoJSON line segments.
4. **Explore the result:** select a target, inspect visited areas and dwell times, and use the map timeline to examine movement.

The route view combines a target selector, a visited-address count, a distribution by area, a dwell-time chart and a map timeline. The original recording above demonstrates target changes and timeline interactions affecting the displayed route.

Map lines connect observed or aggregated locations in time order. They do not describe a road-level route or establish GPS-level accuracy.

## Design considerations

**Connecting summaries and details.** Scanning anomaly candidates and examining their supporting indicators require different levels of detail. Separating flags from detailed metrics and linking their objects lets the interface present both for the same cell.

**Turning logs into map objects.** Coordinates alone do not form a usable movement history. Visit segments, representative locations and relationships to subsequent points must be computed and expressed as spatial properties.

**Data dependencies and interface variables.** I documented circular dependencies between input and output datasets. Separate technical examples explain how TypeScript Functions, Ontology objects and Workshop selection variables connect.

## Related collaboration and disclosure

Before this project, I collaborated with Palantir engineers on a separate Foundry PoC. The photographs below show a presentation about that collaboration and a WIS demonstration. They provide context for this experience and are separate from performance evidence for the mobile femtocell PoC.

![Sharing the KT × Palantir PoC experience. I am seated in the middle wearing a light-colored shirt. Other participants' faces have been pixelated.](../../../media/foundry/poc-presentation-mosaic.png)

![At the WIS demonstration booth for Palantir-based early detection of wired-network anomalies.](../../../media/foundry/wis-demo.jpeg)

The public material demonstrates a **PoC connecting data processing, object relationships, candidate review and route exploration**. Archived materials were inspected. Detection rates, false-positive rates, processing times and production impact were neither disclosed nor newly measured.

**Work produced with actual internal company data is confidential and cannot be disclosed.** Raw telecom logs, subscriber information, internal analysis files and production results are excluded from this portfolio.
