import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';

/// Screen 2: Hair Goal Screen
/// Purpose: Understand their SPECIFIC goal (not generic)
/// Emotion: Engaged — "they're asking the right questions"
class HairGoalScreen extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const HairGoalScreen({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  State<HairGoalScreen> createState() => _HairGoalScreenState();
}

class _HairGoalScreenState extends State<HairGoalScreen> {
  String? _selectedGoal;

  static const List<Map<String, String>> _goalOptions = [
    {
      'id': 'goal_stop_shedding',
      'emoji': '🛑',
      'title': 'Stop the shedding',
      'subtitle': 'My hair is falling out',
    },
    {
      'id': 'goal_regrow',
      'emoji': '🌱',
      'title': 'Regrow what I\'ve lost',
      'subtitle': 'Fill in thin areas',
    },
    {
      'id': 'goal_strengthen',
      'emoji': '💪',
      'title': 'Strengthen & repair',
      'subtitle': 'Stop breakage & damage',
    },
    {
      'id': 'goal_transform',
      'emoji': '✨',
      'title': 'Transform my hair',
      'subtitle': 'Healthier, more vibrant',
    },
    {
      'id': 'goal_length',
      'emoji': '📏',
      'title': 'Finally grow it long',
      'subtitle': 'Past my "stuck point"',
    },
    {
      'id': 'goal_all',
      'emoji': '🎯',
      'title': 'All of the above',
      'subtitle': 'Complete transformation',
    },
  ];

  void _onSelect(String goalId) {
    setState(() {
      _selectedGoal = goalId;
    });

    // Save to state
    FFAppState().update(() {
      FFAppState().quizProfileV2.hairGoal = goalId;
    });

    // Auto-advance after delay
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) {
        widget.onNext();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return SafeArea(
      child: Column(
        children: [
          // Header with progress
          QuizHeaderV2(
            currentStep: 1,
            totalSteps: 12,
            showBackButton: true,
            onBackPressed: widget.onBack,
          ),

          const SizedBox(height: 16),

          // Question
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                Text(
                  'What\'s your #1 hair goal?',
                  style: theme.headlineSmall.copyWith(
                    color: theme.primaryText,
                    fontWeight: FontWeight.w700,
                    fontSize: 22,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  '(Pick the ONE that matters most right now)',
                  style: theme.bodyMedium.copyWith(
                    color: theme.secondaryText,
                    fontSize: 14,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Options
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: _goalOptions.map((option) {
                  return SingleSelectOptionCard(
                    id: option['id']!,
                    emoji: option['emoji'],
                    title: option['title']!,
                    subtitle: option['subtitle'],
                    isSelected: _selectedGoal == option['id'],
                    onTap: () => _onSelect(option['id']!),
                  );
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
