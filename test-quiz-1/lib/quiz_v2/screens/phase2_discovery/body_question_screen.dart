import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';

/// Screen 10: Body Question Screen
/// Purpose: Gather data for Root Cause #2 (Internal) — Diet AND Stress combined
/// Emotion: Connecting dots they never connected
class BodyQuestionScreen extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const BodyQuestionScreen({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  State<BodyQuestionScreen> createState() => _BodyQuestionScreenState();
}

class _BodyQuestionScreenState extends State<BodyQuestionScreen> {
  List<String> _selectedOptions = [];

  static const List<Map<String, dynamic>> _options = [
    {
      'id': 'body_stress',
      'title': 'High stress or anxiety',
      'isExclusive': false,
    },
    {
      'id': 'body_lifechange',
      'title': 'Major life change',
      'subtitle': '(move, job, relationship)',
      'isExclusive': false,
    },
    {
      'id': 'body_diet',
      'title': 'Dieting or restricted eating',
      'isExclusive': false,
    },
    {
      'id': 'body_hormones',
      'title': 'Pregnancy or hormonal changes',
      'isExclusive': false,
    },
    {
      'id': 'body_illness',
      'title': 'Illness or medication',
      'isExclusive': false,
    },
    {
      'id': 'body_none',
      'title': 'None of these',
      'isExclusive': true,
    },
  ];

  bool get _canContinue => _selectedOptions.isNotEmpty;

  void _onContinue() {
    if (!_canContinue) return;

    // Save to state
    FFAppState().update(() {
      FFAppState().quizProfileV2.bodyFactors = List.from(_selectedOptions);
    });

    widget.onNext();
  }

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return SafeArea(
      child: Column(
        children: [
          // Header with progress
          QuizHeaderV2(
            currentStep: 7,
            totalSteps: 12,
            showBackButton: true,
            onBackPressed: widget.onBack,
          ),

          const SizedBox(height: 16),

          // Title
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                Text(
                  'Now let\'s look inside...',
                  style: theme.headlineSmall.copyWith(
                    color: theme.primaryText,
                    fontWeight: FontWeight.w700,
                    fontSize: 22,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                Text(
                  'In the past year, have you experienced any of these?',
                  style: theme.bodyMedium.copyWith(
                    color: theme.primaryText,
                    fontSize: 15,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  '(Select all that apply)',
                  style: theme.bodySmall.copyWith(
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
              child: MultiSelectCheckboxList(
                options: _options,
                selectedIds: _selectedOptions,
                onSelectionChanged: (newSelection) {
                  setState(() {
                    _selectedOptions = newSelection;
                  });
                },
              ),
            ),
          ),

          // Continue button
          Padding(
            padding: const EdgeInsets.all(16),
            child: QuizPrimaryButton(
              text: 'CONTINUE',
              isEnabled: _canContinue,
              onPressed: _onContinue,
            ),
          ),
        ],
      ),
    );
  }
}
