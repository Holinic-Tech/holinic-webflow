import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';
import '/quiz_v2/helpers/personalization_helper.dart';

/// Screen 11: Internal Reveal (VISUAL REVEAL)
/// Purpose: Root Cause #2 Revelation — The body connection
/// Emotion: "I never connected these things..."
class InternalReveal extends StatelessWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const InternalReveal({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);
    final profile = FFAppState().quizProfileV2;
    final internalMessage = PersonalizationHelper.getInternalMessage(
      profile.bodyFactors,
    );

    return RevealScreenWrapper(
      showBackButton: true,
      onBackPressed: onBack,
      ctaText: 'SEE MY FULL PATTERN',
      onCtaPressed: onNext,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 24),

            // Title with emoji
            RevealSectionTitle(
              emoji: '🔬',
              text: 'The connection:',
            ),

            const SizedBox(height: 24),

            // Visual: Body nutrient priority diagram
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: theme.backgroundDove,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: theme.progessUnselected),
              ),
              child: Column(
                children: [
                  // Body diagram with nutrient flow
                  Container(
                    width: double.infinity,
                    height: 180,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // Body outline
                        Icon(
                          Icons.person_outline,
                          size: 120,
                          color: theme.secondaryText.withOpacity(0.3),
                        ),
                        // Arrows showing nutrient priority
                        Positioned(
                          top: 20,
                          right: 60,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              _PriorityLabel(
                                label: '1. BRAIN',
                                color: theme.success,
                              ),
                              const SizedBox(height: 4),
                              _PriorityLabel(
                                label: '2. HEART',
                                color: theme.success,
                              ),
                              const SizedBox(height: 4),
                              _PriorityLabel(
                                label: '3. ORGANS',
                                color: theme.success,
                              ),
                            ],
                          ),
                        ),
                        Positioned(
                          bottom: 20,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: theme.error.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: theme.error.withOpacity(0.3),
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  'LAST: ',
                                  style: theme.labelSmall.copyWith(
                                    color: theme.error,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  'HAIR',
                                  style: theme.labelMedium.copyWith(
                                    color: theme.error,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'When your body is stressed, it sends nutrients to VITAL organs first.',
                    style: theme.bodyMedium.copyWith(
                      color: theme.primaryText,
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Hair gets what\'s LEFT.',
                    style: theme.titleMedium.copyWith(
                      color: theme.error,
                      fontWeight: FontWeight.w700,
                      fontSize: 18,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Dynamic message based on body factors
            RevealInfoCard(
              text: internalMessage,
              margin: EdgeInsets.zero,
              backgroundColor: theme.secondaryViolet.withOpacity(0.5),
            ),

            const SizedBox(height: 24),

            // Root cause label
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 16),
              child: Text(
                'This is ROOT CAUSE #2',
                style: theme.titleMedium.copyWith(
                  color: theme.button,
                  fontWeight: FontWeight.w700,
                  fontSize: 16,
                ),
                textAlign: TextAlign.center,
              ),
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

class _PriorityLabel extends StatelessWidget {
  final String label;
  final Color color;

  const _PriorityLabel({
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 6),
        Text(
          label,
          style: theme.labelSmall.copyWith(
            color: theme.primaryText,
            fontWeight: FontWeight.w600,
            fontSize: 11,
          ),
        ),
      ],
    );
  }
}
