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

class HeaderProgressBar extends StatefulWidget {
  const HeaderProgressBar({
    super.key,
    this.width,
    this.height,
    required this.totalQuestions,
    required this.currentQuestion,
    required this.totalSegments,
    required this.valueColor,
    required this.backgroundColor,
    required this.progressBarHeight,
  });

  final double? width;
  final double? height;
  final int totalQuestions;
  final int currentQuestion;
  final int totalSegments;
  final Color valueColor;
  final Color backgroundColor;
  final double progressBarHeight;

  @override
  State<HeaderProgressBar> createState() => _HeaderProgressBarState();
}

class _HeaderProgressBarState extends State<HeaderProgressBar> {
  @override
  Widget build(BuildContext context) {
    double questionsPerSegment = widget.totalQuestions / widget.totalSegments;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: List.generate(
        widget.totalSegments,
        (index) {
          double segmentStart = index * questionsPerSegment;
          double segmentEnd = (index + 1) * questionsPerSegment;

          double progress = 0.0;
          if (widget.currentQuestion >= segmentEnd) {
            progress = 1.0;
          } else if (widget.currentQuestion > segmentStart) {
            progress =
                (widget.currentQuestion - segmentStart) / questionsPerSegment;
          }

          return Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: LinearProgressIndicator(
                value: progress,
                backgroundColor: widget.backgroundColor,
                valueColor: AlwaysStoppedAnimation<Color>(widget.valueColor),
                minHeight: widget.progressBarHeight,
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          );
        },
      ),
    );
  }
}
