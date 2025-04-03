import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'image_background_ques_body_v3_widget.dart'
    show ImageBackgroundQuesBodyV3Widget;
import 'package:flutter/material.dart';

class ImageBackgroundQuesBodyV3Model
    extends FlutterFlowModel<ImageBackgroundQuesBodyV3Widget> {
  ///  Local state fields for this component.

  int? selectedIndex;

  List<String> selectedAnswer = [];
  void addToSelectedAnswer(String item) => selectedAnswer.add(item);
  void removeFromSelectedAnswer(String item) => selectedAnswer.remove(item);
  void removeAtIndexFromSelectedAnswer(int index) =>
      selectedAnswer.removeAt(index);
  void insertAtIndexInSelectedAnswer(int index, String item) =>
      selectedAnswer.insert(index, item);
  void updateSelectedAnswerAtIndex(int index, Function(String) updateFn) =>
      selectedAnswer[index] = updateFn(selectedAnswer[index]);

  String? questionId;

  List<String> selectedAnswerId = [];
  void addToSelectedAnswerId(String item) => selectedAnswerId.add(item);
  void removeFromSelectedAnswerId(String item) => selectedAnswerId.remove(item);
  void removeAtIndexFromSelectedAnswerId(int index) =>
      selectedAnswerId.removeAt(index);
  void insertAtIndexInSelectedAnswerId(int index, String item) =>
      selectedAnswerId.insert(index, item);
  void updateSelectedAnswerIdAtIndex(int index, Function(String) updateFn) =>
      selectedAnswerId[index] = updateFn(selectedAnswerId[index]);

  AnswerStruct? answerList;
  void updateAnswerListStruct(Function(AnswerStruct) updateFn) {
    updateFn(answerList ??= AnswerStruct());
  }

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
