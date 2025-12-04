import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/quiz_v2/navigation/quiz_navigation.dart';

/// Header component for Quiz V2 screens with back button and progress bar
class QuizHeaderV2 extends StatelessWidget {
  final int currentStep;
  final int totalSteps;
  final VoidCallback? onBackPressed;
  final bool showBackButton;
  final bool showProgress;

  const QuizHeaderV2({
    super.key,
    required this.currentStep,
    this.totalSteps = 12,
    this.onBackPressed,
    this.showBackButton = true,
    this.showProgress = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Top row with back button and step indicator
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Back button
              if (showBackButton && onBackPressed != null)
                GestureDetector(
                  onTap: onBackPressed,
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    child: Icon(
                      Icons.arrow_back_ios,
                      size: 20,
                      color: theme.primaryText,
                    ),
                  ),
                )
              else
                const SizedBox(width: 36),

              // Step indicator
              if (showProgress)
                Text(
                  '$currentStep of $totalSteps',
                  style: theme.bodyMedium.copyWith(
                    color: theme.secondaryText,
                    fontSize: 14,
                  ),
                )
              else
                const SizedBox.shrink(),

              // Spacer to balance the row
              const SizedBox(width: 36),
            ],
          ),

          if (showProgress) ...[
            const SizedBox(height: 12),
            // Progress bar
            _ProgressBar(
              currentStep: currentStep,
              totalSteps: totalSteps,
            ),
          ],
        ],
      ),
    );
  }
}

class _ProgressBar extends StatelessWidget {
  final int currentStep;
  final int totalSteps;

  const _ProgressBar({
    required this.currentStep,
    required this.totalSteps,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);
    final progress = currentStep / totalSteps;

    return Container(
      height: 6,
      decoration: BoxDecoration(
        color: theme.progessUnselected,
        borderRadius: BorderRadius.circular(3),
      ),
      child: LayoutBuilder(
        builder: (context, constraints) {
          return Stack(
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                width: constraints.maxWidth * progress,
                height: 6,
                decoration: BoxDecoration(
                  color: theme.button,
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

/// Factory method to create header based on screen index
class QuizHeaderV2Factory {
  static QuizHeaderV2? createForScreen(
    int screenIndex, {
    VoidCallback? onBackPressed,
  }) {
    // Check if this screen should show progress bar
    if (!QuizNavigationManager.shouldShowProgressBar(screenIndex)) {
      // Reveal screens don't show progress, but may show back button
      if (QuizNavigationManager.shouldShowBackButton(screenIndex)) {
        return QuizHeaderV2(
          currentStep: 0,
          showProgress: false,
          showBackButton: true,
          onBackPressed: onBackPressed,
        );
      }
      return null; // No header for entry/result screens
    }

    final progressStep = QuizNavigationManager.getProgressStep(screenIndex);

    return QuizHeaderV2(
      currentStep: progressStep,
      totalSteps: QuizNavigationManager.totalProgressSteps,
      showBackButton: QuizNavigationManager.shouldShowBackButton(screenIndex),
      showProgress: true,
      onBackPressed: onBackPressed,
    );
  }
}
