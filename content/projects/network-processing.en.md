## The problem
Within a network anomaly-detection project, I worked on preprocessing that checks whether an IP address belongs to a CIDR range. My contribution focused on improving this lookup, rather than building the entire detection system.

## My implementation
I applied **binary search and Numba** to IP-to-subnet membership lookup. The wider project used Python and PySpark.

- Scope: CIDR membership lookup during preprocessing
- Search approach: binary search
- Execution optimization: Numba

The exact data structure and implementation sequence will be documented after reviewing the original code.

## Scope and validation
The contribution described here is **preprocessing lookup optimization**, not development of the anomaly-detection model itself.

Before-and-after timings, input size, execution environment, and output-equivalence checks will be added after reviewing the code and available records. No unverified performance figures are presented.
