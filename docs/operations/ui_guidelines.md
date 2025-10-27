# WorldChat — UI Guidelines (Foundation)

Version: v1.0 (Branded + Motion Enhanced)
Platform: Swift / SwiftUI
Output Path: `/DesignSystem/WorldChatDesignSystem.swift`

-----

## 1\. Overview & Philosophy

WorldChat’s interface reflects modern minimalism with calm confidence, global clarity, and seamless connectivity. The design language draws inspiration from Linear, Vercel, Notion, and shadcn/ui: neutral surfaces, rigorous spacing, subtle motion, and precise typography. These guidelines are the single source of truth for design and UI implementation across all phases (Design $\rightarrow$ Build $\rightarrow$ UI Review).

Principles:

  - **Clarity first:** content and language should be easy to parse in any script or direction (LTR/RTL).
  - **Calm motion:** animations are purposeful, fast, and support cognition.
  - **Consistency via Tokens:** Colors, typography, spacing, motion, and states are defined as static constants or Enums for direct use in SwiftUI.
  - **Accessibility by Default:** WCAG AA+ contrast, focus visibility, and reduced-motion support (via `\.\@Environment(\.accessibilityDifferentiateWithoutColor)` and `\.\@Environment(\.accessibilityReduceMotion)`).

-----

## 2\. Color System

Colors must be defined in the **Asset Catalog** using the **"Any, Light, and Dark"** appearances to ensure automatic system-level light/dark mode support.

### Color Tokens (Swift/SwiftUI)

| Token (Swift Constant) | Name | Light (HEX) | Dark (HEX) | SwiftUI Usage |
| :--- | :--- | :--- | :--- | :--- |
| `\.brandPrimary` | Dark Blue | `#072D51` | `#0B2F4F` | Primary actions, headers, emphasis |
| `\.brandAccent` | Gold | `#CFA968` | `#B89058` | Accents, focus glow, highlights |
| `\.brandSecondary` | Light Blue | `#CDD2C5` | `#A8B2A3` | Subtle surfaces, secondary text |
| `\.background` | Background | `#FFFFFF` | `#0B0D10` | Page background |
| `\.surface` | Surface | `#F7F8FA` | `#12161C` | Cards, modals, inputs |
| `\.border` | Border | `#E5E7EB` | `#273142` | Dividers, input borders |
| `\.textPrimary` | Text | `#0F172A` | `#E5E7EB` | Primary text |
| `\.textMuted` | Text Muted | `#475569` | `#94A3B8` | Secondary text |

### Semantic Tokens (SwiftUI)

| Token (Swift Constant) | Light | Dark | SwiftUI Usage |
| :--- | :--- | :--- | :--- |
| `\.success` | `#16A34A` | `#22C55E` | Success, confirmations |
| `\.warning` | `#F59E0B` | `#D97706` | Cautionary states |
| `\.error` | `#DC2626` | `#EF4444` | Errors, destructive |
| `\.info` | `#0EA5E9` | `#38BDF8` | Informational |

**Swift/SwiftUI Implementation Concept:**

```swift
extension Color {
    // Brand & Neutral
    static let brandPrimary = Color("brandPrimary") 
    static let surface = Color("surface")
    // ... all other tokens must be defined in Asset Catalog

    // Semantic
    static let success = Color("success")
}
```

-----

## 3\. Typography

Use a modern system font (**SF Pro** or a custom font like Inter/Geist). Font definitions should be defined as a set of static styles for consistent hierarchy.

### Scale & Weights (SwiftUI `Font` Definitions)

| Style (Swift Constant) | Size / Line Height | Weight | SwiftUI Modifier | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `\.display` | 30 / 36 | Bold (700) | `\.font(\.system(size: 30, weight: \.bold))` | Large titles (e.g., in a main header) |
| `\.h1` | 24 / 32 | Bold (700) | `\.font(\.system(size: 24, weight: \.bold))` | Main headings |
| `\.h2` | 20 / 28 | Semibold (600) | `\.font(\.system(size: 20, weight: \.semibold))` | Section titles |
| `\.h3` | 18 / 26 | Semibold (600) | `\.font(\.system(size: 18, weight: \.semibold))` | Sub-headings, labels |
| `\.body` | 16 / 24 | Regular (400) | `\.font(\.system(size: 16))` | Main text, message content |
| `\.secondary` | 14 / 20 | Regular (400) | `\.font(\.system(size: 14)).foregroundColor(\.textMuted)` | Secondary text, sub-labels |
| `\.caption` | 12 / 16 | Regular (400) | `\.font(\.system(size: 12)).foregroundColor(\.textMuted)` | Timestamps, minor details |

**Best Practices:**

  - Use the `.monospacedDigit()` modifier for timestamps and metrics (equivalent to `tabular-nums`).
  - Line length 60–80 chars; use the `.lineSpacing()` modifier where required for clarity in multilingual scripts.
  - Use `Text` views for all text rendering.

-----

## 4\. Spacing & Layout

All spacing, sizing, and corner radii are based on an **8pt grid** (adapting the 4px to 8pt for better native fit).

### Spacing Tokens (Swift `CGFloat`)

| Token (Swift Constant) | Value (pt) | Swift Constant Name | Usage |
| :--- | :--- | :--- | :--- |
| **`space1`** | `4.0` | `CGFloat` | Tightest spacing |
| **`space2`** | `8.0` | `CGFloat` | Component internal padding |
| **`space3`** | `12.0` | `CGFloat` | Standard spacing |
| **`space4`** | `16.0` | `CGFloat` | Section padding, modal padding |
| **`space6`** | `24.0` | `CGFloat` | Major layout separation |
| **`space8`** | `32.0` | `CGFloat` | Large vertical separation |

### Radius & Shadow Tokens (Swift `Double` / `ViewModifier`)

| Token (Swift Constant) | Value (pt) | Type | Usage |
| :--- | :--- | :--- | :--- |
| `\.radiusSM` | `4.0` | `CGFloat` | Small elements (Badges, Buttons) |
| `\.radiusMD` | `8.0` | `CGFloat` | Standard components (Inputs, Cards) |
| `\.radiusLG` | `12.0` | `CGFloat` | Larger containers (Modals) |
| `\.shadowSM` | **ViewModifier** | **Shadow** | `\.shadow(color: \.textPrimary.\.opacity(0.08), radius: 2, x: 0, y: 1)` | Subtle lift |
| `\.shadowMD` | **ViewModifier** | **Shadow** | `\.shadow(color: \.textPrimary.\.opacity(0.12), radius: 5, x: 0, y: 4)` | Standard element lift |

**Swift Implementation Concept:**

```swift
enum AppSpacing {
    static let space1: CGFloat = 4.0
    static let space2: CGFloat = 8.0
    static let space3: CGFloat = 12.0
    static let radiusMD: CGFloat = 8.0
}
```

-----

## 5\. Interaction States

SwiftUI manages internal state changes (e.g., `\.buttonStyle`) to provide consistent feedback.

| State | Native Implementation | Principle |
| :--- | :--- | :--- |
| **Hover** (macOS/iPad) | Use `\.onHover` and `\.animation` with an implicit `\.easeInOut(duration: AppMotion.fast)` for opacity and shadow adjustments. | Soft fade (100ms; opacity + subtle shadow). |
| **Focus** | SwiftUI's built-in focus ring (use `\.focusable()`). Custom: Use `\.overlay` with a `RoundedRectangle` and `\.brandAccent` border with a subtle shadow/glow. | 1pt border highlight with gold glow (`\.brandAccent`). |
| **Active** (Tap) | Use `\.scaleEffect(0.97)` within a custom `ButtonStyle` (e.g., `\.PressableButtonStyle`). | Scale to 0.97 with ease-out (tap/click feedback). |
| **Disabled** | Apply `\.disabled(true)` and `\.opacity(0.6)`. | Reduced opacity (\~60%), no interaction. |

-----

## 6\. Motion & Animation

Define animation timing curves and durations as constants for use with `\.animation()`.

### Motion Tokens (Swift `Double` / `Animation`)

| Token (Swift Constant) | Value (ms) | Type | Usage |
| :--- | :--- | :--- | :--- |
| `\.motionFast` | `100` | `Double` | Quick visual feedback (Hover, Text Changes) |
| `\.motionBase` | `200` | `Double` | Standard UI transitions (Card/List Updates) |
| `\.motionSlow` | `300` | `Double` | Large transitions (Modal, Full Screen Navigation) |
| `\.easeStandard` | `Animation` | `\.cubicBezier(0.4, 0, 0.2, 1)` | Standard Ease (equivalent to `ease-in-out` in many cases) |

**Principles:**

  - Use the **`\.transition(\.move(edge:).combined(\.opacity))`** for list/view entrances.
  - Use **`\.scaleEffect`** only for emphasis (e.g., button press).
  - Respect **`prefers-reduced-motion`**: use `\.environment(\.accessibilityReduceMotion, \.true)` to disable non-essential animations.

**Swift Implementation Concept:**

```swift
enum AppMotion {
    static let fast: Double = 0.10 // 100ms
    static let base: Double = 0.20 // 200ms
    static let easeStandard: Animation = .easeInOut(duration: AppMotion.base) // Simplified standard
}
```

-----

## 7\. Accessibility

The native Swift/SwiftUI environment provides strong default accessibility.

  - Maintain **WCAG AA+ contrast** (ensured by color tokens in Light/Dark mode).
  - **Clear focus styles** (handled by default on macOS/iPadOS, can be customized with `\.focusable()`).
  - Support **keyboard navigation** (default behavior in SwiftUI, ensure proper use of focus groups).
  - Respect **Reduced Motion**: Use `\.environment(\.accessibilityReduceMotion)` to control animations.
  - **RTL Support**: SwiftUI manages layout mirroring automatically for most views (e.g., `HStack` flips to `\.\@State\.\@Environment(\.layoutDirection)`). Requires rigorous testing with Arabic/Hebrew locales.

-----

## 8\. Component Tokens

Define reusable `ViewModifiers` or `View` structs for consistent component composition.

### Button (`\.PressableButtonStyle`)

| Property | Swift Implementation | Principle |
| :--- | :--- | :--- |
| **Primary** | `\.background(\.brandPrimary).foregroundColor(\.white)` | Dark Blue fill |
| **Secondary** | `\.background(\.surface).foregroundColor(\.textPrimary).border(\.border)` | Surface fill with border |
| **Subtle** | `\.background(\.clear).foregroundColor(\.textPrimary).onHover { $0 ? \.surface : \.clear }` | Transparent, surface hover |
| **Radius** | `\.cornerRadius(AppSpacing.radiusMD)` (8pt) | `radiusMD` |
| **Padding** | `\.padding(\.horizontal, AppSpacing.space4).padding(\.vertical, AppSpacing.space2)` (16pt / 8pt) | `space4` / `space2` |
| **States** | Custom `ButtonStyle` for `\.scaleEffect(0.97)` on press. | Uses shared interaction states. |

### Card (`\.CardView`)

| Property | Swift Implementation | Principle |
| :--- | :--- | :--- |
| **Surface** | `\.background(\.surface).foregroundColor(\.textPrimary).cornerRadius(AppSpacing.radiusLG).shadow(\.shadowSM)` | Surface fill, rounded, subtle shadow. |
| **Padding** | `\.padding(AppSpacing.space4)` (16pt) or `\.padding(AppSpacing.space6)` (24pt) | `space4` / `space6` |
| **Hover** | Use `\.onHover` with `\.shadowMD` and `\.animation` | `hover:shadow-md` |

### Input (`\.AppTextField`)

| Property | Swift Implementation | Principle |
| :--- | :--- | :--- |
| **Base** | `\.background(\.surface).border(\.border).cornerRadius(AppSpacing.radiusMD).padding(AppSpacing.space3)` | Surface, border, `radiusMD`. |
| **Focus** | `\.overlay(\.RoundedRectangle(cornerRadius: AppSpacing.radiusMD).stroke(\.brandAccent, lineWidth: 2))` | Custom `focusEffect` using `\.brandAccent`. |
| **Error** | `\.border(\.error)` | Border change to `error` color. |

### Modal (`\.AppModal`)

| Property | Swift Implementation | Principle |
| :--- | :--- | :--- |
| **Container** | `\.background(\.surface).cornerRadius(AppSpacing.radiusLG).shadow(\.shadowLG)` | Surface, large radius, strong shadow. |
| **Motion** | Use `\.transition(\.scale(0.95).combined(\.opacity)).animation(\.easeStandard)` | Fade-in + scale from 0.95 $\rightarrow$ 1.0. |
| **Behavior** | Implement `\.keyboardShortcut` for dismissal (`\.escape`) and use the `\.focusable` environment to manage the focus trap. | Focus trap and keyboard dismissal. |

-----

## 9\. Responsive Breakpoints

SwiftUI primarily uses **Size Classes** (`\.horizontalSizeClass`) and geometry readers instead of fixed pixel breakpoints.

| Breakpoint (Web) | Native Approach (SwiftUI) | Principle |
| :--- | :--- | :--- |
| `sm: 640` | **Compact** size class (e.g., iPhone Portrait) | Single-column, max density, smaller font sizes. |
| `md: 768` | **Regular** size class (e.g., iPhone Landscape, iPad) | Dual-column layouts, increased spacing (`space4` $\rightarrow$ `space6`). |
| `lg: 1024` | **`GeometryReader`** width \> 800pt | Tablet/Desktop layouts, typography scales up. |
| `xl: 1280` | **`GeometryReader`** width \> 1000pt | Max container width, maximum data density. |

**Responsive Typography:** Use ternary operators or `switch` statements based on `\.horizontalSizeClass` to apply different font sizes (e.g., `h1` is 24pt in compact, 30pt in regular).

-----

## 10\. Version History

  - v1.0 — Initial branded + motion-enhanced foundation (colors, type, spacing, states, motion, a11y, component tokens, responsive rules).