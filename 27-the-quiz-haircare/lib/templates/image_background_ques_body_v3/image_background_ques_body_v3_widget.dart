import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/custom_code/actions/index.dart' as actions;
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import 'image_background_ques_body_v3_model.dart';
export 'image_background_ques_body_v3_model.dart';

/// Question with Image entire background.
class ImageBackgroundQuesBodyV3Widget extends StatefulWidget {
  const ImageBackgroundQuesBodyV3Widget({
    super.key,
    required this.question,
    required this.answer1,
    required this.answer2,
    required this.skipAction,
    required this.checkBoxToggleOn,
    required this.checkBoxToggleOff,
    bool? logoShow,
    required this.answerAction1,
    required this.answerAction2,
    required this.answerImage1,
    required this.answerImage2,
    required this.answerAction3,
    required this.answer3,
    this.selectedAnswer,
    required this.questionId,
    this.aswerImage3,
    this.answerList,
  }) : this.logoShow = logoShow ?? true;

  final String? question;
  final String? answer1;
  final String? answer2;
  final Future Function()? skipAction;

  /// On action of the I want BOTH
  final Future Function()? checkBoxToggleOn;

  /// Off action of the I want BOTH
  final Future Function()? checkBoxToggleOff;

  final bool logoShow;
  final Future Function()? answerAction1;
  final Future Function()? answerAction2;

  /// Imagepath of the answer1
  final String? answerImage1;

  /// Answer Image path
  final String? answerImage2;

  final Future Function()? answerAction3;
  final String? answer3;
  final List<String>? selectedAnswer;
  final String? questionId;
  final String? aswerImage3;
  final List<AnswerStruct>? answerList;

  @override
  State<ImageBackgroundQuesBodyV3Widget> createState() =>
      _ImageBackgroundQuesBodyV3WidgetState();
}

class _ImageBackgroundQuesBodyV3WidgetState
    extends State<ImageBackgroundQuesBodyV3Widget>
    with TickerProviderStateMixin {
  late ImageBackgroundQuesBodyV3Model _model;

  final animationsMap = <String, AnimationInfo>{};

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => ImageBackgroundQuesBodyV3Model());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.selectedAnswer = [];
      safeSetState(() {});
      await actions.trackGAEvent(
        'Quiz Viewed',
        '',
        '',
        FFAppConstants.nonQuestionAnswerItem.toList(),
        '',
        '',
      );
    });

    animationsMap.addAll({
      'containerOnPageLoadAnimation': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          MoveEffect(
            curve: Curves.easeInOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            begin: Offset(0.0, 22.0),
            end: Offset(0.0, 0.0),
          ),
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            begin: 0.11,
            end: 1.0,
          ),
        ],
      ),
      'iconOnPageLoadAnimation': AnimationInfo(
        loop: true,
        reverse: true,
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          VisibilityEffect(duration: 80.ms),
          MoveEffect(
            curve: Curves.easeInOut,
            delay: 80.0.ms,
            duration: 770.0.ms,
            begin: Offset(0.0, 10.0),
            end: Offset(0.0, 0.0),
          ),
        ],
      ),
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
    context.watch<FFAppState>();

    return Align(
      alignment: AlignmentDirectional(0.0, 0.0),
      child: Container(
        width: double.infinity,
        height: double.infinity,
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
          color: FlutterFlowTheme.of(context).secondaryBackground,
        ),
        child: Padding(
          padding: EdgeInsetsDirectional.fromSTEB(
              15.0,
              valueOrDefault<double>(
                () {
                  if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
                    return 40.0;
                  } else if (MediaQuery.sizeOf(context).width <
                      kBreakpointMedium) {
                    return 60.0;
                  } else if (MediaQuery.sizeOf(context).width <
                      kBreakpointLarge) {
                    return 60.0;
                  } else {
                    return 60.0;
                  }
                }(),
                0.0,
              ),
              15.0,
              valueOrDefault<double>(
                () {
                  if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
                    return 40.0;
                  } else if (MediaQuery.sizeOf(context).width <
                      kBreakpointMedium) {
                    return 60.0;
                  } else if (MediaQuery.sizeOf(context).width <
                      kBreakpointLarge) {
                    return 60.0;
                  } else {
                    return 60.0;
                  }
                }(),
                0.0,
              )),
          child: Column(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Align(
                alignment: AlignmentDirectional(0.0, -1.0),
                child: Container(
                  width: MediaQuery.sizeOf(context).width * 1.0,
                  height: 50.0,
                  decoration: BoxDecoration(),
                  alignment: AlignmentDirectional(0.0, -1.0),
                  child: Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(0.0, 10.0, 0.0, 20.0),
                    child: Row(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 90.0,
                          height: 50.0,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(0.0),
                          ),
                          child: Visibility(
                            visible: widget.logoShow,
                            child: Align(
                              alignment: AlignmentDirectional(0.0, -1.0),
                              child: Padding(
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    0.0, 1.0, 0.0, 1.0),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(0.0),
                                  child: Image.network(
                                    'https://assets.hairqare.co/%5BHAIRQARE%5D-%5BLOGO%5D-periwinkle%20copy%202.webp',
                                    fit: BoxFit.contain,
                                    alignment: Alignment(-1.0, 0.0),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        Container(
                          width: 180.0,
                          height: 90.0,
                          decoration: BoxDecoration(
                            color: Color(0xFFE9FAD1),
                            image: DecorationImage(
                              fit: BoxFit.fitWidth,
                              image: Image.network(
                                '',
                              ).image,
                            ),
                            borderRadius: BorderRadius.circular(2.0),
                          ),
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                1.0, 1.0, 0.0, 1.0),
                            child: Row(
                              mainAxisSize: MainAxisSize.max,
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      5.0, 0.0, 0.0, 0.0),
                                  child: Text(
                                    '4.8 out of 5',
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Open Sans',
                                          fontSize: 12.0,
                                          letterSpacing: 0.0,
                                        ),
                                  ),
                                ),
                                Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      5.0, 0.0, 0.0, 0.0),
                                  child: Text(
                                    '|',
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          color: FlutterFlowTheme.of(context)
                                              .alternate,
                                          letterSpacing: 0.0,
                                        ),
                                  ),
                                ),
                                Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      5.0, 0.0, 5.0, 0.0),
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(0.0),
                                    child: Image.network(
                                      'https://assets.hairqare.co/Trustpilot_brandmark_gr-blk_RGB-144x36-M.webp',
                                      fit: BoxFit.cover,
                                      alignment: Alignment(1.0, 0.0),
                                    ),
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
              ),
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(
                    0.0,
                    valueOrDefault<double>(
                      FFAppConstants.templateTopPadding,
                      0.0,
                    ),
                    0.0,
                    0.0),
                child: AutoSizeText(
                  valueOrDefault<String>(
                    widget.question,
                    ' See if the Challenge is a fit for you and your hair profile',
                  ),
                  textAlign: TextAlign.center,
                  minFontSize: 12.0,
                  style: FlutterFlowTheme.of(context).bodyMedium.override(
                        fontFamily: 'Inter',
                        color: FlutterFlowTheme.of(context).primaryText,
                        fontSize: () {
                          if (MediaQuery.sizeOf(context).width <
                              kBreakpointSmall) {
                            return 22.0;
                          } else if (MediaQuery.sizeOf(context).width <
                              kBreakpointMedium) {
                            return 27.0;
                          } else if (MediaQuery.sizeOf(context).width <
                              kBreakpointLarge) {
                            return 27.0;
                          } else {
                            return 27.0;
                          }
                        }(),
                        letterSpacing: 0.0,
                        fontWeight: FontWeight.w600,
                      ),
                ),
              ),
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(0.0, 45.0, 0.0, 0.0),
                child: AutoSizeText(
                  'Start by selecting your goal:',
                  textAlign: TextAlign.center,
                  minFontSize: 10.0,
                  style: FlutterFlowTheme.of(context).bodyMedium.override(
                        fontFamily: 'Inter',
                        color: FlutterFlowTheme.of(context).secondary,
                        fontSize: 14.0,
                        letterSpacing: 0.0,
                        fontWeight: FontWeight.w500,
                      ),
                ),
              ),
              Icon(
                Icons.keyboard_arrow_down_sharp,
                color: FlutterFlowTheme.of(context).primaryText,
                size: 30.0,
              ).animateOnPageLoad(animationsMap['iconOnPageLoadAnimation']!),
              Container(
                constraints: BoxConstraints(
                  maxWidth: 650.0,
                ),
                decoration: BoxDecoration(),
                child: Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 20.0, 0.0, 0.0),
                  child: Row(
                    mainAxisSize: MainAxisSize.max,
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Expanded(
                        child: Opacity(
                          opacity: 0.85,
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                valueOrDefault<double>(
                                  () {
                                    if (MediaQuery.sizeOf(context).width <
                                        kBreakpointSmall) {
                                      return 0.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointMedium) {
                                      return 10.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointLarge) {
                                      return 10.0;
                                    } else {
                                      return 10.0;
                                    }
                                  }(),
                                  0.0,
                                ),
                                10.0,
                                valueOrDefault<double>(
                                  () {
                                    if (MediaQuery.sizeOf(context).width <
                                        kBreakpointSmall) {
                                      return 0.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointMedium) {
                                      return 10.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointLarge) {
                                      return 10.0;
                                    } else {
                                      return 10.0;
                                    }
                                  }(),
                                  0.0,
                                ),
                                10.0),
                            child: InkWell(
                              splashColor: Colors.transparent,
                              focusColor: Colors.transparent,
                              hoverColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              onTap: () async {
                                _model.selectedIndex = 1;
                                _model.questionId = widget.questionId;
                                _model.addToSelectedAnswerId(FFAppState()
                                    .hairGoal
                                    .elementAtOrNull(0)!
                                    .id);
                                _model.addToSelectedAnswer(FFAppState()
                                    .hairGoal
                                    .elementAtOrNull(0)!
                                    .answer);
                                safeSetState(() {});
                                await actions.trackGAEvent(
                                  'Quiz Started',
                                  widget.questionId,
                                  widget.question,
                                  _model.selectedAnswerId.toList(),
                                  '',
                                  '',
                                );
                                await actions.trackGAEvent(
                                  'Question Answered',
                                  widget.questionId,
                                  widget.question,
                                  _model.selectedAnswerId.toList(),
                                  '',
                                  '',
                                );
                                await widget.answerAction1?.call();
                              },
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(20.0),
                                child: Container(
                                  height: () {
                                    if (MediaQuery.sizeOf(context).width <
                                        kBreakpointSmall) {
                                      return 180.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointMedium) {
                                      return 200.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointLarge) {
                                      return 200.0;
                                    } else {
                                      return 200.0;
                                    }
                                  }(),
                                  decoration: BoxDecoration(
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryBackground,
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
                                    borderRadius: BorderRadius.circular(20.0),
                                    border: Border.all(
                                      color: _model.selectedIndex == 1
                                          ? FlutterFlowTheme.of(context)
                                              .secondaryPlum
                                          : FlutterFlowTheme.of(context)
                                              .transparent,
                                      width: 2.0,
                                    ),
                                  ),
                                  child: Column(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    children: [
                                      Expanded(
                                        child: Container(
                                          width: double.infinity,
                                          decoration: BoxDecoration(
                                            color: FlutterFlowTheme.of(context)
                                                .secondaryBackground,
                                            image: DecorationImage(
                                              fit: BoxFit.cover,
                                              image: Image.network(
                                                valueOrDefault<String>(
                                                  widget.answerImage1,
                                                  'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/62cbaa353a301e2df7aa36c9_sarah-tran-holiniq-hairqare-2.webp',
                                                ),
                                              ).image,
                                            ),
                                            borderRadius: BorderRadius.only(
                                              bottomLeft: Radius.circular(0.0),
                                              bottomRight: Radius.circular(0.0),
                                              topLeft: Radius.circular(20.0),
                                              topRight: Radius.circular(20.0),
                                            ),
                                          ),
                                        ),
                                      ),
                                      Align(
                                        alignment:
                                            AlignmentDirectional(0.0, 0.0),
                                        child: Container(
                                          width:
                                              MediaQuery.sizeOf(context).width *
                                                  1.0,
                                          decoration: BoxDecoration(
                                            color: FlutterFlowTheme.of(context)
                                                .secondary,
                                            borderRadius: BorderRadius.only(
                                              bottomLeft: Radius.circular(20.0),
                                              bottomRight:
                                                  Radius.circular(20.0),
                                              topLeft: Radius.circular(0.0),
                                              topRight: Radius.circular(0.0),
                                            ),
                                          ),
                                          child: Padding(
                                            padding: EdgeInsets.all(5.0),
                                            child: Text(
                                              valueOrDefault<String>(
                                                FFAppState()
                                                    .hairGoal
                                                    .elementAtOrNull(0)
                                                    ?.answer,
                                                'Stop hair loss and thinning',
                                              ),
                                              textAlign: TextAlign.center,
                                              style: FlutterFlowTheme.of(
                                                      context)
                                                  .bodyMedium
                                                  .override(
                                                    fontFamily: 'Inter',
                                                    color: FlutterFlowTheme.of(
                                                            context)
                                                        .primary,
                                                    fontSize: 16.0,
                                                    letterSpacing: 0.0,
                                                    fontWeight: FontWeight.w500,
                                                  ),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: Opacity(
                          opacity: 0.85,
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                valueOrDefault<double>(
                                  () {
                                    if (MediaQuery.sizeOf(context).width <
                                        kBreakpointSmall) {
                                      return 0.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointMedium) {
                                      return 10.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointLarge) {
                                      return 10.0;
                                    } else {
                                      return 10.0;
                                    }
                                  }(),
                                  0.0,
                                ),
                                10.0,
                                valueOrDefault<double>(
                                  () {
                                    if (MediaQuery.sizeOf(context).width <
                                        kBreakpointSmall) {
                                      return 0.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointMedium) {
                                      return 10.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointLarge) {
                                      return 10.0;
                                    } else {
                                      return 10.0;
                                    }
                                  }(),
                                  0.0,
                                ),
                                10.0),
                            child: InkWell(
                              splashColor: Colors.transparent,
                              focusColor: Colors.transparent,
                              hoverColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              onTap: () async {
                                _model.selectedIndex = 2;
                                _model.questionId = widget.questionId;
                                _model.addToSelectedAnswerId(FFAppState()
                                    .hairGoal
                                    .elementAtOrNull(1)!
                                    .id);
                                _model.addToSelectedAnswer(FFAppState()
                                    .hairGoal
                                    .elementAtOrNull(1)!
                                    .answer);
                                safeSetState(() {});
                                await actions.trackGAEvent(
                                  'Quiz Started',
                                  widget.questionId,
                                  widget.question,
                                  _model.selectedAnswerId.toList(),
                                  '',
                                  '',
                                );
                                await actions.trackGAEvent(
                                  'Question Answered',
                                  widget.questionId,
                                  widget.question,
                                  _model.selectedAnswerId.toList(),
                                  '',
                                  '',
                                );
                                await widget.answerAction2?.call();
                              },
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(20.0),
                                child: Container(
                                  height: () {
                                    if (MediaQuery.sizeOf(context).width <
                                        kBreakpointSmall) {
                                      return 180.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointMedium) {
                                      return 200.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointLarge) {
                                      return 200.0;
                                    } else {
                                      return 200.0;
                                    }
                                  }(),
                                  decoration: BoxDecoration(
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryBackground,
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
                                    borderRadius: BorderRadius.circular(20.0),
                                    border: Border.all(
                                      color: _model.selectedIndex == 2
                                          ? FlutterFlowTheme.of(context)
                                              .secondaryPlum
                                          : FlutterFlowTheme.of(context)
                                              .transparent,
                                      width: 2.0,
                                    ),
                                  ),
                                  child: Column(
                                    mainAxisSize: MainAxisSize.max,
                                    children: [
                                      Expanded(
                                        child: Container(
                                          width: double.infinity,
                                          decoration: BoxDecoration(
                                            color: FlutterFlowTheme.of(context)
                                                .secondaryBackground,
                                            image: DecorationImage(
                                              fit: BoxFit.cover,
                                              image: Image.network(
                                                valueOrDefault<String>(
                                                  widget.answerImage2,
                                                  'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/62cbaa353a301e2df7aa36c9_sarah-tran-holiniq-hairqare-2.webp',
                                                ),
                                              ).image,
                                            ),
                                            borderRadius: BorderRadius.only(
                                              bottomLeft: Radius.circular(0.0),
                                              bottomRight: Radius.circular(0.0),
                                              topLeft: Radius.circular(20.0),
                                              topRight: Radius.circular(20.0),
                                            ),
                                          ),
                                        ),
                                      ),
                                      Align(
                                        alignment:
                                            AlignmentDirectional(0.0, 0.0),
                                        child: Container(
                                          width:
                                              MediaQuery.sizeOf(context).width *
                                                  1.0,
                                          decoration: BoxDecoration(
                                            color: FlutterFlowTheme.of(context)
                                                .secondary,
                                            borderRadius: BorderRadius.only(
                                              bottomLeft: Radius.circular(20.0),
                                              bottomRight:
                                                  Radius.circular(20.0),
                                              topLeft: Radius.circular(0.0),
                                              topRight: Radius.circular(0.0),
                                            ),
                                          ),
                                          child: Padding(
                                            padding: EdgeInsets.all(5.0),
                                            child: Text(
                                              valueOrDefault<String>(
                                                FFAppState()
                                                    .hairGoal
                                                    .elementAtOrNull(1)
                                                    ?.answer,
                                                'Longer, better looking hair',
                                              ),
                                              textAlign: TextAlign.center,
                                              style: FlutterFlowTheme.of(
                                                      context)
                                                  .bodyMedium
                                                  .override(
                                                    fontFamily: 'Inter',
                                                    color: FlutterFlowTheme.of(
                                                            context)
                                                        .primary,
                                                    fontSize: 16.0,
                                                    letterSpacing: 0.0,
                                                    fontWeight: FontWeight.w500,
                                                  ),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ]
                        .divide(SizedBox(width: () {
                          if (MediaQuery.sizeOf(context).width <
                              kBreakpointSmall) {
                            return 20.0;
                          } else if (MediaQuery.sizeOf(context).width <
                              kBreakpointMedium) {
                            return 22.0;
                          } else if (MediaQuery.sizeOf(context).width <
                              kBreakpointLarge) {
                            return 22.0;
                          } else {
                            return 22.0;
                          }
                        }()))
                        .addToStart(SizedBox(width: 10.0))
                        .addToEnd(SizedBox(width: 10.0)),
                  ),
                ),
              ),
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(0.0, 10.0, 0.0, 10.0),
                child: Container(
                  width: 220.0,
                  decoration: BoxDecoration(),
                  child: FFButtonWidget(
                    onPressed: () async {
                      _model.selectedIndex = 3;
                      _model.questionId = widget.questionId;
                      _model.addToSelectedAnswer(
                          (widget.answerList!.elementAtOrNull(2))!.answer);
                      _model.addToSelectedAnswerId(
                          (widget.answerList!.elementAtOrNull(2))!.id);
                      safeSetState(() {});
                      await actions.trackGAEvent(
                        'Quiz Started',
                        widget.questionId,
                        widget.question,
                        _model.selectedAnswerId.toList(),
                        '',
                        '',
                      );
                      await actions.trackGAEvent(
                        'Question Answered',
                        widget.questionId,
                        widget.question,
                        _model.selectedAnswerId.toList(),
                        '',
                        '',
                      );
                      await widget.answerAction2?.call();
                    },
                    text: FFAppState().hairGoal.elementAtOrNull(2)!.answer,
                    options: FFButtonOptions(
                      height: 40.0,
                      padding:
                          EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
                      iconPadding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                      color: FlutterFlowTheme.of(context).orange,
                      textStyle:
                          FlutterFlowTheme.of(context).titleSmall.override(
                                fontFamily: 'Inter',
                                color: FlutterFlowTheme.of(context).primary,
                                letterSpacing: 0.0,
                              ),
                      elevation: 0.0,
                      borderRadius: BorderRadius.circular(8.0),
                      hoverColor: FlutterFlowTheme.of(context).accentTangerine,
                    ),
                  ),
                ),
              ),
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(0.0, 10.0, 0.0, 0.0),
                child: InkWell(
                  splashColor: Colors.transparent,
                  focusColor: Colors.transparent,
                  hoverColor: Colors.transparent,
                  highlightColor: Colors.transparent,
                  onTap: () async {
                    await widget.skipAction?.call();
                  },
                  child: Container(
                    decoration: BoxDecoration(),
                    child: Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 10.0),
                      child: Text(
                        'Skip the quiz',
                        style: FlutterFlowTheme.of(context).bodyMedium.override(
                              fontFamily: 'Inter',
                              color: FlutterFlowTheme.of(context).primaryText,
                              fontSize: 16.0,
                              letterSpacing: 0.0,
                              decoration: TextDecoration.underline,
                              lineHeight: 1.2,
                            ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ).animateOnPageLoad(animationsMap['containerOnPageLoadAnimation']!),
    );
  }
}
