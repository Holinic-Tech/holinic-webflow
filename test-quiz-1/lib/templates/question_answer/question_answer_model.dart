import '/flutter_flow/flutter_flow_util.dart';
import 'question_answer_widget.dart' show QuestionAnswerWidget;
import 'package:flutter/material.dart';

class QuestionAnswerModel extends FlutterFlowModel<QuestionAnswerWidget> {
  ///  Local state fields for this component.
  /// selcted answer in list
  int? selctedValue;

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

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
