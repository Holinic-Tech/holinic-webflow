import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';

/// Screen 1: Entry Hook Screen
/// Purpose: Create curiosity and set expectations
/// Emotion: Curious, slightly hopeful
class EntryHookScreen extends StatelessWidget {
  final VoidCallback onStart;

  const EntryHookScreen({
    super.key,
    required this.onStart,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          children: [
            const Spacer(flex: 1),

            // Logo
            Image.asset(
              'assets/images/hairqare_logo.png',
              height: 40,
              errorBuilder: (context, error, stackTrace) {
                return Text(
                  'HAIRQARE',
                  style: theme.headlineMedium.copyWith(
                    color: theme.button,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 2,
                  ),
                );
              },
            ),

            const SizedBox(height: 24),

            // Divider
            Container(
              height: 1,
              color: theme.progessUnselected,
            ),

            const SizedBox(height: 24),

            // Free Hair Diagnosis badge
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('🔬', style: TextStyle(fontSize: 20)),
                const SizedBox(width: 8),
                Text(
                  'FREE HAIR DIAGNOSIS',
                  style: theme.titleMedium.copyWith(
                    color: theme.button,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1,
                    fontSize: 14,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Main headline
            Text(
              '"Why is my hair REALLY struggling?"',
              style: theme.headlineSmall.copyWith(
                color: theme.primaryText,
                fontWeight: FontWeight.w700,
                fontSize: 22,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 12),

            // Sub-headline
            Text(
              'Find out in 3 minutes — plus discover if there\'s a fix',
              style: theme.bodyMedium.copyWith(
                color: theme.secondaryText,
                fontSize: 15,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 24),

            // Divider
            Container(
              height: 1,
              color: theme.progessUnselected,
            ),

            const SizedBox(height: 24),

            // Before/After image
            const BeforeAfterPair(
              beforeUrl: 'https://assets.hairqare.co/testimonials/sarah_before.jpg',
              afterUrl: 'https://assets.hairqare.co/testimonials/sarah_after.jpg',
              name: 'Sarah',
              age: 34,
              timeframe: '3 months later',
              height: 180,
            ),

            const SizedBox(height: 24),

            // Divider
            Container(
              height: 1,
              color: theme.progessUnselected,
            ),

            const Spacer(flex: 1),

            // CTA Button
            QuizPrimaryButton(
              text: 'START MY DIAGNOSIS',
              onPressed: () {
                // Set quiz start time
                FFAppState().update(() {
                  FFAppState().quizProfileV2.quizStartTime = DateTime.now();
                });
                onStart();
              },
            ),

            const SizedBox(height: 16),

            // Social proof
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.check, size: 16, color: Colors.green),
                const SizedBox(width: 6),
                Text(
                  '200,000+ women diagnosed',
                  style: theme.bodySmall.copyWith(
                    color: theme.secondaryText,
                    fontSize: 13,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
