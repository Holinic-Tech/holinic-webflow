import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';
import '/quiz_v2/helpers/testimonial_matcher.dart';

/// Screen 14: Before/After Gallery (VISUAL PROOF)
/// Purpose: Show undeniable proof from people like them
/// Emotion: Belief — "Women like me have done this"
class BeforeAfterGallery extends StatelessWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const BeforeAfterGallery({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);
    final profile = FFAppState().quizProfileV2;

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
      ctaText: 'HOW DOES THIS WORK?',
      onCtaPressed: onNext,
      child: Column(
        children: [
          const SizedBox(height: 24),

          // Title
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              'WOMEN WITH YOUR PATTERN',
              style: theme.headlineSmall.copyWith(
                color: theme.primaryText,
                fontWeight: FontWeight.w700,
                fontSize: 20,
                letterSpacing: 1,
              ),
              textAlign: TextAlign.center,
            ),
          ),

          const SizedBox(height: 24),

          // Testimonial carousel - use default height (380)
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
