import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'rating_question_options_model.dart';
export 'rating_question_options_model.dart';

/// Question with Ratings as an option.
class RatingQuestionOptionsWidget extends StatefulWidget {
  const RatingQuestionOptionsWidget({
    super.key,
    required this.question,
    this.subQuestion,
    required this.buttonAction,
    this.questionId,
  });

  final String? question;
  final String? subQuestion;
  final Future Function()? buttonAction;
  final String? questionId;

  @override
  State<RatingQuestionOptionsWidget> createState() =>
      _RatingQuestionOptionsWidgetState();
}

class _RatingQuestionOptionsWidgetState
    extends State<RatingQuestionOptionsWidget> {
  late RatingQuestionOptionsModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => RatingQuestionOptionsModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.selectedAnswer = [];
      safeSetState(() {});
    });

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: AlignmentDirectional(0.0, -1.0),
      child: Container(
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
          color: FlutterFlowTheme.of(context).primary,
        ),
        child: Padding(
          padding: EdgeInsetsDirectional.fromSTEB(
              valueOrDefault<double>(
                FFAppConstants.horizontalPadding,
                0.0,
              ),
              valueOrDefault<double>(
                FFAppConstants.templateTopPadding,
                0.0,
              ),
              valueOrDefault<double>(
                FFAppConstants.horizontalPadding,
                0.0,
              ),
              0.0),
          child: Column(
            mainAxisSize: MainAxisSize.max,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Align(
                alignment: AlignmentDirectional(0.0, -1.0),
                child: Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 15.0),
                  child: Text(
                    widget.question!,
                    textAlign: TextAlign.center,
                    style: FlutterFlowTheme.of(context).bodyMedium.override(
                          fontFamily: 'Inter',
                          color: FlutterFlowTheme.of(context).textRichBlack,
                          fontSize: () {
                            if (MediaQuery.sizeOf(context).width <
                                kBreakpointSmall) {
                              return 20.0;
                            } else if (MediaQuery.sizeOf(context).width <
                                kBreakpointMedium) {
                              return 24.0;
                            } else if (MediaQuery.sizeOf(context).width <
                                kBreakpointLarge) {
                              return 27.0;
                            } else {
                              return 27.0;
                            }
                          }(),
                          letterSpacing: 0.0,
                          fontWeight: FontWeight.w500,
                        ),
                  ),
                ),
              ),
              if ((widget.subQuestion != null && widget.subQuestion != '') &&
                  responsiveVisibility(
                    context: context,
                    desktop: false,
                  ))
                Align(
                  alignment: AlignmentDirectional(0.0, -1.0),
                  child: Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(20.0, 0.0, 20.0, 0.0),
                    child: Text(
                      widget.subQuestion!,
                      textAlign: TextAlign.center,
                      style: FlutterFlowTheme.of(context).bodyMedium.override(
                            fontFamily: 'Inter',
                            color: FlutterFlowTheme.of(context).textRichBlack,
                            fontSize: 12.0,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.normal,
                          ),
                    ),
                  ),
                ),
              Align(
                alignment: AlignmentDirectional(0.0, -1.0),
                child: Container(
                  width: 500.0,
                  constraints: BoxConstraints(
                    maxWidth: 500.0,
                  ),
                  decoration: BoxDecoration(),
                  child: Column(
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(0.0, 32.0, 0.0, 0.0),
                        child: Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            InkWell(
                              splashColor: Colors.transparent,
                              focusColor: Colors.transparent,
                              hoverColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              onTap: () async {
                                _model.selectedRating = 1;
                                _model.questionId = valueOrDefault<String>(
                                  widget.questionId,
                                  'test',
                                );
                                _model.addToSelectedAnswer('1');
                                _model.question = widget.question;
                                safeSetState(() {});
                                await widget.buttonAction?.call();
                              },
                              child: Container(
                                width: 50.0,
                                height: 50.0,
                                decoration: BoxDecoration(
                                  color: _model.selectedRating == 1
                                      ? FlutterFlowTheme.of(context)
                                          .secondaryViolet
                                      : FlutterFlowTheme.of(context)
                                          .primaryWhite,
                                  boxShadow: [
                                    BoxShadow(
                                      blurRadius: 14.0,
                                      color: Color(0xB3DAE1FE),
                                      offset: Offset(
                                        0.0,
                                        3.0,
                                      ),
                                      spreadRadius: 0.0,
                                    )
                                  ],
                                  borderRadius: BorderRadius.circular(8.0),
                                  border: Border.all(
                                    color: _model.selectedRating == 1
                                        ? FlutterFlowTheme.of(context)
                                            .secondaryPlum
                                        : FlutterFlowTheme.of(context)
                                            .transparent,
                                  ),
                                ),
                                child: Align(
                                  alignment: AlignmentDirectional(0.0, 0.0),
                                  child: Text(
                                    '1',
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          color: FlutterFlowTheme.of(context)
                                              .textRichBlack,
                                          fontSize: 16.0,
                                          letterSpacing: 0.0,
                                        ),
                                  ),
                                ),
                              ),
                            ),
                            InkWell(
                              splashColor: Colors.transparent,
                              focusColor: Colors.transparent,
                              hoverColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              onTap: () async {
                                _model.selectedRating = 2;
                                _model.questionId = widget.questionId;
                                _model.addToSelectedAnswer('2');
                                _model.question = widget.question;
                                safeSetState(() {});
                                await widget.buttonAction?.call();
                              },
                              child: Container(
                                width: 50.0,
                                height: 50.0,
                                decoration: BoxDecoration(
                                  color: _model.selectedRating == 2
                                      ? FlutterFlowTheme.of(context)
                                          .secondaryViolet
                                      : FlutterFlowTheme.of(context)
                                          .primaryWhite,
                                  boxShadow: [
                                    BoxShadow(
                                      blurRadius: 14.0,
                                      color: Color(0xB3DAE1FE),
                                      offset: Offset(
                                        0.0,
                                        3.0,
                                      ),
                                      spreadRadius: 0.0,
                                    )
                                  ],
                                  borderRadius: BorderRadius.circular(8.0),
                                  border: Border.all(
                                    color: _model.selectedRating == 2
                                        ? FlutterFlowTheme.of(context)
                                            .secondaryPlum
                                        : FlutterFlowTheme.of(context)
                                            .transparent,
                                  ),
                                ),
                                child: Align(
                                  alignment: AlignmentDirectional(0.0, 0.0),
                                  child: Text(
                                    '2',
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          color: FlutterFlowTheme.of(context)
                                              .textRichBlack,
                                          fontSize: 16.0,
                                          letterSpacing: 0.0,
                                        ),
                                  ),
                                ),
                              ),
                            ),
                            InkWell(
                              splashColor: Colors.transparent,
                              focusColor: Colors.transparent,
                              hoverColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              onTap: () async {
                                _model.selectedRating = 3;
                                _model.questionId = widget.questionId;
                                _model.addToSelectedAnswer('3');
                                _model.question = widget.question;
                                safeSetState(() {});
                                await widget.buttonAction?.call();
                              },
                              child: Container(
                                width: 50.0,
                                height: 50.0,
                                decoration: BoxDecoration(
                                  color: _model.selectedRating == 3
                                      ? FlutterFlowTheme.of(context)
                                          .secondaryViolet
                                      : FlutterFlowTheme.of(context)
                                          .primaryWhite,
                                  boxShadow: [
                                    BoxShadow(
                                      blurRadius: 14.0,
                                      color: Color(0xB3DAE1FE),
                                      offset: Offset(
                                        0.0,
                                        3.0,
                                      ),
                                      spreadRadius: 0.0,
                                    )
                                  ],
                                  borderRadius: BorderRadius.circular(8.0),
                                  border: Border.all(
                                    color: _model.selectedRating == 3
                                        ? FlutterFlowTheme.of(context)
                                            .secondaryPlum
                                        : FlutterFlowTheme.of(context)
                                            .transparent,
                                  ),
                                ),
                                child: Align(
                                  alignment: AlignmentDirectional(0.0, 0.0),
                                  child: Text(
                                    '3',
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          color: FlutterFlowTheme.of(context)
                                              .textRichBlack,
                                          fontSize: 16.0,
                                          letterSpacing: 0.0,
                                        ),
                                  ),
                                ),
                              ),
                            ),
                            InkWell(
                              splashColor: Colors.transparent,
                              focusColor: Colors.transparent,
                              hoverColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              onTap: () async {
                                _model.selectedRating = 4;
                                _model.questionId = widget.questionId;
                                _model.addToSelectedAnswer('4');
                                _model.question = widget.question;
                                safeSetState(() {});
                                await widget.buttonAction?.call();
                              },
                              child: Container(
                                width: 50.0,
                                height: 50.0,
                                decoration: BoxDecoration(
                                  color: _model.selectedRating == 4
                                      ? FlutterFlowTheme.of(context)
                                          .secondaryViolet
                                      : FlutterFlowTheme.of(context)
                                          .primaryWhite,
                                  boxShadow: [
                                    BoxShadow(
                                      blurRadius: 14.0,
                                      color: Color(0xB3DAE1FE),
                                      offset: Offset(
                                        0.0,
                                        3.0,
                                      ),
                                      spreadRadius: 0.0,
                                    )
                                  ],
                                  borderRadius: BorderRadius.circular(8.0),
                                  border: Border.all(
                                    color: _model.selectedRating == 4
                                        ? FlutterFlowTheme.of(context)
                                            .secondaryPlum
                                        : FlutterFlowTheme.of(context)
                                            .transparent,
                                  ),
                                ),
                                child: Align(
                                  alignment: AlignmentDirectional(0.0, 0.0),
                                  child: Text(
                                    '4',
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          color: FlutterFlowTheme.of(context)
                                              .textRichBlack,
                                          fontSize: 16.0,
                                          letterSpacing: 0.0,
                                        ),
                                  ),
                                ),
                              ),
                            ),
                            InkWell(
                              splashColor: Colors.transparent,
                              focusColor: Colors.transparent,
                              hoverColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              onTap: () async {
                                _model.selectedRating = 5;
                                _model.questionId = widget.questionId;
                                _model.addToSelectedAnswer('5');
                                _model.question = widget.question;
                                safeSetState(() {});
                                await widget.buttonAction?.call();
                              },
                              child: Container(
                                width: 50.0,
                                height: 50.0,
                                decoration: BoxDecoration(
                                  color: _model.selectedRating == 5
                                      ? FlutterFlowTheme.of(context)
                                          .secondaryViolet
                                      : FlutterFlowTheme.of(context)
                                          .primaryWhite,
                                  boxShadow: [
                                    BoxShadow(
                                      blurRadius: 14.0,
                                      color: Color(0xB3DAE1FE),
                                      offset: Offset(
                                        0.0,
                                        3.0,
                                      ),
                                      spreadRadius: 0.0,
                                    )
                                  ],
                                  borderRadius: BorderRadius.circular(8.0),
                                  border: Border.all(
                                    color: _model.selectedRating == 5
                                        ? FlutterFlowTheme.of(context)
                                            .secondaryPlum
                                        : FlutterFlowTheme.of(context)
                                            .transparent,
                                  ),
                                ),
                                child: Align(
                                  alignment: AlignmentDirectional(0.0, 0.0),
                                  child: Text(
                                    '5',
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          color: FlutterFlowTheme.of(context)
                                              .textRichBlack,
                                          fontSize: 16.0,
                                          letterSpacing: 0.0,
                                        ),
                                  ),
                                ),
                              ),
                            ),
                          ].divide(SizedBox(width: 5.0)),
                        ),
                      ),
                      Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(0.0, 15.0, 0.0, 0.0),
                        child: Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Not at all',
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Inter',
                                    color: FlutterFlowTheme.of(context)
                                        .textRichBlack,
                                    fontSize: 14.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w500,
                                  ),
                            ),
                            Text(
                              'Totally',
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Inter',
                                    color: FlutterFlowTheme.of(context)
                                        .textRichBlack,
                                    fontSize: 14.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w500,
                                  ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
