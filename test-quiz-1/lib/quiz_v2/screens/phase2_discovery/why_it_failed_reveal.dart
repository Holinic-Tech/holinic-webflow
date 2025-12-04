import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';
import '/quiz_v2/helpers/personalization_helper.dart';

/// Screen 7: Why It Failed Reveal (VISUAL REVEAL)
/// Purpose: Validate their frustration + create first "aha"
/// Emotion: "So it's NOT my fault..."
class WhyItFailedReveal extends StatelessWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const WhyItFailedReveal({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  List<String> _getRelevantMessages() {
    final triedBefore = FFAppState().quizProfileV2.triedBefore;
    final messages = PersonalizationHelper.getWhyItFailedMessages();

    return triedBefore
        .where((tried) => messages.containsKey(tried))
        .map((tried) => messages[tried]!)
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);
    final relevantMessages = _getRelevantMessages();

    return RevealScreenWrapper(
      showBackButton: true,
      onBackPressed: onBack,
      ctaText: 'CONTINUE',
      onCtaPressed: onNext,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 24),

            // Title
            Text(
              'Here\'s the thing about what you\'ve tried...',
              style: theme.headlineSmall.copyWith(
                color: theme.primaryText,
                fontWeight: FontWeight.w700,
                fontSize: 22,
              ),
            ),

            const SizedBox(height: 24),

            // Visual diagram placeholder
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
                  // Symptom -> Treatment diagram
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                        decoration: BoxDecoration(
                          color: theme.secondaryAlmond,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'SYMPTOM',
                          style: theme.labelMedium.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Icon(Icons.arrow_forward, color: theme.secondaryText),
                      const SizedBox(width: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                        decoration: BoxDecoration(
                          color: theme.secondaryAlmond,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'TREATMENT',
                          style: theme.labelMedium.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: theme.error.withOpacity(0.2),
                        ),
                        child: Icon(
                          Icons.close,
                          color: theme.error,
                          size: 20,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'These treat SYMPTOMS\nnot ROOT CAUSES',
                    style: theme.titleMedium.copyWith(
                      color: theme.primaryText,
                      fontWeight: FontWeight.w700,
                      fontSize: 18,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Dynamic messages based on what they tried
            if (relevantMessages.isNotEmpty) ...[
              ...relevantMessages.map((message) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: RevealInfoCard(
                    icon: '💡',
                    text: message,
                    margin: EdgeInsets.zero,
                  ),
                );
              }),
            ],

            const SizedBox(height: 24),

            // Footer text
            Text(
              'Let me show you what\'s actually happening...',
              style: theme.bodyMedium.copyWith(
                color: theme.secondaryText,
                fontStyle: FontStyle.italic,
                fontSize: 15,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
