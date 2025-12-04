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

import 'dart:async';

class LoginProgressBar extends StatefulWidget {
  const LoginProgressBar({
    super.key,
    this.width,
    this.height,
    required this.activeColor,
    required this.backgroundColor,
    required this.radius,
    this.minHeight,
    required this.delay,
    required this.borderWidth,
    required this.navigation,
    required this.isDesktop,
    required this.maxProgress,
  });

  final double? width;
  final double? height;
  final List<Color> activeColor;
  final Color backgroundColor;
  final double radius;
  final double? minHeight;
  final int delay;
  final double borderWidth;
  final Future Function() navigation;
  final bool isDesktop;
  final double maxProgress;

  @override
  State<LoginProgressBar> createState() => _LoginProgressBarState();
}

class _LoginProgressBarState extends State<LoginProgressBar> {
  Timer? timer;
  double sliderValue = 0.0;

  void startProgress() {
    timer = Timer.periodic(Duration(milliseconds: widget.delay),
        (Timer timer) async {
      if (sliderValue < widget.maxProgress) {
        setState(() {
          sliderValue += 10;
        });
      } else {
        timer.cancel();
        await Future.delayed(Duration(seconds: 1));
        widget.navigation();
      }
    });
  }

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    startProgress();
  }

  @override
  Widget build(BuildContext context) {
    double progressWidth =
        ((widget.isDesktop ? 500 : MediaQuery.of(context).size.width) - 36) *
            (sliderValue / 100);

    return Container(
      height: widget.minHeight,
      width: widget.isDesktop ? 500 : MediaQuery.of(context).size.width,
      padding: EdgeInsets.all(widget.borderWidth),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(widget.radius),
      ),
      child: Stack(
        children: [
          Container(
            width: MediaQuery.of(context).size.width,
            height: widget.minHeight,
            decoration: BoxDecoration(
              color: widget.backgroundColor,
              border:
                  Border.all(color: Colors.white, width: widget.borderWidth),
              borderRadius: BorderRadius.circular(widget.radius),
            ),
          ),
          AnimatedContainer(
            duration: const Duration(milliseconds: 350),
            width: progressWidth,
            height: widget.minHeight,
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: widget.activeColor),
              borderRadius: BorderRadius.circular(widget.radius),
            ),
          ),
        ],
      ),
    );
  }
}
