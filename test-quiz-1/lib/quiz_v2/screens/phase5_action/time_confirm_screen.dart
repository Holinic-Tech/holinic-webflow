import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';

/// Screen 20: Time Confirm Screen
/// Purpose: Final confirmation they can do this
/// Emotion: Commitment — "I can do this"
class TimeConfirmScreen extends StatelessWidget {
  final VoidCallback onYes;
  final VoidCallback onNo;
  final VoidCallback onBack;

  const TimeConfirmScreen({
    super.key,
    required this.onYes,
    required this.onNo,
    required this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return SafeArea(
      child: Column(
        children: [
          // Header with progress
          QuizHeaderV2(
            currentStep: 11,
            totalSteps: 12,
            showBackButton: true,
            onBackPressed: onBack,
          ),

          const SizedBox(height: 24),

          // Title
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                Text(
                  'Perfect. Last step...',
                  style: theme.bodyMedium.copyWith(
                    color: theme.secondaryText,
                    fontSize: 14,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                Text(
                  'Can you commit to 10-15 minutes per day for 14 days?',
                  style: theme.headlineSmall.copyWith(
                    color: theme.primaryText,
                    fontWeight: FontWeight.w700,
                    fontSize: 22,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),

          const SizedBox(height: 40),

          // Visual: Calendar icon
          Container(
            width: 160,
            height: 160,
            decoration: BoxDecoration(
              color: theme.backgroundDove,
              shape: BoxShape.circle,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.calendar_today,
                  size: 48,
                  color: theme.button,
                ),
                const SizedBox(height: 12),
                Text(
                  '14 days',
                  style: theme.titleMedium.copyWith(
                    color: theme.primaryText,
                    fontWeight: FontWeight.w700,
                    fontSize: 18,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '10-15 min/day',
                  style: theme.bodySmall.copyWith(
                    color: theme.secondaryText,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),

          const Spacer(),

          // Two buttons
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                Expanded(
                  child: _CommitButton(
                    text: 'YES, I CAN',
                    isPrimary: true,
                    onTap: () {
                      FFAppState().update(() {
                        FFAppState().quizProfileV2.canCommit = true;
                      });
                      onYes();
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _CommitButton(
                    text: 'NOT RIGHT NOW',
                    isPrimary: false,
                    onTap: () {
                      FFAppState().update(() {
                        FFAppState().quizProfileV2.canCommit = false;
                      });
                      onNo();
                    },
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _CommitButton extends StatelessWidget {
  final String text;
  final bool isPrimary;
  final VoidCallback onTap;

  const _CommitButton({
    required this.text,
    required this.isPrimary,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 56,
        decoration: BoxDecoration(
          color: isPrimary ? theme.button : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: isPrimary
              ? null
              : Border.all(color: theme.progessUnselected, width: 1),
        ),
        child: Center(
          child: Text(
            text,
            style: theme.titleMedium.copyWith(
              color: isPrimary ? Colors.white : theme.primaryText,
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }
}
