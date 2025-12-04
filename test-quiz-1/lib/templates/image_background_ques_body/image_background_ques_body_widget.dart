import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'dart:ui';
import '/custom_code/actions/index.dart' as actions;
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'image_background_ques_body_model.dart';
export 'image_background_ques_body_model.dart';

/// Question with Image entire background.
class ImageBackgroundQuesBodyWidget extends StatefulWidget {
  const ImageBackgroundQuesBodyWidget({
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
    String? image,
    required this.answerAction3,
    required this.answer3,
    this.questionId,
  })  : this.logoShow = logoShow ?? true,
        this.image = image ??
            'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66bde2fe72c37fa3520283e2_Quiz%20Start%20Screen%201.webp';

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

  /// background image
  final String image;

  final Future Function()? answerAction3;
  final String? answer3;
  final String? questionId;

  @override
  State<ImageBackgroundQuesBodyWidget> createState() =>
      _ImageBackgroundQuesBodyWidgetState();
}

class _ImageBackgroundQuesBodyWidgetState
    extends State<ImageBackgroundQuesBodyWidget> with TickerProviderStateMixin {
  late ImageBackgroundQuesBodyModel _model;

  final animationsMap = <String, AnimationInfo>{};

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => ImageBackgroundQuesBodyModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.selectedAnswer = [];
      safeSetState(() {});
      await actions.trackGAEvent(
        'Quiz Viewed',
        _model.questionId,
        widget.question,
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

    return Stack(
      children: [
        if (() {
          if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
            return false;
          } else if (MediaQuery.sizeOf(context).width < kBreakpointMedium) {
            return false;
          } else if (MediaQuery.sizeOf(context).width < kBreakpointLarge) {
            return false;
          } else {
            return true;
          }
        }())
          ClipRect(
            child: ImageFiltered(
              imageFilter: ImageFilter.blur(
                sigmaX: 10.0,
                sigmaY: 10.0,
              ),
              child: Opacity(
                opacity: 0.7,
                child: Container(
                  decoration: BoxDecoration(
                    color: FlutterFlowTheme.of(context).accent2,
                  ),
                  child: Opacity(
                    opacity: 0.3,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8.0),
                      child: Image.network(
                        valueOrDefault<String>(
                          widget.image,
                          'https://assets.hairqare.co/sarah-quiz-start-cover.webp',
                        ),
                        width: double.infinity,
                        height: double.infinity,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        Align(
          alignment: AlignmentDirectional(0.0, 0.0),
          child: Container(
            width: double.infinity,
            height: double.infinity,
            constraints: BoxConstraints(
              maxWidth: () {
                if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
                  return 500.0;
                } else if (MediaQuery.sizeOf(context).width <
                    kBreakpointMedium) {
                  return double.infinity;
                } else if (MediaQuery.sizeOf(context).width <
                    kBreakpointLarge) {
                  return 500.0;
                } else {
                  return 500.0;
                }
              }(),
            ),
            decoration: BoxDecoration(
              color: FlutterFlowTheme.of(context).secondaryBackground,
              image: DecorationImage(
                fit: BoxFit.cover,
                image: Image.network(
                  valueOrDefault<String>(
                    widget.image,
                    'https://assets.hairqare.co/sarah-quiz-start-cover.webp',
                  ),
                ).image,
              ),
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
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      if (widget.logoShow == true)
                        ClipRRect(
                          borderRadius: BorderRadius.circular(0.0),
                          child: Image.network(
                            'https://assets.hairqare.co/Hairqare_white_logo_1.webp',
                            width: () {
                              if (MediaQuery.sizeOf(context).width <
                                  kBreakpointSmall) {
                                return 80.0;
                              } else if (MediaQuery.sizeOf(context).width <
                                  kBreakpointMedium) {
                                return 100.0;
                              } else if (MediaQuery.sizeOf(context).width <
                                  kBreakpointLarge) {
                                return 100.0;
                              } else {
                                return 100.0;
                              }
                            }(),
                            height: () {
                              if (MediaQuery.sizeOf(context).width <
                                  kBreakpointSmall) {
                                return 18.0;
                              } else if (MediaQuery.sizeOf(context).width <
                                  kBreakpointMedium) {
                                return 20.0;
                              } else if (MediaQuery.sizeOf(context).width <
                                  kBreakpointLarge) {
                                return 20.0;
                              } else {
                                return 20.0;
                              }
                            }(),
                            fit: BoxFit.contain,
                          ),
                        ),
                      Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(0.0, 45.0, 0.0, 0.0),
                        child: Text(
                          widget.question!,
                          textAlign: TextAlign.center,
                          style: FlutterFlowTheme.of(context)
                              .bodyMedium
                              .override(
                                font: GoogleFonts.inter(
                                  fontWeight: FontWeight.w500,
                                  fontStyle: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .fontStyle,
                                ),
                                color:
                                    FlutterFlowTheme.of(context).primaryWhite,
                                fontSize: 27.0,
                                letterSpacing: 0.0,
                                fontWeight: FontWeight.w500,
                                fontStyle: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .fontStyle,
                              ),
                        ),
                      ),
                    ],
                  ),
                  Column(
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(0.0, 45.0, 0.0, 0.0),
                        child: Text(
                          FFLocalizations.of(context).getText(
                            'ixew8z9q' /* Start by selecting your goal: */,
                          ),
                          textAlign: TextAlign.center,
                          style: FlutterFlowTheme.of(context)
                              .bodyMedium
                              .override(
                                font: GoogleFonts.inter(
                                  fontWeight: FontWeight.w500,
                                  fontStyle: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .fontStyle,
                                ),
                                color:
                                    FlutterFlowTheme.of(context).primaryWhite,
                                fontSize: 20.0,
                                letterSpacing: 0.0,
                                fontWeight: FontWeight.w500,
                                fontStyle: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .fontStyle,
                              ),
                        ),
                      ),
                      Icon(
                        Icons.keyboard_arrow_down_sharp,
                        color: FlutterFlowTheme.of(context).primaryWhite,
                        size: 30.0,
                      ).animateOnPageLoad(
                          animationsMap['iconOnPageLoadAnimation']!),
                      Container(
                        constraints: BoxConstraints(
                          maxWidth: 650.0,
                        ),
                        decoration: BoxDecoration(),
                        child: Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 20.0, 0.0, 0.0),
                          child: Row(
                            mainAxisSize: MainAxisSize.max,
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              Expanded(
                                child: Opacity(
                                  opacity: 0.85,
                                  child: InkWell(
                                    splashColor: Colors.transparent,
                                    focusColor: Colors.transparent,
                                    hoverColor: Colors.transparent,
                                    highlightColor: Colors.transparent,
                                    onTap: () async {
                                      _model.selectedAnswer = [];
                                      _model.selectedAnswerId = [];
                                      safeSetState(() {});
                                      _model.addToSelectedAnswer(FFAppState()
                                          .hairGoal
                                          .elementAtOrNull(0)!
                                          .answer);
                                      _model.addToSelectedAnswerId(FFAppState()
                                          .hairGoal
                                          .elementAtOrNull(0)!
                                          .id);
                                      _model.questionId = FFAppState()
                                          .hairGoal
                                          .elementAtOrNull(0)
                                          ?.type;
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
                                    child: AnimatedContainer(
                                      duration: Duration(milliseconds: 200),
                                      curve: Curves.easeIn,
                                      height: () {
                                        if (MediaQuery.sizeOf(context).width <
                                            kBreakpointSmall) {
                                          return 60.0;
                                        } else if (MediaQuery.sizeOf(context)
                                                .width <
                                            kBreakpointMedium) {
                                          return 80.0;
                                        } else if (MediaQuery.sizeOf(context)
                                                .width <
                                            kBreakpointLarge) {
                                          return 80.0;
                                        } else {
                                          return 80.0;
                                        }
                                      }(),
                                      decoration: BoxDecoration(
                                        color: FlutterFlowTheme.of(context)
                                            .secondaryBackground,
                                        borderRadius:
                                            BorderRadius.circular(5.0),
                                      ),
                                      child: Align(
                                        alignment:
                                            AlignmentDirectional(0.0, 0.0),
                                        child: Padding(
                                          padding:
                                              EdgeInsetsDirectional.fromSTEB(
                                                  5.0, 2.0, 5.0, 2.0),
                                          child: AutoSizeText(
                                            valueOrDefault<String>(
                                              FFAppState()
                                                  .hairGoal
                                                  .elementAtOrNull(0)
                                                  ?.answer,
                                              'I want to stop my hair loss',
                                            ),
                                            textAlign: TextAlign.center,
                                            minFontSize: 10.0,
                                            style: FlutterFlowTheme.of(context)
                                                .bodyMedium
                                                .override(
                                                  font: GoogleFonts.inter(
                                                    fontWeight: FontWeight.w500,
                                                    fontStyle:
                                                        FlutterFlowTheme.of(
                                                                context)
                                                            .bodyMedium
                                                            .fontStyle,
                                                  ),
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .textRichBlack,
                                                  fontSize: () {
                                                    if (MediaQuery.sizeOf(
                                                                context)
                                                            .width <
                                                        kBreakpointSmall) {
                                                      return 17.0;
                                                    } else if (MediaQuery
                                                                .sizeOf(context)
                                                            .width <
                                                        kBreakpointMedium) {
                                                      return 19.0;
                                                    } else if (MediaQuery
                                                                .sizeOf(context)
                                                            .width <
                                                        kBreakpointLarge) {
                                                      return 19.0;
                                                    } else {
                                                      return 19.0;
                                                    }
                                                  }(),
                                                  letterSpacing: 0.0,
                                                  fontWeight: FontWeight.w500,
                                                  fontStyle:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .bodyMedium
                                                          .fontStyle,
                                                ),
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
                                  child: InkWell(
                                    splashColor: Colors.transparent,
                                    focusColor: Colors.transparent,
                                    hoverColor: Colors.transparent,
                                    highlightColor: Colors.transparent,
                                    onTap: () async {
                                      _model.selectedAnswer = [];
                                      _model.selectedAnswerId = [];
                                      safeSetState(() {});
                                      _model.addToSelectedAnswer(FFAppState()
                                          .hairGoal
                                          .elementAtOrNull(1)!
                                          .answer);
                                      _model.addToSelectedAnswerId(FFAppState()
                                          .hairGoal
                                          .elementAtOrNull(1)!
                                          .id);
                                      _model.questionId = FFAppState()
                                          .hairGoal
                                          .elementAtOrNull(1)
                                          ?.type;
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
                                    child: AnimatedContainer(
                                      duration: Duration(milliseconds: 200),
                                      curve: Curves.easeIn,
                                      height: () {
                                        if (MediaQuery.sizeOf(context).width <
                                            kBreakpointSmall) {
                                          return 60.0;
                                        } else if (MediaQuery.sizeOf(context)
                                                .width <
                                            kBreakpointMedium) {
                                          return 80.0;
                                        } else if (MediaQuery.sizeOf(context)
                                                .width <
                                            kBreakpointLarge) {
                                          return 80.0;
                                        } else {
                                          return 80.0;
                                        }
                                      }(),
                                      decoration: BoxDecoration(
                                        color: FlutterFlowTheme.of(context)
                                            .secondaryBackground,
                                        borderRadius:
                                            BorderRadius.circular(5.0),
                                      ),
                                      child: Align(
                                        alignment:
                                            AlignmentDirectional(0.0, 0.0),
                                        child: Padding(
                                          padding:
                                              EdgeInsetsDirectional.fromSTEB(
                                                  5.0, 2.0, 5.0, 2.0),
                                          child: AutoSizeText(
                                            valueOrDefault<String>(
                                              FFAppState()
                                                  .hairGoal
                                                  .elementAtOrNull(1)
                                                  ?.answer,
                                              'I want better hair',
                                            ),
                                            textAlign: TextAlign.center,
                                            minFontSize: 10.0,
                                            style: FlutterFlowTheme.of(context)
                                                .bodyMedium
                                                .override(
                                                  font: GoogleFonts.inter(
                                                    fontWeight: FontWeight.w500,
                                                    fontStyle:
                                                        FlutterFlowTheme.of(
                                                                context)
                                                            .bodyMedium
                                                            .fontStyle,
                                                  ),
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .textRichBlack,
                                                  fontSize: () {
                                                    if (MediaQuery.sizeOf(
                                                                context)
                                                            .width <
                                                        kBreakpointSmall) {
                                                      return 17.0;
                                                    } else if (MediaQuery
                                                                .sizeOf(context)
                                                            .width <
                                                        kBreakpointMedium) {
                                                      return 19.0;
                                                    } else if (MediaQuery
                                                                .sizeOf(context)
                                                            .width <
                                                        kBreakpointLarge) {
                                                      return 19.0;
                                                    } else {
                                                      return 19.0;
                                                    }
                                                  }(),
                                                  letterSpacing: 0.0,
                                                  fontWeight: FontWeight.w500,
                                                  fontStyle:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .bodyMedium
                                                          .fontStyle,
                                                ),
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
                        padding: EdgeInsetsDirectional.fromSTEB(
                            0.0, 20.0, 0.0, 20.0),
                        child: Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            InkWell(
                              splashColor: Colors.transparent,
                              focusColor: Colors.transparent,
                              hoverColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              onTap: () async {
                                _model.selectedAnswer = [];
                                _model.selectedAnswerId = [];
                                _model.checkBoxToggle = true;
                                safeSetState(() {});
                                _model.addToSelectedAnswer(FFAppState()
                                    .hairGoal
                                    .elementAtOrNull(2)!
                                    .answer);
                                _model.addToSelectedAnswerId(FFAppState()
                                    .hairGoal
                                    .elementAtOrNull(2)!
                                    .id);
                                _model.questionId = FFAppState()
                                    .hairGoal
                                    .elementAtOrNull(2)
                                    ?.type;
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
                                await widget.answerAction3?.call();
                              },
                              child: Container(
                                decoration: BoxDecoration(),
                                child: Row(
                                  mainAxisSize: MainAxisSize.max,
                                  children: [
                                    Theme(
                                      data: ThemeData(
                                        checkboxTheme: CheckboxThemeData(
                                          visualDensity: VisualDensity.compact,
                                          materialTapTargetSize:
                                              MaterialTapTargetSize.shrinkWrap,
                                          shape: CircleBorder(),
                                        ),
                                        unselectedWidgetColor:
                                            FlutterFlowTheme.of(context)
                                                .backgroundDove,
                                      ),
                                      child: Checkbox(
                                        value: _model.checkboxValue ??=
                                            _model.checkBoxToggle!,
                                        onChanged: (newValue) async {
                                          safeSetState(() =>
                                              _model.checkboxValue = newValue!);
                                          if (newValue!) {
                                            _model.selectedAnswer = [];
                                            _model.selectedAnswerId = [];
                                            _model.checkBoxToggle = true;
                                            safeSetState(() {});
                                            _model.addToSelectedAnswer(
                                                FFAppState()
                                                    .hairGoal
                                                    .elementAtOrNull(2)!
                                                    .answer);
                                            _model.addToSelectedAnswerId(
                                                FFAppState()
                                                    .hairGoal
                                                    .elementAtOrNull(2)!
                                                    .id);
                                            _model.questionId = FFAppState()
                                                .hairGoal
                                                .elementAtOrNull(2)
                                                ?.type;
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
                                            await widget.answerAction3?.call();
                                          }
                                        },
                                        side: (FlutterFlowTheme.of(context)
                                                    .backgroundDove !=
                                                null)
                                            ? BorderSide(
                                                width: 2,
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .backgroundDove,
                                              )
                                            : null,
                                        activeColor:
                                            FlutterFlowTheme.of(context)
                                                .secondaryPlum,
                                        checkColor: FlutterFlowTheme.of(context)
                                            .primaryWhite,
                                      ),
                                    ),
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          5.0, 0.0, 0.0, 0.0),
                                      child: Text(
                                        valueOrDefault<String>(
                                          FFAppState()
                                              .hairGoal
                                              .elementAtOrNull(2)
                                              ?.answer,
                                          'I want BOTH',
                                        ),
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              font: GoogleFonts.inter(
                                                fontWeight: FontWeight.w500,
                                                fontStyle:
                                                    FlutterFlowTheme.of(context)
                                                        .bodyMedium
                                                        .fontStyle,
                                              ),
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .primaryWhite,
                                              fontSize: 19.0,
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.w500,
                                              fontStyle:
                                                  FlutterFlowTheme.of(context)
                                                      .bodyMedium
                                                      .fontStyle,
                                              decoration:
                                                  TextDecoration.underline,
                                              lineHeight: 1.2,
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
                      InkWell(
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
                            padding: EdgeInsetsDirectional.fromSTEB(
                                0.0, 0.0, 0.0, 10.0),
                            child: Text(
                              FFLocalizations.of(context).getText(
                                'r3fmpz9h' /* Skip the Quiz */,
                              ),
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    font: GoogleFonts.inter(
                                      fontWeight: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontWeight,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
                                    ),
                                    color: FlutterFlowTheme.of(context)
                                        .primaryWhite,
                                    fontSize: valueOrDefault<double>(
                                      MediaQuery.sizeOf(context).height < 649.0
                                          ? 14.0
                                          : 16.0,
                                      16.0,
                                    ),
                                    letterSpacing: 0.0,
                                    fontWeight: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontWeight,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontStyle,
                                    decoration: TextDecoration.underline,
                                    lineHeight: 1.2,
                                  ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ).animateOnPageLoad(animationsMap['containerOnPageLoadAnimation']!),
        ),
      ],
    );
  }
}
