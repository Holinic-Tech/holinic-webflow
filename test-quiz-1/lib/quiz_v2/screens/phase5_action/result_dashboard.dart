import 'package:flutter/material.dart';
import 'dart:math' as math;
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';
import '/quiz_v2/helpers/personalization_helper.dart';
import '/quiz_v2/helpers/fit_score_calculator.dart';
import '/quiz_v2/helpers/testimonial_matcher.dart';

/// Screen 23: Result Dashboard (THE CLOSE)
/// Purpose: This IS the sale — personalized transformation plan + offer
/// Emotion: Confidence → Excitement → Action
/// SCROLLABLE — This is the exception
class ResultDashboard extends StatelessWidget {
  final VoidCallback onCheckout;

  const ResultDashboard({
    super.key,
    required this.onCheckout,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);
    final profile = FFAppState().quizProfileV2;
    final firstName = profile.userName.isNotEmpty
        ? profile.userName.split(' ')[0]
        : 'Friend';
    final concernShort = PersonalizationHelper.getConcernShort(profile.primaryConcern);
    final rootCauseCount = profile.rootCauseCount;
    final rootCauseTexts = FitScoreCalculator.getRootCauseDisplayTexts(profile.rootCauses);

    return Scaffold(
      backgroundColor: theme.primaryBackground,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // SECTION 1: Celebration & Fit Score
              _Section1FitScore(
                firstName: firstName,
                fitScore: profile.fitScore,
              ),

              // SECTION 2: Your Diagnosis Summary
              _Section2DiagnosisSummary(
                concernShort: concernShort,
                rootCauseCount: rootCauseCount,
                rootCauseTexts: rootCauseTexts,
              ),

              // SECTION 3: Your Transformation Vision
              _Section3TransformationVision(
                concernShort: profile.primaryConcern,
                hairType: profile.hairType,
              ),

              // SECTION 4: What Your Life Looks Like After
              _Section4LifeAfter(onCtaPressed: onCheckout),

              // SECTION 5: How You'll Get There
              _Section5HowToGetThere(rootCauseCount: rootCauseCount),

              // SECTION 6: Final Social Proof
              _Section6SocialProof(),

              // SECTION 7: The Offer
              _Section7Offer(rootCauseCount: rootCauseCount),

              // SECTION 8: Guarantee
              _Section8Guarantee(),

              // SECTION 9: Final CTA
              _Section9FinalCta(
                firstName: firstName,
                concernShort: concernShort,
                onCheckout: onCheckout,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// SECTION 1: Celebration & Fit Score
class _Section1FitScore extends StatelessWidget {
  final String firstName;
  final int fitScore;

  const _Section1FitScore({
    required this.firstName,
    required this.fitScore,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            theme.button.withOpacity(0.1),
            Colors.transparent,
          ],
        ),
      ),
      child: Column(
        children: [
          Text(
            '🎉 Great news, $firstName!',
            style: theme.headlineSmall.copyWith(
              color: theme.primaryText,
              fontWeight: FontWeight.w700,
              fontSize: 24,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          Container(
            width: 140,
            height: 140,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: theme.button.withOpacity(0.1),
              border: Border.all(color: theme.button, width: 4),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'YOUR FIT SCORE',
                  style: theme.labelSmall.copyWith(
                    color: theme.button,
                    fontWeight: FontWeight.w600,
                    fontSize: 10,
                    letterSpacing: 0.5,
                  ),
                ),
                Text(
                  '$fitScore%',
                  style: theme.displaySmall.copyWith(
                    color: theme.button,
                    fontWeight: FontWeight.w700,
                    fontSize: 40,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Excellent match for the 14-Day Challenge',
            style: theme.titleMedium.copyWith(
              color: theme.primaryText,
              fontWeight: FontWeight.w600,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Women with your score have a $fitScore% success rate',
            style: theme.bodyMedium.copyWith(
              color: theme.secondaryText,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}

// SECTION 2: Your Diagnosis Summary
class _Section2DiagnosisSummary extends StatelessWidget {
  final String concernShort;
  final int rootCauseCount;
  final List<String> rootCauseTexts;

  const _Section2DiagnosisSummary({
    required this.concernShort,
    required this.rootCauseCount,
    required this.rootCauseTexts,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Text(
            'YOUR HAIR PATTERN',
            style: theme.titleMedium.copyWith(
              color: theme.primaryText,
              fontWeight: FontWeight.w700,
              fontSize: 18,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Your $concernShort is being caused by $rootCauseCount factors:',
            style: theme.bodyMedium.copyWith(
              color: theme.secondaryText,
              fontSize: 14,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          ...rootCauseTexts.map((text) => Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: theme.success.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  Icon(Icons.check_circle, color: theme.success, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      text,
                      style: theme.bodyMedium.copyWith(
                        color: theme.primaryText,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          )),
          const SizedBox(height: 8),
          Text(
            'This is why nothing you\'ve tried has worked — until now.',
            style: theme.bodyMedium.copyWith(
              color: theme.primaryText,
              fontWeight: FontWeight.w600,
              fontStyle: FontStyle.italic,
              fontSize: 14,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

// SECTION 3: Your Transformation Vision
class _Section3TransformationVision extends StatelessWidget {
  final String concernShort;
  final String hairType;

  const _Section3TransformationVision({
    required this.concernShort,
    required this.hairType,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);
    final statements = PersonalizationHelper.getFuturePacingStatements(concernShort);
    final emojis = ['🪞', '🚿', '💁', '😌'];

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      color: theme.backgroundDove,
      child: Column(
        children: [
          Text(
            'IMAGINE, 90 DAYS FROM NOW...',
            style: theme.titleMedium.copyWith(
              color: theme.primaryText,
              fontWeight: FontWeight.w700,
              fontSize: 18,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 24),
          ...List.generate(statements.length, (index) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(emojis[index % emojis.length], style: const TextStyle(fontSize: 20)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      statements[index],
                      style: theme.bodyMedium.copyWith(
                        color: theme.primaryText,
                        fontSize: 15,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
          const SizedBox(height: 16),
          Text(
            'This isn\'t a fantasy. This is what happens when you address all root causes at once.',
            style: theme.bodyMedium.copyWith(
              color: theme.secondaryText,
              fontSize: 14,
              fontStyle: FontStyle.italic,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

// SECTION 4: What Your Life Looks Like After
class _Section4LifeAfter extends StatelessWidget {
  final VoidCallback onCtaPressed;

  const _Section4LifeAfter({required this.onCtaPressed});

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Text(
            'YOUR LIFE AFTER THE CHALLENGE',
            style: theme.titleMedium.copyWith(
              color: theme.primaryText,
              fontWeight: FontWeight.w700,
              fontSize: 18,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 20),
          _BenefitCard(emoji: '💰', title: 'SAVE \$200-500/YEAR', description: 'Stop buying products that don\'t work'),
          const SizedBox(height: 12),
          _BenefitCard(emoji: '⏰', title: '5-MINUTE ROUTINE', description: 'Once you know what works, it becomes effortless'),
          const SizedBox(height: 12),
          _BenefitCard(emoji: '🧠', title: 'PEACE OF MIND', description: 'No more obsessing over every strand'),
          const SizedBox(height: 24),
          QuizPrimaryButton(text: 'I\'M READY — SHOW ME', onPressed: onCtaPressed),
        ],
      ),
    );
  }
}

class _BenefitCard extends StatelessWidget {
  final String emoji;
  final String title;
  final String description;

  const _BenefitCard({required this.emoji, required this.title, required this.description});

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: theme.progessUnselected),
      ),
      child: Row(
        children: [
          Text(emoji, style: const TextStyle(fontSize: 28)),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: theme.titleSmall.copyWith(fontWeight: FontWeight.w700, fontSize: 14)),
                Text(description, style: theme.bodySmall.copyWith(color: theme.secondaryText, fontSize: 13)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// SECTION 5: How You'll Get There
class _Section5HowToGetThere extends StatelessWidget {
  final int rootCauseCount;

  const _Section5HowToGetThere({required this.rootCauseCount});

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      color: theme.backgroundDove,
      child: Column(
        children: [
          Text('YOUR 14-DAY TRANSFORMATION', style: theme.titleMedium.copyWith(fontWeight: FontWeight.w700, fontSize: 18, letterSpacing: 1)),
          const SizedBox(height: 8),
          Text('Here\'s how you\'ll address all $rootCauseCount root causes at once:', style: theme.bodyMedium.copyWith(color: theme.secondaryText, fontSize: 14)),
          const SizedBox(height: 20),
          _PhaseCard(phase: 1, days: '1-6', title: 'CLEAR', description: 'Remove years of buildup so your follicles can finally breathe', result: 'Scalp feels lighter by Day 3'),
          const SizedBox(height: 12),
          _PhaseCard(phase: 2, days: '7-10', title: 'RESET', description: 'Balance your body so nutrients reach your hair', result: 'Shedding reduces by Day 10'),
          const SizedBox(height: 12),
          _PhaseCard(phase: 3, days: '11-14', title: 'GROW', description: 'Build YOUR personalized routine that works forever', result: 'Know exactly what YOUR hair needs'),
          const SizedBox(height: 20),
          Text('10-15 minutes per day • 14 days to transformation', style: theme.bodyMedium.copyWith(color: theme.button, fontWeight: FontWeight.w600, fontSize: 14)),
        ],
      ),
    );
  }
}

class _PhaseCard extends StatelessWidget {
  final int phase;
  final String days;
  final String title;
  final String description;
  final String result;

  const _PhaseCard({required this.phase, required this.days, required this.title, required this.description, required this.result});

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 32, height: 32,
                decoration: BoxDecoration(shape: BoxShape.circle, color: theme.button),
                child: Center(child: Text('$phase', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700))),
              ),
              const SizedBox(width: 10),
              Text('DAYS $days: $title', style: theme.titleSmall.copyWith(fontWeight: FontWeight.w700, fontSize: 14)),
            ],
          ),
          const SizedBox(height: 10),
          Text(description, style: theme.bodyMedium.copyWith(fontSize: 14)),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(Icons.arrow_forward, size: 14, color: theme.success),
              const SizedBox(width: 6),
              Text(result, style: theme.bodySmall.copyWith(color: theme.success, fontWeight: FontWeight.w600, fontSize: 13)),
            ],
          ),
        ],
      ),
    );
  }
}

// SECTION 6: Social Proof
class _Section6SocialProof extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);
    final profile = FFAppState().quizProfileV2;
    final testimonials = TestimonialMatcher.getTopTestimonials(TestimonialMatcher.getSampleTestimonials(), profile, count: 3);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Text('WOMEN LIKE YOU WHO DID THIS', style: theme.titleMedium.copyWith(fontWeight: FontWeight.w700, fontSize: 18, letterSpacing: 1)),
          const SizedBox(height: 20),
          SizedBox(height: 320, child: TestimonialCarousel(testimonials: testimonials, height: 300)),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ...List.generate(5, (i) => Icon(Icons.star, color: theme.warning, size: 20)),
              const SizedBox(width: 8),
              Text('4.8/5 from 15,000+ verified reviews', style: theme.bodySmall.copyWith(color: theme.secondaryText, fontSize: 13)),
            ],
          ),
        ],
      ),
    );
  }
}

// SECTION 7: The Offer
class _Section7Offer extends StatelessWidget {
  final int rootCauseCount;

  const _Section7Offer({required this.rootCauseCount});

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      color: theme.button.withOpacity(0.05),
      child: Column(
        children: [
          Text('START YOUR TRANSFORMATION', style: theme.titleMedium.copyWith(fontWeight: FontWeight.w700, fontSize: 18, letterSpacing: 1)),
          const SizedBox(height: 20),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: theme.button, width: 2)),
            child: Column(
              children: [
                Text('THE 14-DAY HAIRCARE CHALLENGE', style: theme.titleMedium.copyWith(fontWeight: FontWeight.w700, fontSize: 16)),
                const SizedBox(height: 8),
                Text('Everything you need to transform your hair by addressing all $rootCauseCount root causes at once.', style: theme.bodyMedium.copyWith(color: theme.secondaryText, fontSize: 14), textAlign: TextAlign.center),
                const SizedBox(height: 16),
                Divider(color: theme.progessUnselected),
                const SizedBox(height: 16),
                _FeatureItem(text: '14 daily video lessons'),
                _FeatureItem(text: 'Personalized routine builder'),
                _FeatureItem(text: 'DIY shampoo workshop'),
                _FeatureItem(text: 'Ingredient scanner app'),
                _FeatureItem(text: 'Members community'),
                _FeatureItem(text: 'All bonuses included'),
                const SizedBox(height: 16),
                Divider(color: theme.progessUnselected),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('\$249', style: theme.titleMedium.copyWith(color: theme.secondaryText, decoration: TextDecoration.lineThrough, fontSize: 18)),
                    const SizedBox(width: 12),
                    Text('→', style: TextStyle(color: theme.secondaryText, fontSize: 18)),
                    const SizedBox(width: 12),
                    Text('\$37', style: theme.headlineMedium.copyWith(color: theme.button, fontWeight: FontWeight.w700, fontSize: 32)),
                  ],
                ),
                const SizedBox(height: 8),
                Text('That\'s less than ONE salon product that doesn\'t work.', style: theme.bodySmall.copyWith(color: theme.secondaryText, fontSize: 13)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _FeatureItem extends StatelessWidget {
  final String text;

  const _FeatureItem({required this.text});

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Icon(Icons.check, color: theme.success, size: 18),
          const SizedBox(width: 10),
          Text(text, style: theme.bodyMedium.copyWith(fontSize: 14)),
        ],
      ),
    );
  }
}

// SECTION 8: Guarantee
class _Section8Guarantee extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Text('💯 30-DAY GUARANTEE', style: theme.titleMedium.copyWith(fontWeight: FontWeight.w700, fontSize: 18)),
          const SizedBox(height: 20),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: theme.success.withOpacity(0.1), borderRadius: BorderRadius.circular(16), border: Border.all(color: theme.success.withOpacity(0.3))),
            child: Column(
              children: [
                Container(
                  width: 60, height: 60,
                  decoration: BoxDecoration(shape: BoxShape.circle, color: theme.success),
                  child: const Icon(Icons.verified, color: Colors.white, size: 32),
                ),
                const SizedBox(height: 16),
                Text('Try the entire Challenge.', style: theme.titleMedium.copyWith(fontWeight: FontWeight.w700, fontSize: 16)),
                const SizedBox(height: 12),
                Text('If you don\'t see results — or you\'re not satisfied for ANY reason — just email us for a full refund.', style: theme.bodyMedium.copyWith(fontSize: 14), textAlign: TextAlign.center),
                const SizedBox(height: 12),
                Text('No questions. No hassle.', style: theme.bodyMedium.copyWith(fontWeight: FontWeight.w600, fontSize: 14)),
                const SizedBox(height: 8),
                Text('You literally cannot lose.', style: theme.titleMedium.copyWith(color: theme.success, fontWeight: FontWeight.w700, fontSize: 16)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Text('Either you transform your hair, or you pay nothing.', style: theme.bodyMedium.copyWith(fontStyle: FontStyle.italic, fontSize: 14), textAlign: TextAlign.center),
        ],
      ),
    );
  }
}

// SECTION 9: Final CTA
class _Section9FinalCta extends StatelessWidget {
  final String firstName;
  final String concernShort;
  final VoidCallback onCheckout;

  const _Section9FinalCta({required this.firstName, required this.concernShort, required this.onCheckout});

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      color: theme.button.withOpacity(0.05),
      child: Column(
        children: [
          Text('$firstName, YOUR HAIR IS WAITING', style: theme.headlineSmall.copyWith(fontWeight: FontWeight.w700, fontSize: 22), textAlign: TextAlign.center),
          const SizedBox(height: 16),
          Text('You now know what\'s really causing your $concernShort.', style: theme.bodyMedium.copyWith(fontSize: 15), textAlign: TextAlign.center),
          const SizedBox(height: 8),
          Text('You\'ve seen women with your exact pattern transform their hair.', style: theme.bodyMedium.copyWith(fontSize: 15), textAlign: TextAlign.center),
          const SizedBox(height: 16),
          Text('The only question is:', style: theme.bodyMedium.copyWith(fontSize: 15, fontStyle: FontStyle.italic), textAlign: TextAlign.center),
          const SizedBox(height: 8),
          Text('Are you ready to be next?', style: theme.titleMedium.copyWith(fontWeight: FontWeight.w700, fontSize: 18), textAlign: TextAlign.center),
          const SizedBox(height: 24),
          QuizPrimaryButton(text: 'YES — START MY 14-DAY TRANSFORMATION  \$37', onPressed: onCheckout, showArrow: false),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.lock, size: 14, color: theme.secondaryText),
              const SizedBox(width: 6),
              Text('Secure checkout', style: theme.bodySmall.copyWith(color: theme.secondaryText, fontSize: 12)),
              const SizedBox(width: 16),
              Icon(Icons.credit_card, size: 14, color: theme.secondaryText),
              const SizedBox(width: 6),
              Text('All major cards', style: theme.bodySmall.copyWith(color: theme.secondaryText, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.flash_on, size: 14, color: theme.success),
              const SizedBox(width: 6),
              Text('Instant access', style: theme.bodySmall.copyWith(color: theme.success, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 24),
          Divider(color: theme.progessUnselected),
          const SizedBox(height: 16),
          GestureDetector(
            onTap: () {
              // TODO: Open chat support
            },
            child: Text('Questions? Tap here to chat', style: theme.bodyMedium.copyWith(color: theme.button, decoration: TextDecoration.underline, fontSize: 14)),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}
