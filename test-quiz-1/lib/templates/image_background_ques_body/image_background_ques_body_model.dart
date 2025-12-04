import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'image_background_ques_body_widget.dart'
    show ImageBackgroundQuesBodyWidget;
import 'package:flutter/material.dart';

class ImageBackgroundQuesBodyModel
    extends FlutterFlowModel<ImageBackgroundQuesBodyWidget> {
  ///  Local state fields for this component.

  List<String> selectedAnswer = [];
  void addToSelectedAnswer(String item) => selectedAnswer.add(item);
  void removeFromSelectedAnswer(String item) => selectedAnswer.remove(item);
  void removeAtIndexFromSelectedAnswer(int index) =>
      selectedAnswer.removeAt(index);
  void insertAtIndexInSelectedAnswer(int index, String item) =>
      selectedAnswer.insert(index, item);
  void updateSelectedAnswerAtIndex(int index, Function(String) updateFn) =>
      selectedAnswer[index] = updateFn(selectedAnswer[index]);

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

  String? questionId;

  bool? checkBoxToggle = false;

  ///  State fields for stateful widgets in this component.

  // State field(s) for Checkbox widget.
  bool? checkboxValue;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
