import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';

/// Screen 6: Tried Before Screen (Multi-select)
/// Purpose: Capture what they've tried (sets up the reveal)
/// Emotion: Slight frustration surfacing
class TriedBeforeScreen extends StatefulWidget {
  final Function(bool skipReveal) onNext;
  final VoidCallback onBack;

  const TriedBeforeScreen({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  State<TriedBeforeScreen> createState() => _TriedBeforeScreenState();
}

class _TriedBeforeScreenState extends State<TriedBeforeScreen> {
  List<String> _selectedOptions = [];

  static const List<Map<String, dynamic>> _options = [
    {
      'id': 'tried_products',
      'title': 'Special shampoos & conditioners',
      'isExclusive': false,
    },
    {
      'id': 'tried_supplements',
      'title': 'Supplements (biotin, collagen, vitamins)',
      'isExclusive': false,
    },
    {
      'id': 'tried_minoxidil',
      'title': 'Minoxidil / Rogaine',
      'isExclusive': false,
    },
    {
      'id': 'tried_diy',
      'title': 'Oils & DIY treatments',
      'subtitle': '(rosemary, castor, etc)',
      'isExclusive': false,
    },
    {
      'id': 'tried_professional',
      'title': 'Dermatologist or specialist',
      'isExclusive': false,
    },
    {
      'id': 'tried_nothing',
      'title': 'Nothing yet',
      'isExclusive': true,
    },
  ];

  bool get _canContinue => _selectedOptions.isNotEmpty;

  void _onContinue() {
    if (!_canContinue) return;

    // Save to state
    FFAppState().update(() {
      FFAppState().quizProfileV2.triedBefore = List.from(_selectedOptions);
    });

    // Check if we should skip the "Why It Failed" reveal
    final skipReveal = _selectedOptions.contains('tried_nothing');
    widget.onNext(skipReveal);
  }

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return SafeArea(
      child: Column(
        children: [
          // Header with progress
          QuizHeaderV2(
            currentStep: 5,
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
                  'What have you already tried?',
                  style: theme.headlineSmall.copyWith(
                    color: theme.primaryText,
                    fontWeight: FontWeight.w700,
                    fontSize: 22,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  '(Select all that apply)',
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
