import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import 'multi_choice_with_image_question_check_box_practices_widget.dart'
    show MultiChoiceWithImageQuestionCheckBoxPracticesWidget;
import 'package:flutter/material.dart';

class MultiChoiceWithImageQuestionCheckBoxPracticesModel
    extends FlutterFlowModel<
        MultiChoiceWithImageQuestionCheckBoxPracticesWidget> {
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
