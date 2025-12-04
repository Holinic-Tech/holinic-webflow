import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';

/// Screen 8: Products Question Screen
/// Purpose: Gather data for Root Cause #1 (Buildup)
/// Emotion: Curious about what this reveals
class ProductsQuestionScreen extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const ProductsQuestionScreen({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  State<ProductsQuestionScreen> createState() => _ProductsQuestionScreenState();
}

class _ProductsQuestionScreenState extends State<ProductsQuestionScreen> {
  String? _sulfateFree;
  String? _washFrequency;

  static const List<Map<String, String>> _frequencyOptions = [
    {'id': 'daily', 'label': 'Daily'},
    {'id': 'everyother', 'label': 'Every\nother day'},
    {'id': 'twice_week', 'label': '2x/week\nor less'},
  ];

  bool get _canContinue => _sulfateFree != null && _washFrequency != null;

  void _onContinue() {
    if (!_canContinue) return;

    // Save to state
    FFAppState().update(() {
      FFAppState().quizProfileV2.usesSulfateFree = _sulfateFree!;
      FFAppState().quizProfileV2.washFrequency = _washFrequency!;
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
            currentStep: 6,
            totalSteps: 12,
            showBackButton: true,
            onBackPressed: widget.onBack,
          ),

          const SizedBox(height: 16),

          // Title
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              'Quick question about your current products...',
              style: theme.headlineSmall.copyWith(
                color: theme.primaryText,
                fontWeight: FontWeight.w700,
                fontSize: 22,
              ),
              textAlign: TextAlign.center,
            ),
          ),

          const SizedBox(height: 32),

          // Sulfate-free question
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Do you use "sulfate-free" or "gentle" shampoo?',
                  style: theme.titleMedium.copyWith(
                    color: theme.primaryText,
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 12),
                QuizBinaryButtons(
                  leftText: 'YES',
                  rightText: 'NO',
                  selectedValue: _sulfateFree,
                  onSelected: (value) {
                    setState(() {
                      _sulfateFree = value;
                    });
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),

          // Wash frequency question
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'How often do you wash?',
                  style: theme.titleMedium.copyWith(
                    color: theme.primaryText,
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 12),
                ThreeOptionSelector(
                  options: _frequencyOptions,
                  selectedId: _washFrequency,
                  onSelect: (id) {
                    setState(() {
                      _washFrequency = id;
                    });
                  },
                  margin: EdgeInsets.zero,
                ),
              ],
            ),
          ),

          const Spacer(),

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
