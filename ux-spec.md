# Silo UX/UI Refurbishment Specification

**Version**: 1.0
**Status**: Ready for Implementation
**Author**: Sally (UX Advisor)

## 🎯 Overview
This specification outlines the comprehensive UX/UI improvements for the Silo application. The goal is to elevate the "look & feel" to a premium architectural standard, resolve friction in the capture flow, and implement "delightful" micro-interactions.

---

## 1. Capture Flow (`MagicPaste.tsx`)

**Problem**: Conflict between link/file inputs, messy tag management.
**Solution**: Separated modes with clear hierarchy.

### 1.1 Mode Selection (Tabs)
-   **Component**: Introduce a graphical Tab switcher at the top of the modal.
-   **Modes**: `[ 🔗 Link ]` | `[ 📄 File ]`
-   **Behavior**:
    -   **Link Mode**: Shows *only* the URL input field. Large, focused.
    -   **File Mode**: Shows *only* the Drag & Drop zone. Large, illustrative.
    -   *Constraint*: Mutually exclusive. A user cannot attach a file AND a link simultaneously.
    -   **Transition**: Smooth, sliding layout transition between modes.

### 1.2 Tag Management
-   **Visual**: Move tags to a dedicated "Footer Row" in the modal.
-   **Layout**: Horizontal scrollable list (carousel) OR a clean flex-wrap "cloud".
-   **Interaction**: Adding a tag does NOT shift the input fields. Tags accumulate neatly at the bottom.
-   **Input**: "Add tag..." pill that expands on focus.

---

## 2. Navigation & Discovery

**Problem**: Floating overlays (search/filter) obscure content and feel "messy".
**Solution**: Integrated, stable layout.

### 2.1 Search Bar (Option A)
-   **Location**: Integrated directly into the **Header**.
-   **State**:
    -   *Default*: A sleek "Search pill" icon `🔍` on the right side.
    -   *Active*: Expands smoothly to reveal the input field, pushing other elements slightly or overlaying just the header title.
    -   *Design*: Minimalist, pill-shaped, matches the glassmorphic aesthetic.

### 2.2 Filter Bar
-   **Location**: Dedicated fixed bar **immediately below** the Header.
-   **Behavior**:
    -   **Pinned**: Stays visible when scrolling (sticky).
    -   **Layout Flow**: Content (Masonry Grid) starts *below* this bar. No overlap/obscuring.
    -   **Visual**: clear backdrop-blur, solid border-bottom `white/5`.

---

## 3. Visual Identity & Theme

**Problem**: Pure black (`#000`) is harsh; transitions are basic.
**Solution**: Deep Anthracite & Organic Transitions.

### 3.1 Color Palette (Dark Mode: Neutral Accent)

| Element | HSL / CSS | Purpose |
| :--- | :--- | :--- |
| **Background** | `HSL(222, 47%, 6%)` | Main background (Keep Midnight) |
| **Card / Popover** | `HSL(222, 47%, 10%)` | Surfaces (Keep Midnight separation) |
| **Primary** | `HSL(0, 0%, 98%)` | **White Accent**: Clean, high-contrast buttons |
| **Primary-Fore** | `HSL(222, 47%, 6%)` | Text on buttons (Matched to background) |
| **Muted / Secondary**| `HSL(222, 20%, 15%)` | Subdued secondary elements |
| **Border** | `HSL(222, 30%, 18%)` | Clean midnight borders |

- **Strategy**: Keep the atmospheric background but replace the "flashy" blue accents with **Neutral White**.
- **Result**: Visual relief from blue dominance; premium and focused interactions.

- **Light Mode Background**: Soft off-white `HSL(240, 10%, 98.5%)`.
- **Texture**: Keep the subtle CSS Noise Overlay to avoid "flat" digital feel.

### 3.2 Visual Ambiance (Dark Mode)
-   **Feature**: "Organic Blobs" (Randomized).
-   **Implementation**: 
    - **No Animation**: No pulsing or movement. 
    - **Random Placement**: 3-4 small, blurred circles placed asymmetrically.
    - **Low Visibility**: Opacity reduced to `5-10%` for extreme discretion.
    - **Colors**: Indigo and Deep Blue variants (`bg-blue-600/10`, `bg-indigo-500/10`).
-   **Goal**: Subtle depth that feels like "ink on paper" rather than a digital animation.

### 3.3 Theme Transition (Dark/Light)
-   **Animation**: "Mask Reveal" effect.
-   **Trigger**: The toggle button.
-   **Effect**: The new theme expands predominantly in a circle *starting from the cursor position/toggle button*, filling the screen.
-   **Tech**: Use CSS `clip-path` animation or View Transitions API if supported.

---

## 4. Resource Cards (`ResourceCard.tsx`)

**Problem**: Static interactions, floating date, useless menu.
**Solution**: Purposeful interactions.

### 4.1 Hover State
-   **Animation**: `scale(1.02)` + `translateY(-4px)`.
-   **Shadow**: Increase shadow depth significantly on hover (`shadow-2xl`).
-   **Glow**: Subtle border glow color matching the resource type (e.g., blue for links, red for PDFs).

### 4.2 Actions Menu (...)
-   **Functionality**: Implement a dropdown/popover.
-   **Items**:
    -   ✏️ **Edit**: Modify title/notes/tags.
    -   📋 **Copy Link**: Copy URL to clipboard.
    -   📤 **Share**: System share sheet.
    -   🗑️ **Delete**: Immediate deletion with "Undo" toast feedback. No confirmation dialog.

### 4.3 Layout
-   **Date**: Fix position to **Bottom Right**. Use a monospaced font for alignment.
-   **Title/Desc**: Ensure consistent clamp (2 lines max).

---

## 5. Deletion Experience

**Problem**: `window.confirm` is disruptive and ugly.
**Solution**: Instant execution with Undo.

### 5.1 Flow
1.  User clicks "Delete".
2.  **Immediate**: Resource disappears. **No confirmation dialog.**
3.  **Feedback**: Show a Sonner Toast with **[ Undo ]** action.
4.  **Backend**: Executed immediately or after slight delay to allow undo.

---

## 🛠️ Implementation Checklist (Vertex Instructions)

1.  **Modify `MagicPaste.tsx`**: Implement Tabs (Link/File) & fixed Tag footer.
2.  **Update `Header`**: Integrate Search input.
3.  **Update `Layout`**: Insert FilterBar container below header.
4.  **Update `globals.css`**: Set bg-color to Zinc-950 + Add Noise class.
5.  **Update `ThemeTransition`**: Implement circular clip-path transition.
6.  **Refactor `ResourceCard`**: Update hover styles, fix date, add Menu dropdown.
7.  **Refactor Deletion**: Remove `confirm()`, use Toast + Optimistic state.
