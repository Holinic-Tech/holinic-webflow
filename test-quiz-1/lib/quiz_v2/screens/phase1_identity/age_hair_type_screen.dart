import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';

/// Screen 4: Age + Hair Type Screen
/// Purpose: Get demographics for testimonial matching
/// Emotion: Efficient, professional
class AgeHairTypeScreen extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const AgeHairTypeScreen({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  State<AgeHairTypeScreen> createState() => _AgeHairTypeScreenState();
}

class _AgeHairTypeScreenState extends State<AgeHairTypeScreen> {
  String? _selectedAge;
  String? _selectedHairType;

  static const List<Map<String, String>> _ageOptions = [
    {'id': 'age_18to29', 'label': '18-29'},
    {'id': 'age_30to39', 'label': '30-39'},
    {'id': 'age_40to49', 'label': '40-49'},
    {'id': 'age_50plus', 'label': '50+'},
  ];

  static const List<Map<String, String>> _hairTypeOptions = [
    {
      'id': 'type_straight',
      'label': 'Straight',
      'imageUrl': 'assets/images/hair_types/straight.png',
    },
    {
      'id': 'type_wavy',
      'label': 'Wavy',
      'imageUrl': 'assets/images/hair_types/wavy.png',
    },
    {
      'id': 'type_curly',
      'label': 'Curly',
      'imageUrl': 'assets/images/hair_types/curly.png',
    },
    {
      'id': 'type_coily',
      'label': 'Coily',
      'imageUrl': 'assets/images/hair_types/coily.png',
    },
  ];

  bool get _canContinue => _selectedAge != null && _selectedHairType != null;

  void _onContinue() {
    if (!_canContinue) return;

    // Save to state
    FFAppState().update(() {
      FFAppState().quizProfileV2.ageRange = _selectedAge!;
      FFAppState().quizProfileV2.hairType = _selectedHairType!;
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
            currentStep: 3,
            totalSteps: 12,
            showBackButton: true,
            onBackPressed: widget.onBack,
          ),

          const SizedBox(height: 16),

          // Title
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              'A bit about you...',
              style: theme.headlineSmall.copyWith(
                color: theme.primaryText,
                fontWeight: FontWeight.w700,
                fontSize: 22,
              ),
              textAlign: TextAlign.center,
            ),
          ),

          const SizedBox(height: 32),

          // Age section
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'YOUR AGE',
                  style: theme.labelMedium.copyWith(
                    color: theme.secondaryText,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 12),
                ChipSelector(
                  options: _ageOptions,
                  selectedId: _selectedAge,
                  onSelect: (id) {
                    setState(() {
                      _selectedAge = id;
                    });
                  },
                  margin: EdgeInsets.zero,
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),

          // Hair type section
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'YOUR HAIR TYPE',
                  style: theme.labelMedium.copyWith(
                    color: theme.secondaryText,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 12),
                ImageSelector(
                  options: _hairTypeOptions,
                  selectedId: _selectedHairType,
                  onSelect: (id) {
                    setState(() {
                      _selectedHairType = id;
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
