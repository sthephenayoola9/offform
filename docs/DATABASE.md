# OFFFORM — Relational Database Schema & Data Models

## 1. Schema Design Principles

OFFFORM models complex relationships across identity, social graphs, bespoke commerce, collaboration agreements, and regulatory governance.

---

## 2. Model Breakdown

### 2.1 Identity & Governance
- **`User`**: Account identity, username, email, passwordHash, role (`VISITOR`, `MEMBER`, `SELLER`, `ADMIN`), age, location, aestheticTags, isVerifiedDesigner, isApprovedSeller.
- **`SellerApplication`**: Atelier dossier including businessName, portfolioUrl, productionCapabilities, idDocumentUrl (secure reference), addressDocumentUrl (secure reference), status (`PENDING`, `APPROVED`, `REJECTED`, `INFO_REQUESTED`), reviewNotes, reviewedAt.
- **`PolicyVersion`**: Versioned platform policies (`TERMS`, `PRIVACY`, `COMMUNITY`, `SELLER`, `REFUND`, `IP`, `COLLAB`, `MODERATION`, `COOKIE`), version string (e.g. `1.0.0`), summary, content, effectiveDate.
- **`PolicyAcceptance`**: Cryptographic record of user consent for each policy version (`userId`, `policyType`, `version`, `acceptedAt`).
- **`AuditLog`**: Immutable compliance record (`actorId`, `action`, `targetType`, `targetId`, `details`, `createdAt`).

### 2.2 Social & Community
- **`Post`**: Community lookbook item (`authorId`, `caption`, `postType`: OUTFIT/CONCEPT/INSPIRATION, `mediaUrls`, `tags`, `linkedProductId`).
- **`PostLike`**: Direct member likes.
- **`Comment`**: Community feedback and critique threads.
- **`Save`**: Bookmarked items (`targetType`: POST / PRODUCT).
- **`Follow`**: Member-to-creator social graph.
- **`Block`**: Mutual protection mechanism restricting direct interactions and recommendation appearances.

### 2.3 Commerce & Customisation
- **`Product`**: Marketplace listing (`sellerId`, `title`, `description`, `category`, `productType`: READY_MADE / MADE_TO_ORDER / CUSTOMISABLE / COMMISSION, `price`, `currency`, `stock`, `images`, `materials`, `measurements`, `leadTimeDays`, `status`).
- **`CustomizationOption`**: Designer-controlled customization specifications (`productId`, `name`, `type`, `values`: JSON array of options with extra charges, `extraPrice`).
- **`Order`**: Purchase transaction (`buyerId`, `sellerId`, `totalAmount`, `status`: PENDING_PAYMENT -> PAYMENT_CONFIRMED -> IN_PRODUCTION -> READY_TO_SHIP -> SHIPPED -> DELIVERED, `shippingAddress`, `customisationSelections`, `trackingNumber`).
- **`OrderItem`**: Specific products and agreed configuration within an order.
- **`OrderStatusHistory`**: Chronological fulfillment status change history with timestamps and notes.

### 2.4 Collaboration & Events
- **`CollaborationBrief`**: Creative brief (`ownerId`, `title`, `description`, `skillsRequired`, `budgetRange`, `deadline`, `visibility`, `status`).
- **`CollaborationProposal`**: Designer pitch on an active brief (`briefId`, `designerId`, `message`, `quoteAmount`, `estimatedDays`, `status`).
- **`Event`**: Runway shows, underground pop-ups, exhibitions.
- **`Challenge`**: Themed creative design contests.
- **`ChallengeSubmission`**: Garment submissions with votes and judging records.

### 2.5 Communication & Safety
- **`Conversation`**: Two-party message thread (`participant1Id`, `participant2Id`, `status`: REQUEST_PENDING, ACCEPTED, DECLINED, BLOCKED).
- **`Message`**: Direct messages within an approved conversation.
- **`ModerationReport`**: Community reports (`reporterId`, `targetType`, `targetId`, `category`, `reason`, `status`, `resolutionAction`, `moderatorNotes`).
- **`Notification`**: Activity and security alerts (`userId`, `title`, `body`, `category`, `isRead`, `linkUrl`).

