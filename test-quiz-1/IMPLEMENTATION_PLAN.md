# Hairqare Sales Quiz V2 - Implementation Plan

## Overview

This plan covers the complete implementation of the 24-screen "Hair Diagnosis Experience" quiz redesign. The implementation will be done in phases, with each phase building on the previous.

---

## PHASE 0: Foundation & Data Architecture

### 0.1 Create New QuizProfile Data Model

**File:** `lib/backend/schema/structs/quiz_profile_struct.dart`

```dart
class QuizProfileStruct {
  // Identity (Screens 2-5)
  String? hairGoal;           // goal_stop_shedding | goal_regrow | goal_strengthen | goal_transform | goal_length | goal_all
  String? primaryConcern;     // concern_thinning | concern_shedding | concern_breakage | concern_frizz | concern_scalp
  String? ageRange;           // age_18to29 | age_30to39 | age_40to49 | age_50plus
  String? hairType;           // type_straight | type_wavy | type_curly | type_coily
  String? struggleDuration;   // duration_new | duration_year | duration_years | duration_long

  // Discovery (Screens 6-11)
  List<String> triedBefore;   // tried_products | tried_supplements | tried_minoxidil | tried_diy | tried_professional | tried_nothing
  String? usesSulfateFree;    // yes | no
  String? washFrequency;      // daily | everyother | twice_week
  List<String> bodyFactors;   // body_stress | body_lifechange | body_diet | body_hormones | body_illness | body_none

  // Conviction (Screens 18-19)
  String? biggestConcern;     // concern_works | concern_time | concern_diy | concern_disappointed | concern_none

  // Action (Screens 20-21)
  bool canCommit;
  String? userName;
  String? userEmail;

  // Calculated Fields
  int fitScore;               // 85-98
  List<String> rootCauses;    // cause_buildup | cause_internal | cause_mismatch
  int rootCauseCount;

  // Upsell Flags
  bool showScalpUpsell;
  bool showNutritionUpsell;
  bool showStressUpsell;

  // Timestamps
  DateTime? quizStartTime;
  DateTime? quizCompleteTime;
}
```

### 0.2 Create Content Mapping Data Models

**File:** `lib/backend/schema/structs/quiz_content_struct.dart`

```dart
// For dynamic text personalization
class ConcernTextMapStruct {
  static Map<String, String> concernShort = {
    'concern_thinning': 'thinning hair',
    'concern_shedding': 'hair shedding',
    'concern_breakage': 'breakage',
    'concern_frizz': 'frizz and dryness',
    'concern_scalp': 'scalp issues',
  };
}

// For timeline milestones by concern
class TimelineMilestonesStruct {
  String week1;
  String week2;
  String month1;
  String month3;
}

// For testimonial matching
class TestimonialStruct {
  String name;
  int age;
  String imageBeforeUrl;
  String imageAfterUrl;
  String quote;
  String concernMatch;    // concern_thinning, etc.
  String ageRangeMatch;   // age_30to39, etc.
  String hairTypeMatch;   // type_curly, etc.
  String timeframe;       // "3 months", etc.
}

// For concern responses (Screen 19)
class ConcernResponseStruct {
  String title;
  String response;
  List<String> proofPoints;
}
```

### 0.3 Update App State

**File:** `lib/app_state.dart`

Add new state properties:
- `quizProfileV2` - QuizProfileStruct instance
- `currentScreenIndex` - int (0-23)
- `progressBarStep` - int (1-12, for display)
- `isRevealScreen` - bool (determines if progress bar shows)

### 0.4 Create Navigation Manager

**File:** `lib/quiz_v2/navigation/quiz_navigation.dart`

```dart
class QuizNavigationManager {
  // Screen index to screen type mapping
  static const Map<int, String> screenTypes = {
    0: 'entry',
    1: 'question',      // Hair Goal
    2: 'question',      // Primary Concern
    3: 'question',      // Age + Hair Type
    4: 'question',      // Duration Stakes
    5: 'question',      // Tried Before
    6: 'reveal',        // Why It Failed
    7: 'question',      // Products Question
    8: 'reveal',        // Buildup Reveal
    9: 'question',      // Body Question
    10: 'reveal',       // Internal Reveal
    11: 'reveal',       // Full Pattern Reveal
    12: 'reveal',       // Transformation Timeline
    13: 'reveal',       // Before/After Gallery
    14: 'reveal',       // Method Overview
    15: 'reveal',       // Personalized Prediction
    16: 'reveal',       // Success Stories
    17: 'question',     // Biggest Concern
    18: 'reveal',       // Concern Addressed
    19: 'question',     // Time Check
    20: 'question',     // Email Capture
    21: 'loading',      // Loading/Anticipation
    22: 'result',       // Result Dashboard (scrollable)
    23: 'redirect',     // Checkout
  };

  // Progress bar mapping (only shows on question screens)
  static const Map<int, int> progressMapping = {
    1: 1,   // Hair Goal -> 1 of 12
    2: 2,   // Primary Concern -> 2 of 12
    3: 3,   // Age + Hair Type -> 3 of 12
    4: 4,   // Duration Stakes -> 4 of 12
    5: 5,   // Tried Before -> 5 of 12
    7: 6,   // Products Question -> 6 of 12
    9: 7,   // Body Question -> 7 of 12
    17: 10, // Biggest Concern -> 10 of 12
    19: 11, // Time Check -> 11 of 12
    20: 12, // Email Capture -> 12 of 12
  };

  // Conditional navigation logic
  static int getNextScreen(int current, QuizProfileStruct profile) {
    switch (current) {
      case 5: // After Tried Before
        if (profile.triedBefore.contains('tried_nothing')) {
          return 7; // Skip "Why It Failed", go to Products Question
        }
        return 6; // Go to Why It Failed reveal
      case 19: // After Time Check
        if (!profile.canCommit) {
          // Soft exit with email capture option
          return 20; // Still go to email but with different messaging
        }
        return 20;
      default:
        return current + 1;
    }
  }
}
```

---

## PHASE 1: IDENTITY SCREENS (Screens 1-5)

### Screen 1: EntryHookScreen

**File:** `lib/quiz_v2/screens/phase1_identity/entry_hook_screen.dart`

**Layout Components:**
- Logo header
- Headline: "FREE HAIR DIAGNOSIS"
- Subheadline: "Why is my hair REALLY struggling?"
- Description: "Find out in 3 minutes — plus discover if there's a fix"
- Before/After image pair (Sarah, 34)
- CTA Button: "START MY DIAGNOSIS →"
- Social proof: "✓ 200,000+ women diagnosed"

**Actions:**
- Set `quizStarted = true`
- Set `quizStartTime = DateTime.now()`
- Navigate to Screen 2

**Styling:**
- No progress bar
- Full viewport, no scroll
- Primary CTA button style

---

### Screen 2: HairGoalScreen

**File:** `lib/quiz_v2/screens/phase1_identity/hair_goal_screen.dart`

**Layout Components:**
- Header with back button + "1 of 12" + progress bar
- Question: "What's your #1 hair goal?"
- Subtext: "(Pick the ONE that matters most right now)"
- 6 option cards with emojis:

| Emoji | Title | Subtitle | ID |
|-------|-------|----------|-----|
| 🛑 | Stop the shedding | My hair is falling out | goal_stop_shedding |
| 🌱 | Regrow what I've lost | Fill in thin areas | goal_regrow |
| 💪 | Strengthen & repair | Stop breakage & damage | goal_strengthen |
| ✨ | Transform my hair | Healthier, more vibrant | goal_transform |
| 📏 | Finally grow it long | Past my "stuck point" | goal_length |
| 🎯 | All of the above | Complete transformation | goal_all |

**Behavior:**
- Single-select
- Auto-advance after 300ms delay on selection
- Store: `quizProfile.hairGoal = selectedAnswer`

---

### Screen 3: PrimaryConcernScreen

**File:** `lib/quiz_v2/screens/phase1_identity/primary_concern_screen.dart`

**Layout Components:**
- Header with back button + "2 of 12" + progress bar
- Question: "What bothers you MOST about your hair right now?"
- 5 option cards with icons:

| Icon | Text Line 1 | Text Line 2 | ID |
|------|-------------|-------------|-----|
| [thinning icon] | Seeing more scalp | than I used to | concern_thinning |
| [shedding icon] | Hair everywhere except | on my head | concern_shedding |
| [breakage icon] | Breakage & damage — | it won't grow past here | concern_breakage |
| [frizz icon] | Dry, frizzy, impossible | to manage | concern_frizz |
| [scalp icon] | Itchy, flaky, irritated | scalp | concern_scalp |

**Behavior:**
- Single-select
- Auto-advance after 300ms delay
- Store: `quizProfile.primaryConcern = selectedAnswer`

---

### Screen 4: AgeHairTypeScreen

**File:** `lib/quiz_v2/screens/phase1_identity/age_hair_type_screen.dart`

**Layout Components:**
- Header with back button + "3 of 12" + progress bar
- Title: "A bit about you..."
- Section 1: "YOUR AGE"
  - Chip selector row: 18-29 | 30-39 | 40-49 | 50+
- Section 2: "YOUR HAIR TYPE"
  - 4 image options: Straight | Wavy | Curly | Coily
- Continue button (disabled until both selected)

**Behavior:**
- Both inputs required before Continue enabled
- Store on Continue:
  - `quizProfile.ageRange = selectedAge`
  - `quizProfile.hairType = selectedType`

**IDs:**
- Age: `age_18to29`, `age_30to39`, `age_40to49`, `age_50plus`
- Hair: `type_straight`, `type_wavy`, `type_curly`, `type_coily`

---

### Screen 5: DurationStakesScreen

**File:** `lib/quiz_v2/screens/phase1_identity/duration_stakes_screen.dart`

**Layout Components:**
- Header with back button + "4 of 12" + progress bar
- Dynamic question: "How long has {concernShort} been affecting you?"
- 4 option cards:

| Text Line 1 | Text Line 2 | ID |
|-------------|-------------|-----|
| Just started noticing | (Less than 6 months) | duration_new |
| About a year | (6-12 months) | duration_year |
| A few years | (1-3 years) | duration_years |
| As long as I can remember | (3+ years) | duration_long |

**Dynamic Text Logic:**
```dart
String getConcernShort() {
  return {
    'concern_thinning': 'thinning hair',
    'concern_shedding': 'hair shedding',
    'concern_breakage': 'breakage',
    'concern_frizz': 'frizz and dryness',
    'concern_scalp': 'scalp issues',
  }[quizProfile.primaryConcern] ?? 'this';
}
```

**Behavior:**
- Single-select, auto-advance
- Store: `quizProfile.struggleDuration = selectedAnswer`

---

## PHASE 2: DISCOVERY SCREENS (Screens 6-12)

### Screen 6: TriedBeforeScreen

**File:** `lib/quiz_v2/screens/phase2_discovery/tried_before_screen.dart`

**Layout Components:**
- Header with back button + "5 of 12" + progress bar
- Question: "What have you already tried?"
- Subtext: "(Select all that apply)"
- 6 checkbox options:

| Text | ID |
|------|-----|
| Special shampoos & conditioners | tried_products |
| Supplements (biotin, collagen, vitamins) | tried_supplements |
| Minoxidil / Rogaine | tried_minoxidil |
| Oils & DIY treatments (rosemary, castor, etc) | tried_diy |
| Dermatologist or specialist | tried_professional |
| Nothing yet | tried_nothing |

- Continue button

**Behavior:**
- Multi-select with checkboxes
- "Nothing yet" should deselect others (exclusive option)
- Continue navigates conditionally:
  - If `tried_nothing` selected → Skip to Screen 8
  - Otherwise → Screen 7

**Store:** `quizProfile.triedBefore = selectedAnswers`

---

### Screen 7: WhyItFailedReveal (VISUAL REVEAL)

**File:** `lib/quiz_v2/screens/phase2_discovery/why_it_failed_reveal.dart`

**Layout Components:**
- No progress bar (reveal screen)
- Title: "Here's the thing about what you've tried..."
- Visual: Diagram showing "symptom → treatment" with X mark
- Text: "These treat SYMPTOMS not ROOT CAUSES"
- Dynamic list based on what they tried:

| If tried | Show |
|----------|------|
| tried_products | "Products add more buildup on your scalp" |
| tried_supplements | "Supplements can't reach blocked follicles" |
| tried_minoxidil | "Minoxidil is a bandaid — stop using it and hair falls out again" |
| tried_diy | "Oils help but don't fix the underlying issue" |
| tried_professional | "Specialists treat one piece, miss the whole picture" |

- Footer text: "Let me show you what's actually happening..."
- Continue button

**Styling:**
- Fade-in animation on entry
- No scroll needed

---

### Screen 8: ProductsQuestionScreen

**File:** `lib/quiz_v2/screens/phase2_discovery/products_question_screen.dart`

**Layout Components:**
- Header with back button + "6 of 12" + progress bar
- Title: "Quick question about your current products..."
- Question 1: "Do you use 'sulfate-free' or 'gentle' shampoo?"
  - Two large buttons: YES | NO
- Question 2: "How often do you wash?"
  - Three buttons: Daily | Every other day | 2x/week or less
- Continue button

**Behavior:**
- Both questions must be answered
- Store:
  - `quizProfile.usesSulfateFree = yes | no`
  - `quizProfile.washFrequency = daily | everyother | twice_week`

---

### Screen 9: BuildupReveal (VISUAL REVEAL)

**File:** `lib/quiz_v2/screens/phase2_discovery/buildup_reveal.dart`

**Layout Components:**
- No progress bar
- Title with emoji: "🔬 What we found:"
- Large visual: Cross-section of hair follicle with buildup
- Caption: "YOUR FOLLICLES - Product buildup blocks nutrients from reaching your hair root"
- Dynamic message card based on answers:

```dart
String getBuilupMessage() {
  if (quizProfile.usesSulfateFree == 'yes') {
    return "⚠️ 'Sulfate-free' products often cause MORE buildup — they can't fully cleanse";
  } else if (quizProfile.washFrequency == 'twice_week') {
    return "⚠️ Infrequent washing lets oils and products accumulate on your scalp";
  } else {
    return "⚠️ Even regular products create invisible layers that build up over time";
  }
}
```

- Footer: "This is ROOT CAUSE #1 — But there's more..."
- Continue button

---

### Screen 10: BodyQuestionScreen

**File:** `lib/quiz_v2/screens/phase2_discovery/body_question_screen.dart`

**Layout Components:**
- Header with back button + "7 of 12" + progress bar
- Title: "Now let's look inside..."
- Question: "In the past year, have you experienced any of these?"
- Subtext: "(Select all that apply)"
- 6 checkbox options:

| Text | ID |
|------|-----|
| High stress or anxiety | body_stress |
| Major life change (move, job, relationship) | body_lifechange |
| Dieting or restricted eating | body_diet |
| Pregnancy or hormonal changes | body_hormones |
| Illness or medication | body_illness |
| None of these | body_none |

- Continue button

**Behavior:**
- Multi-select
- "None of these" is exclusive
- Store: `quizProfile.bodyFactors = selectedAnswers`

---

### Screen 11: InternalReveal (VISUAL REVEAL)

**File:** `lib/quiz_v2/screens/phase2_discovery/internal_reveal.dart`

**Layout Components:**
- No progress bar
- Title with emoji: "🔬 The connection:"
- Large visual: Body diagram showing nutrients flowing to vital organs first, hair last
- Caption: "When your body is stressed, it sends nutrients to VITAL organs first. Hair gets what's LEFT."
- Dynamic message based on body factors:

```dart
String getInternalMessage() {
  if (quizProfile.bodyFactors.contains('body_stress') ||
      quizProfile.bodyFactors.contains('body_lifechange')) {
    return "Your stress is likely redirecting nutrients away from hair";
  }
  if (quizProfile.bodyFactors.contains('body_diet')) {
    return "Your diet may be missing key hair-building nutrients";
  }
  if (quizProfile.bodyFactors.contains('body_hormones')) {
    return "Hormonal shifts directly affect your hair growth cycle";
  }
  if (quizProfile.bodyFactors.contains('body_illness')) {
    return "Your body is prioritizing healing over hair growth";
  }
  return "Even without major stressors, daily life creates low-grade nutrient competition";
}
```

- Footer: "This is ROOT CAUSE #2"
- CTA Button: "SEE MY FULL PATTERN →"

---

### Screen 12: FullPatternReveal (THE BIG MOMENT)

**File:** `lib/quiz_v2/screens/phase2_discovery/full_pattern_reveal.dart`

**Layout Components:**
- No progress bar
- Title: "YOUR HAIR PATTERN"
- Subtitle: "Based on your answers, here's what's happening:"
- Large visual: Circular hub diagram showing:
  - Center: "YOUR HAIR"
  - Connected nodes (highlighted if active):
    - BUILDUP (cause_buildup)
    - INTERNAL (cause_internal)
    - WRONG FIT (cause_mismatch)
    - WHAT TRIED (from triedBefore)

**Dynamic Content:**
```dart
void calculateRootCauses() {
  quizProfile.rootCauses = [];

  // Always add buildup
  quizProfile.rootCauses.add('cause_buildup');

  // Add internal if body factors exist (excluding none)
  if (!quizProfile.bodyFactors.contains('body_none') &&
      quizProfile.bodyFactors.isNotEmpty) {
    quizProfile.rootCauses.add('cause_internal');
  }

  // Add mismatch if they tried things
  if (!quizProfile.triedBefore.contains('tried_nothing')) {
    quizProfile.rootCauses.add('cause_mismatch');
  }

  quizProfile.rootCauseCount = quizProfile.rootCauses.length;
}
```

- Personalized insight: "Your {concernShort} isn't random. It's the predictable result of these {count} factors working together."
- Hook text: "And when you address them all at once?"
- CTA: "SEE WHAT'S POSSIBLE →"

---

## PHASE 3: VISION SCREENS (Screens 13-16)

### Screen 13: TransformationTimeline

**File:** `lib/quiz_v2/screens/phase3_vision/transformation_timeline.dart`

**Layout Components:**
- No progress bar
- Title: "YOUR TRANSFORMATION TIMELINE"
- Subtitle: "Based on your {concernShort} and {duration}, here's what women like you typically see:"
- Visual timeline with 4 milestones:

**Dynamic Milestones by Concern:**

| Concern | Week 1 | Week 2-3 | Month 1-2 | Month 3+ |
|---------|--------|----------|-----------|----------|
| thinning/shedding | Scalp feels lighter, less inflammation | Shedding noticeably reduced | Baby hairs appearing at hairline | Visible new density, friends notice |
| breakage | Hair feels stronger when wet | Breakage dramatically reduced | Hair stretches without snapping | Growing past your 'stuck point' |
| frizz | Hair feels smoother, more manageable | Frizz visibly reduced | Natural texture pattern emerges | Hair holds style longer |
| scalp | Scalp irritation calms | Flaking reduces significantly | Balanced scalp environment | Healthy foundation for growth |

- CTA: "SEE REAL RESULTS →"

---

### Screen 14: BeforeAfterGallery

**File:** `lib/quiz_v2/screens/phase3_vision/before_after_gallery.dart`

**Layout Components:**
- No progress bar
- Title: "WOMEN WITH YOUR PATTERN"
- Swipeable carousel of before/after images
- Each card shows:
  - Large before/after image
  - Name, age
  - Concern match description
  - Timeframe
- Carousel dots indicator
- CTA: "HOW DOES THIS WORK? →"

**Matching Logic:**
```dart
List<Testimonial> getMatchedTestimonials() {
  return testimonials.where((t) {
    // Required: same primary concern
    if (t.concernMatch != quizProfile.primaryConcern) return false;
    return true;
  }).toList()
    ..sort((a, b) {
      // Prefer same age range
      int scoreA = a.ageRangeMatch == quizProfile.ageRange ? 1 : 0;
      int scoreB = b.ageRangeMatch == quizProfile.ageRange ? 1 : 0;
      // Then prefer same hair type
      scoreA += a.hairTypeMatch == quizProfile.hairType ? 1 : 0;
      scoreB += b.hairTypeMatch == quizProfile.hairType ? 1 : 0;
      return scoreB.compareTo(scoreA);
    });
}
```

---

### Screen 15: MethodOverview

**File:** `lib/quiz_v2/screens/phase3_vision/method_overview.dart`

**Layout Components:**
- No progress bar
- Title: "THE 3-PHASE METHOD"
- Visual: 3 connected circles/steps
  - Phase 1: CLEAR (Days 1-6)
  - Phase 2: RESET (Days 7-10)
  - Phase 3: GROW (Days 11-14)
- Brief descriptions:
  - "PHASE 1: Clear the buildup"
  - "PHASE 2: Reset your body's balance"
  - "PHASE 3: Grow with your new routine"
- Footer: "All in just 10-15 min/day"
- CTA: "SEE MY PREDICTION →"

---

### Screen 16: PersonalizedPrediction

**File:** `lib/quiz_v2/screens/phase3_vision/personalized_prediction.dart`

**Layout Components:**
- No progress bar
- Title: "YOUR PREDICTED RESULTS"
- Subtitle: "Based on women {ageRange} with {concernShort}:"
- Visual: Circular progress chart
- Dynamic stats by concern:

| Concern | Stat 1 | Stat 2 | Stat 3 |
|---------|--------|--------|--------|
| thinning/shedding | 94% see reduced shedding in 2 weeks | 89% notice baby hairs within 30 days | 92% report thicker-feeling hair at 90 days |
| breakage | 91% see less breakage in 2 weeks | 87% grow past their 'stuck length' by 60 days | 94% report stronger hair at 90 days |
| frizz | 93% see smoother hair in 2 weeks | 88% report more manageable texture by 30 days | 91% experience lasting frizz reduction |
| scalp | 96% see scalp improvement in 1 week | 92% report reduced flaking by 14 days | 89% maintain balanced scalp long-term |

- CTA: "SEE SUCCESS STORIES →"

---

## PHASE 4: CONVICTION SCREENS (Screens 17-19)

### Screen 17: SuccessStories

**File:** `lib/quiz_v2/screens/phase4_conviction/success_stories.dart`

**Layout Components:**
- No progress bar
- Title: "SUCCESS STORIES"
- Subtitle: "Women in their {ageRange} who fixed their {concernShort}"
- Large swipeable carousel with:
  - Before/after images
  - Short powerful quote
  - Name, age, specific detail
  - SWIPE indicator
- Carousel dots
- CTA: "ALMOST DONE →"

**Matching:** Same logic as Screen 14, but most specific matches possible

---

### Screen 18: BiggestConcernCapture

**File:** `lib/quiz_v2/screens/phase4_conviction/biggest_concern_capture.dart`

**Layout Components:**
- Header with back button + "10 of 12" + progress bar
- Title: "One last question..."
- Question: "What's your biggest concern about trying something new?"
- 5 options:

| Text | ID |
|------|-----|
| "What if it doesn't work for MY specific case?" | concern_works |
| "I don't have much time in my daily routine" | concern_time |
| "Making my own products sounds complicated" | concern_diy |
| "I've been disappointed too many times before" | concern_disappointed |
| "No concerns — I'm ready to try something new!" | concern_none |

**Behavior:**
- Single-select, auto-advance
- Store: `quizProfile.biggestConcern = selectedAnswer`

---

### Screen 19: ConcernAddressed

**File:** `lib/quiz_v2/screens/phase4_conviction/concern_addressed.dart`

**Layout Components:**
- No progress bar
- Title: "Great question."
- Dynamic content based on selection:

**concern_works:**
- Title: "Here's why it works for your specific case"
- Response: "Your {concernShort} is caused by {rootCauseCount} factors we identified. This method addresses ALL of them at once — that's why it works when single-solution approaches fail."
- Proof points:
  - ✓ 94% of women with your pattern see results
  - ✓ 30-day money-back guarantee if you don't
  - ✓ 200,000+ women have done this

**concern_time:**
- Title: "The time commitment"
- Response: "Each day takes 10-15 minutes. That's actually LESS than most haircare routines — because you stop doing things that don't work."
- Proof points:
  - ✓ 10-15 minutes per day
  - ✓ Watch the lessons at your own pace
  - ✓ Simple daily actions, not complex rituals

**concern_diy:**
- Title: "About the DIY products"
- Response: "The DIY shampoo is ONE optional component. It takes 10 minutes to make, uses 5 basic ingredients, and costs about $10 for 6+ months of product. Most women are surprised how easy it is."
- Proof points:
  - ✓ 5 simple ingredients you can get anywhere
  - ✓ Takes 10 minutes, once
  - ✓ You also learn which store products are safe

**concern_disappointed:**
- Title: "We understand disappointment"
- Response: "You've tried things that treated symptoms, not root causes. That's not your fault — that's how the industry is designed. This is different because it addresses ALL {rootCauseCount} factors at once."
- Proof points:
  - ✓ Different mechanism = different results
  - ✓ 30-day guarantee removes all risk
  - ✓ See results or get your money back

**concern_none:**
- Title: "You're ready!"
- Response: "Love that energy. Let's get your personalized plan."
- Simplified screen, quick forward

- CTA: "GET MY RESULTS →"

---

## PHASE 5: ACTION SCREENS (Screens 20-24)

### Screen 20: TimeConfirmScreen

**File:** `lib/quiz_v2/screens/phase5_action/time_confirm_screen.dart`

**Layout Components:**
- Header with back button + "11 of 12" + progress bar
- Title: "Perfect. Last step..."
- Question: "Can you commit to 10-15 minutes per day for 14 days?"
- Visual: Calendar icon with "14 days" and "10-15 min/day"
- Two large buttons: "YES, I CAN" | "NOT RIGHT NOW"

**Behavior:**
- YES → Screen 21, set `quizProfile.canCommit = true`
- NOT RIGHT NOW → Screen 21 with soft exit messaging, set `quizProfile.canCommit = false`

---

### Screen 21: EmailCaptureScreen

**File:** `lib/quiz_v2/screens/phase5_action/email_capture_screen.dart`

**Layout Components:**
- Header with back button + "12 of 12" + progress bar
- Title: "Your personalized plan is ready!"
- Visual: Blurred/teased preview of results dashboard
- Subtitle: "Enter your details to see your results:"
- Form fields:
  - Name input
  - Email input
- CTA: "SEE MY RESULTS →"
- Footer: "🔒 Your info is safe with us"

**Behavior:**
- Validate email format
- Store:
  - `quizProfile.userName = name`
  - `quizProfile.userEmail = email`
- Fire webhook to CRM/Klaviyo
- Fire conversion tracking
- Navigate to Screen 22

---

### Screen 22: LoadingAnticipation

**File:** `lib/quiz_v2/screens/phase5_action/loading_anticipation.dart`

**Layout Components:**
- No progress bar
- Title: "Creating your personalized transformation plan, {firstName}..."
- Animated progress bar
- Sequential checkpoints (appear 1.5s apart):
  - ✓ Analyzing your hair pattern
  - ✓ Matching with success stories
  - ○ Calculating your timeline
  - ○ Building your plan

**Behavior:**
- Auto-advance to Screen 23 after ~6 seconds
- Calculate fit score during this time

```dart
void calculateFitScore() {
  int score = 85; // Base score

  // Duration bonus (longer = higher potential)
  if (quizProfile.struggleDuration == 'duration_years' ||
      quizProfile.struggleDuration == 'duration_long') {
    score += 5;
  }

  // Multiple root causes = better fit for comprehensive solution
  score += quizProfile.rootCauseCount * 3;

  // Cap at 98
  quizProfile.fitScore = min(98, score);
}
```

---

### Screen 23: ResultDashboard (SCROLLABLE)

**File:** `lib/quiz_v2/screens/phase5_action/result_dashboard.dart`

**This is the ONLY scrollable screen**

**Section 1: Celebration & Fit Score**
- Title: "🎉 Great news, {firstName}!"
- Fit score visual: Large "94%" (or calculated score)
- Caption: "Excellent match for the 14-Day Challenge"
- Subtext: "Women with your score have a 94% success rate"

**Section 2: Your Diagnosis Summary**
- Title: "YOUR HAIR PATTERN"
- Reuse pattern diagram from Screen 12 (larger)
- Text: "Your {concernShort} is being caused by {rootCauseCount} factors:"
- Dynamic list of root causes:
  - ✓ Product buildup blocking your follicles
  - ✓ Internal stress redirecting nutrients
  - ✓ Wrong routine for your unique hair profile
- Footer: "This is why nothing you've tried has worked — until now."

**Section 3: Your Transformation Vision (Future Pacing)**
- Title: "IMAGINE, 90 DAYS FROM NOW..."
- Aspirational image matching their hair type
- Dynamic future pacing statements by concern (see spec)

**Section 4: What Your Life Looks Like After**
- Three benefit cards:
  - 💰 SAVE $200-500/YEAR - Stop buying products that don't work
  - ⏰ 5-MINUTE ROUTINE - Once you know what works, it becomes effortless
  - 🧠 PEACE OF MIND - No more obsessing over every strand
- CTA: "I'M READY — SHOW ME →"

**Section 5: How You'll Get There**
- Title: "YOUR 14-DAY TRANSFORMATION"
- Subtitle: "Here's how you'll address all {rootCauseCount} root causes at once:"
- Three phase cards:
  - DAYS 1-6: CLEAR - Remove years of buildup... → Scalp feels lighter by Day 3
  - DAYS 7-10: RESET - Balance your body... → Shedding reduces by Day 10
  - DAYS 11-14: GROW - Build YOUR personalized routine...
- Footer: "10-15 minutes per day, 14 days to transformation"

**Section 6: Final Social Proof**
- Title: "WOMEN LIKE YOU WHO DID THIS"
- Carousel (reuse from Screen 17)
- Rating: "★★★★★ 4.8/5 from 15,000+ verified reviews"

**Section 7: The Offer**
- Title: "START YOUR TRANSFORMATION"
- Offer card:
  - "THE 14-DAY HAIRCARE CHALLENGE"
  - Description: "Everything you need to transform your hair..."
  - Feature list with checkmarks
  - Price: ~~$249~~ → $37
  - Value prop: "That's less than ONE salon product that doesn't work."
- CTA Button: "START MY TRANSFORMATION $37"
- Security badges: "🔒 Secure checkout"

**Section 8: Guarantee & Risk Removal**
- Title: "💯 30-DAY GUARANTEE"
- Guarantee badge visual
- Text: Full guarantee copy from spec
- Footer: "Either you transform your hair, or you pay nothing."

**Section 9: Final CTA**
- Title: "{firstName}, YOUR HAIR IS WAITING"
- Closing copy from spec
- Final CTA: "YES — START MY 14-DAY TRANSFORMATION $37"
- Trust indicators: secure checkout, cards accepted, instant access
- Help link: "Questions? Tap here to chat"

---

### Screen 24: Checkout Redirect

**File:** `lib/quiz_v2/screens/phase5_action/checkout_redirect.dart`

**Behavior:**
- Redirect to WooCommerce checkout
- Pass all profile data as URL parameters or via webhook
- Track conversion event

---

## IMPLEMENTATION ORDER

### Sprint 1: Foundation (Estimated: 15 files)
1. Create QuizProfileStruct data model
2. Create all supporting structs (content maps, testimonials, etc.)
3. Update app_state.dart with new state
4. Create QuizNavigationManager
5. Create base screen templates (question, reveal, loading)
6. Create shared components (header, progress bar, footer button)

### Sprint 2: Phase 1 - Identity (5 screens)
1. Screen 1: EntryHookScreen
2. Screen 2: HairGoalScreen
3. Screen 3: PrimaryConcernScreen
4. Screen 4: AgeHairTypeScreen
5. Screen 5: DurationStakesScreen

### Sprint 3: Phase 2 - Discovery (7 screens)
1. Screen 6: TriedBeforeScreen
2. Screen 7: WhyItFailedReveal
3. Screen 8: ProductsQuestionScreen
4. Screen 9: BuildupReveal
5. Screen 10: BodyQuestionScreen
6. Screen 11: InternalReveal
7. Screen 12: FullPatternReveal

### Sprint 4: Phase 3 - Vision (4 screens)
1. Screen 13: TransformationTimeline
2. Screen 14: BeforeAfterGallery
3. Screen 15: MethodOverview
4. Screen 16: PersonalizedPrediction

### Sprint 5: Phase 4 - Conviction (3 screens)
1. Screen 17: SuccessStories
2. Screen 18: BiggestConcernCapture
3. Screen 19: ConcernAddressed

### Sprint 6: Phase 5 - Action (5 screens)
1. Screen 20: TimeConfirmScreen
2. Screen 21: EmailCaptureScreen
3. Screen 22: LoadingAnticipation
4. Screen 23: ResultDashboard (most complex)
5. Screen 24: Checkout Redirect

### Sprint 7: Polish & Integration
1. Asset integration (images, icons, illustrations)
2. Animation implementation (fade-ins, progress bar)
3. Webhook integration (CRM, analytics)
4. Testing and refinement
5. Performance optimization

---

## VISUAL ASSETS REQUIRED

### Illustrations/Diagrams (6):
1. `follicle_cross_section.png` - Shows buildup blocking nutrients
2. `body_nutrient_priority.png` - Organs getting nutrients before hair
3. `hair_pattern_hub.png` - Central hub with causes radiating
4. `transformation_timeline.png` - Visual progress tracker
5. `three_phase_method.png` - 3 connected circles/steps
6. `guarantee_badge.png` - Trust seal visual

### Icons (15+):
1. Hair goal icons (6): shedding, regrow, strengthen, transform, length, all
2. Concern icons (5): thinning, shedding, breakage, frizz, scalp
3. Hair type images (4): straight, wavy, curly, coily
4. UI icons: back arrow, checkmark, lock, calendar, etc.

### Photos:
1. Before/after testimonials (minimum 15) - tagged by concern, age, hair type
2. Aspirational hair images by type
3. Entry hook before/after (Sarah, 34)

---

## KEY PERSONALIZATION LOGIC

### Dynamic Text Helpers

```dart
class PersonalizationHelper {
  static String getConcernShort(String concern) {
    return {
      'concern_thinning': 'thinning hair',
      'concern_shedding': 'hair shedding',
      'concern_breakage': 'breakage',
      'concern_frizz': 'frizz and dryness',
      'concern_scalp': 'scalp issues',
    }[concern] ?? 'hair issues';
  }

  static String getAgeRangeDisplay(String ageRange) {
    return {
      'age_18to29': '18-29',
      'age_30to39': '30-39',
      'age_40to49': '40-49',
      'age_50plus': '50+',
    }[ageRange] ?? '';
  }

  static String getDurationDisplay(String duration) {
    return {
      'duration_new': 'recently',
      'duration_year': 'about a year',
      'duration_years': 'a few years',
      'duration_long': 'a long time',
    }[duration] ?? '';
  }

  static List<String> getFuturePacingStatements(String concern) {
    // Returns array of 4 statements based on concern
    // Implementation per spec
  }

  static Map<String, String> getTimelineMilestones(String concern) {
    // Returns week1, week2, month1, month3 milestones
    // Implementation per spec
  }

  static List<String> getPredictedStats(String concern) {
    // Returns 3 statistics for the concern
    // Implementation per spec
  }
}
```

---

## TESTING CHECKLIST

### Flow Testing:
- [ ] Complete quiz flow from Screen 1 to 24
- [ ] Back navigation works correctly
- [ ] Conditional navigation (tried_nothing skip, time check paths)
- [ ] Progress bar updates correctly on question screens only

### Personalization Testing:
- [ ] All dynamic text populates correctly for each concern type
- [ ] Testimonials match user profile appropriately
- [ ] Root cause calculation is accurate
- [ ] Fit score calculation works

### Data Persistence:
- [ ] Quiz profile saves all answers
- [ ] Email/name captured and stored
- [ ] Webhook fires with correct data
- [ ] Analytics events tracked

### UI/UX Testing:
- [ ] No scrolling on any screen except Screen 23
- [ ] All screens fit in mobile viewport
- [ ] Auto-advance works on single-select questions
- [ ] Multi-select + Continue pattern works
- [ ] Fade-in animations on reveal screens
- [ ] Loading screen timing feels right

### Edge Cases:
- [ ] What happens if user exits mid-quiz?
- [ ] What if network fails during email submission?
- [ ] Browser back button behavior
- [ ] Deep link handling

---

## FILES TO CREATE

### Data Models (lib/backend/schema/structs/):
1. quiz_profile_v2_struct.dart
2. quiz_content_maps_struct.dart
3. testimonial_v2_struct.dart
4. concern_response_struct.dart
5. timeline_milestone_struct.dart

### Navigation (lib/quiz_v2/navigation/):
1. quiz_navigation_manager.dart

### Shared Components (lib/quiz_v2/components/):
1. quiz_header_v2.dart
2. quiz_progress_bar_v2.dart
3. quiz_footer_button.dart
4. single_select_option_card.dart
5. multi_select_checkbox_card.dart
6. chip_selector.dart
7. image_selector.dart
8. reveal_screen_wrapper.dart
9. before_after_carousel.dart
10. testimonial_card.dart

### Screens - Phase 1 (lib/quiz_v2/screens/phase1_identity/):
1. entry_hook_screen.dart
2. hair_goal_screen.dart
3. primary_concern_screen.dart
4. age_hair_type_screen.dart
5. duration_stakes_screen.dart

### Screens - Phase 2 (lib/quiz_v2/screens/phase2_discovery/):
1. tried_before_screen.dart
2. why_it_failed_reveal.dart
3. products_question_screen.dart
4. buildup_reveal.dart
5. body_question_screen.dart
6. internal_reveal.dart
7. full_pattern_reveal.dart

### Screens - Phase 3 (lib/quiz_v2/screens/phase3_vision/):
1. transformation_timeline.dart
2. before_after_gallery.dart
3. method_overview.dart
4. personalized_prediction.dart

### Screens - Phase 4 (lib/quiz_v2/screens/phase4_conviction/):
1. success_stories.dart
2. biggest_concern_capture.dart
3. concern_addressed.dart

### Screens - Phase 5 (lib/quiz_v2/screens/phase5_action/):
1. time_confirm_screen.dart
2. email_capture_screen.dart
3. loading_anticipation.dart
4. result_dashboard.dart
5. checkout_redirect.dart

### Helpers (lib/quiz_v2/helpers/):
1. personalization_helper.dart
2. fit_score_calculator.dart
3. testimonial_matcher.dart

### Main Quiz Container:
1. lib/quiz_v2/quiz_v2_container.dart

**TOTAL: ~45 new files**

---

## MIGRATION STRATEGY

Since this is a complete redesign, the approach is:

1. **Create parallel structure**: All new code in `lib/quiz_v2/` directory
2. **Keep existing code**: Don't modify existing quiz until V2 is ready
3. **Feature flag**: Add app state flag to switch between V1 and V2
4. **Gradual rollout**: Can A/B test V1 vs V2 before full migration
5. **Remove V1**: Once V2 is validated, remove old code

---

*This plan covers 100% of the V2 specification requirements.*
