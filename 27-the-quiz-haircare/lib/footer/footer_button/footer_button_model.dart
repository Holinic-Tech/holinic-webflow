import '/common_widget/common_button/common_button_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'footer_button_widget.dart' show FooterButtonWidget;
import 'package:flutter/material.dart';

class FooterButtonModel extends FlutterFlowModel<FooterButtonWidget> {
  ///  State fields for stateful widgets in this component.

  // Model for CommonButton component.
  late CommonButtonModel commonButtonModel;

  @override
  void initState(BuildContext context) {
    commonButtonModel = createModel(context, () => CommonButtonModel());
  }

  @override
  void dispose() {
    commonButtonModel.dispose();
  }
}
