import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/helpers/fit_score_calculator.dart';

/// Screen 22: Loading/Anticipation Screen
/// Purpose: Build anticipation while calculating results
/// Emotion: Peak anticipation
class LoadingAnticipation extends StatefulWidget {
  final VoidCallback onComplete;

  const LoadingAnticipation({
    super.key,
    required this.onComplete,
  });

  @override
  State<LoadingAnticipation> createState() => _LoadingAnticipationState();
}

class _LoadingAnticipationState extends State<LoadingAnticipation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  int _currentStep = 0;
  final List<String> _steps = [
    'Analyzing your hair pattern',
    'Matching with success stories',
    'Calculating your timeline',
    'Building your plan',
  ];

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 6),
    );

    _controller.addListener(() {
      final progress = _controller.value;
      final newStep = (progress * _steps.length).floor();
      if (newStep != _currentStep && newStep < _steps.length) {
        setState(() {
          _currentStep = newStep;
        });
      }
    });

    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        // Apply calculations before navigating
        FFAppState().update(() {
          FitScoreCalculator.applyCalculations(FFAppState().quizProfileV2);
        });

        widget.onComplete();
      }
    });

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);
    final firstName = FFAppState().quizProfileV2.userName.isNotEmpty
        ? FFAppState().quizProfileV2.userName.split(' ')[0]
        : '';

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Spacer(flex: 2),

            // Title
            Text(
              firstName.isNotEmpty
                  ? 'Creating your personalized transformation plan, $firstName...'
                  : 'Creating your personalized transformation plan...',
              style: theme.headlineSmall.copyWith(
                color: theme.primaryText,
                fontWeight: FontWeight.w700,
                fontSize: 22,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 48),

            // Progress bar
            AnimatedBuilder(
              animation: _controller,
              builder: (context, child) {
                return Column(
                  children: [
                    Container(
                      height: 8,
                      decoration: BoxDecoration(
                        color: theme.progessUnselected,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: LayoutBuilder(
                        builder: (context, constraints) {
                          return Stack(
                            children: [
                              Container(
                                width: constraints.maxWidth * _controller.value,
                                height: 8,
                                decoration: BoxDecoration(
                                  color: theme.button,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      '${(_controller.value * 100).toInt()}%',
                      style: theme.bodyMedium.copyWith(
                        color: theme.secondaryText,
                        fontSize: 14,
                      ),
                    ),
                  ],
                );
              },
            ),

            const SizedBox(height: 48),

            // Checkpoints
            ...List.generate(_steps.length, (index) {
              final isComplete = index < _currentStep;
              final isCurrent = index == _currentStep;

              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Row(
                  children: [
                    // Checkbox
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      width: 24,
                      height: 24,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isComplete ? theme.success : Colors.transparent,
                        border: Border.all(
                          color: isComplete
                              ? theme.success
                              : isCurrent
                                  ? theme.button
                                  : theme.progessUnselected,
                          width: 2,
                        ),
                      ),
                      child: isComplete
                          ? const Icon(Icons.check, size: 14, color: Colors.white)
                          : isCurrent
                              ? SizedBox(
                                  width: 12,
                                  height: 12,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation<Color>(
                                      theme.button,
                                    ),
                                  ),
                                )
                              : null,
                    ),
                    const SizedBox(width: 12),
                    // Label
                    Text(
                      _steps[index],
                      style: theme.bodyMedium.copyWith(
                        color: isComplete || isCurrent
                            ? theme.primaryText
                            : theme.secondaryText,
                        fontWeight: isCurrent ? FontWeight.w600 : FontWeight.w400,
                        fontSize: 15,
                      ),
                    ),
                  ],
                ),
              );
            }),

            const Spacer(flex: 3),
          ],
        ),
      ),
    );
  }
}
