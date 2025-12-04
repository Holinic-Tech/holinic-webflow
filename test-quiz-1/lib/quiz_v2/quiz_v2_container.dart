import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/navigation/quiz_navigation.dart';

// Phase 1: Identity screens
import '/quiz_v2/screens/phase1_identity/entry_hook_screen.dart';
import '/quiz_v2/screens/phase1_identity/hair_goal_screen.dart';
import '/quiz_v2/screens/phase1_identity/primary_concern_screen.dart';
import '/quiz_v2/screens/phase1_identity/age_hair_type_screen.dart';
import '/quiz_v2/screens/phase1_identity/duration_stakes_screen.dart';

// Phase 2: Discovery screens
import '/quiz_v2/screens/phase2_discovery/tried_before_screen.dart';
import '/quiz_v2/screens/phase2_discovery/why_it_failed_reveal.dart';
import '/quiz_v2/screens/phase2_discovery/products_question_screen.dart';
import '/quiz_v2/screens/phase2_discovery/buildup_reveal.dart';
import '/quiz_v2/screens/phase2_discovery/body_question_screen.dart';
import '/quiz_v2/screens/phase2_discovery/internal_reveal.dart';
import '/quiz_v2/screens/phase2_discovery/full_pattern_reveal.dart';

// Phase 3: Vision screens
import '/quiz_v2/screens/phase3_vision/transformation_timeline.dart';
import '/quiz_v2/screens/phase3_vision/before_after_gallery.dart';
import '/quiz_v2/screens/phase3_vision/method_overview.dart';
import '/quiz_v2/screens/phase3_vision/personalized_prediction.dart';

// Phase 4: Conviction screens
import '/quiz_v2/screens/phase4_conviction/success_stories.dart';
import '/quiz_v2/screens/phase4_conviction/biggest_concern_capture.dart';
import '/quiz_v2/screens/phase4_conviction/concern_addressed.dart';

// Phase 5: Action screens
import '/quiz_v2/screens/phase5_action/time_confirm_screen.dart';
import '/quiz_v2/screens/phase5_action/email_capture_screen.dart';
import '/quiz_v2/screens/phase5_action/loading_anticipation.dart';
import '/quiz_v2/screens/phase5_action/result_dashboard.dart';
import '/quiz_v2/screens/phase5_action/checkout_redirect.dart';

/// Main container for Quiz V2 that manages all 24 screens
/// Uses PageView for smooth transitions between screens
class QuizV2Container extends StatefulWidget {
  const QuizV2Container({super.key});

  @override
  State<QuizV2Container> createState() => _QuizV2ContainerState();
}

class _QuizV2ContainerState extends State<QuizV2Container> {
  late PageController _pageController;
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    _currentIndex = FFAppState().currentScreenIndexV2;
    _pageController = PageController(initialPage: _currentIndex);

    // Reset quiz state on fresh start
    if (_currentIndex == 0) {
      FFAppState().resetQuizV2();
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  /// Navigate to the next screen with conditional logic
  void _goToNextScreen() {
    final profile = FFAppState().quizProfileV2;
    final nextIndex = QuizNavigationManager.getNextScreen(_currentIndex, profile);

    _navigateToScreen(nextIndex);
  }

  /// Navigate to the previous screen with conditional logic
  void _goToPreviousScreen() {
    final profile = FFAppState().quizProfileV2;
    final prevIndex = QuizNavigationManager.getPreviousScreen(_currentIndex, profile);

    _navigateToScreen(prevIndex);
  }

  /// Navigate to a specific screen index
  void _navigateToScreen(int index) {
    if (index < 0 || index >= QuizNavigationManager.totalScreens) return;

    setState(() {
      _currentIndex = index;
    });

    // Update app state
    FFAppState().update(() {
      FFAppState().currentScreenIndexV2 = index;
      FFAppState().progressBarStepV2 = QuizNavigationManager.getProgressStep(index);
    });

    // Animate to the new page
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  /// Build the screen widget for a given index
  Widget _buildScreen(int index) {
    switch (index) {
      // Phase 1: Identity (Screens 0-4)
      case 0:
        return EntryHookScreen(
          onStart: _goToNextScreen,
        );
      case 1:
        return HairGoalScreen(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );
      case 2:
        return PrimaryConcernScreen(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );
      case 3:
        return AgeHairTypeScreen(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );
      case 4:
        return DurationStakesScreen(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );

      // Phase 2: Discovery (Screens 5-11)
      case 5:
        return TriedBeforeScreen(
          onNext: (bool skipReveal) {
            if (skipReveal) {
              // Skip WhyItFailedReveal (screen 6) and go to ProductsQuestion (screen 7)
              _navigateToScreen(7);
            } else {
              _goToNextScreen();
            }
          },
          onBack: _goToPreviousScreen,
        );
      case 6:
        return WhyItFailedReveal(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );
      case 7:
        return ProductsQuestionScreen(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );
      case 8:
        return BuildupReveal(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );
      case 9:
        return BodyQuestionScreen(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );
      case 10:
        return InternalReveal(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );
      case 11:
        return FullPatternReveal(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );

      // Phase 3: Vision (Screens 12-15)
      case 12:
        return TransformationTimeline(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );
      case 13:
        return BeforeAfterGallery(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );
      case 14:
        return MethodOverview(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );
      case 15:
        return PersonalizedPrediction(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );

      // Phase 4: Conviction (Screens 16-18)
      case 16:
        return SuccessStories(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );
      case 17:
        return BiggestConcernCapture(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );
      case 18:
        return ConcernAddressed(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );

      // Phase 5: Action (Screens 19-23)
      case 19:
        return TimeConfirmScreen(
          onYes: _goToNextScreen,
          onNo: _goToNextScreen, // Both paths go to email capture
          onBack: _goToPreviousScreen,
        );
      case 20:
        return EmailCaptureScreen(
          onNext: _goToNextScreen,
          onBack: _goToPreviousScreen,
        );
      case 21:
        return LoadingAnticipation(
          onComplete: _goToNextScreen,
        );
      case 22:
        return ResultDashboard(
          onCheckout: _goToNextScreen,
        );
      case 23:
        return const CheckoutRedirect();

      default:
        return _buildErrorScreen();
    }
  }

  Widget _buildErrorScreen() {
    final theme = FlutterFlowTheme.of(context);
    return Scaffold(
      backgroundColor: theme.primaryBackground,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              size: 48,
              color: theme.error,
            ),
            const SizedBox(height: 16),
            Text(
              'Screen not found',
              style: theme.titleMedium.copyWith(
                color: theme.primaryText,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => _navigateToScreen(0),
              child: const Text('Start Over'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Scaffold(
      backgroundColor: theme.primaryBackground,
      body: PageView.builder(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(), // Disable swipe navigation
        itemCount: QuizNavigationManager.totalScreens,
        itemBuilder: (context, index) => _buildScreen(index),
        onPageChanged: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}

/// Widget that wraps the Quiz V2 and can be used as an entry point
class QuizV2Widget extends StatefulWidget {
  const QuizV2Widget({super.key});

  @override
  State<QuizV2Widget> createState() => _QuizV2WidgetState();
}

class _QuizV2WidgetState extends State<QuizV2Widget> {
  @override
  void initState() {
    super.initState();
    // Initialize quiz state
    FFAppState().resetQuizV2();
  }

  @override
  Widget build(BuildContext context) {
    return const QuizV2Container();
  }
}
