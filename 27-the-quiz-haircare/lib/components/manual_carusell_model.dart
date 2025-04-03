import '/flutter_flow/flutter_flow_util.dart';
import 'manual_carusell_widget.dart' show ManualCarusellWidget;
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';

class ManualCarusellModel extends FlutterFlowModel<ManualCarusellWidget> {
  ///  State fields for stateful widgets in this component.

  // State field(s) for Carousel widget.
  CarouselSliderController? carouselController;
  int carouselCurrentIndex = 1;

  // State field(s) for RatingBar widget.
  double? ratingBarValue;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
