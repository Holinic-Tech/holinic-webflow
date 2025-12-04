import 'package:flutter/material.dart';
import 'dart:math' as math;
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';
import '/quiz_v2/helpers/personalization_helper.dart';

/// Screen 16: Personalized Prediction (VISUAL)
/// Purpose: Show THEIR specific expected results
/// Emotion: Excitement — "This is what I can achieve"
class PersonalizedPrediction extends StatelessWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const PersonalizedPrediction({
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
    final stats = PersonalizationHelper.getPredictedStats(profile.primaryConcern);

    // Extract main percentage from first stat
    final mainPercentage = _extractPercentage(stats[0]);

    return RevealScreenWrapper(
      showBackButton: true,
      onBackPressed: onBack,
      ctaText: 'SEE SUCCESS STORIES',
      onCtaPressed: onNext,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 24),

            // Title
            Text(
              'YOUR PREDICTED RESULTS',
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
              'Based on women $ageRange with $concernShort:',
              style: theme.bodyMedium.copyWith(
                color: theme.secondaryText,
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 32),

            // Circular progress chart
            _CircularProgressChart(
              percentage: mainPercentage,
              label: _extractLabel(stats[0]),
            ),

            const SizedBox(height: 32),

            // Stats list
            ...stats.map((stat) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: _StatItem(text: stat),
              );
            }),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  int _extractPercentage(String stat) {
    final regex = RegExp(r'(\d+)%');
    final match = regex.firstMatch(stat);
    if (match != null) {
      return int.parse(match.group(1)!);
    }
    return 90;
  }

  String _extractLabel(String stat) {
    // Extract the action part after the percentage
    final parts = stat.split('%');
    if (parts.length > 1) {
      return parts[1].trim();
    }
    return 'see improvement';
  }
}

class _CircularProgressChart extends StatelessWidget {
  final int percentage;
  final String label;

  const _CircularProgressChart({
    required this.percentage,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: 180,
      height: 180,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Background circle
          CustomPaint(
            size: const Size(180, 180),
            painter: _CirclePainter(
              progress: percentage / 100,
              backgroundColor: theme.progessUnselected,
              progressColor: theme.button,
              strokeWidth: 12,
            ),
          ),
          // Center content
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '$percentage%',
                style: theme.displaySmall.copyWith(
                  color: theme.primaryText,
                  fontWeight: FontWeight.w700,
                  fontSize: 40,
                ),
              ),
              Text(
                label,
                style: theme.bodySmall.copyWith(
                  color: theme.secondaryText,
                  fontSize: 12,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _CirclePainter extends CustomPainter {
  final double progress;
  final Color backgroundColor;
  final Color progressColor;
  final double strokeWidth;

  _CirclePainter({
    required this.progress,
    required this.backgroundColor,
    required this.progressColor,
    required this.strokeWidth,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - strokeWidth) / 2;

    // Background circle
    final bgPaint = Paint()
      ..color = backgroundColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawCircle(center, radius, bgPaint);

    // Progress arc
    final progressPaint = Paint()
      ..color = progressColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    final sweepAngle = 2 * math.pi * progress;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -math.pi / 2, // Start from top
      sweepAngle,
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

class _StatItem extends StatelessWidget {
  final String text;

  const _StatItem({required this.text});

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: theme.success.withOpacity(0.1),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        children: [
          Icon(
            Icons.check_circle,
            color: theme.success,
            size: 20,
          ),
          const SizedBox(width: 12),
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
    );
  }
}
