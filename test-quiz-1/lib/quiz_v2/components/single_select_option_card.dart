import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';

/// Single select option card with emoji, title, and optional subtitle
/// Used for single-choice quiz questions
class SingleSelectOptionCard extends StatelessWidget {
  final String id;
  final String? emoji;
  final String title;
  final String? subtitle;
  final bool isSelected;
  final VoidCallback onTap;
  final EdgeInsets? margin;

  const SingleSelectOptionCard({
    super.key,
    required this.id,
    this.emoji,
    required this.title,
    this.subtitle,
    required this.isSelected,
    required this.onTap,
    this.margin,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: margin ?? const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        decoration: BoxDecoration(
          color: isSelected ? theme.button.withOpacity(0.08) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? theme.button : theme.progessUnselected,
            width: isSelected ? 2 : 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: theme.button.withOpacity(0.15),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: Row(
          children: [
            // Emoji
            if (emoji != null && emoji!.isNotEmpty) ...[
              Text(
                emoji!,
                style: const TextStyle(fontSize: 24),
              ),
              const SizedBox(width: 12),
            ],
            // Title and subtitle
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    title,
                    style: theme.titleMedium.copyWith(
                      color: theme.primaryText,
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
                    ),
                  ),
                  if (subtitle != null && subtitle!.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(
                      subtitle!,
                      style: theme.bodySmall.copyWith(
                        color: theme.secondaryText,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            // Selection indicator
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isSelected ? theme.button : Colors.transparent,
                border: Border.all(
                  color: isSelected ? theme.button : theme.progessUnselected,
                  width: 2,
                ),
              ),
              child: isSelected
                  ? const Icon(
                      Icons.check,
                      size: 16,
                      color: Colors.white,
                    )
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}

/// List of single select option cards
class SingleSelectOptionList extends StatelessWidget {
  final List<Map<String, String>> options;
  final String? selectedId;
  final Function(String) onSelect;
  final bool autoAdvance;
  final VoidCallback? onAutoAdvance;

  const SingleSelectOptionList({
    super.key,
    required this.options,
    this.selectedId,
    required this.onSelect,
    this.autoAdvance = false,
    this.onAutoAdvance,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: options.map((option) {
        final id = option['id'] ?? '';
        final isSelected = selectedId == id;

        return SingleSelectOptionCard(
          id: id,
          emoji: option['emoji'],
          title: option['title'] ?? '',
          subtitle: option['subtitle'],
          isSelected: isSelected,
          onTap: () {
            onSelect(id);
            if (autoAdvance && onAutoAdvance != null) {
              // Delay slightly for visual feedback
              Future.delayed(const Duration(milliseconds: 300), () {
                onAutoAdvance!();
              });
            }
          },
        );
      }).toList(),
    );
  }
}
