# KnoWMi QR Analytics Migration Guide

This guide outlines how to transition from legacy direct-to-profile QR codes to the new **KnoWMi Intercept & Analytics Layer**.

## 1. Overview of the Change

- **Legacy URL**: `knowmi.in/p/[opaque_id]`
- **New URL**: `knowmi.in/q/[scan_token]`

The new URL passes through a high-performance intercept layer that captures geo-location and device data before instantly redirecting to the existing profile page.

## 2. Impact on Existing T-Shirts

**No existing t-shirts will break.** 
Any QR code pointing to `/p/[id]` will continue to resolve to the profile page normally. However, these scans will **not** appear in the new Analytics Dashboard because they bypass the intercept layer.

## 3. Step-by-Step Migration

### Step A: Initialize Tracking Tokens
For any user who already has a printed t-shirt and wants to start tracking (for future prints):
1. Navigate to the **QR Studio** in the Dashboard.
2. Create a new token with a label describing the physical item (e.g., "White Signature Tee - Large").
3. This will generate a unique `scan_token`.

### Step B: Update Production Files
For all future printing batches:
1. Do **not** use the direct profile link.
2. Download the high-resolution PNG from the QR Studio for that specific token.
3. This PNG is exported at 1200px with **Level H** error correction, specifically optimized for textile printing.

### Step C: Retroactive Backfill (Advanced)
If you wish to track scans on existing `/p/[id]` links, a middleware can be applied to the `/p` route in a future phase. However, this will only track scans globally and cannot distinguish between different t-shirts owned by the same user. The `/q/[token]` system is the only way to achieve per-item tracking.

## 4. Technical Best Practices for Print

- **Size**: Minimum recommended size is **2x2 inches** (5x5 cm).
- **Contrast**: Black on white is highly recommended. For dark fabrics, ensure the white "quiet zone" (border) around the QR is preserved.
- **Placement**: Avoid placing codes directly on seams or high-stretch areas (like the direct center of a ribbed chest) to prevent distortion during wear.

---
**Senior Engineer Note**: The intercept layer is designed to execute in <50ms. The scanner will perceive zero difference in load time compared to the legacy direct link.
