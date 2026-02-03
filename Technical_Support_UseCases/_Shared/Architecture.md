# System Architecture

## Purpose
This document describes the global system architecture
used across all use cases.

---

## High-Level Layers

```txt
[ Client ]
     │
     ▼
[ HTTP / Router ]
     │
     ▼
[ Middleware ]
     │
     ▼
[ Application Services ]
     │
     ▼
[ Error Mapper ]
     │
     ▼
[ Persistence ]

Error Inheritance Hierarchy (Simple View)

For explaining fast:

Error
  ↑
ApplicationError
  ↑
  ├── ValidationError   (400)
  ├── ConflictError     (409)
  ├── NotFoundError     (404)
  └── CustomError...    (...)


┌────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                       │
│                                                            │
│   ┌────────────────────────────────────────────────────┐   │
│   │                ApplicationError                    │   │
│   │  (Base Business Error - No HTTP / No Framework)     │   │
│   └───────────────▲────────────────────────────────────┘   │
│                   │                                        │
│    ┌──────────────┼──────────────┬──────────────┐          │
│    │              │              │              │          │
│ ┌───────┐     ┌────────┐    ┌──────────┐    ┌──────────┐   │
│ │Validation│   │Conflict│    │NotFound  │    │ Future... │   │
│ │  Error   │   │ Error  │    │  Error   │    │  Errors   │   │
│ └───────┘     └────────┘    └──────────┘    └──────────┘   │
│                                                            │
│  Each error implements:                                   │
│  toHttp() → { status, message }                            │
│                                                            │
└───────────────────────┬────────────────────────────────────┘
                        │
                        │ Business Exception
                        ▼
┌────────────────────────────────────────────────────────────┐
│                 INTERFACE ADAPTER LAYER                     │
│                                                            │
│                  httpErrorMapper                           │
│                                                            │
│  - Receives ApplicationError                               │
│  - Calls: error.toHttp()                                   │
│  - Translates → Boom Error                                 │
│                                                            │
│  switch(status) → boom.*()                                 │
│                                                            │
└───────────────────────┬────────────────────────────────────┘
                        │
                        │ HTTP Error Object
                        ▼
┌────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                        │
│                                                            │
│                   Express / Fastify                        │
│                                                            │
│   res.status(...).json(...)                                 │
│                                                            │
│   Sends response to client                                 │
│                                                            │
└────────────────────────────────────────────────────────────┘

✅ 2. Integrated Dense Diagram (With Your Real Classes)


┌────────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE / HTTP LAYER                      │
│                                                                    │
│   createUserRouter.js                                              │
│                                                                    │
│   router.post('/')                                                 │
│      │                                                             │
│      │  req, res                                                    │
│      ▼                                                             │
│   async handler(req, res, next)                                    │
│                                                                    │
│   → calls: userService.create()                                    │
│   → sends: res.status(201).json()                                  │
│                                                                    │
└───────────────┬────────────────────────────────────────────────────┘
                │
                │ HTTP Request
                ▼
┌────────────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE LAYER                               │
│                                                                    │
│   validatorHandler.js                                              │
│                                                                    │
│   - Joi schema validation                                          │
│   - boom.badRequest() on fail                                      │
│                                                                    │
│   Runs BEFORE controller                                           │
│                                                                    │
└───────────────┬────────────────────────────────────────────────────┘
                │
                │ Validated Data
                ▼
┌────────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                               │
│                                                                    │
│   UserService.js                                                   │
│                                                                    │
│   create(data)                                                     │
│     ├─ if (!email) → throw ValidationError                         │
│     ├─ if (!hasher) → throw ApplicationError                        │
│     ├─ hash password                                               │
│     └─ repository.create()                                         │
│                                                                    │
│   Errors:                                                          │
│     ApplicationError                                               │
│        ↑                                                           │
│     ValidationError (400)                                          │
│     ConflictError   (409)                                          │
│     NotFoundError   (404)                                          │
│                                                                    │
│   ❗ No Express / No Boom                                           │
│                                                                    │
└───────────────┬────────────────────────────────────────────────────┘
                │
                │ throws Business Error
                ▼
┌────────────────────────────────────────────────────────────────────┐
│                 INTERFACE ADAPTER LAYER                             │
│                                                                    │
│   error-mapper.js                                                  │
│                                                                    │
│   httpErrorMapper(error)                                           │
│                                                                    │
│   - Calls error.toHttp()                                           │
│   - Maps to boom.*()                                               │
│                                                                    │
└───────────────┬────────────────────────────────────────────────────┘
                │
                │ Boom Error
                ▼
┌────────────────────────────────────────────────────────────────────┐
│                    EXPRESS ERROR HANDLER                            │
│                                                                    │
│   next(err)                                                        │
│   Express sends HTTP response                                      │
│                                                                    │
│   res.status(err.output.statusCode)                                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
