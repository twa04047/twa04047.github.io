## My contribution

For a Usage-Based Insurance (UBI) proposal, I connected large-vehicle driving records with insurance accident histories to **compare driving behavior between vehicles with and without recorded accidents**. I developed the preprocessing, aggregation and analysis code that turned second-by-second records into vehicle-level indicators.

The main challenges were repetitive work and processing time. I **automated an Excel workflow in Python** and **made processing 11× faster by replacing core row-by-row loops with pandas column operations**. I implemented supplied analysis and decision criteria and owned the data-processing and output-generation code.

## The complete processing workflow

```ubi-process
```

The pipeline derives speed changes, direction changes, RPM and braking features for each trip, then aggregates them by vehicle. Distance- and time-based ratios account for differences in driving exposure. Insurance histories are joined using anonymous vehicle IDs.

| Perspective | Example features | Input records |
| --- | --- | --- |
| Speed changes | Harsh acceleration, deceleration and stops | Speed differences, brake signals |
| Direction changes | Harsh lane changes and turns | Direction differences, rolling windows |
| Driving conditions | Speeding, steady-speed, high-RPM and night driving | Speed, RPM, timestamps |
| Vehicle comparison | Events per distance or time | Trip distance and driving duration |

**An accident count of zero defines the no-accident group; one or more defines the accident group.** For vehicles matched to insurance information, F-tests and independent-samples T-tests compare the groups' indicators. Group membership comes from observed accident history; the T-test assesses differences in group means.

## From loops to pandas: 11× faster

```ubi-performance
```

The original approach iterated through records, compared consecutive values and accumulated counts. I moved the core calculations into **column differences, boolean masks, rolling windows and grouped aggregations** to reduce the cost of per-record iteration.

| Calculation | Implementation approach |
| --- | --- |
| Consecutive speed and direction changes | Column differences with `diff()` |
| Changes over a time window | `rolling()` and `shift()` |
| Records meeting a condition | Boolean masks, `sum()` and NumPy conditions |
| Combining trips by vehicle | Aggregation with `groupby()` |

The optimization focused on **vectorizing repeated calculations across rows**. Outer loops over files and trips remained while pandas handled the calculations applied to many records.

```python
# Simplified illustration: one vehicle/trip, sorted by timestamp
speed_change = trip["SPEED"].diff()
high_rpm_time = (trip["RPM"] > rpm_threshold).sum()
direction_window = trip["DIRECTION"].diff().rolling(5).sum()
```

The actual direction calculation also handles the 0°/359° boundary and feature-specific filters. Interpreting record counts as seconds requires attention to sampling intervals and missing or duplicate records.

## Automating the Excel workflow

I connected the process from reading insurance Excel files to producing result workbooks. The code applies the cleaning, aggregation and analysis rules previously handled through repetitive spreadsheet work.

| Task | Python implementation |
| --- | --- |
| Collect insurance inputs | Read multiple sheets, remove explanatory rows and combine data |
| Select eligible records | Apply ownership/date filters and handle missing or unresolved claims |
| Summarize accident history | Aggregate accident counts and claim amounts; map anonymous serial IDs |
| Connect driving and insurance | Join vehicle-level driving features to accident histories |
| Produce comparison results | Statistical tests, tables, distribution charts and Excel/CSV exports |

Encoding each step made the workflow repeatable and allowed results to be regenerated when the analysis criteria changed.

## Stored data and monthly scale

I inspected **all 10,000 CSV files** in `ubi_data/csv_data`. These are counts of the stored files, separate from the monthly estimates below.

| Measure | Stored CSV files |
| --- | ---: |
| Files | 10,000 |
| Data rows, excluding headers | **252,781,483 · about 252.8 million** |
| Data columns | **13** |
| Uncompressed CSV size | **23.24 GB · about 21.65 GiB** |
| Average row size, excluding headers | Approximately 92 bytes |

The CSV files also contain one saved index column. The row total counts stored records, not unique observations or elapsed driving time. The separate 501 Parquet files (about 7.79 GB) and vehicle mapping file are excluded from this total.

```ubi-scale
```

**One vehicle recorded every second for 30 continuous days produces 2,592,000 rows.** At eight hours per day, that becomes **864,000 rows**. Under the same assumptions, row counts and estimated storage scale with fleet size.

## Schema and synthetic examples

**Every value below was invented to illustrate the format.** No real vehicle IDs, timestamps, driving records or insurance histories are published. In the analysis files, `VIN` contains an anonymous serial identifier.

| Column | Meaning | Synthetic example |
| --- | --- | --- |
| `VIN` | Anonymous vehicle identifier | `DEMO-001` |
| `TRIP_DATE` | Driving date | `2030-01-01` |
| `TRIP_COUNT` | Trip number within the day | `1` |
| `TRIP_TIME` | Record timestamp | `2030-01-01 09:00:00` |
| `RPM` | Engine revolutions per minute | `1,200` |
| `SPEED` | Vehicle speed, km/h | `40` |
| `DIRECTION` | Heading, 0–359° | `90` |
| `ACCEL_X` | Raw X-axis acceleration value | `1.0` |
| `ACCEL_Y` | Raw Y-axis acceleration value | `0.0` |
| `BRAKE_YN` | Encoded brake signal | `48` |
| `DAY_DISTANCE` | Daily cumulative distance | `12` |
| `TOTAL_DISTANCE` | Total cumulative distance | `10,012` |
| `STATUS` | DTG device status code | `0` |

This three-second synthetic sequence shows selected columns from a single vehicle and trip, ordered by timestamp.

| VIN | TRIP_TIME | SPEED | RPM | DIRECTION | BRAKE_YN |
| --- | --- | ---: | ---: | ---: | ---: |
| DEMO-001 | 2030-01-01 09:00:00 | 40 | 1,200 | 90 | 48 |
| DEMO-001 | 2030-01-01 09:00:01 | 42 | 1,250 | 91 | 48 |
| DEMO-001 | 2030-01-01 09:00:02 | 39 | 1,180 | 91 | 49 |

The parser stores `BRAKE_YN` characters `0/1` as ASCII codes `48/49`. Acceleration, distance and device status values must be interpreted according to the source format and processing code.
