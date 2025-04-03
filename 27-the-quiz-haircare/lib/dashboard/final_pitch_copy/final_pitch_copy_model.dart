import '/backend/schema/structs/index.dart';
import '/dashboard/dashboard_widget/dashboard_widget_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'final_pitch_copy_widget.dart' show FinalPitchCopyWidget;
import 'package:flutter/material.dart';

class FinalPitchCopyModel extends FlutterFlowModel<FinalPitchCopyWidget> {
  ///  Local state fields for this component.
  /// Selected  plan index
  int? selctedValue;

  String? hairGoal;

  List<ProfileStruct> profile = [];
  void addToProfile(ProfileStruct item) => profile.add(item);
  void removeFromProfile(ProfileStruct item) => profile.remove(item);
  void removeAtIndexFromProfile(int index) => profile.removeAt(index);
  void insertAtIndexInProfile(int index, ProfileStruct item) =>
      profile.insert(index, item);
  void updateProfileAtIndex(int index, Function(ProfileStruct) updateFn) =>
      profile[index] = updateFn(profile[index]);

  ///  State fields for stateful widgets in this component.

  // Model for dashboard_widget component.
  late DashboardWidgetModel dashboardWidgetModel1;
  // Model for dashboard_widget component.
  late DashboardWidgetModel dashboardWidgetModel2;
  // Model for dashboard_widget component.
  late DashboardWidgetModel dashboardWidgetModel3;
  // State field(s) for Slider widget.
  double? sliderValue1;
  // Model for dashboard_widget component.
  late DashboardWidgetModel dashboardWidgetModel4;
  // Model for dashboard_widget component.
  late DashboardWidgetModel dashboardWidgetModel5;
  // Model for dashboard_widget component.
  late DashboardWidgetModel dashboardWidgetModel6;
  // State field(s) for Slider widget.
  double? sliderValue2;

  @override
  void initState(BuildContext context) {
    dashboardWidgetModel1 = createModel(context, () => DashboardWidgetModel());
    dashboardWidgetModel2 = createModel(context, () => DashboardWidgetModel());
    dashboardWidgetModel3 = createModel(context, () => DashboardWidgetModel());
    dashboardWidgetModel4 = createModel(context, () => DashboardWidgetModel());
    dashboardWidgetModel5 = createModel(context, () => DashboardWidgetModel());
    dashboardWidgetModel6 = createModel(context, () => DashboardWidgetModel());
  }

  @override
  void dispose() {
    dashboardWidgetModel1.dispose();
    dashboardWidgetModel2.dispose();
    dashboardWidgetModel3.dispose();
    dashboardWidgetModel4.dispose();
    dashboardWidgetModel5.dispose();
    dashboardWidgetModel6.dispose();
  }
}
