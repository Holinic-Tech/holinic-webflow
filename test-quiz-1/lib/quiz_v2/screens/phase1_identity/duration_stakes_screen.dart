import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';
import '/quiz_v2/helpers/personalization_helper.dart';

/// Screen 5: Duration + Stakes Screen
/// Purpose: Establish duration (pain calibration) and emotional stakes
/// Emotion: Validated — "they understand what I'm going through"
class DurationStakesScreen extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const DurationStakesScreen({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  State<DurationStakesScreen> createState() => _DurationStakesScreenState();
}

class _DurationStakesScreenState extends State<DurationStakesScreen> {
  String? _selectedDuration;

  static const List<Map<String, String>> _durationOptions = [
    {
      'id': 'duration_new',
      'title': 'Just started noticing',
      'subtitle': '(Less than 6 months)',
    },
    {
      'id': 'duration_year',
      'title': 'About a year',
      'subtitle': '(6-12 months)',
    },
    {
      'id': 'duration_years',
      'title': 'A few years',
      'subtitle': '(1-3 years)',
    },
    {
      'id': 'duration_long',
      'title': 'As long as I can remember',
      'subtitle': '(3+ years)',
    },
  ];

  void _onSelect(String durationId) {
    setState(() {
      _selectedDuration = durationId;
    });

    // Save to state
    FFAppState().update(() {
      FFAppState().quizProfileV2.struggleDuration = durationId;
    });

    // Auto-advance after delay
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) {
        widget.onNext();
      }
    });
  }

  String _getQuestionText() {
    final concern = FFAppState().quizProfileV2.primaryConcern;
    final concernShort = PersonalizationHelper.getConcernShort(concern);
    return 'How long has $concernShort been affecting you?';
  }

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return SafeArea(
      child: Column(
        children: [
          // Header with progress
          QuizHeaderV2(
            currentStep: 4,
            totalSteps: 12,
            showBackButton: true,
            onBackPressed: widget.onBack,
          ),

          const SizedBox(height: 16),

          // Question (dynamic based on concern)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              _getQuestionText(),
              style: theme.headlineSmall.copyWith(
                color: theme.primaryText,
                fontWeight: FontWeight.w700,
                fontSize: 22,
              ),
              textAlign: TextAlign.center,
            ),
          ),

          const SizedBox(height: 24),

          // Options
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: _durationOptions.map((option) {
                  return SingleSelectOptionCard(
                    id: option['id']!,
                    title: option['title']!,
                    subtitle: option['subtitle'],
                    isSelected: _selectedDuration == option['id'],
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
