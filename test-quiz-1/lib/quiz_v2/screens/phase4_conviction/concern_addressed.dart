import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';
import '/quiz_v2/helpers/personalization_helper.dart';

/// Screen 19: Concern Addressed (PERSONALIZED REASSURANCE)
/// Purpose: Directly address their specific concern
/// Emotion: Relief — "They actually addressed my worry"
class ConcernAddressed extends StatelessWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const ConcernAddressed({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);
    final profile = FFAppState().quizProfileV2;
    final concernShort = PersonalizationHelper.getConcernShort(profile.primaryConcern);
    final responseData = PersonalizationHelper.getConcernResponse(
      profile.biggestConcern,
      concernShort,
      profile.rootCauseCount,
    );

    final title = responseData['title'] as String;
    final response = responseData['response'] as String;
    final proofPoints = responseData['proofPoints'] as List<String>;

    // Simplified screen for "no concerns"
    final isNoConerns = profile.biggestConcern == 'concern_none';

    return RevealScreenWrapper(
      showBackButton: true,
      onBackPressed: onBack,
      ctaText: 'GET MY RESULTS',
      onCtaPressed: onNext,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 24),

            // "Great question" header (skip if no concerns)
            if (!isNoConerns) ...[
              Text(
                'Great question.',
                style: theme.bodyMedium.copyWith(
                  color: theme.secondaryText,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 16),
            ],

            // Title
            Text(
              title,
              style: theme.headlineSmall.copyWith(
                color: theme.primaryText,
                fontWeight: FontWeight.w700,
                fontSize: 22,
              ),
            ),

            const SizedBox(height: 24),

            // Visual icon based on concern type
            if (!isNoConerns)
              _ConcernVisual(concernType: profile.biggestConcern),

            const SizedBox(height: 24),

            // Response text
            Text(
              response,
              style: theme.bodyMedium.copyWith(
                color: theme.primaryText,
                fontSize: 15,
                height: 1.5,
              ),
            ),

            if (proofPoints.isNotEmpty) ...[
              const SizedBox(height: 24),

              // Proof points
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: theme.success.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: proofPoints.map((point) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(
                            Icons.check_circle,
                            color: theme.success,
                            size: 20,
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              point,
                              style: theme.bodyMedium.copyWith(
                                color: theme.primaryText,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

class _ConcernVisual extends StatelessWidget {
  final String concernType;

  const _ConcernVisual({required this.concernType});

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    IconData iconData;
    Color iconColor;

    switch (concernType) {
      case 'concern_works':
        iconData = Icons.science;
        iconColor = theme.button;
        break;
      case 'concern_time':
        iconData = Icons.access_time;
        iconColor = theme.accentTangerine;
        break;
      case 'concern_diy':
        iconData = Icons.auto_fix_high;
        iconColor = theme.success;
        break;
      case 'concern_disappointed':
        iconData = Icons.favorite;
        iconColor = theme.error;
        break;
      default:
        iconData = Icons.check_circle;
        iconColor = theme.success;
    }

    return Center(
      child: Container(
        width: 80,
        height: 80,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: iconColor.withOpacity(0.1),
        ),
        child: Icon(
          iconData,
          size: 40,
          color: iconColor,
        ),
      ),
    );
  }
}
