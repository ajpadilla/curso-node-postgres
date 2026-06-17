# Deployment Thinking

## Overview

Building an application locally is only the first step.

A backend system becomes truly useful when it can be deployed, operated, and maintained in a repeatable manner.

As this project evolved, deployment became an engineering concern rather than a manual process.

The goal shifted from:

"Can the application run?"

to:

"Can the application be deployed reliably?"

This change introduced several infrastructure concepts including:

* environment management
* release management
* service management
* reverse proxies
* monitoring
* automation

---

# The Early Development Workflow

During the initial stages of development, deployment was simple.

Workflow:

git pull
↓
npm install
↓
npm start

This approach works for local development but creates challenges as systems grow.

Problems:

* inconsistent environments
* manual configuration
* difficult rollbacks
* operational risk

The application could run, but deployment was not yet engineered.

---

# Separating Development and Deployment

A key realization was that development and deployment have different goals.

Development focuses on:

* feature creation
* experimentation
* rapid iteration

Deployment focuses on:

* stability
* repeatability
* reliability

The deployment process should minimize risk while ensuring predictable outcomes.

---

# Deployment Objectives

The deployment strategy was designed around several principles.

---

## Repeatability

A deployment should follow the same process every time.

Desired outcome:

Server A
↓
Deployment Process
↓
Application Running

Server B
↓
Deployment Process
↓
Application Running

Both environments should behave consistently.

---

## Reproducibility

A deployment should be recreated from documentation and automation rather than memory.

The process should not depend on:

* remembering commands
* personal notes
* tribal knowledge

Infrastructure should be reproducible.

---

## Safety

Deployment should minimize operational risk.

Examples:

* preserve configuration
* avoid accidental data loss
* support rollback strategies

The goal is to make deployments predictable and recoverable.

---

## Observability

A deployed system should expose information about its health.

Examples:

* logs
* metrics
* health checks

Without visibility, failures become difficult to diagnose.

---

# Application Structure

The deployment strategy separates application code from environment-specific data.

Example structure:

/opt/shopcore-api

```
current/
releases/
shared/
```

---

## Current

Contains the active application version.

Example:

/opt/shopcore-api/current

The running service points to this location.

---

## Releases

Stores versioned deployments.

Example:

/opt/shopcore-api/releases

Each deployment creates a new release directory.

Benefits:

* deployment history
* rollback capability
* easier troubleshooting

---

## Shared

Contains persistent resources.

Examples:

* .env
* uploads
* logs

Benefits:

* deployments remain stateless
* configuration survives releases

---

# Release Thinking

One important deployment concept is separating releases from source control.

Git is responsible for:

* source code history

Deployment is responsible for:

* running application versions

A release represents a deployable snapshot of the application.

Example:

Release 1
↓
Release 2
↓
Release 3

If Release 3 fails:

current
↓
Release 2

Rollback becomes possible.

This approach reduces deployment risk.

---

# Environment Management

Applications behave differently across environments.

Examples:

Development

* local database
* debugging enabled

Production

* managed database
* monitoring enabled
* stricter security

Environment-specific configuration is stored outside the application code.

Examples:

* database credentials
* JWT secrets
* SMTP credentials

This prevents configuration from being tied to deployments.

---

# Service Management

A deployed application should run independently from a terminal session.

For this reason, deployment planning includes service managers such as:

systemd

Benefits:

* automatic startup
* process supervision
* restart policies
* centralized logs

Example flow:

Server Boot
↓
systemd
↓
Node.js Application
↓
Application Available

This improves reliability.

---

# Reverse Proxy Layer

Directly exposing Node.js to the internet is rarely ideal.

A reverse proxy introduces an additional operational layer.

Planned architecture:

Client
↓
Nginx
↓
Node.js Application

Benefits:

* SSL termination
* request routing
* static file serving
* security controls

The reverse proxy becomes the public entry point.

---

# Database Deployment Considerations

Deployment is not limited to application code.

Infrastructure dependencies must also be considered.

Examples:

* PostgreSQL availability
* database migrations
* backup strategy
* credential management

The PostgreSQL automation script was introduced as part of this broader deployment strategy.

The goal is to ensure application and database environments evolve together.

---

# Monitoring and Operations

Deployment is incomplete without visibility.

Current monitoring stack:

Application
↓
Metrics
↓
Prometheus
↓
Grafana

Benefits:

* health visibility
* performance monitoring
* operational awareness

Monitoring enables engineers to verify that deployments behave as expected.

---

# Deployment Evolution

The deployment journey can be viewed as several stages.

Stage 1

Application
↓
Manual Startup

---

Stage 2

Application
↓
Environment Variables
↓
Manual Deployment

---

Stage 3

Application
↓
Systemd
↓
Managed Service

---

Stage 4

Nginx
↓
Node.js
↓
PostgreSQL
↓
Monitoring

---

Stage 5

Automation
↓
Repeatable Releases
↓
Operational Visibility

Each stage reduces manual effort and operational risk.

---

# Future Improvements

Potential future enhancements include:

* automated release creation
* deployment scripts
* CI/CD pipelines
* automated rollback
* infrastructure provisioning
* container orchestration

These improvements would continue moving the project toward production-grade deployment practices.

---

# Infrastructure Principles Learned

The deployment process introduced several important engineering concepts.

---

## Separation of Concerns

Application code, configuration, and infrastructure should be managed independently.

---

## Infrastructure as Code

Infrastructure configuration should be automated whenever possible.

---

## Release Management

Deployments should be treated as versioned releases.

---

## Operational Reliability

A system should remain available without manual intervention.

---

## Observability

Deployment success should be measurable rather than assumed.

---

# Summary

This project's deployment strategy evolved from manually running a Node.js application toward a more structured approach focused on reliability and operational readiness.

The design introduces concepts such as:

* release management
* environment isolation
* service management
* reverse proxies
* monitoring
* infrastructure automation

More importantly, it reflects a shift from development-focused thinking toward deployment and operations thinking, where the goal is not only to build software, but also to run software reliably.
