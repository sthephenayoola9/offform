# OFFFORM — Feature Status Register (Section 30)

Status Key:
- **Implemented & Tested:** Fully functional frontend, backend, database models, and automated tests.
- **Implemented:** Functional frontend and backend connected to database.
- **Phased / Deferred:** Scheduled for subsequent phases per Master Specification.

---

## 1. Identity & Account Management

| Feature | Status | Notes |
| :--- | :--- | :--- |
| Member Registration (`/auth/register`) | **Implemented & Tested** | 16+ age check strictly enforced, policy consent recorded. |
| Member Login (`/auth/login`) | **Implemented & Tested** | Bcrypt password verification + 1-click Demo Role Switcher. |
| Demo Role Switcher | **Implemented & Tested** | Switch instantly between Visitor, Member, Seller, Admin. |
| Profile & Bio Management (`/profile`) | **Implemented & Tested** | Update display name, bio, location, aesthetic tags. |
| Account Deactivation / Deletion | **Implemented & Tested** | Anonymizes user, logs audit entry, retains legal records. |

---

## 2. Community & Feed

| Feature | Status | Notes |
| :--- | :--- | :--- |
| Discover Feed (`/discover`) | **Implemented & Tested** | Following & Discover tabs, aesthetic tag filtering. |
| Lookbook Creation Modal | **Implemented & Tested** | Post caption, multiple media URLs, type, tags, linked product. |
| Lookbook Detail View (`/posts/[id]`) | **Implemented & Tested** | Dedicated page, author card, linked product / commission link. |
| Post Likes, Comments, Saves | **Implemented & Tested** | Real-time optimistic update, persisted in SQLite DB. |
| Content Reporting Modal | **Implemented & Tested** | Routes reports directly to Admin Moderation Queue. |

---

## 3. Designers & Portfolios

| Feature | Status | Notes |
| :--- | :--- | :--- |
| Searchable Designer Directory (`/designers`) | **Implemented & Tested** | Emerging designer spotlight, aesthetic filters. |
| Designer Profile (`/designers/[id]`) | **Implemented & Tested** | Portfolio looks, active listings, custom quote modal. |
| Trust Labels | **Implemented & Tested** | Verified Designer and Approved Seller badges. |

---

## 4. Marketplace & Customisation

| Feature | Status | Notes |
| :--- | :--- | :--- |
| Product Catalog (`/marketplace`) | **Implemented & Tested** | Ready-made, made-to-order, customisable, commissions. |
| Product Detail (`/marketplace/[id]`) | **Implemented & Tested** | Size charts, materials, lead time, seller trust card. |
| Interactive Customisation Configurator | **Implemented & Tested** | Live price adjustment based on selected options. |
| Order Creation & Checkout | **Implemented & Tested** | Persists order, customisation summary, status history. |
| Product Side-by-Side Comparison | **Implemented & Tested** | Available in `/saved` (compare up to 3 garments). |

---

## 5. Seller Workspace

| Feature | Status | Notes |
| :--- | :--- | :--- |
| Seller Application (`/seller/apply`) | **Implemented & Tested** | 18+ check, portfolio URL, equipment details, KYC refs. |
| Seller Studio Workspace (`/seller`) | **Implemented & Tested** | Catalog overview, incoming orders, commission briefs. |
| Garment Listing Creation | **Implemented & Tested** | Customisation options builder with extra price controls. |
| Order Fulfillment State Machine | **Implemented & Tested** | Advance to In Production, Ready to Ship, Shipped, Delivered. |

---

## 6. Administration & Governance

| Feature | Status | Notes |
| :--- | :--- | :--- |
| Admin Console (`/admin`) | **Implemented & Tested** | Server-side role check (`role === "ADMIN"`). |
| Seller Accreditation Review Queue | **Implemented & Tested** | Inspect dossier, approve (grants seller role), reject, or request info. |
| Moderation Reports Queue | **Implemented & Tested** | Dismiss, issue warning, or pause listing. |
| Platform Audit Trail | **Implemented & Tested** | Immutable chronological record of administrative actions. |
| Versioned Policy System (`/policies`) | **Implemented & Tested** | 9 versioned policies with interactive acceptance buttons. |

---

## 7. Advanced Ecosystem (Phase 3 Roadmap)

| Feature | Status | Notes |
| :--- | :--- | :--- |
| Interactive 3D Garment Mesh Viewer | **Deferred** | Dependent on 3D glTF asset generation pipeline. |
| Automated Carrier Live Tracking | **Deferred** | Dependent on external carrier API integration. |
| Automated Stripe Connect Escrow | **Deferred** | Sandbox order & status workflow currently simulated honestly. |

