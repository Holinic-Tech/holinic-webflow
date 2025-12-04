import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';

/// Screen 15: Method Overview (VISUAL)
/// Purpose: Show HOW the transformation happens (3 phases)
/// Emotion: Clarity — "I can see how this works"
class MethodOverview extends StatelessWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const MethodOverview({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return RevealScreenWrapper(
      showBackButton: true,
      onBackPressed: onBack,
      ctaText: 'SEE MY PREDICTION',
      onCtaPressed: onNext,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 24),

            // Title
            Text(
              'THE 3-PHASE METHOD',
              style: theme.headlineSmall.copyWith(
                color: theme.primaryText,
                fontWeight: FontWeight.w700,
                fontSize: 22,
                letterSpacing: 1,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 32),

            // 3 Phase visual
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: theme.backgroundDove,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  // Phase circles with arrows
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _PhaseCircle(number: 1, label: 'CLEAR'),
                      _ArrowConnector(),
                      _PhaseCircle(number: 2, label: 'RESET'),
                      _ArrowConnector(),
                      _PhaseCircle(number: 3, label: 'GROW'),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Days labels
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _DaysLabel(label: 'Days 1-6'),
                      _DaysLabel(label: 'Days 7-10'),
                      _DaysLabel(label: 'Days 11-14'),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Phase descriptions
            _PhaseDescription(
              number: 1,
              title: 'PHASE 1: Clear the buildup',
              description: 'Remove years of product residue so your follicles can finally breathe',
            ),
            const SizedBox(height: 16),
            _PhaseDescription(
              number: 2,
              title: 'PHASE 2: Reset your body\'s balance',
              description: 'Redirect nutrients back to your hair through simple daily practices',
            ),
            const SizedBox(height: 16),
            _PhaseDescription(
              number: 3,
              title: 'PHASE 3: Grow with your new routine',
              description: 'Build a personalized routine that works for YOUR unique hair profile',
            ),

            const SizedBox(height: 32),

            // Time commitment
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: BoxDecoration(
                color: theme.button.withOpacity(0.1),
                borderRadius: BorderRadius.circular(30),
              ),
              child: Text(
                'All in just 10-15 min/day',
                style: theme.titleMedium.copyWith(
                  color: theme.button,
                  fontWeight: FontWeight.w600,
                  fontSize: 15,
                ),
              ),
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

class _PhaseCircle extends StatelessWidget {
  final int number;
  final String label;

  const _PhaseCircle({
    required this.number,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: 70,
      height: 70,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: theme.button,
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            '$number',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w700,
            ),
          ),
          Text(
            label,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 10,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _ArrowConnector extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: 30,
      child: Icon(
        Icons.arrow_forward,
        color: theme.button,
        size: 20,
      ),
    );
  }
}

class _DaysLabel extends StatelessWidget {
  final String label;

  const _DaysLabel({required this.label});

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Text(
      label,
      style: theme.bodySmall.copyWith(
        color: theme.secondaryText,
        fontSize: 12,
      ),
    );
  }
}

class _PhaseDescription extends StatelessWidget {
  final int number;
  final String title;
  final String description;

  const _PhaseDescription({
    required this.number,
    required this.title,
    required this.description,
  });

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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: theme.titleMedium.copyWith(
              color: theme.primaryText,
              fontWeight: FontWeight.w700,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            description,
            style: theme.bodyMedium.copyWith(
              color: theme.secondaryText,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}
