import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';

/// Horizontal chip selector for compact single-choice options
/// Used for age range selection, etc.
class ChipSelector extends StatelessWidget {
  final List<Map<String, String>> options;
  final String? selectedId;
  final Function(String) onSelect;
  final EdgeInsets? margin;

  const ChipSelector({
    super.key,
    required this.options,
    this.selectedId,
    required this.onSelect,
    this.margin,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin ?? const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: options.map((option) {
          final id = option['id'] ?? '';
          final label = option['label'] ?? '';
          final isSelected = selectedId == id;
          final isFirst = options.first == option;
          final isLast = options.last == option;

          return Expanded(
            child: _ChipOption(
              id: id,
              label: label,
              isSelected: isSelected,
              isFirst: isFirst,
              isLast: isLast,
              onTap: () => onSelect(id),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _ChipOption extends StatelessWidget {
  final String id;
  final String label;
  final bool isSelected;
  final bool isFirst;
  final bool isLast;
  final VoidCallback onTap;

  const _ChipOption({
    required this.id,
    required this.label,
    required this.isSelected,
    required this.isFirst,
    required this.isLast,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        height: 48,
        decoration: BoxDecoration(
          color: isSelected ? theme.button : Colors.white,
          borderRadius: BorderRadius.horizontal(
            left: isFirst ? const Radius.circular(10) : Radius.zero,
            right: isLast ? const Radius.circular(10) : Radius.zero,
          ),
          border: Border.all(
            color: isSelected ? theme.button : theme.progessUnselected,
            width: 1,
          ),
        ),
        child: Center(
          child: Text(
            label,
            style: theme.titleSmall.copyWith(
              color: isSelected ? Colors.white : theme.primaryText,
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
          ),
        ),
      ),
    );
  }
}

/// Vertical chip selector for when horizontal doesn't fit
class VerticalChipSelector extends StatelessWidget {
  final List<Map<String, String>> options;
  final String? selectedId;
  final Function(String) onSelect;
  final EdgeInsets? margin;

  const VerticalChipSelector({
    super.key,
    required this.options,
    this.selectedId,
    required this.onSelect,
    this.margin,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      margin: margin ?? const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: options.map((option) {
          final id = option['id'] ?? '';
          final label = option['label'] ?? '';
          final isSelected = selectedId == id;

          return GestureDetector(
            onTap: () => onSelect(id),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              decoration: BoxDecoration(
                color: isSelected ? theme.button : Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: isSelected ? theme.button : theme.progessUnselected,
                  width: 1,
                ),
              ),
              child: Center(
                child: Text(
                  label,
                  style: theme.titleSmall.copyWith(
                    color: isSelected ? Colors.white : theme.primaryText,
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

/// Three-option horizontal selector (Daily | Every other day | 2x/week)
class ThreeOptionSelector extends StatelessWidget {
  final List<Map<String, String>> options;
  final String? selectedId;
  final Function(String) onSelect;
  final EdgeInsets? margin;

  const ThreeOptionSelector({
    super.key,
    required this.options,
    this.selectedId,
    required this.onSelect,
    this.margin,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      margin: margin ?? const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: options.asMap().entries.map((entry) {
          final index = entry.key;
          final option = entry.value;
          final id = option['id'] ?? '';
          final label = option['label'] ?? '';
          final isSelected = selectedId == id;

          return Expanded(
            child: GestureDetector(
              onTap: () => onSelect(id),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                height: 56,
                margin: EdgeInsets.only(
                  left: index == 0 ? 0 : 4,
                  right: index == options.length - 1 ? 0 : 4,
                ),
                decoration: BoxDecoration(
                  color: isSelected ? theme.button : Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: isSelected ? theme.button : theme.progessUnselected,
                    width: 1,
                  ),
                ),
                child: Center(
                  child: Text(
                    label,
                    textAlign: TextAlign.center,
                    style: theme.bodySmall.copyWith(
                      color: isSelected ? Colors.white : theme.primaryText,
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                    ),
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
