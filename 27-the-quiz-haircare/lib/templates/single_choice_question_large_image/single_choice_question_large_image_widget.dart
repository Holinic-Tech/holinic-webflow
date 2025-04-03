import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/custom_code/actions/index.dart' as actions;
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:provider/provider.dart';
import 'single_choice_question_large_image_model.dart';
export 'single_choice_question_large_image_model.dart';

/// Question with single-choice answer.
class SingleChoiceQuestionLargeImageWidget extends StatefulWidget {
  const SingleChoiceQuestionLargeImageWidget({
    super.key,
    required this.question,
    required this.answerData,
    required this.answerAction,
    this.subQuestion,
    required this.questionId,
  });

  final String? question;
  final List<ImageAnswerStruct>? answerData;

  /// Action call back
  final Future Function()? answerAction;

  final String? subQuestion;
  final String? questionId;

  @override
  State<SingleChoiceQuestionLargeImageWidget> createState() =>
      _SingleChoiceQuestionLargeImageWidgetState();
}

class _SingleChoiceQuestionLargeImageWidgetState
    extends State<SingleChoiceQuestionLargeImageWidget>
    with TickerProviderStateMixin {
  late SingleChoiceQuestionLargeImageModel _model;

  final animationsMap = <String, AnimationInfo>{};

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => SingleChoiceQuestionLargeImageModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.selectedAnswer = [];
      safeSetState(() {});
    });

    animationsMap.addAll({
      'containerOnPageLoadAnimation': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          MoveEffect(
            curve: Curves.easeInOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            begin: Offset(30.0, 0.0),
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
          child: ListView(
            padding: EdgeInsets.zero,
            shrinkWrap: true,
            scrollDirection: Axis.vertical,
            children: [
              Align(
                alignment: AlignmentDirectional(0.0, -1.0),
                child: Text(
                  valueOrDefault<String>(
                    widget.question,
                    'question',
                  ),
                  textAlign: TextAlign.center,
                  style: FlutterFlowTheme.of(context).bodyMedium.override(
                        fontFamily: 'Inter',
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
              if (widget.subQuestion != null && widget.subQuestion != '')
                Align(
                  alignment: AlignmentDirectional(0.0, -1.0),
                  child: Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(0.0, 10.0, 0.0, 0.0),
                    child: Text(
                      widget.subQuestion!,
                      textAlign: TextAlign.center,
                      style: FlutterFlowTheme.of(context).bodyMedium.override(
                            fontFamily: 'Inter',
                            fontSize: 16.0,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.normal,
                          ),
                    ),
                  ),
                ),
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(0.0, 32.0, 0.0, 0.0),
                child: Builder(
                  builder: (context) {
                    final imageAnswerDataList = widget.answerData!.toList();

                    return MasonryGridView.builder(
                      gridDelegate:
                          SliverSimpleGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: imageAnswerDataList.length > 6 ? 3 : 2,
                      ),
                      crossAxisSpacing: () {
                        if (MediaQuery.sizeOf(context).width <
                            kBreakpointSmall) {
                          return 10.0;
                        } else if (MediaQuery.sizeOf(context).width <
                            kBreakpointMedium) {
                          return 20.0;
                        } else if (MediaQuery.sizeOf(context).width <
                            kBreakpointLarge) {
                          return 10.0;
                        } else {
                          return 10.0;
                        }
                      }(),
                      mainAxisSpacing: 10.0,
                      itemCount: imageAnswerDataList.length,
                      shrinkWrap: true,
                      itemBuilder: (context, imageAnswerDataListIndex) {
                        final imageAnswerDataListItem =
                            imageAnswerDataList[imageAnswerDataListIndex];
                        return InkWell(
                          splashColor: Colors.transparent,
                          focusColor: Colors.transparent,
                          hoverColor: Colors.transparent,
                          highlightColor: Colors.transparent,
                          onTap: () async {
                            await Future.wait([
                              Future(() async {
                                _model.selectedIndex = imageAnswerDataListIndex;
                                _model
                                    .addToSelectedAnswer(valueOrDefault<String>(
                                  imageAnswerDataListItem.id,
                                  'test',
                                ));
                                _model.questionId = valueOrDefault<String>(
                                  imageAnswerDataListItem.type,
                                  'type',
                                );
                                safeSetState(() {});
                                await actions.trackGAEvent(
                                  'Question Answered',
                                  _model.questionId,
                                  widget.question,
                                  _model.selectedAnswer.toList(),
                                  '',
                                  '',
                                );
                                await widget.answerAction?.call();
                              }),
                            ]);
                          },
                          child: Container(
                            decoration: BoxDecoration(
                              color: _model.selectedIndex ==
                                      imageAnswerDataListIndex
                                  ? FlutterFlowTheme.of(context).secondaryViolet
                                  : FlutterFlowTheme.of(context)
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
                              borderRadius:
                                  BorderRadius.circular(valueOrDefault<double>(
                                imageAnswerDataListItem.image != ''
                                    ? 20.0
                                    : 10.0,
                                0.0,
                              )),
                            ),
                            child: Column(
                              mainAxisSize: MainAxisSize.max,
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                if (imageAnswerDataListItem.image != '')
                                  Container(
                                    width: double.infinity,
                                    height: valueOrDefault<double>(
                                      (FFAppState()
                                                      .answerWithImageChoice
                                                      .length >
                                                  6
                                              ? () {
                                                  if (MediaQuery.sizeOf(context)
                                                          .width <
                                                      kBreakpointSmall) {
                                                    return 85;
                                                  } else if (MediaQuery.sizeOf(
                                                              context)
                                                          .width <
                                                      kBreakpointMedium) {
                                                    return 200;
                                                  } else if (MediaQuery.sizeOf(
                                                              context)
                                                          .width <
                                                      kBreakpointLarge) {
                                                    return 85;
                                                  } else {
                                                    return 85;
                                                  }
                                                }()
                                              : () {
                                                  if (MediaQuery.sizeOf(context)
                                                          .width <
                                                      kBreakpointSmall) {
                                                    return 150;
                                                  } else if (MediaQuery.sizeOf(
                                                              context)
                                                          .width <
                                                      kBreakpointMedium) {
                                                    return 200;
                                                  } else if (MediaQuery.sizeOf(
                                                              context)
                                                          .width <
                                                      kBreakpointLarge) {
                                                    return 150;
                                                  } else {
                                                    return 150;
                                                  }
                                                }())
                                          .toDouble(),
                                      200.0,
                                    ),
                                    decoration: BoxDecoration(
                                      color: FlutterFlowTheme.of(context)
                                          .secondaryBackground,
                                      image: DecorationImage(
                                        fit: BoxFit.cover,
                                        image: Image.network(
                                          imageAnswerDataListItem.image,
                                        ).image,
                                      ),
                                      borderRadius: BorderRadius.only(
                                        bottomLeft: Radius.circular(0.0),
                                        bottomRight: Radius.circular(0.0),
                                        topLeft: Radius.circular(10.0),
                                        topRight: Radius.circular(10.0),
                                      ),
                                    ),
                                  ),
                                Align(
                                  alignment: AlignmentDirectional(0.0, 1.0),
                                  child: Container(
                                    height: () {
                                      if (MediaQuery.sizeOf(context).width <
                                          kBreakpointSmall) {
                                        return 30.0;
                                      } else if (MediaQuery.sizeOf(context)
                                              .width <
                                          kBreakpointMedium) {
                                        return 40.0;
                                      } else if (MediaQuery.sizeOf(context)
                                              .width <
                                          kBreakpointLarge) {
                                        return 30.0;
                                      } else {
                                        return 30.0;
                                      }
                                    }(),
                                    decoration: BoxDecoration(
                                      color: _model.selectedIndex ==
                                              imageAnswerDataListIndex
                                          ? FlutterFlowTheme.of(context).accent2
                                          : FlutterFlowTheme.of(context)
                                              .secondary,
                                      borderRadius: BorderRadius.only(
                                        bottomLeft: Radius.circular(10.0),
                                        bottomRight: Radius.circular(10.0),
                                        topLeft: Radius.circular(0.0),
                                        topRight: Radius.circular(0.0),
                                      ),
                                    ),
                                    child: Align(
                                      alignment: AlignmentDirectional(0.0, 0.0),
                                      child: Padding(
                                        padding: EdgeInsets.all(5.0),
                                        child: Text(
                                          imageAnswerDataListItem.answer,
                                          style: FlutterFlowTheme.of(context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Inter',
                                                color: _model.selectedIndex ==
                                                        imageAnswerDataListIndex
                                                    ? FlutterFlowTheme.of(
                                                            context)
                                                        .primaryText
                                                    : FlutterFlowTheme.of(
                                                            context)
                                                        .primary,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.w500,
                                              ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ).animateOnPageLoad(animationsMap['containerOnPageLoadAnimation']!),
    );
  }
}
