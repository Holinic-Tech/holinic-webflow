import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';
import '/quiz_v2/helpers/personalization_helper.dart';

/// Screen 13: Transformation Timeline (VISUAL)
/// Purpose: Make the future feel real and achievable
/// Emotion: Hope — "This could actually happen for me"
class TransformationTimeline extends StatelessWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const TransformationTimeline({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);
    final profile = FFAppState().quizProfileV2;
    final concernShort = PersonalizationHelper.getConcernShort(profile.primaryConcern);
    final duration = PersonalizationHelper.getDurationDisplay(profile.struggleDuration);
    final milestones = PersonalizationHelper.getTimelineMilestones(profile.primaryConcern);

    return RevealScreenWrapper(
      showBackButton: true,
      onBackPressed: onBack,
      ctaText: 'SEE REAL RESULTS',
      onCtaPressed: onNext,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 24),

            // Title
            Text(
              'YOUR TRANSFORMATION TIMELINE',
              style: theme.headlineSmall.copyWith(
                color: theme.primaryText,
                fontWeight: FontWeight.w700,
                fontSize: 20,
                letterSpacing: 1,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 12),

            Text(
              'Based on your $concernShort and $duration, here\'s what women like you typically see:',
              style: theme.bodyMedium.copyWith(
                color: theme.secondaryText,
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 32),

            // Timeline
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: theme.backgroundDove,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  _TimelineMilestone(
                    period: 'WEEK 1',
                    description: milestones['week1'] ?? '',
                    isFirst: true,
                    isComplete: false,
                  ),
                  _TimelineMilestone(
                    period: 'WEEK 2-3',
                    description: milestones['week2'] ?? '',
                    isFirst: false,
                    isComplete: false,
                  ),
                  _TimelineMilestone(
                    period: 'MONTH 1-2',
                    description: milestones['month1'] ?? '',
                    isFirst: false,
                    isComplete: false,
                  ),
                  _TimelineMilestone(
                    period: 'MONTH 3+',
                    description: milestones['month3'] ?? '',
                    isFirst: false,
                    isComplete: true,
                    isLast: true,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

class _TimelineMilestone extends StatelessWidget {
  final String period;
  final String description;
  final bool isFirst;
  final bool isComplete;
  final bool isLast;

  const _TimelineMilestone({
    required this.period,
    required this.description,
    required this.isFirst,
    required this.isComplete,
    this.isLast = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Timeline line and dot
        Column(
          children: [
            // Dot
            Container(
              width: 16,
              height: 16,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isComplete ? theme.button : Colors.white,
                border: Border.all(
                  color: theme.button,
                  width: 2,
                ),
              ),
              child: isComplete
                  ? const Icon(Icons.check, size: 10, color: Colors.white)
                  : null,
            ),
            // Line (except for last item)
            if (!isLast)
              Container(
                width: 2,
                height: 60,
                color: theme.button.withOpacity(0.3),
              ),
          ],
        ),
        const SizedBox(width: 16),
        // Content
        Expanded(
          child: Padding(
            padding: EdgeInsets.only(bottom: isLast ? 0 : 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  period,
                  style: theme.labelMedium.copyWith(
                    color: theme.button,
                    fontWeight: FontWeight.w700,
                    fontSize: 12,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: theme.bodyMedium.copyWith(
                    color: theme.primaryText,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
