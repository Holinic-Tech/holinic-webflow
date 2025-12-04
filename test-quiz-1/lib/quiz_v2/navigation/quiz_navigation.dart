import '/backend/schema/structs/quiz_profile_v2_struct.dart';

/// Manages navigation flow and screen mapping for Quiz V2
class QuizNavigationManager {
  // Screen types for each index
  static const Map<int, String> screenTypes = {
    0: 'entry',         // EntryHookScreen
    1: 'question',      // HairGoalScreen
    2: 'question',      // PrimaryConcernScreen
    3: 'question',      // AgeHairTypeScreen
    4: 'question',      // DurationStakesScreen
    5: 'question',      // TriedBeforeScreen
    6: 'reveal',        // WhyItFailedReveal
    7: 'question',      // ProductsQuestionScreen
    8: 'reveal',        // BuildupReveal
    9: 'question',      // BodyQuestionScreen
    10: 'reveal',       // InternalReveal
    11: 'reveal',       // FullPatternReveal
    12: 'reveal',       // TransformationTimeline
    13: 'reveal',       // BeforeAfterGallery
    14: 'reveal',       // MethodOverview
    15: 'reveal',       // PersonalizedPrediction
    16: 'reveal',       // SuccessStories
    17: 'question',     // BiggestConcernCapture
    18: 'reveal',       // ConcernAddressed
    19: 'question',     // TimeConfirmScreen
    20: 'question',     // EmailCaptureScreen
    21: 'loading',      // LoadingAnticipation
    22: 'result',       // ResultDashboard (scrollable)
    23: 'redirect',     // Checkout
  };

  // Screen names for reference
  static const Map<int, String> screenNames = {
    0: 'EntryHookScreen',
    1: 'HairGoalScreen',
    2: 'PrimaryConcernScreen',
    3: 'AgeHairTypeScreen',
    4: 'DurationStakesScreen',
    5: 'TriedBeforeScreen',
    6: 'WhyItFailedReveal',
    7: 'ProductsQuestionScreen',
    8: 'BuildupReveal',
    9: 'BodyQuestionScreen',
    10: 'InternalReveal',
    11: 'FullPatternReveal',
    12: 'TransformationTimeline',
    13: 'BeforeAfterGallery',
    14: 'MethodOverview',
    15: 'PersonalizedPrediction',
    16: 'SuccessStories',
    17: 'BiggestConcernCapture',
    18: 'ConcernAddressed',
    19: 'TimeConfirmScreen',
    20: 'EmailCaptureScreen',
    21: 'LoadingAnticipation',
    22: 'ResultDashboard',
    23: 'CheckoutRedirect',
  };

  // Progress bar mapping (only shows on question screens)
  // Maps screen index to "X of 12" display
  static const Map<int, int> progressMapping = {
    1: 1,   // HairGoalScreen -> 1 of 12
    2: 2,   // PrimaryConcernScreen -> 2 of 12
    3: 3,   // AgeHairTypeScreen -> 3 of 12
    4: 4,   // DurationStakesScreen -> 4 of 12
    5: 5,   // TriedBeforeScreen -> 5 of 12
    7: 6,   // ProductsQuestionScreen -> 6 of 12
    9: 7,   // BodyQuestionScreen -> 7 of 12
    17: 10, // BiggestConcernCapture -> 10 of 12
    19: 11, // TimeConfirmScreen -> 11 of 12
    20: 12, // EmailCaptureScreen -> 12 of 12
  };

  // Total number of screens
  static const int totalScreens = 24;

  // Total progress steps for display
  static const int totalProgressSteps = 12;

  /// Check if current screen should show progress bar
  static bool shouldShowProgressBar(int screenIndex) {
    return progressMapping.containsKey(screenIndex);
  }

  /// Get progress bar step for current screen (1-12)
  static int getProgressStep(int screenIndex) {
    return progressMapping[screenIndex] ?? 0;
  }

  /// Get screen type (question, reveal, loading, result, etc.)
  static String getScreenType(int screenIndex) {
    return screenTypes[screenIndex] ?? 'unknown';
  }

  /// Get screen name for debugging/logging
  static String getScreenName(int screenIndex) {
    return screenNames[screenIndex] ?? 'Unknown';
  }

  /// Check if screen is a reveal screen (no progress bar, fade-in animation)
  static bool isRevealScreen(int screenIndex) {
    return screenTypes[screenIndex] == 'reveal';
  }

  /// Check if screen is a question screen
  static bool isQuestionScreen(int screenIndex) {
    return screenTypes[screenIndex] == 'question';
  }

  /// Check if screen should allow back navigation
  static bool canGoBack(int screenIndex) {
    // Can't go back from entry or result screens
    return screenIndex > 0 && screenIndex < 22;
  }

  /// Get the next screen index based on current state and profile
  /// Handles conditional navigation logic
  static int getNextScreen(int currentScreen, QuizProfileV2Struct profile) {
    switch (currentScreen) {
      case 5: // After TriedBeforeScreen
        // Skip WhyItFailedReveal if user selected "Nothing yet"
        if (profile.triedBefore.contains('tried_nothing')) {
          return 7; // Go to ProductsQuestionScreen
        }
        return 6; // Go to WhyItFailedReveal

      case 6: // After WhyItFailedReveal
        return 7; // Go to ProductsQuestionScreen

      case 19: // After TimeConfirmScreen
        // Both paths go to EmailCapture, but messaging may differ
        return 20;

      default:
        // Normal sequential progression
        if (currentScreen < totalScreens - 1) {
          return currentScreen + 1;
        }
        return currentScreen; // Stay on last screen
    }
  }

  /// Get the previous screen index (handles skip logic in reverse)
  static int getPreviousScreen(int currentScreen, QuizProfileV2Struct profile) {
    switch (currentScreen) {
      case 7: // On ProductsQuestionScreen
        // If user had "Nothing yet", skip back to TriedBeforeScreen
        if (profile.triedBefore.contains('tried_nothing')) {
          return 5;
        }
        return 6; // Go back to WhyItFailedReveal

      default:
        // Normal sequential regression
        if (currentScreen > 0) {
          return currentScreen - 1;
        }
        return 0; // Stay on first screen
    }
  }

  /// Check if current screen auto-advances after selection (single-select questions)
  static bool shouldAutoAdvance(int screenIndex) {
    // Single-select question screens auto-advance
    switch (screenIndex) {
      case 1:  // HairGoalScreen
      case 2:  // PrimaryConcernScreen
      case 4:  // DurationStakesScreen
      case 17: // BiggestConcernCapture
        return true;
      default:
        return false;
    }
  }

  /// Get auto-advance delay in milliseconds
  static int getAutoAdvanceDelay() {
    return 300; // 300ms delay after selection
  }

  /// Check if current screen requires Continue button
  static bool requiresContinueButton(int screenIndex) {
    switch (screenIndex) {
      case 3:  // AgeHairTypeScreen (two inputs)
      case 5:  // TriedBeforeScreen (multi-select)
      case 7:  // ProductsQuestionScreen (two inputs)
      case 9:  // BodyQuestionScreen (multi-select)
      case 19: // TimeConfirmScreen (two buttons, but special case)
      case 20: // EmailCaptureScreen (form)
        return true;
      default:
        // Reveal screens have Continue buttons too
        return isRevealScreen(screenIndex);
    }
  }

  /// Check if screen is the scrollable result page
  static bool isScrollableScreen(int screenIndex) {
    return screenIndex == 22; // Only ResultDashboard is scrollable
  }

  /// Get CTA button text for each screen
  static String getCtaButtonText(int screenIndex) {
    switch (screenIndex) {
      case 0:
        return 'START MY DIAGNOSIS';
      case 6:
        return 'CONTINUE';
      case 8:
        return 'CONTINUE';
      case 10:
        return 'SEE MY FULL PATTERN';
      case 11:
        return 'SEE WHAT\'S POSSIBLE';
      case 12:
        return 'SEE REAL RESULTS';
      case 13:
        return 'HOW DOES THIS WORK?';
      case 14:
        return 'SEE MY PREDICTION';
      case 15:
        return 'SEE SUCCESS STORIES';
      case 16:
        return 'ALMOST DONE';
      case 18:
        return 'GET MY RESULTS';
      case 20:
        return 'SEE MY RESULTS';
      case 22:
        return 'START MY TRANSFORMATION';
      default:
        return 'CONTINUE';
    }
  }

  /// Get back button behavior - some screens should skip back
  static bool shouldShowBackButton(int screenIndex) {
    // Don't show back on entry, loading, result, or redirect screens
    return screenIndex > 0 && screenIndex < 21;
  }
}
