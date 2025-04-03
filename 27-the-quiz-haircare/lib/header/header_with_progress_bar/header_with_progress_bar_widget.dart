import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/custom_code/actions/index.dart' as actions;
import '/custom_code/widgets/index.dart' as custom_widgets;
import 'package:flutter/material.dart';
import 'header_with_progress_bar_model.dart';
export 'header_with_progress_bar_model.dart';

/// Header with Linear Progression bar & back button
class HeaderWithProgressBarWidget extends StatefulWidget {
  const HeaderWithProgressBarWidget({
    super.key,
    required this.isProgress,
    required this.isBack,
    required this.fillColor,
    required this.totalQuestion,
    required this.currentQuestion,
    required this.totalSegments,
    required this.backAction,
  });

  final bool? isProgress;
  final bool? isBack;
  final Color? fillColor;

  /// Number of question
  final int? totalQuestion;

  /// Current question index
  final int? currentQuestion;

  /// Number of segments
  final int? totalSegments;

  final Future Function()? backAction;

  @override
  State<HeaderWithProgressBarWidget> createState() =>
      _HeaderWithProgressBarWidgetState();
}

class _HeaderWithProgressBarWidgetState
    extends State<HeaderWithProgressBarWidget> {
  late HeaderWithProgressBarModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => HeaderWithProgressBarModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: BoxConstraints(
        maxWidth: () {
          if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
            return 500.0;
          } else if (MediaQuery.sizeOf(context).width < kBreakpointMedium) {
            return double.infinity;
          } else if (MediaQuery.sizeOf(context).width < kBreakpointLarge) {
            return 500.0;
          } else {
            return 500.0;
          }
        }(),
      ),
      decoration: BoxDecoration(
        color: valueOrDefault<Color>(
          widget.fillColor,
          FlutterFlowTheme.of(context).primaryWhite,
        ),
      ),
      child: Padding(
        padding: EdgeInsetsDirectional.fromSTEB(20.0, 5.0, 20.0, 5.0),
        child: Column(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (widget.isBack ?? true)
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(0.0, 5.0, 0.0, 0.0),
                child: Row(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Align(
                      alignment: AlignmentDirectional(-1.0, 0.0),
                      child: Container(
                        width: MediaQuery.sizeOf(context).width * 0.1,
                        constraints: BoxConstraints(
                          maxWidth: 50.0,
                        ),
                        decoration: BoxDecoration(),
                        child: Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              5.0, 2.0, 5.0, 2.0),
                          child: InkWell(
                            splashColor: Colors.transparent,
                            focusColor: Colors.transparent,
                            hoverColor: Colors.transparent,
                            highlightColor: Colors.transparent,
                            onTap: () async {
                              await actions.trackGAEvent(
                                'Quiz Back',
                                '',
                                '',
                                FFAppConstants.nonQuestionAnswerItem.toList(),
                                '',
                                '',
                              );
                              await widget.backAction?.call();
                            },
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(8.0),
                              child: Image.asset(
                                'assets/images/Arrow_104.png',
                                width: 35.0,
                                fit: BoxFit.fill,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    Container(
                      decoration: BoxDecoration(),
                      child: Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(5.0, 2.0, 5.0, 2.0),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8.0),
                          child: Image.asset(
                            'assets/images/image_448_(1).png',
                            width: 96.0,
                            height: 22.0,
                            fit: BoxFit.contain,
                          ),
                        ),
                      ),
                    ),
                    Container(
                      width: MediaQuery.sizeOf(context).width * 0.1,
                      constraints: BoxConstraints(
                        maxWidth: 50.0,
                      ),
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).transparent,
                      ),
                    ),
                  ],
                ),
              ),
            if (!widget.isBack!)
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(0.0, 5.0, 0.0, 0.0),
                child: Row(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(5.0, 2.0, 5.0, 2.0),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8.0),
                        child: Image.asset(
                          'assets/images/image_448_(1).png',
                          width: 96.0,
                          height: 22.0,
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            if (widget.isProgress ?? true)
              Container(
                width: double.infinity,
                height: 40.0,
                child: custom_widgets.HeaderProgressBar(
                  width: double.infinity,
                  height: 40.0,
                  totalQuestions: widget.totalQuestion!,
                  currentQuestion: widget.currentQuestion!,
                  totalSegments: widget.totalSegments!,
                  valueColor: FlutterFlowTheme.of(context).secondaryPlum,
                  backgroundColor:
                      FlutterFlowTheme.of(context).progessUnselected,
                  progressBarHeight: 4.0,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
