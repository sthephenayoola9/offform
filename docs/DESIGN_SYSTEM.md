# OFFFORM — Design System & Visual Specification

**Tagline:** Outside the ordinary.  
**Art Direction:** Refined contemporary fashion-journal aesthetic with a restrained red identity.

---

## 1. Core Palette & Design Tokens

OFFFORM departs from generic SaaS card layouts and dark-mode saturation. The palette reflects tactile natural cotton, archive newsprint, dark ink, and subtle deep crimson.

| Token | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `--bg-warm` | `#F8F5F0` | Primary application canvas, gentle warm off-white. |
| `--surface-clean` | `#FFFFFF` | Editorial card surface, modal backgrounds. |
| `--text-charcoal` | `#252321` | Deep charcoal for high-contrast primary typography. |
| `--text-muted` | `#77716D` | Soft stone grey for subtitles, timestamps, and metadata. |
| `--border-subtle` | `#E7E1DB` | Restrained architectural borders separating sections. |
| `--brand-crimson` | `#A92735` | Signature brand crimson for deliberate highlights and CTAs. |
| `--dark-crimson` | `#791D29` | Deep burgundy crimson for badges, alerts, and active states. |
| `--crimson-tint` | `#FBECEE` | Soft rose background tint for badges and tags. |

### Color Usage Rules
- **Crimson is an accent, not a background flood:** Large saturated red backgrounds are prohibited. Red is blended as radial atmospheric highlights or applied to pill tags and primary action buttons.
- **Accessible Contrast:** Charcoal on `#F8F5F0` meets WCAG AAA standards for reading comfort.

---

## 2. Typography System

The typography creates a sharp editorial hierarchy combining a literary serif with an engineered sans-serif.

| Role | Font Family | Tracking & Weight | Application |
| :--- | :--- | :--- | :--- |
| **Editorial Display** | *Cormorant Garamond* | Regular / Italic, `-0.02em` | Main hero headlines, section titles, designer names. |
| **Functional UI** | *Plus Jakarta Sans* | Medium / Semi-Bold / Bold | Navigation, buttons, inputs, product details, tags. |
| **Monospace / Code** | *system-ui mono* | Uppercase, `+0.05em` | Lead times, order IDs, prices, version stamps. |

---

## 3. Trust Labels & Badges

Per Section 9 of the Master Specification, trust labels must explicitly clarify verified facts from unverified claims:

- **Verified Designer:** (`.badge-verified-designer`)  
  *Style:* `#FBECEE` background, `#791D29` text, crimson border.  
  *Meaning:* Portfolio, identity, and studio authenticity independently inspected by human curation.
- **Approved Seller:** (`.badge-approved-seller`)  
  *Style:* `#F4F1EC` background, `#252321` text, subtle border.  
  *Meaning:* Production capacity and business credentials verified for live marketplace transactions.
- **Inspiration Post:**  
  *Style:* Clearly distinguished from catalog items. A community post does not imply a product for sale or licensed manufacture.

---

## 4. Layout & Spacing Principles

- **Generous Whitespace:** Space reinforces luxury and editorial dignity.
- **Intentional Asymmetry:** Grids vary between 7/5 splits and editorial staggered cards.
- **Restrained Containers:** Avoid boxing every paragraph into rounded SaaS cards. Surfaces are flat or framed with thin `#E7E1DB` borders.

