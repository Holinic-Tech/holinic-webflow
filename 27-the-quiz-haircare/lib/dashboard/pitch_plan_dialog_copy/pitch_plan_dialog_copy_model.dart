import '/flutter_flow/flutter_flow_timer.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:stop_watch_timer/stop_watch_timer.dart';
import 'pitch_plan_dialog_copy_widget.dart' show PitchPlanDialogCopyWidget;
import 'package:flutter/material.dart';

class PitchPlanDialogCopyModel
    extends FlutterFlowModel<PitchPlanDialogCopyWidget> {
  ///  State fields for stateful widgets in this component.

  // State field(s) for Timer widget.
  final timerInitialTimeMs = 1740000;
  int timerMilliseconds = 1740000;
  String timerValue = StopWatchTimer.getDisplayTime(
    1740000,
    hours: false,
    milliSecond: false,
  );
  FlutterFlowTimerController timerController =
      FlutterFlowTimerController(StopWatchTimer(mode: StopWatchMode.countDown));

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {
    timerController.dispose();
  }
}
