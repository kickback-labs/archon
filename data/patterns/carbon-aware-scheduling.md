# Carbon-Aware Scheduling

## Description

Carbon-Aware Scheduling is a sustainability architecture pattern that reduces the carbon footprint of flexible, long-running compute workloads by automatically scheduling them to execute when and where the electrical grid is powered by the highest proportion of renewable energy. Because carbon intensity (grams of CO₂ per kilowatt-hour) varies dramatically by geographic region and time of day based on the current generation mix (solar, wind, hydro vs. coal, gas), deferring non-urgent workloads to green windows can substantially reduce net carbon emissions without changing the workload itself.

Two primary strategies:
- **Temporal Shifting:** Pause a workload and resume it during hours when the local grid is cleanest (peak solar midday, peak wind nights)
- **Geographic Shifting:** Route flexible workloads to cloud regions currently powered by a higher proportion of clean energy (e.g., Nordic regions with near-100% hydro, or regions with current high solar generation)

## When to Use

- Long-running, deferrable compute workloads where timing is flexible — ML model training (days to weeks), batch ETL, video rendering, data backup
- Organisations with explicit carbon reduction commitments (net-zero targets, Science Based Targets initiative) seeking to reduce Scope 3 emissions
- Regulated industries where demonstrable carbon accounting is required
- Multi-cloud or multi-region architectures where geographic load shifting is architecturally feasible
- Sustainability is a stated quality attribute alongside cost, latency, and availability

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Batch compute with pause/resume capability (spot instances, preemptible VMs, managed batch services); scheduler that is carbon-intensity-aware |
| `analytics` | Carbon intensity data feed (Electricity Maps API, WattTime API, cloud-native carbon dashboards); job scheduling metadata |
| `devops` | Carbon-aware orchestrator (open-source: Carbon Aware SDK from Green Software Foundation; cloud-native: Azure carbon-aware scheduler, GCP carbon-intelligent platform); job completion SLA monitoring |

## Carbon Intensity Data Sources

| Source | Coverage |
|---|---|
| Electricity Maps | Global real-time and forecast grid carbon intensity per region |
| WattTime | US-focused real-time marginal emissions data |
| GCP Carbon Intelligent Computing | Native GCP temporal shifting for GCE workloads |
| Azure Sustainability Calculator | Carbon reporting; limited scheduling integration |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Carbon reduction** | Meaningful reduction in net emissions for deferrable workloads — studies show 20–50% reduction achievable |
| **Latency tolerance** | Only works for non-urgent workloads — green windows may not align with business deadlines |
| **Complexity** | Requires integration with real-time carbon intensity APIs and a carbon-aware scheduler layer |
| **Geographic shifting cost** | Running workloads in non-primary regions may increase egress costs and add data transfer complexity |

## Common Pitfalls

- Applying carbon-aware scheduling to latency-sensitive workloads — a workload with a strict 2-hour SLA cannot defer to a green window that is 8 hours away
- Not setting hard deadline constraints — a scheduler that indefinitely defers a job waiting for a green window that never comes will miss business SLAs
- Treating carbon-aware scheduling as a complete sustainability strategy — it reduces operational emissions but does not address embodied carbon in hardware, Scope 1/2 data centre emissions, or supply chain impacts
- Ignoring egress costs when doing geographic shifting — routing a petabyte job to a green region may cost more in egress than the carbon reduction is worth
