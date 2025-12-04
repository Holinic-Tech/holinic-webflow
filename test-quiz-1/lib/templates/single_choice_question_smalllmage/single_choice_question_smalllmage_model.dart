import '/flutter_flow/flutter_flow_util.dart';
import 'single_choice_question_smalllmage_widget.dart'
    show SingleChoiceQuestionSmalllmageWidget;
import 'package:flutter/material.dart';

class SingleChoiceQuestionSmalllmageModel
    extends FlutterFlowModel<SingleChoiceQuestionSmalllmageWidget> {
  ///  Local state fields for this component.
  /// user selected answer
  int? selctedIndex;

  List<String> selectedAnswer = [];
  void addToSelectedAnswer(String item) => selectedAnswer.add(item);
  void removeFromSelectedAnswer(String item) => selectedAnswer.remove(item);
  void removeAtIndexFromSelectedAnswer(int index) =>
      selectedAnswer.removeAt(index);
  void insertAtIndexInSelectedAnswer(int index, String item) =>
      selectedAnswer.insert(index, item);
  void updateSelectedAnswerAtIndex(int index, Function(String) updateFn) =>
      selectedAnswer[index] = updateFn(selectedAnswer[index]);

  String? questionId = '';

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
