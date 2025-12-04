import '/backend/schema/structs/index.dart';
import '/components/floating_timer_dialog_box_widget.dart';
import '/dashboard/dashboard_widget/dashboard_widget_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'final_pitch_widget.dart' show FinalPitchWidget;
import 'package:flutter/material.dart';

class FinalPitchModel extends FlutterFlowModel<FinalPitchWidget> {
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

  bool hideTimerBar = false;

  ///  State fields for stateful widgets in this component.

  // Model for dashboard_widget component.
  late DashboardWidgetModel dashboardWidgetModel1;
  // Model for dashboard_widget component.
  late DashboardWidgetModel dashboardWidgetModel2;
  // Model for dashboard_widget component.
  late DashboardWidgetModel dashboardWidgetModel3;
  // Model for dashboard_widget component.
  late DashboardWidgetModel dashboardWidgetModel4;
  // Model for dashboard_widget component.
  late DashboardWidgetModel dashboardWidgetModel5;
  // Model for dashboard_widget component.
  late DashboardWidgetModel dashboardWidgetModel6;
  // Model for FloatingTimerDialogBox component.
  late FloatingTimerDialogBoxModel floatingTimerDialogBoxModel;

  @override
  void initState(BuildContext context) {
    dashboardWidgetModel1 = createModel(context, () => DashboardWidgetModel());
    dashboardWidgetModel2 = createModel(context, () => DashboardWidgetModel());
    dashboardWidgetModel3 = createModel(context, () => DashboardWidgetModel());
    dashboardWidgetModel4 = createModel(context, () => DashboardWidgetModel());
    dashboardWidgetModel5 = createModel(context, () => DashboardWidgetModel());
    dashboardWidgetModel6 = createModel(context, () => DashboardWidgetModel());
    floatingTimerDialogBoxModel =
        createModel(context, () => FloatingTimerDialogBoxModel());
  }

  @override
  void dispose() {
    dashboardWidgetModel1.dispose();
    dashboardWidgetModel2.dispose();
    dashboardWidgetModel3.dispose();
    dashboardWidgetModel4.dispose();
    dashboardWidgetModel5.dispose();
    dashboardWidgetModel6.dispose();
    floatingTimerDialogBoxModel.dispose();
  }
}
