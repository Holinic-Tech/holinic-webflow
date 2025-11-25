# FlutterFlow to React Quiz Migration Guide

This document provides comprehensive guidance for migrating FlutterFlow quizzes to React, based on the Hairqare Quiz migration completed in November 2025.

---

## Table of Contents

1. [Overview](#overview)
2. [Source Files & Where to Find Data](#source-files--where-to-find-data)
3. [Project Structure](#project-structure)
4. [Data Extraction from FlutterFlow](#data-extraction-from-flutterflow)
5. [Screen Flow & Navigation](#screen-flow--navigation)
6. [Question Types & Components](#question-types--components)
7. [Analytics & Tracking](#analytics--tracking)
8. [Webhook Integration](#webhook-integration)
9. [Responsive Design](#responsive-design)
10. [Common Issues & Solutions](#common-issues--solutions)
11. [Testing Checklist](#testing-checklist)

---

## Overview

### Why Migrate from FlutterFlow to React?

- **Performance**: Flutter Web compiles to ~4MB JavaScript; React bundle is ~300KB
- **SEO**: React supports server-side rendering and better meta tags
- **Maintainability**: React codebase is more accessible to web developers
- **Loading Speed**: Significantly faster initial load times

### Tech Stack for React Rebuild

| Category | Choice | Rationale |
|----------|--------|-----------|
| Build Tool | Vite | Fast builds, excellent DX |
| Language | TypeScript | Type safety for quiz data structures |
| State Management | Zustand | Simple API, persistence middleware |
| Styling | Tailwind CSS | Rapid development, utility-first |
| Animations | CSS Transitions | Simple, performant |

---

## Source Files & Where to Find Data

### FlutterFlow Export Location

When you export a FlutterFlow project, you get a folder structure like:
```
QuizV2-flutterflow/
├── lib/
│   ├── custom_code/
│   │   └── actions/           # Custom Dart actions (webhooks, tracking)
│   ├── pages/
│   │   └── home_page/         # Main quiz page
│   └── backend/
│       └── schema/
│           └── structs/       # Data structures
├── web/
│   └── index.html             # Analytics scripts, meta tags
└── assets/                    # Local assets (if any)
```

### YAML Files (Primary Data Source)

FlutterFlow exports YAML files that contain ALL quiz configuration:

| File | Contains |
|------|----------|
| `app-state.yaml` | All questions, answers, images, field mappings |
| `page-widget-tree-outline.yaml` | Screen order and component hierarchy |
| `id-Container_*.yaml` | Individual screen configurations |

**Location**: These are typically in the FlutterFlow dashboard export or can be found in Dropbox/Air Downloads.

### Key Data to Extract from `app-state.yaml`

```yaml
# Questions are stored as "questionsList" with this structure:
- questionId: "hairGoal"
  questionText: "Start by selecting your goal:"
  answers:
    - answer: "I want to stop my hair loss"
      image: "https://assets.hairqare.co/mid-hairloss-graphic.webp"
      id: "goal_hairloss"
  acField: "48"        # ActiveCampaign field number
  mpField: "Hair Goal" # Mixpanel field name
```

### Dart Files for Business Logic

| File | Contains |
|------|----------|
| `webhook_call_quiz_profile.dart` | Make.com webhook payload structure |
| `webhook_callcvg.dart` | CVG tracking event structure |
| `redirect_to_checkout.dart` | Checkout URL building logic |

---

## Project Structure

### Recommended React Project Structure

```
quiz-project/
├── public/
│   └── index.html              # Analytics scripts
├── src/
│   ├── main.tsx                # Entry point
│   ├── App.tsx                 # Root component
│   │
│   ├── types/                  # TypeScript definitions
│   │   ├── quiz.types.ts
│   │   ├── question.types.ts
│   │   └── result.types.ts
│   │
│   ├── data/                   # Quiz configuration (DATA LAYER)
│   │   ├── questions.ts        # All questions with options
│   │   ├── screenFlow.ts       # Screen sequence (questions + pitch screens)
│   │   ├── pitchScreens.ts     # Pitch screen content
│   │   └── dashboardContent.ts # Result page personalization
│   │
│   ├── store/                  # State management
│   │   └── quizStore.ts        # Zustand store
│   │
│   ├── hooks/                  # Custom hooks
│   │   └── useQuiz.ts          # Quiz navigation & state
│   │
│   ├── components/
│   │   ├── quiz/               # Quiz flow components
│   │   │   ├── QuizContainer.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── PitchScreen.tsx
│   │   │   └── SkipDialog.tsx
│   │   │
│   │   ├── questions/          # Question type components
│   │   │   ├── HeroQuestion.tsx
│   │   │   ├── ImageCardQuestion.tsx
│   │   │   ├── TextOptionQuestion.tsx
│   │   │   ├── MultiSelectQuestion.tsx
│   │   │   ├── FeedbackCardQuestion.tsx
│   │   │   └── SliderQuestion.tsx
│   │   │
│   │   ├── form/
│   │   │   └── LeadCaptureForm.tsx
│   │   │
│   │   └── result/
│   │       └── ResultPage.tsx
│   │
│   ├── services/               # External integrations
│   │   ├── analytics.ts        # GA, GTM, CVG
│   │   └── webhook.ts          # Make.com webhook
│   │
│   └── utils/
│       └── segmentResolver.ts  # Coupon code logic
│
├── index.html                  # Vite entry with tracking scripts
├── tailwind.config.js
└── vite.config.ts
```

---

## Data Extraction from FlutterFlow

### Step 1: Extract Questions

From `app-state.yaml`, extract each question into this TypeScript structure:

```typescript
// src/data/questions.ts
export const questions: Record<QuestionId, QuestionConfig> = {
  hairGoal: {
    id: 'hairGoal',
    questionText: 'Start by selecting your goal:',
    format: 'imageCard',  // Determine from Flutter widget type
    acField: '48',        // ActiveCampaign field number
    mpField: 'Hair Goal', // Mixpanel property name
    options: [
      {
        id: 'goal_hairloss',
        answer: 'I want to stop my hair loss',
        image: 'https://assets.hairqare.co/mid-hairloss-graphic.webp',
      },
      // ... more options
    ],
  },
  // ... more questions
};
```

### Step 2: Map Flutter Widget Types to React Components

| Flutter Widget | React Component | Format Key |
|----------------|-----------------|------------|
| `ImageBackgroundQuesBody` | `HeroQuestion` | `hero` |
| `SingleChoiceQuestionLargeImage` | `ImageCardQuestion` | `imageCard` |
| `TitlesAndDescriptionAnsBody` | `TextOptionQuestion` | `textOption` |
| `MultiChoiceWithImageCheckBox` | `MultiSelectQuestion` | `multiSelect` |
| `AnswerWithAdditionalInfo` | `FeedbackCardQuestion` | `feedbackCard` |
| `RatingQuestionOptions` | `SliderQuestion` | `slider` |

### Step 3: Extract Screen Flow

From `page-widget-tree-outline.yaml`, determine the exact screen order:

```typescript
// src/data/screenFlow.ts
export const screenFlow: ScreenConfig[] = [
  { index: 0, type: 'question', questionId: 'hairGoal' },
  { index: 1, type: 'question', questionId: 'hairType' },
  // ...
  { index: 6, type: 'pitch', pitchType: 'simple' },  // Pitch screens!
  { index: 7, type: 'question', questionId: 'hairqareKnowledge' },
  // ...
  { index: 17, type: 'loading' },
  { index: 18, type: 'emailCapture' },
  { index: 19, type: 'dashboard' },
];
```

### Step 4: Extract Field Mappings

The `acField` and `mpField` values are CRITICAL for webhook integration:

```typescript
// From app-state.yaml, each question has:
acField: "48"  // Maps to ActiveCampaign field_48
mpField: "Hair Goal"  // Maps to Mixpanel property "Hair Goal"
```

---

## Screen Flow & Navigation

### Understanding the Flow

FlutterFlow quizzes typically have this structure:

1. **Hero/Start Screen** (question with background image)
2. **Question Screens** (various types)
3. **Pitch Screens** (interstitial content, no questions)
4. **More Question Screens**
5. **Loading Screen** (animated progress)
6. **Email Capture Screen**
7. **Dashboard/Results Screen**

### Pitch Screens Are NOT Questions

**Important**: Pitch screens are interspersed between questions but don't have questionIds. They're identified by their container type in the YAML:

```yaml
# In page-widget-tree-outline.yaml
Container_qtf5lwt3:
  type: PitchBody_simpleTextImagesBody  # This is a pitch screen!
```

### Navigation Logic

```typescript
// src/hooks/useQuiz.ts
const handleNext = () => {
  const currentScreen = screenFlow[currentIndex];

  // For questions, verify answer exists
  if (currentScreen.type === 'question') {
    if (!answers[currentScreen.questionId]) return;
  }

  // Move to next screen
  setCurrentIndex(currentIndex + 1);
};
```

### Auto-Advance Behavior

- **Single-select questions**: Auto-advance after 300ms delay
- **Multi-select questions**: Require explicit "Continue" button
- **Slider questions**: Auto-advance after selection
- **Feedback questions**: Show feedback, then auto-advance

---

## Question Types & Components

### 1. Hero Question (Start Screen)

**Flutter**: `ImageBackgroundQuesBody`
**React**: `HeroQuestion.tsx`

Features:
- Full-screen background image
- Logo at top
- Answer options at bottom
- "Skip the Quiz" link

```tsx
// Key styling
<div
  className="min-h-screen bg-cover bg-center"
  style={{ backgroundImage: `url(${backgroundImage})` }}
>
  {/* Content overlaid on background */}
</div>
```

### 2. Image Card Question

**Flutter**: `SingleChoiceQuestionLargeImage`
**React**: `ImageCardQuestion.tsx`

Features:
- 2-column grid of cards
- Image with label bar below
- Selection state with border highlight

```tsx
// Grid layout
<div className="grid grid-cols-2 gap-3">
  {options.map(option => (
    <button
      className={`rounded-lg overflow-hidden ${
        isSelected ? 'ring-2 ring-[#7375A6]' : ''
      }`}
    >
      <img src={option.image} className="w-full h-[120px] object-cover" />
      <div className="h-[36px] bg-[#7375A6] text-white text-center">
        {option.answer}
      </div>
    </button>
  ))}
</div>
```

### 3. Text Option Question

**Flutter**: `TitlesAndDescriptionAnsBody`
**React**: `TextOptionQuestion.tsx`

Features:
- Vertical list of options
- Optional emoji on left
- Optional description below title

### 4. Multi-Select Question

**Flutter**: `MultiChoiceWithImageCheckBox`
**React**: `MultiSelectQuestion.tsx`

Features:
- Checkbox indicators (not radio buttons)
- "None of the above" option at bottom
- Requires explicit Continue button
- Can select multiple options

```tsx
// Checkbox styling
<div className={`w-6 h-6 rounded-[3px] border-2 ${
  isSelected
    ? 'bg-[#7375A6] border-[#7375A6]'
    : 'bg-white border-[#7375A6]'
}`}>
  {isSelected && <CheckIcon />}
</div>
```

### 5. Feedback Card Question

**Flutter**: `AnswerWithAdditionalInfo`
**React**: `FeedbackCardQuestion.tsx`

Features:
- Shows feedback after selection
- Feedback has title + description
- Auto-advances after feedback display

```tsx
const [showFeedback, setShowFeedback] = useState(false);
const [selectedOption, setSelectedOption] = useState(null);

const handleSelect = (option) => {
  setSelectedOption(option);
  setShowFeedback(true);
  // Auto-advance after 2 seconds
  setTimeout(() => onNext(), 2000);
};
```

### 6. Slider Question

**Flutter**: `RatingQuestionOptions`
**React**: `SliderQuestion.tsx`

Features:
- 5 rating buttons (1-5)
- Labels at ends ("Not at all" / "Totally")
- Auto-advances after selection

```tsx
<div className="flex justify-between gap-2">
  {[1, 2, 3, 4, 5].map(value => (
    <button
      onClick={() => onSelect(value)}
      className={`w-12 h-12 rounded-lg ${
        selected === value
          ? 'bg-[#E8EBFC] border-[#7375A6]'
          : 'bg-white'
      }`}
    >
      {value}
    </button>
  ))}
</div>
```

---

## Analytics & Tracking

### Event Names Must Match Flutter Exactly

The Flutter app uses specific event names. React MUST use the same names for tracking continuity:

| Event | GA/GTM Name | Notes |
|-------|-------------|-------|
| Question answered | `Question Answered` | Title Case! |
| Quiz started | `Quiz Started` | |
| Quiz completed | `Completed Quiz` | Different for GA vs GTM |
| Skip dialog opened | `Opened Skip Dialog` | |
| Skip dialog closed | `Closed Skip Dialog` | |
| User skips quiz | `SkipQuiz` | |
| Back button clicked | `Quiz Back` | |
| Pitch continue | `Continued From Pitch` | |
| CTA clicked | `Go to checkout` | |

### Event Properties Structure

```typescript
// trackQuestionAnswered - MUST include these properties
{
  event_category: 'Quiz',
  position: number,           // Current screen index
  question_id: string,        // e.g., "hairGoal"
  question: string,           // Actual question text!
  selected_answer: string[],  // ALWAYS an array
}
```

### CVG Tracking Setup

In `index.html`, include the CVG initialization:

```html
<!-- CVG Script -->
<script async src="https://hairqare.co/cvg/static/pixels/PmzQC4.js"></script>
<script>
  // CVG initialization stub (critical for queuing)
  window.cvg || (cvg = function() {
    cvg.process ? cvg.process.apply(cvg, arguments) : cvg.queue.push(arguments)
  }, cvg.queue = []);

  // Configure proxy
  cvg({method: "proxy", tracking: "https://hairqare.co/cvg", static: "https://hairqare.co/cvg/static"});

  // Track page load
  cvg({method: "track", eventName: "$page_load"});
</script>
```

### CVG Event for Quiz Completion

```typescript
// Must match Flutter webhookCallcvg.dart exactly
trackCVG({
  method: 'event',
  event: 'Completed Quiz',
  properties: {
    answers: answersArray,
    name: fullName,
    firstName: firstName,
    lastName: lastName,
    email: email,
  },
  profileProperties: { $email: email },
  aliases: [`urn:email:${email}`],
});
```

---

## Webhook Integration

### Make.com Webhook URL

Found in `webhook_call_quiz_profile.dart`:
```dart
const String webhookUrl = 'https://hook.us1.make.com/3d6vksxwtqukhrx465bjymy4y6sfdkr6';
```

### Webhook Payload Structure (CRITICAL)

The payload MUST match Flutter exactly or Make.com automations will break:

```typescript
interface WebhookPayload {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  quizData: {
    rawAnswers: Array<{
      questionId: string;
      answerIds: string[];  // ALWAYS array, even for single answers
    }>;
  };
  activeCampaign: {
    // field_X format where X is the acField number
    field_48: string;  // Hair Goal
    field_20: string;  // Hair Type
    field_6: string;   // Age Cohort
    // ... etc
  };
  mixpanel: {
    $name: string;
    $email: string;
    "Hair Goal": string;
    "Hair Type": string;
    // ... etc
  };
}
```

### Building ActiveCampaign Fields

```typescript
const activeCampaign: Record<string, string> = {};

for (const [questionId, answer] of Object.entries(answers)) {
  const question = questions[questionId];
  if (question?.acField) {
    // Convert arrays to comma-separated strings for AC
    const value = Array.isArray(answer)
      ? answer.join(', ')
      : String(answer);
    activeCampaign[`field_${question.acField}`] = value;
  }
}
```

### Building Mixpanel Fields

```typescript
const mixpanel: Record<string, unknown> = {
  $name: userInfo.name,
  $email: userInfo.email,
};

for (const [questionId, answer] of Object.entries(answers)) {
  const question = questions[questionId];
  if (question?.mpField) {
    // Arrays stay as arrays for Mixpanel
    mixpanel[question.mpField] = answer;
  }
}
```

---

## Responsive Design

### Mobile-First Approach

Design for mobile first (375px), then add desktop breakpoints.

### Key Viewport Handling

**Problem**: Content shouldn't scroll on most screens; only Results page scrolls.

**Solution**: Use `100dvh` (dynamic viewport height) to account for mobile browser chrome:

```css
.container-quiz {
  height: 100dvh;
  overflow: hidden;  /* Prevent scroll on quiz screens */
}

.results-page {
  min-height: 100dvh;
  overflow-y: auto;  /* Allow scroll on results */
}
```

### Fixed Bottom Buttons

For Continue buttons that should stick to bottom:

```tsx
<div className="h-[calc(100dvh-60px)] flex flex-col">
  {/* Content */}
  <div className="flex-1 overflow-hidden">
    {/* Question content */}
  </div>

  {/* Fixed footer */}
  <div className="flex-shrink-0 px-4 pb-6 md:pb-10">
    <button>Continue</button>
  </div>
</div>
```

### Desktop Padding

Add extra bottom padding on desktop for visual balance:

```tsx
<div className="pb-6 md:pb-10">
  {/* Content */}
</div>
```

### Max Width Constraint

Constrain quiz to readable width on desktop:

```tsx
<div className="max-w-[500px] mx-auto">
  {/* Quiz content */}
</div>
```

---

## Common Issues & Solutions

### Issue 1: Content Scrolling When It Shouldn't

**Problem**: Quiz screens scroll even when content fits.

**Cause**: Using `min-height: 100vh` allows content to exceed viewport.

**Solution**:
```css
/* Use fixed height with overflow hidden */
.container-quiz {
  height: 100dvh;
  overflow: hidden;
}
```

### Issue 2: Age/Personalization Keys Don't Match

**Problem**: Dashboard shows "Summary" fallback instead of personalized content.

**Cause**: Keys in data files don't match answer IDs exactly.

**Example**:
- `dashboardContent.ts` had: `age_18_29`
- `questions.ts` had: `age_18to29`

**Solution**: Ensure ALL keys match exactly across files. Check:
- `questions.ts` answer IDs
- `dashboardContent.ts` lookup keys
- `screenFlow.ts` question IDs

### Issue 3: Analytics Events Have Wrong Names

**Problem**: GA reports show different event names than expected.

**Cause**: React used snake_case (`question_answered`) but Flutter used Title Case (`Question Answered`).

**Solution**: Match Flutter event names exactly:
```typescript
// WRONG
trackGA('question_answered', properties);

// CORRECT
trackGA('Question Answered', properties);
```

### Issue 4: Webhook Data Structure Wrong

**Problem**: Make.com automation fails or data doesn't appear in ActiveCampaign.

**Cause**: React sent flat object for answers; Flutter sent array.

**Solution**: Match Flutter structure exactly:
```typescript
// WRONG
quizData: {
  rawAnswers: { hairGoal: 'goal_hairloss', ... }
}

// CORRECT
quizData: {
  rawAnswers: [
    { questionId: 'hairGoal', answerIds: ['goal_hairloss'] },
    ...
  ]
}
```

### Issue 5: Single-Select Questions Show Checkboxes

**Problem**: Radio-button style questions display checkbox indicators.

**Cause**: Same component used for both single and multi-select.

**Solution**: Single-select questions should show NO indicator (just background color change). Only multi-select shows checkboxes.

### Issue 6: Build Fails Due to index.html References (CRITICAL)

**Problem**: GitHub Actions build fails with error like:
```
/34-the-quiz-haircare/assets/index-ABC123.js doesn't exist at build time
Rollup failed to resolve import
```

**Cause**: The GitHub Pages deployment workflow modifies `index.html` to reference pre-built assets in `dist/`. If this modified version gets committed back to the repo (either manually or through an automated process), future builds will fail because those hashed asset files don't exist at build time.

**How It Happens**:
1. You run `npm run build` locally or deploy to GitHub Pages
2. Vite outputs built files to `dist/` with hashed names: `index-ABC123.js`
3. The deployment process updates `dist/index.html` to reference these
4. Someone accidentally commits the `dist/index.html` content back to the source `index.html`
5. Future CI builds fail because `index-ABC123.js` doesn't exist yet

**Solution**:

1. **Source `index.html` MUST reference the source file:**
```html
<!-- CORRECT - in source index.html -->
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>

<!-- WRONG - these are build outputs, NOT source -->
<script type="module" crossorigin src="/34-the-quiz-haircare/assets/index-ABC123.js"></script>
<link rel="stylesheet" crossorigin href="/34-the-quiz-haircare/assets/index-XYZ789.css">
```

2. **Prevention**:
   - Add `dist/` to `.gitignore` (already should be)
   - Never copy contents from `dist/index.html` back to source
   - Review PRs for accidental asset reference changes in `index.html`

3. **If you see this error**:
   - Check `index.html` in the repo for hardcoded asset references
   - Replace with `/src/main.tsx` reference
   - Remove any `<link rel="stylesheet" href="/assets/...">` lines (Vite adds these at build time)

**Git command to fix**:
```bash
# View what changed in index.html
git diff index.html

# If it shows hardcoded assets, restore the source version
git checkout HEAD~1 -- index.html
# Or manually edit to use /src/main.tsx
```

### Issue 7: CVG Events Not Firing

**Problem**: CVG tracking events don't appear in dashboard.

**Cause**: Missing CVG initialization stub that queues events before script loads.

**Solution**: Add initialization stub in `index.html`:
```html
<script>
  window.cvg || (cvg = function() {
    cvg.process ? cvg.process.apply(cvg, arguments) : cvg.queue.push(arguments)
  }, cvg.queue = []);
</script>
```

### Issue 8: Images Not Loading

**Problem**: Quiz images show as broken.

**Cause**: URL encoding issues or wrong domain.

**Solution**:
- Use exact URLs from Flutter `app-state.yaml`
- Ensure URLs are properly encoded (spaces as `%20`)
- Verify assets are hosted on correct CDN (`assets.hairqare.co`)

---

## Testing Checklist

### Functional Testing

- [ ] All questions display correctly
- [ ] All answer options are clickable
- [ ] Single-select auto-advances after selection
- [ ] Multi-select requires Continue button
- [ ] Slider questions work and auto-advance
- [ ] Feedback questions show feedback then advance
- [ ] Progress bar updates correctly
- [ ] Back button works (where applicable)
- [ ] Skip dialog opens and closes
- [ ] Skip redirects to checkout
- [ ] Email form validates inputs
- [ ] Results page shows personalized content

### Analytics Testing

Open browser DevTools Console and verify:

- [ ] `[GA] Quiz Started` fires on first question
- [ ] `[GA] Question Answered` fires with correct properties
- [ ] `question` property contains question text
- [ ] `selected_answer` is always an array
- [ ] `position` matches screen index
- [ ] `[GTM] Completed Quiz` fires on results page
- [ ] CVG events appear in CVG dashboard

### Webhook Testing

- [ ] Complete quiz with test email
- [ ] Check Make.com execution history
- [ ] Verify `rawAnswers` is array format
- [ ] Verify `activeCampaign` has `field_X` keys
- [ ] Verify `mixpanel` has correct property names
- [ ] Check ActiveCampaign contact has fields populated
- [ ] Check Mixpanel profile has properties

### Responsive Testing

- [ ] iPhone SE (375px) - smallest common mobile
- [ ] iPhone 14 Pro (393px)
- [ ] iPad (768px)
- [ ] Desktop (1024px+)
- [ ] Verify no horizontal scroll
- [ ] Verify content doesn't overflow viewport
- [ ] Verify buttons are tappable on mobile

### Cross-Browser Testing

- [ ] Chrome
- [ ] Safari (important for iOS)
- [ ] Firefox
- [ ] Edge

---

## Quick Reference: File Locations

| What You Need | Where to Find It |
|---------------|------------------|
| Question data | FlutterFlow `app-state.yaml` |
| Screen order | FlutterFlow `page-widget-tree-outline.yaml` |
| Webhook URL | `lib/custom_code/actions/webhook_call_quiz_profile.dart` |
| CVG tracking | `lib/custom_code/actions/webhook_callcvg.dart` |
| GTM/GA IDs | `web/index.html` |
| Image URLs | `app-state.yaml` under each question's answers |
| AC field mappings | `app-state.yaml` - `acField` property |
| Mixpanel field names | `app-state.yaml` - `mpField` property |
| Checkout URL | `lib/custom_code/actions/redirect_to_checkout.dart` |
| Coupon codes | Search for `getCouponCode` in Dart files |

---

## Maintenance Notes

### Adding a New Question

1. Add question config to `src/data/questions.ts`
2. Add to `questionsOrder` array
3. Update `screenFlow.ts` with new screen entry
4. Verify `acField` and `mpField` mappings

### Updating Analytics

1. Check Flutter implementation first
2. Match event names exactly (case-sensitive!)
3. Match property names exactly
4. Test in GA4 DebugView

### Updating Webhook

1. Check Make.com scenario for expected fields
2. Match Flutter `webhook_call_quiz_profile.dart` structure
3. Test with real submission
4. Verify in ActiveCampaign and Mixpanel

---

*Document created: November 2025*
*Last updated: November 2025*
*Based on: Hairqare Quiz migration from FlutterFlow to React*
