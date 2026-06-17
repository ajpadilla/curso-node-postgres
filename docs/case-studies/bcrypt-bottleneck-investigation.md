# Bcrypt Bottleneck Investigation

## When “Good Architecture” Meets Performance Reality

---

# Introduction

For months, I focused heavily on improving the architecture of my application.

Like many developers early in a project, my initial implementation prioritized **speed of development**. The goal was simple: make things work first.

As the project evolved, however, I started redesigning the system to prioritize maintainability, boundaries, and scalability.

I invested time learning and applying concepts such as:

* Design patterns
* System design
* Object-oriented programming
* SOLID principles
* Clean Architecture
* Separation of concerns
* Layered boundaries

These architectural decisions eventually enabled me to implement more advanced engineering practices across the application:

* Structured error handling
* Observability
* Monitoring
* Health checks
* Security abstractions
* Testing strategies to validate boundaries and responsibilities

At first, these improvements felt like the definition of a “better system.”

The code became:

* More organized
* More modular
* Easier to reason about
* Easier to test
* Easier to extend

The application no longer looked like a collection of files trying to survive.

It started looking like a system.

But eventually, I realized something important:

> Good architecture does not automatically mean good performance.

That realization changed the way I started evaluating software quality.

Because there is an uncomfortable truth in backend engineering:

A system can have:

* clean folder structures
* dependency injection
* perfectly separated responsibilities
* proper abstractions
* beautiful service boundaries

…and still perform poorly under load.

At some point, architecture stops being a theoretical discussion and reality starts asking harder questions:

> What happens when real traffic hits the system?

> How much pressure can the application sustain?

> Where does time actually go during a request?

> Which component becomes the bottleneck?

This is where performance stops being abstract.

Latency becomes reality.

Throughput becomes reality.

CPU usage becomes reality.

Infrastructure behavior becomes reality.

And suddenly, software quality is no longer only about clean code.

It becomes about measurable behavior.

That mindset led me to investigate one of the most common backend operations:

**User registration.**

At first glance, the flow looked extremely simple.

```txt
POST /api/v1/users
```

The request would:

```txt
Validate request
        ↓
Check if email exists
        ↓
Hash password using bcrypt
        ↓
Persist user into PostgreSQL
        ↓
Return response
```

Nothing about this flow looked suspicious.

The application was layered.

Responsibilities were separated.

The code was asynchronous.

Everything looked correct from an architectural perspective.

My initial assumption was:

> “This should scale reasonably well.”

After all, Node.js is asynchronous.

The code was clean.

The layers were isolated.

The request path looked lightweight.

At least, that was the assumption.

So I decided to test it.

Not based on intuition.

Not based on feelings.

But based on measurable evidence.

That decision eventually led me to discover something unexpected:

A seemingly harmless `bcrypt.hash()` operation was saturating CPU resources and becoming the dominant bottleneck in my entire registration flow.

This investigation completely changed how I think about:

* asynchronous code
* Node.js internals
* CPU-bound operations
* observability
* system bottlenecks
* and what “scalability” actually means

This article documents the entire investigation process.

From load testing, to Prometheus metrics, to Linux process inspection, to understanding how Node.js worker threads actually behave under CPU pressure.

Most importantly, it documents a lesson that changed the way I think about backend systems:

> Architecture enables investigation.
> Performance validates reality.

---

# The Registration Flow

Before jumping into metrics and load testing, it is important to understand the actual flow being investigated.

The endpoint under analysis was a standard user registration endpoint:

```txt
POST /api/v1/users
```

At a high level, the request passed through multiple application layers:

```txt
HTTP Request
      ↓
Router
      ↓
Validation Middleware
      ↓
User Service
      ↓
User Repository
      ↓
PostgreSQL
```

Inside the service layer, the registration logic looked conceptually like this:

```txt
Validate email
       ↓
Search existing user
       ↓
Hash password (bcrypt)
       ↓
Persist user
       ↓
Return response
```

From an architectural perspective, this looked reasonable.

The application followed layered boundaries:

### Router Layer

Responsible only for:

* receiving HTTP requests
* validation
* delegating execution to the service layer

No business logic lived here.

---

### Service Layer

Responsible for business rules:

* checking whether the email already existed
* coordinating password hashing
* orchestrating persistence

This layer contained the actual registration workflow.

---

### Repository Layer

Responsible only for database interaction.

The service layer did not care whether persistence was implemented using:

* Sequelize
* raw SQL
* another ORM
* or even another database

The abstraction kept responsibilities isolated.

---

### Security Layer

Password hashing was abstracted behind a dedicated component:

```js
class BcryptPasswordHasher {
  async hash(plain) {
    return bcrypt.hash(plain, 10);
  }
}
```

At first glance, this looked perfectly fine.

In fact, it looked *correct*.

Password hashing should be computationally expensive for security reasons.

`bcrypt` exists specifically to make password cracking harder.

So naturally:

> Some latency is expected.

But the important question is:

> **How much latency is acceptable?**

And more importantly:

> **Could password hashing become the dominant bottleneck of the entire system under concurrency?**

At this point, I still did not suspect `bcrypt`.

The application was asynchronous.

The architecture was clean.

And nothing in the code visually suggested a performance issue.

Which is precisely why intuition alone is dangerous in performance engineering.

Instead of guessing, I decided to create a reproducible experiment.

And that experiment started with load testing.
