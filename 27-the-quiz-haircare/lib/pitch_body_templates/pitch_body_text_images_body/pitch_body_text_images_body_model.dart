import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import 'pitch_body_text_images_body_widget.dart'
    show PitchBodyTextImagesBodyWidget;
import 'package:flutter/material.dart';

class PitchBodyTextImagesBodyModel
    extends FlutterFlowModel<PitchBodyTextImagesBodyWidget> {
  ///  Local state fields for this component.

  String? pitchTitle;

  String? pitchDescription;

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
