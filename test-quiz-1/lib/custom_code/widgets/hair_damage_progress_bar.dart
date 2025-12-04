// Automatic FlutterFlow imports
import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'index.dart'; // Imports other custom widgets
import '/custom_code/actions/index.dart'; // Imports custom actions
import '/flutter_flow/custom_functions.dart'; // Imports custom functions
import 'package:flutter/material.dart';
// Begin custom widget code
// DO NOT REMOVE OR MODIFY THE CODE ABOVE!

class HairDamageProgressBar extends StatefulWidget {
  final double value; // Value between 0.0 and 1.0
  final String scoreText; // The score to display (e.g. "High!")
  final bool animate; // Whether to animate when first shown
  final double? width;
  final double? height;

  const HairDamageProgressBar({
    Key? key,
    required this.value,
    required this.scoreText,
    this.animate = true,
    this.width,
    this.height,
  }) : super(key: key);

  @override
  State<HairDamageProgressBar> createState() => _HairDamageProgressBarState();
}

class _HairDamageProgressBarState extends State<HairDamageProgressBar>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 1500),
    );

    _animation = Tween<double>(begin: 0.0, end: widget.value).animate(
        CurvedAnimation(
            parent: _animationController, curve: Curves.easeOutCubic));

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (widget.animate) {
        _animationController.forward(from: 0.0);
      } else {
        _animationController.value = 1.0;
      }
    });
  }

  @override
  void didUpdateWidget(HairDamageProgressBar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.value != widget.value) {
      _animation = Tween<double>(begin: _animation.value, end: widget.value)
          .animate(CurvedAnimation(
              parent: _animationController, curve: Curves.easeOutCubic));
      _animationController.forward(from: 0.0);
    }
    if (oldWidget.animate != widget.animate) {
      if (widget.animate) {
        _animationController.forward(from: 0.0);
      } else {
        _animationController.value = 1.0;
      }
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Color _getIndicatorColor(double value) {
    if (value < 0.33) {
      return Color.lerp(Colors.red, Colors.orange, value * 3) ?? Colors.red;
    } else if (value < 0.66) {
      return Color.lerp(Colors.orange, Colors.yellow, (value - 0.33) * 3) ??
          Colors.orange;
    } else {
      return Color.lerp(Colors.yellow, Colors.green, (value - 0.66) * 3) ??
          Colors.yellow;
    }
  }

  Color _getLabelBackgroundColor(double value) {
    if (value < 0.33) {
      return Color.lerp(Color(0xFFFEE0D5), Color(0xFFFFFACD), value * 3) ??
          Color(0xFFFEE0D5); // Red-ish to Yellow-ish
    } else if (value < 0.66) {
      return Color.lerp(
              Color(0xFFFFFACD), Color(0xFFE0FFF8), (value - 0.33) * 3) ??
          Color(0xFFFFFACD); // Yellow-ish to Green-ish
    } else {
      return Color.lerp(
              Color(0xFFE0FFF8), Color(0xFFB2FFB2), (value - 0.66) * 3) ??
          Color(0xFFE0FFF8); // Green-ish to Brighter Green
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          LayoutBuilder(
            builder: (context, constraints) {
              final progressBarWidth = constraints.maxWidth;
              final dotDiameter = 16.0;
              final dotRadius = dotDiameter / 2;
              const labelVerticalOffset = 24.0; // Space above the dot

              return Padding(
                padding: const EdgeInsets.only(bottom: 16.0),
                child: Stack(
                  clipBehavior: Clip.none,
                  alignment:
                      Alignment.centerLeft, // Align children to the start
                  children: [
                    Container(
                      height: 4, // Thinner progress bar
                      width: progressBarWidth,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(2),
                        gradient: LinearGradient(
                          colors: [
                            Colors.red.shade400,
                            Colors.orange.shade400,
                            Colors.yellow.shade400,
                            Colors.green.shade400,
                          ],
                        ),
                      ),
                    ),
                    AnimatedBuilder(
                      animation: _animationController,
                      builder: (context, child) {
                        final dotPosition = _animation.value * progressBarWidth;
                        final labelWidth = widget.scoreText.length * 8.0 +
                            28; // Estimate label width
                        double labelLeft = dotPosition - labelWidth / 2;

                        // Keep label within bounds
                        if (labelLeft < 0) {
                          labelLeft = 0;
                        } else if (labelLeft + labelWidth > progressBarWidth) {
                          labelLeft = progressBarWidth - labelWidth;
                        }

                        return Positioned(
                          left: labelLeft,
                          top: -(dotRadius + labelVerticalOffset),
                          child: Opacity(
                            opacity:
                                _animationController.value > 0.0 ? 1.0 : 0.0,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color:
                                    _getLabelBackgroundColor(_animation.value),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                'You - ${widget.scoreText}',
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.black87,
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                    AnimatedBuilder(
                      animation: _animation,
                      builder: (context, child) {
                        final dotPosition = _animation.value * progressBarWidth;
                        return Positioned(
                          left: dotPosition - dotRadius,
                          top: -dotRadius +
                              2, // Adjust to center on the thinner line
                          child: Container(
                            width: dotDiameter,
                            height: dotDiameter,
                            decoration: BoxDecoration(
                              color: _getIndicatorColor(_animation.value),
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 1),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.1),
                                  blurRadius: 1,
                                  offset: const Offset(0, 0.5),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              );
            },
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: const [
                Text(
                  'Minimal',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                    color: Colors.green,
                  ),
                ),
                Text(
                  'Moderate',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                    color: Colors.orange,
                  ),
                ),
                Text(
                  'High',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                    color: Colors.red,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
