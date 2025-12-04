import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';

/// Primary CTA button for Quiz V2 screens
class QuizPrimaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isEnabled;
  final bool showArrow;
  final bool isLoading;
  final double? width;

  const QuizPrimaryButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isEnabled = true,
    this.showArrow = true,
    this.isLoading = false,
    this.width,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: width ?? double.infinity,
      height: 56,
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: ElevatedButton(
        onPressed: isEnabled && !isLoading ? onPressed : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: isEnabled ? theme.button : theme.progessUnselected,
          foregroundColor: Colors.white,
          disabledBackgroundColor: theme.progessUnselected,
          disabledForegroundColor: theme.secondaryText,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24),
        ),
        child: isLoading
            ? const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Flexible(
                    child: Text(
                      text,
                      style: theme.titleMedium.copyWith(
                        color: isEnabled ? Colors.white : theme.secondaryText,
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                      ),
                      textAlign: TextAlign.center,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (showArrow) ...[
                    const SizedBox(width: 8),
                    Icon(
                      Icons.arrow_forward,
                      size: 20,
                      color: isEnabled ? Colors.white : theme.secondaryText,
                    ),
                  ],
                ],
              ),
      ),
    );
  }
}

/// Secondary button variant (outlined)
class QuizSecondaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isEnabled;
  final double? width;

  const QuizSecondaryButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isEnabled = true,
    this.width,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      width: width ?? double.infinity,
      height: 56,
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: OutlinedButton(
        onPressed: isEnabled ? onPressed : null,
        style: OutlinedButton.styleFrom(
          foregroundColor: theme.primaryText,
          side: BorderSide(
            color: isEnabled ? theme.primaryText : theme.progessUnselected,
            width: 1.5,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24),
        ),
        child: Text(
          text,
          style: theme.titleMedium.copyWith(
            color: isEnabled ? theme.primaryText : theme.secondaryText,
            fontWeight: FontWeight.w600,
            fontSize: 16,
          ),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }
}

/// Two-button row for binary choices (Yes/No, etc.)
class QuizBinaryButtons extends StatelessWidget {
  final String leftText;
  final String rightText;
  final String? selectedValue;
  final Function(String) onSelected;

  const QuizBinaryButtons({
    super.key,
    required this.leftText,
    required this.rightText,
    this.selectedValue,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Expanded(
            child: _BinaryButton(
              text: leftText,
              isSelected: selectedValue == leftText.toLowerCase(),
              onTap: () => onSelected(leftText.toLowerCase()),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _BinaryButton(
              text: rightText,
              isSelected: selectedValue == rightText.toLowerCase(),
              onTap: () => onSelected(rightText.toLowerCase()),
            ),
          ),
        ],
      ),
    );
  }
}

class _BinaryButton extends StatelessWidget {
  final String text;
  final bool isSelected;
  final VoidCallback onTap;

  const _BinaryButton({
    required this.text,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        height: 56,
        decoration: BoxDecoration(
          color: isSelected ? theme.button : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? theme.button : theme.progessUnselected,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Center(
          child: Text(
            text,
            style: theme.titleMedium.copyWith(
              color: isSelected ? Colors.white : theme.primaryText,
              fontWeight: FontWeight.w600,
              fontSize: 16,
            ),
          ),
        ),
      ),
    );
  }
}
