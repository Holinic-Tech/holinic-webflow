import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';
import '/quiz_v2/helpers/personalization_helper.dart';
import '/quiz_v2/helpers/fit_score_calculator.dart';

/// Screen 12: Full Pattern Reveal (THE BIG MOMENT)
/// Purpose: The complete diagnosis — their personalized hair pattern
/// Emotion: "THAT'S why nothing worked!"
class FullPatternReveal extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const FullPatternReveal({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  State<FullPatternReveal> createState() => _FullPatternRevealState();
}

class _FullPatternRevealState extends State<FullPatternReveal> {
  @override
  void initState() {
    super.initState();
    // Calculate root causes and update profile
    FFAppState().update(() {
      FitScoreCalculator.applyCalculations(FFAppState().quizProfileV2);
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);
    final profile = FFAppState().quizProfileV2;
    final concernShort = PersonalizationHelper.getConcernShort(
      profile.primaryConcern,
    );
    final rootCauseCount = profile.rootCauseCount;

    return RevealScreenWrapper(
      showBackButton: true,
      onBackPressed: widget.onBack,
      ctaText: 'SEE WHAT\'S POSSIBLE',
      onCtaPressed: widget.onNext,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 24),

            // Title
            Text(
              'YOUR HAIR PATTERN',
              style: theme.headlineSmall.copyWith(
                color: theme.primaryText,
                fontWeight: FontWeight.w700,
                fontSize: 22,
                letterSpacing: 1,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 8),

            Text(
              'Based on your answers, here\'s what\'s happening:',
              style: theme.bodyMedium.copyWith(
                color: theme.secondaryText,
                fontSize: 15,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 32),

            // Hub diagram
            _PatternDiagram(profile: profile),

            const SizedBox(height: 32),

            // Personalized insight
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: theme.secondaryViolet.withOpacity(0.3),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  Text(
                    'Your $concernShort isn\'t random.',
                    style: theme.titleMedium.copyWith(
                      color: theme.primaryText,
                      fontWeight: FontWeight.w700,
                      fontSize: 17,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'It\'s the predictable result of these $rootCauseCount factors working together.',
                    style: theme.bodyMedium.copyWith(
                      color: theme.primaryText,
                      fontSize: 15,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Hook text
            Text(
              'And when you address them all at once?',
              style: theme.titleMedium.copyWith(
                color: theme.button,
                fontWeight: FontWeight.w600,
                fontStyle: FontStyle.italic,
                fontSize: 16,
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

class _PatternDiagram extends StatelessWidget {
  final dynamic profile;

  const _PatternDiagram({required this.profile});

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);
    final rootCauses = profile.rootCauses as List<String>;
    final triedBefore = profile.triedBefore as List<String>;

    // Determine which nodes are active
    final hasBuildup = rootCauses.contains('cause_buildup');
    final hasInternal = rootCauses.contains('cause_internal');
    final hasMismatch = rootCauses.contains('cause_mismatch');
    final hasTriedThings = triedBefore.isNotEmpty && !triedBefore.contains('tried_nothing');

    return Container(
      width: double.infinity,
      height: 280,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Connection lines
          CustomPaint(
            size: const Size(260, 260),
            painter: _ConnectionsPainter(
              hasBuildup: hasBuildup,
              hasInternal: hasInternal,
              hasMismatch: hasMismatch,
              hasTriedThings: hasTriedThings,
              color: theme.button.withOpacity(0.3),
            ),
          ),
          // Center node: YOUR HAIR
          _CenterNode(),
          // Top left: BUILDUP
          Positioned(
            top: 20,
            left: 30,
            child: _CauseNode(
              label: 'BUILDUP',
              isActive: hasBuildup,
            ),
          ),
          // Top right: INTERNAL
          Positioned(
            top: 20,
            right: 30,
            child: _CauseNode(
              label: 'INTERNAL',
              isActive: hasInternal,
            ),
          ),
          // Bottom left: WRONG FIT
          Positioned(
            bottom: 20,
            left: 30,
            child: _CauseNode(
              label: 'WRONG FIT',
              isActive: hasMismatch,
            ),
          ),
          // Bottom right: WHAT TRIED
          Positioned(
            bottom: 20,
            right: 30,
            child: _CauseNode(
              label: 'WHAT TRIED',
              isActive: hasTriedThings,
            ),
          ),
        ],
      ),
    );
  }
}

class _CenterNode extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: 100,
      height: 100,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: theme.button,
        boxShadow: [
          BoxShadow(
            color: theme.button.withOpacity(0.3),
            blurRadius: 20,
            spreadRadius: 5,
          ),
        ],
      ),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'YOUR',
              style: TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
            Text(
              'HAIR',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CauseNode extends StatelessWidget {
  final String label;
  final bool isActive;

  const _CauseNode({
    required this.label,
    required this.isActive,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: 80,
      height: 80,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: isActive ? theme.secondaryAlmond : theme.backgroundDove,
        border: Border.all(
          color: isActive ? theme.accentTangerine : theme.progessUnselected,
          width: 2,
        ),
      ),
      child: Center(
        child: Text(
          label,
          style: TextStyle(
            color: isActive ? theme.primaryText : theme.secondaryText,
            fontSize: 10,
            fontWeight: FontWeight.w600,
          ),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }
}

class _ConnectionsPainter extends CustomPainter {
  final bool hasBuildup;
  final bool hasInternal;
  final bool hasMismatch;
  final bool hasTriedThings;
  final Color color;

  _ConnectionsPainter({
    required this.hasBuildup,
    required this.hasInternal,
    required this.hasMismatch,
    required this.hasTriedThings,
    required this.color,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final center = Offset(size.width / 2, size.height / 2);

    // Draw lines from center to each active node
    if (hasBuildup) {
      canvas.drawLine(center, Offset(70, 60), paint);
    }
    if (hasInternal) {
      canvas.drawLine(center, Offset(size.width - 70, 60), paint);
    }
    if (hasMismatch) {
      canvas.drawLine(center, Offset(70, size.height - 60), paint);
    }
    if (hasTriedThings) {
      canvas.drawLine(center, Offset(size.width - 70, size.height - 60), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
