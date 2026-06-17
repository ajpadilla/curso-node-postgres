# JWT Session Flow

## Overview

After a user successfully authenticates, the application must maintain the user's authenticated state across future requests.

This project uses JSON Web Tokens (JWT) stored in HTTP-only cookies to implement stateless session management.

Unlike traditional server-side sessions, authentication state is not stored in application memory.

Instead, authentication information travels with each request through a signed token.

---

# Why Sessions Exist

Authentication answers:

"Who is the user?"

Sessions answer:

"How do we remember the user on future requests?"

Without a session mechanism, users would need to provide credentials on every request.

Example:

Login Request
↓
Authenticated

Next Request
↓
Login Again

Clearly this is not practical.

A session mechanism allows the application to recognize previously authenticated users.

---

# Session Strategy

The project uses:

* JWT tokens
* HTTP-only cookies
* Passport JWT strategy

Authentication state is carried inside a signed token rather than stored on the server.

---

# Login Flow

Authentication begins when the user submits credentials.

POST /api/v1/auth/login

Request flow:

Client
↓
AuthRouter
↓
Passport Local Strategy
↓
AuthService.authenticate()
↓
UserRepository.findByEmail()
↓
PasswordHasher.compare()
↓
Authenticated User

Once credentials are validated, a JWT token is generated.

---

# Token Generation

After successful authentication:

AuthService
↓
TokenService.sign()
↓
JWT Created

The token contains identity information required for future requests.

Typical claims include:

* sub (user identifier)
* role (authorization role)

Example payload:

{
"sub": 123,
"role": "user"
}

The token is then signed using the application's secret key.

---

# Cookie Creation

After token generation:

JWT
↓
HTTP Response
↓
Set-Cookie Header

Example:

Set-Cookie:
access_token=<jwt>

The browser stores the cookie automatically.

Future requests include the cookie without requiring user intervention.

---

# Why HTTP-Only Cookies?

The project stores JWT tokens in HTTP-only cookies.

Benefits:

* inaccessible to JavaScript
* reduced XSS attack exposure
* automatic browser handling

Flow:

Browser
↓
Stores Cookie
↓
Automatically Sends Cookie
↓
Application Receives Token

This improves security compared to storing tokens in browser-accessible storage.

---

# Authenticated Request Flow

After login, every protected request follows this flow:

Client
↓
Cookie Sent
↓
Passport JWT Strategy
↓
Token Verification
↓
User Attached To Request
↓
Protected Route

The application does not require credentials again.

The JWT acts as proof of authentication.

---

# JWT Verification

Before granting access, the token must be verified.

Verification includes:

* signature validation
* expiration validation
* payload extraction

Flow:

JWT Token
↓
Verify Signature
↓
Verify Expiration
↓
Extract Claims
↓
Authenticated User

Invalid tokens are rejected.

---

# Passport JWT Strategy

The JWT strategy centralizes token validation.

Responsibilities:

* extract token
* validate token
* load authenticated user
* attach user to request

Flow:

Request
↓
Passport JWT Strategy
↓
req.user
↓
Route Handler

This keeps authentication concerns separate from route logic.

---

# Protected Routes

Protected endpoints require a valid JWT.

Example:

GET /api/v1/users/me

Request flow:

Client
↓
Cookie
↓
JWT Validation
↓
User Identified
↓
Response

Without a valid token:

UnauthorizedError
↓
401 Unauthorized

---

# Logout Flow

Logout removes the authentication cookie.

Flow:

Client
↓
Logout Endpoint
↓
Cookie Cleared
↓
Session Ends

Because the browser no longer sends the token, future requests become unauthenticated.

---

# Stateless Authentication

One important design decision is that sessions are stateless.

Traditional Session:

Client
↓
Session ID
↓
Server Memory

JWT Session:

Client
↓
JWT
↓
Server Verification

The server does not need to store session state.

Benefits:

* horizontal scalability
* simpler infrastructure
* reduced server memory usage

---

# Engineering Tradeoffs

## JWT Advantages

Benefits:

* stateless authentication
* horizontal scaling
* reduced session storage
* self-contained identity information

These characteristics simplify deployment and scaling.

---

## JWT Disadvantages

Challenges:

* token revocation is harder
* logout is less strict
* compromised tokens remain valid until expiration

Unlike traditional sessions, JWTs cannot be immediately invalidated without additional infrastructure.

---

## Cookie Advantages

Benefits:

* automatic browser handling
* reduced frontend complexity
* improved security through httpOnly cookies

---

## Cookie Challenges

Requires consideration of:

* CSRF protection
* SameSite policies
* Secure cookie configuration

Proper cookie settings are important for production environments.

---

# Security Considerations

The current implementation includes:

* password hashing using bcrypt
* JWT signing
* HTTP-only cookies
* token verification through Passport

Future improvements may include:

* refresh tokens
* token rotation
* session revocation
* device management
* multi-factor authentication

---

# Request Lifecycle Example

A complete authenticated request looks like:

User Login
↓
Credentials Validated
↓
JWT Generated
↓
Cookie Stored
↓
Future Request
↓
Cookie Sent
↓
JWT Verified
↓
User Authenticated
↓
Protected Resource Returned

This flow represents the complete session lifecycle.

---

# Summary

The project uses JWT-based sessions stored in HTTP-only cookies to maintain authentication state between requests.

The implementation combines:

* Passport Local Strategy
* Passport JWT Strategy
* JWT Token Service
* HTTP-only Cookies

Together these components provide a stateless authentication mechanism that balances security, scalability, and simplicity while keeping authentication concerns isolated from application business logic.
