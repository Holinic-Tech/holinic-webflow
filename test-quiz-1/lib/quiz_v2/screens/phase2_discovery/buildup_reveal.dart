import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';
import '/quiz_v2/helpers/personalization_helper.dart';

/// Screen 9: Buildup Reveal (VISUAL REVEAL)
/// Purpose: Root Cause #1 Revelation — SHOW don't tell
/// Emotion: "Oh my god, I had no idea..."
class BuildupReveal extends StatelessWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const BuildupReveal({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);
    final profile = FFAppState().quizProfileV2;
    final buildupMessage = PersonalizationHelper.getBuilupMessage(
      profile.usesSulfateFree,
      profile.washFrequency,
    );

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

            // Title with emoji
            RevealSectionTitle(
              emoji: '🔬',
              text: 'What we found:',
            ),

            const SizedBox(height: 24),

            // Visual: Follicle cross-section
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
                  // Follicle diagram placeholder
                  Container(
                    width: 200,
                    height: 160,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          theme.secondaryAlmond.withOpacity(0.5),
                          theme.secondaryAlmond,
                        ],
                      ),
                    ),
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // Follicle shape
                        CustomPaint(
                          size: const Size(120, 140),
                          painter: _FolliclePainter(
                            color: theme.primaryText.withOpacity(0.1),
                          ),
                        ),
                        // Buildup indicators
                        Positioned(
                          top: 30,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: theme.error.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              'BUILDUP',
                              style: theme.labelSmall.copyWith(
                                color: theme.error,
                                fontWeight: FontWeight.w700,
                                fontSize: 10,
                              ),
                            ),
                          ),
                        ),
                        // Arrow showing blockage
                        Positioned(
                          top: 60,
                          child: Icon(
                            Icons.block,
                            color: theme.error,
                            size: 24,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'YOUR FOLLICLES',
                    style: theme.labelMedium.copyWith(
                      color: theme.secondaryText,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1,
                      fontSize: 11,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Product buildup blocks nutrients from reaching your hair root',
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

            // Dynamic warning based on answers
            RevealWarningCard(
              text: buildupMessage,
              margin: EdgeInsets.zero,
            ),

            const SizedBox(height: 24),

            // Root cause label
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 16),
              child: Column(
                children: [
                  Text(
                    'This is ROOT CAUSE #1',
                    style: theme.titleMedium.copyWith(
                      color: theme.button,
                      fontWeight: FontWeight.w700,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'But there\'s more...',
                    style: theme.bodyMedium.copyWith(
                      color: theme.secondaryText,
                      fontStyle: FontStyle.italic,
                    ),
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

// Simple painter for follicle shape
class _FolliclePainter extends CustomPainter {
  final Color color;

  _FolliclePainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final path = Path()
      ..moveTo(size.width * 0.3, 0)
      ..lineTo(size.width * 0.7, 0)
      ..quadraticBezierTo(size.width, size.height * 0.1, size.width * 0.8, size.height * 0.3)
      ..quadraticBezierTo(size.width * 0.6, size.height * 0.5, size.width * 0.55, size.height)
      ..lineTo(size.width * 0.45, size.height)
      ..quadraticBezierTo(size.width * 0.4, size.height * 0.5, size.width * 0.2, size.height * 0.3)
      ..quadraticBezierTo(0, size.height * 0.1, size.width * 0.3, 0)
      ..close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
