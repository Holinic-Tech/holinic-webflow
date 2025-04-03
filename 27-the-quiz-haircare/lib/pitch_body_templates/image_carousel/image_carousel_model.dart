import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import 'image_carousel_widget.dart' show ImageCarouselWidget;
import 'package:flutter/material.dart';

class ImageCarouselModel extends FlutterFlowModel<ImageCarouselWidget> {
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
