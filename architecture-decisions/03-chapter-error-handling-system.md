# **Chapter Two: Error Handling System**

## From Try-Catch Everywhere to Centralized Error Handling in Node.js

After spending years writing `try-catch` everywhere, I realized something important:

**Error handling is not just about catching failures — it’s about designing predictable systems.**

At first, adding `try-catch` blocks everywhere felt normal.

A controller failed? Add another catch.

A database validation error? Catch it again.

Authentication failed? Another catch block.

But over time, something started to feel wrong.

My controllers became noisy.

Business logic started mixing with infrastructure concerns.

Error responses became inconsistent.

And debugging production issues became harder than it should be.

I started noticing patterns like this everywhere:

```js
try {
  const user = await userService.create(data);
  res.status(201).json(user);
} catch (error) {
  logger.error(error);

  res.status(500).json({
    message: 'Something went wrong',
  });
}
```

At first glance, this seems fine.

But when error handling is scattered across an application, several problems start appearing:

* Repeated `try-catch` blocks everywhere
* Inconsistent HTTP responses
* Logging duplicated across controllers
* Business logic mixed with transport concerns
* Harder debugging and observability

For example, one endpoint returns:

```json
{ "message": "User not found" }
```

while another returns:

```json
{ "error": "Unexpected failure" }
```

Both represent failures.

But the system behaves inconsistently.

That inconsistency affects maintainability and makes APIs harder to consume.

## Rethinking Error Handling

Eventually, I stopped thinking:

> “How do I catch this error?”

and started asking:

> “How should failures move through the system?”

Instead of scattering error handling, I designed an **error pipeline**.

The idea was simple:

```text
Request
   ↓
Route
   ↓
Service throws domain error
   ↓
Error middleware pipeline
   ↓
Predictable HTTP response
```

The goal was to separate responsibilities.

* **Application layer** → throws business errors
* **Infrastructure layer** → translates failures into HTTP responses
* **Logging layer** → centralizes observability
* **Fallback handler** → guarantees predictable failures

Here is the middleware flow:

```js
app.use(errorMiddlewares.logErrors);
app.use(errorMiddlewares.ormErrorHandler);
app.use(errorMiddlewares.errorMapperMiddleware);
app.use(errorMiddlewares.boomErrorHandler);
app.use(errorMiddlewares.genericErrorHandler);
```

Instead of handling failures inside every controller, errors now flow through a dedicated pipeline.

## The Flow

Here’s what the request lifecycle looks like:

```text
Request
   ↓
Controller / Route
   ↓
Application Service
   ↓
throw new ConflictError()
   ↓
logErrors
   ↓
ormErrorHandler
   ↓
errorMapperMiddleware
   ↓
boomErrorHandler
   ↓
HTTP Response
```

For business failures, I introduced application errors:

```js
class ApplicationError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }

  toHttp() {
    return {
      status: this.status,
      message: this.message,
    };
  }
}
```

Then domain-specific failures extend it:

```js
class ConflictError extends ApplicationError {
  constructor(message) {
    super(message, 409);
  }
}
```

Now the application layer can stay focused on business meaning:

```js
throw new ConflictError('User already exists');
```

without knowing anything about:

* Express
* `res.status()`
* HTTP formatting
* middleware behavior

The infrastructure layer handles translation later.

That separation was important to me.

I wanted domain errors to remain domain-focused.

The application should describe **what happened**.

Infrastructure should decide **how it is exposed externally**.

## What Changed

After centralizing error handling, a few things improved immediately:

* Controllers became smaller
* Error responses became predictable
* Logging moved to one place
* Debugging became easier
* Business logic became easier to reason about

Most importantly, failures started feeling intentional instead of accidental.

## Final Thought

I used to think error handling meant writing `try-catch` blocks.

Now I see it differently.

Error handling is about designing how failures move through a system.
