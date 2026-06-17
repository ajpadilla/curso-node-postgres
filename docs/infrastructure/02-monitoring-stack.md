# Monitoring Stack

## Overview

As the project evolved, simply running the application was no longer enough.

The next challenge became answering operational questions:

* Is the application healthy?
* Is PostgreSQL available?
* Are requests becoming slower?
* Are users experiencing errors?
* How can problems be detected before users report them?

To answer these questions, the project introduced a monitoring stack composed of:

* Health Checks
* Application Metrics
* Prometheus
* Grafana

Together these components provide visibility into the behavior and health of the system.

---

# Why Monitoring Matters

Without monitoring, system failures are often discovered by users.

Example:

User
↓
Application Failure
↓
Support Ticket
↓
Investigation Begins

This approach is reactive.

Monitoring enables a more proactive workflow:

Application Problem
↓
Metric Changes
↓
Monitoring Detection
↓
Investigation Begins

The objective is to reduce the time required to detect and diagnose failures.

---

# Monitoring Architecture

Current monitoring flow:

Application
↓
Prometheus Metrics Endpoint
↓
Prometheus Scraping
↓
Time-Series Storage
↓
Grafana Dashboards
↓
Operator Analysis

Each component has a specific responsibility.

---

# Health Checks

## Purpose

Health checks provide a simple answer to:

"Can the application currently perform its core responsibilities?"

Health endpoints are intentionally lightweight.

Example:

GET /health

Response:

{
"status": "ok",
"db": "connected"
}

---

## Database Health Verification

The application verifies PostgreSQL connectivity.

Flow:

Health Endpoint
↓
Health Service
↓
Database Health Indicator
↓
PostgreSQL

Benefits:

* Early detection of database failures
* Easier deployment verification
* Improved operational visibility

---

# Metrics

## Purpose

Health checks provide a snapshot.

Metrics provide historical visibility.

Health Check:

"Is the system healthy right now?"

Metric:

"How has the system behaved over time?"

Metrics allow engineers to identify trends, bottlenecks, and regressions.

---

# HTTP Metrics

The application records information about incoming requests.

Examples:

* Request count
* Request duration
* Error count

Example flow:

HTTP Request
↓
Metrics Middleware
↓
Prometheus Metric
↓
Stored Time Series

These metrics provide visibility into application behavior under real traffic.

---

# Request Duration

One of the most important metrics is request latency.

Question:

How long does the application take to respond?

Example:

POST /api/v1/users

```
p50 = 20ms
p95 = 90ms
p99 = 200ms
```

These values help identify performance degradation.

---

# Error Metrics

Monitoring request failures is equally important.

Examples:

* 4xx responses
* 5xx responses

Increasing error rates often indicate:

* application bugs
* infrastructure problems
* database issues

Tracking errors over time helps detect incidents earlier.

---

# Prometheus

## Purpose

Prometheus is responsible for collecting and storing application metrics.

The application exposes metrics through:

GET /metrics

Prometheus periodically scrapes this endpoint.

Flow:

Application
↓
/metrics
↓
Prometheus
↓
Time-Series Database

Prometheus becomes the central source of operational data.

---

# Why Prometheus Was Chosen

Prometheus is widely adopted in modern infrastructure environments.

Benefits:

* Open source
* Powerful query language (PromQL)
* Time-series storage
* Strong ecosystem support

It integrates naturally with containerized applications and cloud-native environments.

---

# Grafana

## Purpose

Grafana transforms raw metrics into visual dashboards.

Without Grafana:

Metric Data
↓
Raw Numbers

With Grafana:

Metric Data
↓
Charts
↓
Trends
↓
Insights

Visualization makes operational analysis significantly easier.

---

# Example Dashboards

Potential dashboard sections include:

Application Overview

* Request rate
* Error rate
* Latency

Database Health

* Connectivity status
* Query performance

Infrastructure Overview

* CPU usage
* Memory usage

These dashboards help engineers quickly understand system behavior.

---

# Practical Debugging Workflow

Monitoring becomes valuable during incidents.

Example:

Users report slow registration requests.

Investigation:

User Reports
↓
Grafana Dashboard
↓
Latency Increase Detected
↓
Prometheus Metrics
↓
Identify Bottleneck
↓
Root Cause Analysis

Monitoring reduces guesswork and accelerates troubleshooting.

---

# Example: bcrypt Bottleneck Investigation

One practical use case involved investigating authentication performance.

Observed symptom:

Registration requests became slower under load.

Investigation flow:

Autocannon Load Test
↓
Request Duration Metrics
↓
CPU Utilization Analysis
↓
bcrypt Saturation Identified

Without metrics, identifying the bottleneck would have been significantly more difficult.

Monitoring provided evidence instead of assumptions.

---

# Engineering Principles Learned

Building the monitoring stack introduced several important concepts.

---

## Observability

A system should expose enough information to understand its behavior.

Examples:

* health status
* latency
* errors
* throughput

Observability reduces debugging complexity.

---

## Proactive Operations

Monitoring enables engineers to identify problems before users report them.

This reduces downtime and improves reliability.

---

## Evidence-Based Debugging

Instead of guessing:

"I think the database is slow."

Monitoring allows engineers to verify:

"Database latency increased from 20ms to 300ms."

Operational decisions become data-driven.

---

## Performance Awareness

Metrics make performance measurable.

Without metrics:

Performance is subjective.

With metrics:

Performance becomes observable and quantifiable.

---

# Current Limitations

The current monitoring stack focuses primarily on:

* application metrics
* database health
* request visibility

Potential future improvements include:

* Alertmanager integration
* distributed tracing
* business metrics
* SLO monitoring
* infrastructure exporters
* incident dashboards

These additions would move the system closer to production-grade observability.

---

# Future Evolution

Current state:

Application
↓
Metrics
↓
Prometheus
↓
Grafana

Potential future state:

Application
↓
Metrics + Logs + Traces
↓
Prometheus + Loki + Tempo
↓
Grafana
↓
Alerting
↓
Incident Response

This progression reflects the natural evolution of modern observability systems.

---

# Summary

The monitoring stack was introduced to improve visibility into application behavior and operational health.

The current implementation combines:

* Health Checks
* Metrics
* Prometheus
* Grafana

Together these components provide the foundation for observability, performance analysis, and proactive system monitoring.

More importantly, the project demonstrates a shift from simply running software toward understanding and operating software in a measurable way.
