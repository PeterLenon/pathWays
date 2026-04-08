# Design System Specification: The Architectural Career Curator

## 1. Overview & Creative North Star
**Creative North Star: "The Editorial Architect"**

In an industry saturated with generic, boxy dashboards, this design system breaks away from the "template" aesthetic to deliver a premium, editorial-grade experience. We view career data not as a series of cold metrics, but as a prestigious narrative. 

The "Editorial Architect" philosophy utilizes **intentional asymmetry, expansive breathing room, and tonal depth** to guide the user. We replace rigid structural lines with sophisticated layering and high-contrast typography scales. The result is a platform that feels authoritative yet empowering—moving the user from a state of "searching" to a state of "curating" their professional future.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a "Deep Sea and Forest" logic: Deep blues (`primary`) provide the bedrock of trust, while supportive greens (`secondary`) signify upward mobility and growth.

### The "No-Line" Rule
To achieve a high-end feel, **1px solid borders are prohibited for sectioning.** Boundaries must be defined exclusively through background color shifts or tonal transitions.
- **Example:** A profile summary section (`surface-container-low`) should sit directly on the main page (`surface`) without a stroke. The change in hex code is the boundary.

### Surface Hierarchy & Nesting
We treat the UI as a series of physical layers. Depth is created by "stacking" surface-container tiers:
1. **Base Layer:** `surface` (#f3faff)
2. **Structural Sections:** `surface-container-low` (#e6f6ff)
3. **Primary Cards:** `surface-container-lowest` (#ffffff) for maximum "pop" and focus.
4. **Interactive Overlays:** `surface-container-high` (#d5ecf8)

### The "Glass & Gradient" Rule
Standard flat colors lack "soul." 
- **Signature Textures:** Use a subtle linear gradient for main CTAs transitioning from `primary` (#00366d) to `primary_container` (#1a4d8c).
- **Glassmorphism:** For floating navigation or modals, use `surface` at 80% opacity with a `24px` backdrop-blur. This softens the interface and makes the tool feel integrated and modern.

---

## 3. Typography
Our typography pairing is a dialogue between **Manrope** (The Authority) and **Inter** (The Utility).

- **Display & Headlines (Manrope):** Chosen for its geometric precision and modern "tech-editorial" feel. Use `display-lg` and `headline-lg` with tight letter-spacing (-0.02em) to create an authoritative, data-driven presence.
- **Body & Labels (Inter):** The gold standard for accessibility. Inter’s tall x-height ensures readability of career data and dense resumes even at `body-sm` (0.75rem).

**Typography as Identity:**
Use `headline-md` for data visualization titles to give them the weight of a published report. Use `label-md` in all-caps with 0.05em tracking for category tags to provide a refined, professional finish.

---

## 4. Elevation & Depth
We reject the heavy drop-shadows of the 2010s. We use **Tonal Layering** to convey importance.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a "soft lift" that is felt rather than seen.
- **Ambient Shadows:** When a card must float (e.g., a "New Job Match" alert), use a shadow with a 40px blur and 6% opacity. The shadow color must be a tinted version of `on-surface` (#071e27), never pure black.
- **The "Ghost Border" Fallback:** If a container requires more definition for accessibility, use the `outline-variant` (#c3c6d2) at **15% opacity**. This creates a hint of a boundary without cluttering the visual field.

---

## 5. Components

### Cards & Lists
*   **The Rule:** No divider lines. Period.
*   **Execution:** Use `48px` of vertical white space to separate list items, or alternate background colors between `surface` and `surface-container-low`.
*   **Cards:** Use `xl` (0.75rem) roundedness. Cards should never have a stroke; they are defined by their `surface-container-lowest` fill against a tinted background.

### Buttons
*   **Primary:** High-contrast `primary` fill with `on-primary` text. Utilize the "Signature Texture" gradient. Roundedness: `full`.
*   **Secondary:** `primary_fixed` background with `on_primary_fixed` text. This provides a softer, accessible alternative for secondary actions like "Save for Later."
*   **Tertiary:** No background. Use `primary` text weight `600`. Use a `surface-variant` background on hover.

### Data Visualization (Charts/Graphs)
*   **Color Logic:** Use `secondary` (#1b6d24) for "Growth" metrics and `primary` (#00366d) for "Stability/Baseline" metrics.
*   **Styling:** Chart areas should be housed on `surface_container_highest` to provide a "dark room" feel for data focus. Lines should have a stroke width of 3px with `round` caps for a premium, custom look.

### Input Fields
*   **Modern State:** Use `surface_container_low` as the fill. 
*   **Indicator:** Instead of a full-box border on focus, use a 2px bottom-border of `primary` to maintain the "No-Line" editorial aesthetic.

---

## 6. Do’s and Don’ts

### Do:
- **Do** use asymmetrical layouts. For example, a wide column for "Experience" (75%) and a narrow column for "Skills Analytics" (25%).
- **Do** use `secondary_container` (#a0f399) for positive growth indicators (e.g., +15% salary increase).
- **Do** prioritize "negative space." If a screen feels crowded, increase the padding—never add a border to "fix" it.

### Don’t:
- **Don't** use 100% opaque `outline` tokens for structural containers. It breaks the editorial flow.
- **Don't** use standard "drop shadows" with 0 blur. It makes the "Data-Driven" persona feel "Data-Cluttered."
- **Don't** use dividers between list items. Trust the white space and the `body-md` typography to define the rhythm.
- **Don't** use pure black (#000000) for text. Always use `on_surface` (#071e27) to maintain the sophisticated, deep-blue tonal range.