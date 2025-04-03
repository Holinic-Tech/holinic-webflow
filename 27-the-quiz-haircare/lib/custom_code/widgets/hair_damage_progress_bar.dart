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
  final String scoreText; // The score to display (e.g. "46.71")
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

  bool _animationComplete = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 1500),
    );

    _animation = Tween<double>(begin: 0.0, end: widget.value).animate(
        CurvedAnimation(
            parent: _animationController, curve: Curves.easeOutCubic))
      ..addStatusListener((status) {
        if (status == AnimationStatus.completed) {
          setState(() {
            _animationComplete = true;
          });
        }
      });

    // Start animation regardless of widget.animate setting
    // We'll handle showing initial state differently
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (widget.animate) {
        _animationController.forward(from: 0.0);
      } else {
        _animationController.value = 1.0;
        setState(() {
          _animationComplete = true;
        });
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
      _animationComplete = false;
    }

    // Force animation if animate property changes
    if (oldWidget.animate != widget.animate) {
      if (widget.animate) {
        _animationController.forward(from: 0.0);
        _animationComplete = false;
      } else {
        _animationController.value = 1.0;
        setState(() {
          _animationComplete = true;
        });
      }
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Color _getIndicatorColor(double value) {
    // Get gradient color based on position
    if (value < 0.33) {
      return Color.lerp(Colors.green, Colors.yellow, value * 3) ?? Colors.green;
    } else if (value < 0.66) {
      return Color.lerp(Colors.yellow, Colors.orange, (value - 0.33) * 3) ??
          Colors.yellow;
    } else {
      return Color.lerp(Colors.orange, Colors.red, (value - 0.66) * 3) ??
          Colors.red;
    }
  }

  @override
  Widget build(BuildContext context) {
    // Debug print to verify animation status
    print(
        "Building widget, animate: ${widget.animate}, controller: ${_animationController.value}, animation: ${_animation.value}");

    return Container(
      width: widget.width,
      height: widget.height,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start, // Left align all content

        mainAxisSize: MainAxisSize.min,
        children: [
          // Title text
          Padding(
            padding: const EdgeInsets.only(bottom: 16.0),
            child: Text(
              'Estimated Reversible Hair Damage',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
                color: Colors.black87,
              ),
              textAlign: TextAlign.left,
            ),
          ),

          // Progress bar with indicator
          Padding(
            padding: const EdgeInsets.only(bottom: 16.0, top: 8.0),
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                // Background gradient bar
                Container(
                  height: 8,
                  width: widget.width ?? double.infinity,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(4),
                    gradient: LinearGradient(
                      colors: [
                        Colors.green.shade400,
                        Colors.yellow.shade400,
                        Colors.orange.shade400,
                        Colors.red.shade400,
                      ],
                    ),
                  ),
                ),

                // Indicator point and label
                AnimatedBuilder(
                  animation: _animation,
                  builder: (context, child) {
                    final leftPosition = _animation.value *
                            (widget.width ??
                                MediaQuery.of(context).size.width * 0.9) -
                        10;

                    return Positioned(
                      left: leftPosition,
                      top: -30, // Position above the bar for the label
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Always show the label, just fade it in
                          FadeTransition(
                            opacity: _animationController,
                            child: Container(
                              padding: EdgeInsets.symmetric(
                                  horizontal: 14, vertical: 6),
                              decoration: BoxDecoration(
                                color: Color(0xFFFEE0D5),
                                borderRadius: BorderRadius.circular(18),
                              ),
                              child: Text(
                                'You - ${widget.scoreText}',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.black87,
                                ),
                              ),
                            ),
                          ),
                          SizedBox(height: 2),
                          // Indicator dot
                          Container(
                            width: 20,
                            height: 20,
                            decoration: BoxDecoration(
                              color: _getIndicatorColor(_animation.value),
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.2),
                                  blurRadius: 2,
                                  offset: Offset(0, 1),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ],
            ),
          ),

          // Labels
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'MINIMAL',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: Colors.green.shade600,
                ),
              ),
              Text(
                'MODERATE',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: Colors.orange.shade600,
                ),
              ),
              Text(
                'SEVERE',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: Colors.red.shade600,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// Example usage:
// HairDamageProgressBar(
//   value: 0.65, // 65% damage (0.0 to 1.0)
//   scoreText: 'High!',
//   animate: true, // IMPORTANT: Keep this true for animation to work in FlutterFlow
//   width: double.infinity,
//   height: null,
// )
