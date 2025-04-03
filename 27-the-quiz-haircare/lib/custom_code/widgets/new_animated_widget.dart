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

import 'package:animated_text_kit/animated_text_kit.dart';

class NewAnimatedWidget extends StatefulWidget {
  const NewAnimatedWidget({
    super.key,
    this.width,
    this.height,
    required this.title,
    required this.description,
    required this.titleFontSize,
    required this.descriptionFontSize,
    required this.fontColor,
  });

  final double? width;
  final double? height;
  final String title;
  final String description;
  final double titleFontSize;
  final double descriptionFontSize;
  final Color fontColor;

  @override
  State<NewAnimatedWidget> createState() => _NewAnimatedWidgetState();
}

class _NewAnimatedWidgetState extends State<NewAnimatedWidget> {
  int _currentIndex = 0;
  final List<String> texts = [
    // "Recent studies show that...",
    // "73% of people who experience stress also report finding effective ways to manage it, such as exercise, meditation, or spending time with loved ones, which improves their overall well-being."
  ];

  @override
  void initState() {
    texts.addAll([widget.title, widget.description]);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: List.generate(
          _currentIndex + 1,
          (index) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 2.0),
              child: index < _currentIndex
                  ? Text(
                      texts[index],
                      style: TextStyle(
                        fontSize: index == 0
                            ? widget.titleFontSize
                            : widget.descriptionFontSize,
                        fontWeight:
                            index == 0 ? FontWeight.w500 : FontWeight.w400,
                        color: widget.fontColor,
                      ),
                      textAlign: TextAlign.start,
                    )
                  : AnimatedTextKit(
                      key: UniqueKey(),
                      isRepeatingAnimation: false,
                      animatedTexts: [
                        TypewriterAnimatedText(
                          texts[index],
                          speed: Duration(milliseconds: 100),
                          textStyle: TextStyle(
                            fontSize: index == 0
                                ? widget.titleFontSize
                                : widget.descriptionFontSize,
                            fontWeight:
                                index == 0 ? FontWeight.w500 : FontWeight.w400,
                            color: widget.fontColor,
                          ),
                          cursor: '',
                          textAlign: TextAlign.start,
                        ),
                      ],
                      onFinished: () {
                        if (_currentIndex < texts.length - 1) {
                          Future.delayed(Duration(milliseconds: 200), () {
                            setState(() {
                              _currentIndex++; // Move to the next text
                            });
                          });
                        }
                      },
                    ),
            );
          },
        ),
      ),
    );
  }
}
