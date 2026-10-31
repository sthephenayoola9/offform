# OFFFORM — Automated Testing Suite & Verification (Section 35)

## 1. Test Architecture

The testing framework is built with **Vitest v2.1.9** with Node environment and `@/` path alias resolution.

To run the test suite:
```bash
cmd /c npm test
```
or in PowerShell with execution bypass:
```powershell
npm.cmd run test
```

---

## 2. Test Coverage & Specifications

### Unit Tests
1. **`tests/unit/permissions.test.ts`**
   - Enforces the minimum registration age of 16 (Section 6).
   - Enforces adulthood requirement (18+) for seller accreditation (Section 6).
   - Validates role hierarchy across `VISITOR`, `MEMBER`, `SELLER`, and `ADMIN`.
   - Validates valid and invalid fulfillment transitions (`PENDING_PAYMENT` -> `PAYMENT_CONFIRMED` -> `IN_PRODUCTION` -> `READY_TO_SHIP` -> `SHIPPED` -> `DELIVERED`).

2. **`tests/unit/customisation.test.ts`**
   - Validates designer-configured option selection with accurate price upcharge calculation.
   - Rejects unpermitted or injected customisation options.

3. **`tests/unit/moderation.test.ts`**
   - Validates triage priority for intellectual property infringement (`STOLEN_DESIGN`), scam reports, and harassment.
   - Validates format of immutable audit log entries.

### Integration Tests
4. **`tests/integration/database_flow.test.ts`**
   - Verifies seeding of verified creators, sellers, and admin accounts in SQLite.
   - Verifies product models (`READY_MADE`, `MADE_TO_ORDER`, `CUSTOMISABLE`, `COMMISSION`).
   - Verifies all 8+ versioned platform policy records.
   - Verifies pending seller applications in the curation review queue.

---

## 3. End-to-End Scenarios Verified

- **Scenario 1 (New Member):** Registration with age check, profile customization, feed browsing, liking and saving looks.
- **Scenario 2 (Seller):** Application submission with studio capability details, admin approval, and listing publication.
- **Scenario 3 (Buyer):** Marketplace browsing, filtering by type/price, customisation configuration, and order placement.
- **Scenario 4 (Moderation):** Reporting content, reviewing in the Curator console, and taking resolution actions.
- **Scenario 5 (Privacy & Deletion):** Setting recommendation preferences, viewing policy acceptance, and requesting account deactivation.

