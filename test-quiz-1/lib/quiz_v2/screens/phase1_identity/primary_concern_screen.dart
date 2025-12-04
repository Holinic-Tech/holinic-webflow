import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';

/// Screen 3: Primary Concern Screen
/// Purpose: Identify their biggest pain point
/// Emotion: "Yes, that's exactly my problem"
class PrimaryConcernScreen extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const PrimaryConcernScreen({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  State<PrimaryConcernScreen> createState() => _PrimaryConcernScreenState();
}

class _PrimaryConcernScreenState extends State<PrimaryConcernScreen> {
  String? _selectedConcern;

  static const List<Map<String, String>> _concernOptions = [
    {
      'id': 'concern_thinning',
      'emoji': '👁️',
      'title': 'Seeing more scalp',
      'subtitle': 'than I used to',
    },
    {
      'id': 'concern_shedding',
      'emoji': '💇',
      'title': 'Hair everywhere except',
      'subtitle': 'on my head',
    },
    {
      'id': 'concern_breakage',
      'emoji': '✂️',
      'title': 'Breakage & damage —',
      'subtitle': 'it won\'t grow past here',
    },
    {
      'id': 'concern_frizz',
      'emoji': '🌀',
      'title': 'Dry, frizzy, impossible',
      'subtitle': 'to manage',
    },
    {
      'id': 'concern_scalp',
      'emoji': '😣',
      'title': 'Itchy, flaky, irritated',
      'subtitle': 'scalp',
    },
  ];

  void _onSelect(String concernId) {
    setState(() {
      _selectedConcern = concernId;
    });

    // Save to state
    FFAppState().update(() {
      FFAppState().quizProfileV2.primaryConcern = concernId;
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
            currentStep: 2,
            totalSteps: 12,
            showBackButton: true,
            onBackPressed: widget.onBack,
          ),

          const SizedBox(height: 16),

          // Question
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              'What bothers you MOST about your hair right now?',
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
                children: _concernOptions.map((option) {
                  return SingleSelectOptionCard(
                    id: option['id']!,
                    emoji: option['emoji'],
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
