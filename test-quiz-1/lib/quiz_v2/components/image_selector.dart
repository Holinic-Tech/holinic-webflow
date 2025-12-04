import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';

/// Image-based selector for hair type selection
class ImageSelector extends StatelessWidget {
  final List<Map<String, String>> options;
  final String? selectedId;
  final Function(String) onSelect;
  final EdgeInsets? margin;
  final int columns;

  const ImageSelector({
    super.key,
    required this.options,
    this.selectedId,
    required this.onSelect,
    this.margin,
    this.columns = 4,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin ?? const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: options.map((option) {
          final id = option['id'] ?? '';
          final label = option['label'] ?? '';
          final imageUrl = option['imageUrl'] ?? '';
          final isSelected = selectedId == id;

          return Expanded(
            child: _ImageOption(
              id: id,
              label: label,
              imageUrl: imageUrl,
              isSelected: isSelected,
              onTap: () => onSelect(id),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _ImageOption extends StatelessWidget {
  final String id;
  final String label;
  final String imageUrl;
  final bool isSelected;
  final VoidCallback onTap;

  const _ImageOption({
    required this.id,
    required this.label,
    required this.imageUrl,
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
        margin: const EdgeInsets.symmetric(horizontal: 4),
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: isSelected ? theme.button.withOpacity(0.1) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? theme.button : theme.progessUnselected,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Image container
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                color: theme.backgroundDove,
              ),
              child: imageUrl.isNotEmpty
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.asset(
                        imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return _buildPlaceholder(id);
                        },
                      ),
                    )
                  : _buildPlaceholder(id),
            ),
            const SizedBox(height: 6),
            // Label
            Text(
              label,
              style: theme.bodySmall.copyWith(
                color: isSelected ? theme.button : theme.primaryText,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),
            // Selection indicator
            const SizedBox(height: 4),
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 16,
              height: 16,
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
                      size: 10,
                      color: Colors.white,
                    )
                  : null,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholder(String id) {
    // Placeholder icons based on hair type
    IconData iconData;
    switch (id) {
      case 'type_straight':
        iconData = Icons.horizontal_rule;
        break;
      case 'type_wavy':
        iconData = Icons.waves;
        break;
      case 'type_curly':
        iconData = Icons.loop;
        break;
      case 'type_coily':
        iconData = Icons.bubble_chart;
        break;
      default:
        iconData = Icons.face;
    }

    return Center(
      child: Icon(
        iconData,
        size: 30,
        color: Colors.grey[400],
      ),
    );
  }
}

/// Hair type options data
class HairTypeOptions {
  static List<Map<String, String>> get options => [
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
}
