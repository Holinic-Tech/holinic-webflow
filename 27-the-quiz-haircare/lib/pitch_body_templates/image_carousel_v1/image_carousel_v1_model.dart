import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import 'image_carousel_v1_widget.dart' show ImageCarouselV1Widget;
import 'package:flutter/material.dart';

class ImageCarouselV1Model extends FlutterFlowModel<ImageCarouselV1Widget> {
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
