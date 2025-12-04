import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'pitch_body_simple_detailed_text_images_widget.dart'
    show PitchBodySimpleDetailedTextImagesWidget;
import 'package:flutter/material.dart';

class PitchBodySimpleDetailedTextImagesModel
    extends FlutterFlowModel<PitchBodySimpleDetailedTextImagesWidget> {
  ///  Local state fields for this component.

  String? pitchTitle;

  String? pitchDescription;

  ///  State fields for stateful widgets in this component.

  // State field(s) for Carousel widget.
  CarouselSliderController? carouselController;
  int carouselCurrentIndex = 1;

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
