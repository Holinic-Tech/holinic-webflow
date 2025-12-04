import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';
import '/quiz_v2/helpers/personalization_helper.dart';
import '/quiz_v2/helpers/testimonial_matcher.dart';

/// Screen 17: Success Stories (VISUAL CAROUSEL)
/// Purpose: Deep social proof matched to their profile
/// Emotion: Trust — "Real women, real results"
class SuccessStories extends StatelessWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const SuccessStories({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);
    final profile = FFAppState().quizProfileV2;
    final ageRange = PersonalizationHelper.getAgeRangeDisplay(profile.ageRange);
    final concernShort = PersonalizationHelper.getConcernShort(profile.primaryConcern);

    // Get matched testimonials
    final allTestimonials = TestimonialMatcher.getSampleTestimonials();
    final matchedTestimonials = TestimonialMatcher.getTopTestimonials(
      allTestimonials,
      profile,
      count: 5,
    );

    return RevealScreenWrapper(
      showBackButton: true,
      onBackPressed: onBack,
      ctaText: 'ALMOST DONE',
      onCtaPressed: onNext,
      child: Column(
        children: [
          const SizedBox(height: 24),

          // Title
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                Text(
                  'SUCCESS STORIES',
                  style: theme.headlineSmall.copyWith(
                    color: theme.primaryText,
                    fontWeight: FontWeight.w700,
                    fontSize: 20,
                    letterSpacing: 1,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  'Women in their $ageRange who fixed their $concernShort',
                  style: theme.bodyMedium.copyWith(
                    color: theme.secondaryText,
                    fontSize: 14,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Testimonial carousel
          TestimonialCarousel(
            testimonials: matchedTestimonials,
            height: 420,
            margin: const EdgeInsets.symmetric(horizontal: 0),
          ),

          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
