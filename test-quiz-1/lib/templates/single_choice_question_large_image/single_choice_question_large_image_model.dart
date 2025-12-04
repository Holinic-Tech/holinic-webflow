import '/flutter_flow/flutter_flow_util.dart';
import 'single_choice_question_large_image_widget.dart'
    show SingleChoiceQuestionLargeImageWidget;
import 'package:flutter/material.dart';

class SingleChoiceQuestionLargeImageModel
    extends FlutterFlowModel<SingleChoiceQuestionLargeImageWidget> {
  ///  Local state fields for this component.
  /// user selcted items
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

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
