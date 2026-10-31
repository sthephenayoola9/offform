# OFFFORM — Security Controls & Risk Management (Section 31)

## 1. Authentication & Session Security

- **HttpOnly Cookies & Lax SameSite:** Sessions are stored using secure cookie flags (`offform_user_email`) preventing cross-site scripting (XSS) extraction.
- **Bcrypt Salt Hashing:** Passwords are hashed with bcrypt (salt rounds: 10) before database storage. Plaintext passwords are never logged or persisted.
- **Server-Side Authorisation Enforcement:** Frontend role flags are never trusted. All privileged routes (`/api/admin/*`, `/api/products`, `/api/orders/*/status`) query `getCurrentUser()` directly on the server and check role constraints.

---

## 2. Age Safeguards (Section 6)

- **Strict Registration Age Limit (16+):** Users under 16 are blocked at both client input and API validation with an explicit safeguard error message.
- **Seller Adulthood Requirement (18+):** Members aged 16–17 receive an age-safeguarded community experience and are prohibited from submitting commercial seller verification applications. Commercial selling requires full adulthood (18+).

---

## 3. KYC Verification Evidence Handling (Section 10.3)

- **Private Vault References:** Identity and address proof documents submitted during seller applications are stored under a private object reference schema (`SECURE_VAULT/kyc/*`).
- **No Public Bucket Exposure:** KYC documents are never served through public CDN routes or rendered on member profiles.
- **Strict Role-Gated Access:** Only authenticated users with `role: "ADMIN"` can inspect applicant verification references.

---

## 4. Account Deactivation & Statutory Data Retention (Section 25)

- **Immediate Access Severance:** Upon deletion request, active session cookies are invalidated and personal profile fields (`displayName`, `bio`, `location`) are immediately anonymised.
- **Audit Logging of Deletion:** Every deactivation event creates an immutable `AuditLog` entry.
- **Compliance Retention:** In accordance with consumer protection, tax, and anti-fraud regulations, past order and transaction histories are retained under statutory schedules rather than deleted arbitrarily.

---

## 5. Input Validation & Injection Prevention

- **Zod Schema Parsing:** All incoming API payloads are parsed and validated with Zod, rejecting malformed data, prototype pollution, and excessive payloads.
- **Parameterized SQL via Prisma:** All database operations are parameterized through the Prisma query engine, mitigating SQL injection risks.

