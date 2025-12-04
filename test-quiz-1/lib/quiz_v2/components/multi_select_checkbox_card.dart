import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';

/// Multi-select checkbox card for quiz questions
/// Supports exclusive options (like "None of the above")
class MultiSelectCheckboxCard extends StatelessWidget {
  final String id;
  final String title;
  final String? subtitle;
  final bool isSelected;
  final bool isExclusive;
  final VoidCallback onTap;
  final EdgeInsets? margin;

  const MultiSelectCheckboxCard({
    super.key,
    required this.id,
    required this.title,
    this.subtitle,
    required this.isSelected,
    this.isExclusive = false,
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
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: isSelected ? theme.button.withOpacity(0.08) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? theme.button : theme.progessUnselected,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            // Checkbox
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(6),
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
            const SizedBox(width: 12),
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
                      fontWeight: FontWeight.w500,
                      fontSize: 15,
                    ),
                  ),
                  if (subtitle != null && subtitle!.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(
                      subtitle!,
                      style: theme.bodySmall.copyWith(
                        color: theme.secondaryText,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// List of multi-select checkbox cards with exclusive option handling
class MultiSelectCheckboxList extends StatelessWidget {
  final List<Map<String, dynamic>> options;
  final List<String> selectedIds;
  final Function(List<String>) onSelectionChanged;

  const MultiSelectCheckboxList({
    super.key,
    required this.options,
    required this.selectedIds,
    required this.onSelectionChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: options.map((option) {
        final id = option['id'] as String? ?? '';
        final isExclusive = option['isExclusive'] as bool? ?? false;
        final isSelected = selectedIds.contains(id);

        return MultiSelectCheckboxCard(
          id: id,
          title: option['title'] as String? ?? '',
          subtitle: option['subtitle'] as String?,
          isSelected: isSelected,
          isExclusive: isExclusive,
          onTap: () => _handleTap(id, isExclusive),
        );
      }).toList(),
    );
  }

  void _handleTap(String id, bool isExclusive) {
    List<String> newSelection = List.from(selectedIds);

    if (newSelection.contains(id)) {
      // Deselect
      newSelection.remove(id);
    } else {
      // Select
      if (isExclusive) {
        // Exclusive option: clear all others
        newSelection = [id];
      } else {
        // Non-exclusive: remove any exclusive options first
        final exclusiveIds = options
            .where((o) => o['isExclusive'] == true)
            .map((o) => o['id'] as String)
            .toList();
        newSelection.removeWhere((selectedId) => exclusiveIds.contains(selectedId));
        newSelection.add(id);
      }
    }

    onSelectionChanged(newSelection);
  }
}
