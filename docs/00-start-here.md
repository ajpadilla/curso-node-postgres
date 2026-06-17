# Shopcore API — Engineering Overview

This project is an ecommerce backend focused on backend architecture, authentication, observability, testing, and production readiness.

## Main Engineering Goals

* Build a modular backend using Clean Architecture ideas
* Separate business logic from frameworks
* Create a testable authentication system
* Add observability (metrics, logs, health checks)
* Simulate production debugging workflows
* Practice infrastructure automation

## Recommended Reading Order

1. System Architecture
2. Authentication Flow
3. Testing Strategy
4. Observability
5. PostgreSQL Automation
6. Performance Investigation

## Core Technical Areas

* Node.js
* Express
* PostgreSQL
* Sequelize
* JWT Authentication
* Passport.js
* Prometheus
* Grafana
* Docker
* Winston Logging
* Playwright
* Jest

## Example Engineering Problems Solved

* Centralized error handling
* Authentication using JWT + Passport
* Request correlation with request IDs
* Metrics instrumentation using Prometheus
* Health checks for database availability
* Testing using fake repositories and real integrations
* PostgreSQL automation scripts
