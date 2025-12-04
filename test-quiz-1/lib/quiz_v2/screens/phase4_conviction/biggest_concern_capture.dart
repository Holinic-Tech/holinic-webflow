import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';

/// Screen 18: Biggest Concern Capture
/// Purpose: Identify their remaining objection so we can address it
/// Emotion: Honesty — "They want to understand my hesitation"
class BiggestConcernCapture extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const BiggestConcernCapture({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  State<BiggestConcernCapture> createState() => _BiggestConcernCaptureState();
}

class _BiggestConcernCaptureState extends State<BiggestConcernCapture> {
  String? _selectedConcern;

  static const List<Map<String, String>> _concernOptions = [
    {
      'id': 'concern_works',
      'title': '"What if it doesn\'t work',
      'subtitle': 'for MY specific case?"',
    },
    {
      'id': 'concern_time',
      'title': '"I don\'t have much time',
      'subtitle': 'in my daily routine"',
    },
    {
      'id': 'concern_diy',
      'title': '"Making my own products',
      'subtitle': 'sounds complicated"',
    },
    {
      'id': 'concern_disappointed',
      'title': '"I\'ve been disappointed',
      'subtitle': 'too many times before"',
    },
    {
      'id': 'concern_none',
      'title': '"No concerns — I\'m ready',
      'subtitle': 'to try something new!"',
    },
  ];

  void _onSelect(String concernId) {
    setState(() {
      _selectedConcern = concernId;
    });

    // Save to state
    FFAppState().update(() {
      FFAppState().quizProfileV2.biggestConcern = concernId;
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
            currentStep: 10,
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
                  'One last question...',
                  style: theme.bodyMedium.copyWith(
                    color: theme.secondaryText,
                    fontSize: 14,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  'What\'s your biggest concern about trying something new?',
                  style: theme.headlineSmall.copyWith(
                    color: theme.primaryText,
                    fontWeight: FontWeight.w700,
                    fontSize: 22,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Options
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: _concernOptions.map((option) {
                  return SingleSelectOptionCard(
                    id: option['id']!,
                    title: option['title']!,
                    subtitle: option['subtitle'],
                    isSelected: _selectedConcern == option['id'],
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
