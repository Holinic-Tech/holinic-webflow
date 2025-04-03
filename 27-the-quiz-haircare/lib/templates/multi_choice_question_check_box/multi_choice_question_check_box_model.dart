import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import 'multi_choice_question_check_box_widget.dart'
    show MultiChoiceQuestionCheckBoxWidget;
import 'package:flutter/material.dart';

class MultiChoiceQuestionCheckBoxModel
    extends FlutterFlowModel<MultiChoiceQuestionCheckBoxWidget> {
  ///  Local state fields for this component.

  int count = 0;

  /// selcted item
  int? selctedValue;

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
