import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import 'multi_choice_with_image_question_check_box_widget.dart'
    show MultiChoiceWithImageQuestionCheckBoxWidget;
import 'package:flutter/material.dart';

class MultiChoiceWithImageQuestionCheckBoxModel
    extends FlutterFlowModel<MultiChoiceWithImageQuestionCheckBoxWidget> {
  ///  Local state fields for this component.

  int count = 0;

  /// selcted item
  int? selectedValue;

  String? questionId = 'test';

  List<String> selectedAnswer = [];
  void addToSelectedAnswer(String item) => selectedAnswer.add(item);
  void removeFromSelectedAnswer(String item) => selectedAnswer.remove(item);
  void removeAtIndexFromSelectedAnswer(int index) =>
      selectedAnswer.removeAt(index);
  void insertAtIndexInSelectedAnswer(int index, String item) =>
      selectedAnswer.insert(index, item);
  void updateSelectedAnswerAtIndex(int index, Function(String) updateFn) =>
      selectedAnswer[index] = updateFn(selectedAnswer[index]);

  List<MultiChoiceWithImagesCheckBoxStruct> localAnswerList = [];
  void addToLocalAnswerList(MultiChoiceWithImagesCheckBoxStruct item) =>
      localAnswerList.add(item);
  void removeFromLocalAnswerList(MultiChoiceWithImagesCheckBoxStruct item) =>
      localAnswerList.remove(item);
  void removeAtIndexFromLocalAnswerList(int index) =>
      localAnswerList.removeAt(index);
  void insertAtIndexInLocalAnswerList(
          int index, MultiChoiceWithImagesCheckBoxStruct item) =>
      localAnswerList.insert(index, item);
  void updateLocalAnswerListAtIndex(
          int index, Function(MultiChoiceWithImagesCheckBoxStruct) updateFn) =>
      localAnswerList[index] = updateFn(localAnswerList[index]);

  List<String> answer = [];
  void addToAnswer(String item) => answer.add(item);
  void removeFromAnswer(String item) => answer.remove(item);
  void removeAtIndexFromAnswer(int index) => answer.removeAt(index);
  void insertAtIndexInAnswer(int index, String item) =>
      answer.insert(index, item);
  void updateAnswerAtIndex(int index, Function(String) updateFn) =>
      answer[index] = updateFn(answer[index]);

  ///  State fields for stateful widgets in this component.

  // Model for FooterButton component.
  late FooterButtonModel footerButtonModel;

  @override
  void initState(BuildContext context) {
    footerButtonModel = createModel(context, () => FooterButtonModel());
  }

  @override
  void dispose() {
    footerButtonModel.dispose();
  }
}
