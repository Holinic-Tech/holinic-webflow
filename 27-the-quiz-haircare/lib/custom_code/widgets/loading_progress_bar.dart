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

class LoadingProgressBar extends StatefulWidget {
  const LoadingProgressBar({
    super.key,
    this.width,
    this.height,
    required this.activeColor,
    required this.backgroundColor,
    required this.radius,
    required this.minHeight,
    required this.itemsCount,
    required this.delay,
    required this.borderWidth,
    required this.navigation,
    required this.isDesktop,
  });

  final double? width;
  final double? height;
  final List<Color> activeColor;
  final Color backgroundColor;
  final double radius;
  final double minHeight;
  final int itemsCount;
  final int delay;
  final double borderWidth;
  final Future Function() navigation;
  final bool isDesktop;

  @override
  State<LoadingProgressBar> createState() => _LoadingProgressBarState();
}

class _LoadingProgressBarState extends State<LoadingProgressBar> {
  Timer? timer;
  double sliderValue = 0.0;
  double sliderAddValue = 0.0;

  setDelay() {
    timer = Timer.periodic(Duration(milliseconds: widget.delay),
        (Timer timer) async {
      sliderValue = 100 / widget.itemsCount;
      sliderAddValue += sliderValue;
      setState(() {});
      if (sliderAddValue == 100) {
        timer.cancel();
        await Future.delayed(Duration(seconds: 1));
        widget.navigation();
      }
    });
  }

  @override
  void dispose() {
    timer!.cancel();
    super.dispose();
  }

  @override
  void initState() {
    print("number of item *** ${widget.itemsCount}");
    setDelay();
    super.initState();
  }

  Widget build(BuildContext context) {
    print("width *** ${MediaQuery.of(context).size.width}");
    return Container(
      height: widget.minHeight,
      width: widget.isDesktop ? 500 : MediaQuery.of(context).size.width,
      padding: EdgeInsets.all(widget.borderWidth),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: widget.activeColor),
        borderRadius: BorderRadius.circular(widget.radius),
      ),
      child: Container(
        width: MediaQuery.of(context).size.width,
        height: widget.minHeight,
        decoration: BoxDecoration(
          color: widget.backgroundColor,
          border: Border.all(color: Colors.white, width: widget.borderWidth),
          borderRadius: BorderRadius.circular(widget.radius),
        ),
        child: Stack(
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 350),
              width: ((widget.isDesktop
                          ? 500
                          : MediaQuery.of(context).size.width) -
                      36) *
                  (sliderAddValue / 100),
              height: widget.minHeight,
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: widget.activeColor),
                borderRadius: BorderRadius.circular(widget.radius),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
