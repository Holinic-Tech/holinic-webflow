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

class AnimatedText extends StatefulWidget {
  const AnimatedText({
    super.key,
    this.width,
    this.height,
    required this.titleFontSize,
    required this.descriptionFontSize,
    required this.fontColor,
    required this.animateBoxColor,
    required this.animateBoxBorderColor,
    required this.answerList,
    required this.selectedBoxColor,
    required this.unSelectedBoxColor,
    required this.selectedBoxBorderColor,
    required this.onAnswerSelected,
  });

  final double? width;
  final double? height;
  final double titleFontSize;
  final double descriptionFontSize;
  final Color fontColor;
  final Color animateBoxColor;
  final Color animateBoxBorderColor;
  final List<AnswerWithAdditionalInfoStruct> answerList;
  final Color selectedBoxColor;
  final Color unSelectedBoxColor;
  final Color selectedBoxBorderColor;
  final Function(int? indexInList) onAnswerSelected;

  @override
  State<AnimatedText> createState() => _AnimatedTextState();
}

class _AnimatedTextState extends State<AnimatedText> {
  int _currentIndex = 0;
  int? selectedValue;
  final List<String> texts = [
    // "Recent studies show that...",
    // "73% of people who experience stress also report finding effective ways to manage it, such as exercise, meditation, or spending time with loved ones, which improves their overall well-being."
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (selectedValue != null)
          Container(
            width: double.infinity,
            margin: EdgeInsets.symmetric(
                horizontal: 1.0), // Tiny margin to ensure proper rendering
            constraints: BoxConstraints(
                minHeight: 0), // Allow container to adjust naturally
            decoration: BoxDecoration(
                color: Color(0xFFFFF9E6), // Light yellow background
                border:
                    Border.all(color: Color(0xFFFFE6B3)), // Light yellow border
                borderRadius: BorderRadius.circular(8)),
            child: Padding(
              padding:
                  const EdgeInsets.symmetric(vertical: 18.0, horizontal: 12.0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Books emoji on the left
                  Padding(
                    padding: const EdgeInsets.only(right: 12.0),
                    child: Text(
                      '📚',
                      style: TextStyle(
                        fontSize: 20,
                      ),
                    ),
                  ),
                  // Content with animated text
                  Expanded(
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
                                      fontWeight: index == 0
                                          ? FontWeight.bold
                                          : FontWeight.w400,
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
                                        speed: Duration(milliseconds: 20),
                                        textStyle: TextStyle(
                                          fontSize: index == 0
                                              ? widget.titleFontSize
                                              : widget.descriptionFontSize,
                                          fontWeight: index == 0
                                              ? FontWeight.bold
                                              : FontWeight.w400,
                                          color: widget.fontColor,
                                        ),
                                        cursor: '',
                                        textAlign: TextAlign.start,
                                      ),
                                    ],
                                    pause: Duration(milliseconds: 50),
                                    onFinished: () {
                                      if (_currentIndex < texts.length - 1) {
                                        Future.delayed(
                                            Duration(milliseconds: 50), () {
                                          if (mounted) {
                                            setState(() {
                                              _currentIndex++; // Move to the next text
                                            });
                                          }
                                        });
                                      }
                                    },
                                  ),
                          );
                        },
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        SizedBox(height: 32),
        Expanded(
          child: ListView.builder(
            itemCount: widget.answerList.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 7.5),
                child: GestureDetector(
                  onTap: () {
                    selectedValue = index;
                    texts.clear();
                    texts.addAll([
                      widget.answerList[selectedValue!].answerTitle,
                      widget.answerList[selectedValue!].answerDescription,
                    ]);
                    _currentIndex = 0;
                    widget.onAnswerSelected(index);

                    setState(() {});
                  },
                  child: Container(
                    // width: double.infinity,
                    decoration: BoxDecoration(
                        color: selectedValue == index
                            ? widget.selectedBoxColor
                            : widget.unSelectedBoxColor,
                        borderRadius: BorderRadius.circular(11),
                        border: Border.all(
                            color: selectedValue == index
                                ? widget.selectedBoxBorderColor
                                : Colors.transparent),
                        boxShadow: [
                          BoxShadow(
                              color: Color(0xffb3dae1fe),
                              offset: Offset(0.0, 3.0),
                              blurRadius: 14,
                              spreadRadius: 0.0)
                        ]),
                    child: Row(
                      children: [
                        // Modified image container to fill all the way to the border
                        Container(
                          width: 75, // Wider to match the diet question
                          height: 75, // Taller to match the diet question
                          child: ClipRRect(
                            // Only round the left corners to match your diet question layout
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(11),
                              bottomLeft: Radius.circular(11),
                            ),
                            child: Image.network(
                              widget.answerList[index].image,
                              fit: BoxFit.cover, // Fill the entire space
                              width: 75,
                              height: 75,
                              errorBuilder: (context, error, stackTrace) {
                                return Container(
                                  color: Colors.grey[200],
                                  child:
                                      Icon(Icons.image_not_supported, size: 30),
                                );
                              },
                            ),
                          ),
                        ),
                        // Text content
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(
                                vertical: 20.0, horizontal: 5.0),
                            child: Text(
                              widget.answerList[index].answer,
                              style: TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.w500),
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        )
      ],
    );
  }
}
