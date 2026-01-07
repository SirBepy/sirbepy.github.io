# Portfolio Project - Claude Analysis

## Project Overview
Modern single-page portfolio website built with:
- **Build Tool**: Vite
- **Scroll Library**: Locomotive Scroll (smooth scrolling)
- **Video System**: Custom seamless video looping with cross-fade
- **Animations**: FLIP animation technique for hero sticky header
- **Styling**: CSS with custom properties

---

## Current Status: PARTIALLY BROKEN

A previous refactoring attempt consolidated video backgrounds into a global fixed system but was done incompletely, leaving several broken pieces.

---

## Critical Issues Found

### 1. Hero Video Container Missing (CRITICAL)
**File**: `src/components/hero.js:34-42`

**Problem**: Code tries to setup video on non-existent container
```javascript
const videoContainer = element.querySelector(".hero-video-container");
setupSeamlessLoop(videoContainer, "/videos/hero-video.mp4", "hero-video", 1.0, 0.3, locomotiveScroll);
```

**Root Cause**: Line 13 removed `<div class="hero-video-container"></div>` from HTML

**Impact**:
- `videoContainer` is null
- `setupSeamlessLoop()` returns early and does nothing
- Hero section has no video functionality

**Fix**: Remove this dead code since hero video is now handled globally in main.js

---

### 2. ScrollIntoView Conflicts with Locomotive Scroll (CRITICAL)
**File**: `src/components/hero.js:52, 94`

**Problem**: Using native scroll API instead of Locomotive Scroll API
```javascript
skillsSection.scrollIntoView({ behavior: "smooth" });  // Lines 52, 94
```

**Impact**:
- Janky scroll behavior
- Breaks smooth scrolling
- Conflicts with Locomotive Scroll's internal state

**Fix**: Replace with `locomotiveScroll.scrollTo(skillsSection)` or target element position

---

### 3. Parallax Effect Removed from Videos (MAJOR)
**File**: `src/utils/video.js`

**Problem**:
- `parallaxFactor` parameter exists but is never used
- `updateParallax()` function was removed
- Videos have no parallax movement during scroll

**Evidence**: Compare with `temp_video_staged.js` (old version with parallax)

**Impact**: Videos appear static, less immersive

**Fix**: Either restore parallax or remove the unused parameter

---

### 4. Garbage File in Repository (MINOR)
**File**: `temp_video_staged.js`

**Problem**: Corrupted file with unicode spacing issues (BOM/encoding issue)
- Appears to be an old backup of video.js
- Contains parallax code that was removed
- Should not be in repository

**Fix**: Delete this file (can be recovered from git history if needed)

---

### 5. Deleted ProjectCarousel Component (MAJOR)
**File**: `src/components/projectCarousel.js` (DELETED)

**Problem**:
- Component was completely removed
- No longer displays projects in skill cards
- `skillCard.js` was gutted (no carousel mount point)

**Impact**: Projects are no longer visible anywhere in the portfolio

**Options**:
1. Restore project carousel
2. Build new project display system
3. Remove project references from data if not needed

---

### 6. Z-Index Layering Inconsistency (MODERATE)
**Files**: Multiple CSS files

**Problem**: Unclear z-index hierarchy
```css
/* main.css */
.global-video-overlay { z-index: 10; }  /* Line 116 */

/* hero.css */
.hero-content { z-index: 2; }  /* Line 15 */

/* video.js */
video { z-index: 1, 0, -1; }  /* Various states */
```

**Impact**: Content rendering order may be unpredictable

**Fix**: Establish clear z-index hierarchy:
```
-100: Fixed backgrounds
-1 to 1: Video states
10: Global overlay
20: Content sections
30: Sticky header
40: Cursor
```

---

### 7. Multiple Comment Header in video.js (MINOR)
**File**: `src/utils/video.js:1-4`

**Problem**: Four `/**` lines at start of file
```javascript
/**
/**
/**
/**
```

**Impact**: None (JavaScript ignores these), but looks unprofessional

**Fix**: Remove the duplicate lines

---

## What's Working Well ✓

- Skills banner component (tab-based navigation)
- Cursor particle effect system
- Date duration calculation utility
- Global fixed background system (when not blocked by hero bug)
- Locomotive Scroll integration (mostly)
- CSS architecture with custom properties
- FLIP animations for sticky header

---

## Code Quality Issues

1. **No event listener cleanup** - Memory leak potential in hero.js
2. **Tight coupling** - FLIP animation utility hardcoded for hero elements
3. **Dead code** - skillCard.js component not used anywhere
4. **Mixed scroll APIs** - Native + Locomotive Scroll = conflicts
5. **Incomplete refactoring** - Half-migrated video system

---

## Architecture

### Before Refactoring
- Each section managed its own video container
- Videos were positioned relatively within sections
- Parallax applied per-video

### After Refactoring (Current)
- Global fixed background system in main.js
- Two video containers: `#bg-hero` and `#bg-timeline`
- Opacity fades between backgrounds based on scroll position
- **BUT**: Hero component still has old video setup code (broken)

---

## Git Status (Staged but Not Committed)

Changes made but not committed:
- Modified: hero.js, skillCard.js, timeline.js, main.js, video.js
- Modified: hero.css, main.css, skills.css, timeline.css
- Added: dateHelpers.js, flipAnimation.js, temp_video_staged.js
- Deleted: projectCarousel.js
- Unstaged: portfolioData.js

**Recommendation**: Do NOT commit these changes yet. Fix issues first.

---

## Recommended Approach

### Option A: Fix Then Clean (RECOMMENDED)
**Reasoning**: Get functionality working first, then improve code quality

**Steps**:
1. Fix critical bugs (hero video, scrollIntoView)
2. Test that everything works
3. Run the portfolio and verify all features
4. Clean up code (remove dead code, improve structure)
5. Test again
6. Commit

**Pros**:
- Ensures functionality isn't lost during cleanup
- Easier to debug specific issues
- Can test at each step
- Less risky

**Cons**:
- May clean up code that gets removed anyway
- Two-pass process

---

### Option B: Clean Then Fix
**Reasoning**: Remove broken code first, then rebuild properly

**Steps**:
1. Revert all staged changes
2. Start fresh with incremental refactoring
3. Test at each step
4. Commit frequently

**Pros**:
- Cleaner result
- Better git history
- Forces proper planning

**Cons**:
- More time-consuming
- Risk of losing any good changes
- Requires careful review of what to keep

---

## My Recommendation: OPTION A (Fix Then Clean)

Since you've already made changes and some of them are good (like extracting utilities), let's:

1. **Fix the 2 critical bugs** (10 mins):
   - Remove dead video setup code in hero.js
   - Fix scrollIntoView calls

2. **Test the portfolio** (5 mins):
   - Run `npm run dev`
   - Verify all sections work
   - Check sticky header animations
   - Verify smooth scrolling

3. **Fix major issue** (15 mins):
   - Decide what to do about projects (restore carousel or remove references)

4. **Clean up** (20 mins):
   - Remove dead code
   - Fix z-index hierarchy
   - Delete temp_video_staged.js
   - Remove unused parameters
   - Add event listener cleanup

5. **Final test and commit** (10 mins)

**Total time**: ~1 hour

---

## Questions for You

1. **Projects**: Do you want to display projects in skill cards? If yes, we need to restore/rebuild the carousel. If no, we can remove project references from the data.

2. **Parallax**: Do you want the subtle parallax effect on background videos? The old code had it, but it was removed.

3. **Commit Strategy**: Should we commit the fixes as-is, or do you want me to break them into multiple smaller commits?

---

## Files That Need Attention

**Must Fix**:
- [ ] src/components/hero.js (remove dead video code, fix scrollIntoView)
- [ ] src/utils/video.js (remove duplicate comment headers, clarify parallax)

**Should Fix**:
- [ ] src/components/skillCard.js (remove or restore functionality)
- [ ] src/components/projectCarousel.js (restore or keep deleted)
- [ ] temp_video_staged.js (delete)

**Nice to Fix**:
- [ ] src/styles/main.css (clarify z-index strategy)
- [ ] src/components/hero.js (add event listener cleanup)
- [ ] src/utils/flipAnimation.js (make more generic)

---

## Next Steps

**Awaiting your decision on approach**: Fix Then Clean vs Clean Then Fix

Once you decide, I'll:
1. Create a todo list for tracking
2. Execute the fixes systematically
3. Test after each major change
4. Provide a clean commit when done

**Ready to proceed when you are!**
