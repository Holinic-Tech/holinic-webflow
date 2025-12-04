import '/components/floating_timer_checkout_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'dashboard_widget.dart' show DashboardWidget;
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';

class DashboardModel extends FlutterFlowModel<DashboardWidget> {
  ///  Local state fields for this component.

  double? scrolledPercent = 0.0;

  ///  State fields for stateful widgets in this component.

  // State field(s) for Carousel widget.
  CarouselSliderController? carouselController;
  int carouselCurrentIndex = 1;

  // Model for FloatingTimerCheckout component.
  late FloatingTimerCheckoutModel floatingTimerCheckoutModel;

  @override
  void initState(BuildContext context) {
    floatingTimerCheckoutModel =
        createModel(context, () => FloatingTimerCheckoutModel());
  }

  @override
  void dispose() {
    floatingTimerCheckoutModel.dispose();
  }
}
