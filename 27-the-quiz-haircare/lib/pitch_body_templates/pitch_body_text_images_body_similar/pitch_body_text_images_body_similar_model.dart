import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import '/pitch_body_templates/pitch_widget/pitch_widget_widget.dart';
import 'pitch_body_text_images_body_similar_widget.dart'
    show PitchBodyTextImagesBodySimilarWidget;
import 'package:flutter/material.dart';

class PitchBodyTextImagesBodySimilarModel
    extends FlutterFlowModel<PitchBodyTextImagesBodySimilarWidget> {
  ///  Local state fields for this component.

  String? damageLevel;

  String? hairProblem;

  ///  State fields for stateful widgets in this component.

  // Model for Pitch_widget component.
  late PitchWidgetModel pitchWidgetModel1;
  // Model for Pitch_widget component.
  late PitchWidgetModel pitchWidgetModel2;
  // Model for Pitch_widget component.
  late PitchWidgetModel pitchWidgetModel3;
  // Model for FooterButton component.
  late FooterButtonModel footerButtonModel;

  @override
  void initState(BuildContext context) {
    pitchWidgetModel1 = createModel(context, () => PitchWidgetModel());
    pitchWidgetModel2 = createModel(context, () => PitchWidgetModel());
    pitchWidgetModel3 = createModel(context, () => PitchWidgetModel());
    footerButtonModel = createModel(context, () => FooterButtonModel());
  }

  @override
  void dispose() {
    pitchWidgetModel1.dispose();
    pitchWidgetModel2.dispose();
    pitchWidgetModel3.dispose();
    footerButtonModel.dispose();
  }
}
