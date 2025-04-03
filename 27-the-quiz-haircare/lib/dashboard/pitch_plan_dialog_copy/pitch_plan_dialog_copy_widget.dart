import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_timer.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/custom_code/actions/index.dart' as actions;
import 'package:stop_watch_timer/stop_watch_timer.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:provider/provider.dart';
import 'pitch_plan_dialog_copy_model.dart';
export 'pitch_plan_dialog_copy_model.dart';

/// Personal plan dialog
///
class PitchPlanDialogCopyWidget extends StatefulWidget {
  const PitchPlanDialogCopyWidget({super.key});

  @override
  State<PitchPlanDialogCopyWidget> createState() =>
      _PitchPlanDialogCopyWidgetState();
}

class _PitchPlanDialogCopyWidgetState extends State<PitchPlanDialogCopyWidget> {
  late PitchPlanDialogCopyModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => PitchPlanDialogCopyModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.timerController.onStartTimer();
    });

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    // On component dispose action.
    () async {
      FFAppState().showDlfBanner = !(FFAppState().showDlfBanner ?? true);
      safeSetState(() {});
      await actions.trackGAEvent(
        'Closed Plan Details',
        '',
        '',
        FFAppConstants.nonQuestionAnswerItem.toList(),
        '',
        '',
      );
      context.safePop();
    }();

    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    context.watch<FFAppState>();

    return Align(
      alignment: AlignmentDirectional(0.0, 0.0),
      child: Container(
        width: 500.0,
        decoration: BoxDecoration(
          color: FlutterFlowTheme.of(context).primaryWhite,
          borderRadius: BorderRadius.circular(10.0),
        ),
        child: Padding(
          padding: EdgeInsets.all(20.0),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.max,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    InkWell(
                      splashColor: Colors.transparent,
                      focusColor: Colors.transparent,
                      hoverColor: Colors.transparent,
                      highlightColor: Colors.transparent,
                      onTap: () async {
                        FFAppState().showDlfBanner =
                            !(FFAppState().showDlfBanner ?? true);
                        safeSetState(() {});
                        await actions.trackGAEvent(
                          'Closed Plan Details',
                          '',
                          '',
                          FFAppConstants.nonQuestionAnswerItem.toList(),
                          '',
                          '',
                        );
                        context.safePop();
                      },
                      child: Container(
                        width: 25.0,
                        height: 25.0,
                        decoration: BoxDecoration(
                          color: FlutterFlowTheme.of(context).secondaryViolet,
                          borderRadius: BorderRadius.circular(5.0),
                        ),
                        child: Icon(
                          Icons.close,
                          color: Color(0x863A2D32),
                          size: 22.0,
                        ),
                      ),
                    ),
                    Text(
                      'Your Haircare Challenge Plan',
                      style: FlutterFlowTheme.of(context).bodyMedium.override(
                            fontFamily: 'Inter',
                            fontSize: 16.0,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                    Container(
                      width: 10.0,
                      height: 10.0,
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).secondaryBackground,
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 15.0, 0.0, 15.0),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(10.0),
                    child: Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).secondaryViolet,
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.max,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Container(
                            width: double.infinity,
                            decoration: BoxDecoration(
                              color: FlutterFlowTheme.of(context).secondary,
                            ),
                            child: Padding(
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  7.0, 12.0, 7.0, 12.0),
                              child: Row(
                                mainAxisSize: MainAxisSize.max,
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  RichText(
                                    textScaler:
                                        MediaQuery.of(context).textScaler,
                                    text: TextSpan(
                                      children: [
                                        TextSpan(
                                          text: 'YOUR DISCOUNT',
                                          style: FlutterFlowTheme.of(context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Inter',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .primaryWhite,
                                                fontSize: 12.0,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.w600,
                                              ),
                                        ),
                                        TextSpan(
                                          text: ' RESERVED FOR',
                                          style: FlutterFlowTheme.of(context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Inter',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .primary,
                                                fontSize: 12.0,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.normal,
                                              ),
                                        )
                                      ],
                                      style: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .override(
                                            fontFamily: 'Inter',
                                            letterSpacing: 0.0,
                                          ),
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        0.0, 0.0, 15.0, 0.0),
                                    child: FlutterFlowTimer(
                                      initialTime: _model.timerInitialTimeMs,
                                      getDisplayTime: (value) =>
                                          StopWatchTimer.getDisplayTime(
                                        value,
                                        hours: false,
                                        milliSecond: false,
                                      ),
                                      controller: _model.timerController,
                                      updateStateInterval:
                                          Duration(milliseconds: 1000),
                                      onChanged:
                                          (value, displayTime, shouldUpdate) {
                                        _model.timerMilliseconds = value;
                                        _model.timerValue = displayTime;
                                        if (shouldUpdate) safeSetState(() {});
                                      },
                                      textAlign: TextAlign.start,
                                      style: FlutterFlowTheme.of(context)
                                          .headlineSmall
                                          .override(
                                            fontFamily: 'Inter',
                                            color: FlutterFlowTheme.of(context)
                                                .primary,
                                            fontSize: 14.0,
                                            letterSpacing: 0.0,
                                          ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          Column(
                            mainAxisSize: MainAxisSize.max,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Padding(
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    0.0, 10.0, 0.0, 10.0),
                                child: Row(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceAround,
                                  children: [
                                    Text(
                                      '14 Day Plan',
                                      style: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .override(
                                            fontFamily: 'Inter',
                                            fontSize: 15.0,
                                            letterSpacing: 0.0,
                                            fontWeight: FontWeight.w600,
                                          ),
                                    ),
                                    Text(
                                      'Full Access',
                                      style: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .override(
                                            fontFamily: 'Inter',
                                            color: FlutterFlowTheme.of(context)
                                                .secondaryText,
                                            fontSize: 15.0,
                                            letterSpacing: 0.0,
                                            fontWeight: FontWeight.normal,
                                          ),
                                    ),
                                  ],
                                ),
                              ),
                              Padding(
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    0.0, 0.0, 0.0, 10.0),
                                child: Row(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceEvenly,
                                  children: [
                                    Flexible(
                                      child: Container(
                                        width: 100.0,
                                        height: 50.0,
                                        decoration: BoxDecoration(
                                          color: FlutterFlowTheme.of(context)
                                              .secondaryBackground,
                                          image: DecorationImage(
                                            fit: BoxFit.cover,
                                            image: Image.network(
                                              'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/62cbaa353a301ee4ebaa36ce_IMG_1173-scaled-p-500.jpeg',
                                            ).image,
                                          ),
                                          borderRadius:
                                              BorderRadius.circular(10.0),
                                        ),
                                      ),
                                    ),
                                    Flexible(
                                      child: Column(
                                        mainAxisSize: MainAxisSize.max,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.center,
                                        children: [
                                          Text(
                                            () {
                                              if (FFAppState()
                                                  .quizProfile
                                                  .qaPairs
                                                  .contains(
                                                      QuestionAnswerPairStruct(
                                                    questionId: 'hairConcern',
                                                    answerIds: [
                                                      'concern_hairloss'
                                                    ],
                                                  ))) {
                                                return 'Hair loss focus';
                                              } else if (FFAppState()
                                                  .quizProfile
                                                  .qaPairs
                                                  .contains(
                                                      QuestionAnswerPairStruct(
                                                    questionId: 'hairConcern',
                                                    answerIds: [
                                                      'concern_splitends'
                                                    ],
                                                  ))) {
                                                return 'Split-ends focus';
                                              } else if (FFAppState()
                                                  .quizProfile
                                                  .qaPairs
                                                  .contains(
                                                      QuestionAnswerPairStruct(
                                                    questionId: 'hairConcern',
                                                    answerIds: [
                                                      'concern_scalp'
                                                    ],
                                                  ))) {
                                                return 'Scalp focus';
                                              } else if (FFAppState()
                                                  .quizProfile
                                                  .qaPairs
                                                  .contains(
                                                      QuestionAnswerPairStruct(
                                                    questionId: 'hairConcern',
                                                    answerIds: [
                                                      'concern_damage'
                                                    ],
                                                  ))) {
                                                return 'Damaged hair focus';
                                              } else {
                                                return 'Mixed focus';
                                              }
                                            }(),
                                            style: FlutterFlowTheme.of(context)
                                                .bodyMedium
                                                .override(
                                                  fontFamily: 'Inter',
                                                  fontSize: 14.0,
                                                  letterSpacing: 0.0,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                          ),
                                          Text(
                                            () {
                                              if (FFAppState()
                                                  .quizProfile
                                                  .qaPairs
                                                  .contains(
                                                      QuestionAnswerPairStruct(
                                                    questionId: 'hairConcern',
                                                    answerIds: [
                                                      'concern_hairloss'
                                                    ],
                                                  ))) {
                                                return 'Hair loss focus';
                                              } else if (FFAppState()
                                                  .quizProfile
                                                  .qaPairs
                                                  .contains(
                                                      QuestionAnswerPairStruct(
                                                    questionId: 'hairConcern',
                                                    answerIds: [
                                                      'concern_splitends'
                                                    ],
                                                  ))) {
                                                return 'Split-ends focus';
                                              } else if (FFAppState()
                                                  .quizProfile
                                                  .qaPairs
                                                  .contains(
                                                      QuestionAnswerPairStruct(
                                                    questionId: 'hairConcern',
                                                    answerIds: [
                                                      'concern_scalp'
                                                    ],
                                                  ))) {
                                                return 'Scalp focus';
                                              } else if (FFAppState()
                                                  .quizProfile
                                                  .qaPairs
                                                  .contains(
                                                      QuestionAnswerPairStruct(
                                                    questionId: 'hairConcern',
                                                    answerIds: [
                                                      'concern_damage'
                                                    ],
                                                  ))) {
                                                return 'Damaged hair focus';
                                              } else {
                                                return 'Mixed focus';
                                              }
                                            }(),
                                            style: FlutterFlowTheme.of(context)
                                                .bodyMedium
                                                .override(
                                                  fontFamily: 'Inter',
                                                  fontSize: 14.0,
                                                  letterSpacing: 0.0,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                Divider(
                  thickness: 1.0,
                  color: FlutterFlowTheme.of(context).primaryPeriwinkle,
                ),
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(25.0, 0.0, 25.0, 0.0),
                  child: Text(
                    'Based on your profile, we\'ve added these modules to your plan ',
                    textAlign: TextAlign.center,
                    style: FlutterFlowTheme.of(context).bodyMedium.override(
                          fontFamily: 'Inter',
                          fontSize: 17.0,
                          letterSpacing: 0.0,
                          fontWeight: FontWeight.w600,
                        ),
                  ),
                ),
                Text(
                  'to ensure success:',
                  style: FlutterFlowTheme.of(context).bodyMedium.override(
                        fontFamily: 'Inter',
                        color: FlutterFlowTheme.of(context).orange,
                        fontSize: 17.0,
                        letterSpacing: 0.0,
                        fontWeight: FontWeight.w600,
                      ),
                ),
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 10.0, 0.0, 0.0),
                  child: Builder(
                    builder: (context) {
                      final personalPlanData =
                          FFAppState().personalPlan.toList();

                      return ListView.builder(
                        padding: EdgeInsets.zero,
                        shrinkWrap: true,
                        scrollDirection: Axis.vertical,
                        itemCount: personalPlanData.length,
                        itemBuilder: (context, personalPlanDataIndex) {
                          final personalPlanDataItem =
                              personalPlanData[personalPlanDataIndex];
                          return Padding(
                            padding: EdgeInsets.all(2.0),
                            child: Row(
                              mainAxisSize: MainAxisSize.max,
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    personalPlanDataItem.title,
                                    maxLines: 1,
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          letterSpacing: 0.0,
                                        ),
                                  ),
                                ),
                                Row(
                                  mainAxisSize: MainAxisSize.max,
                                  children: [
                                    Text(
                                      '\$${personalPlanDataItem.price.toString()}',
                                      style: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .override(
                                            fontFamily: 'Inter',
                                            color: FlutterFlowTheme.of(context)
                                                .tertiary,
                                            letterSpacing: 0.0,
                                            decoration:
                                                TextDecoration.lineThrough,
                                          ),
                                    ),
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          2.0, 0.0, 0.0, 0.0),
                                      child: Text(
                                        '\$${personalPlanDataItem.discountedPrice.toString()}',
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Inter',
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .secondary,
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.w500,
                                            ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          );
                        },
                      );
                    },
                  ),
                ),
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 20.0, 0.0, 10.0),
                  child: FFButtonWidget(
                    onPressed: () async {
                      await actions.trackGAEvent(
                        'Go to next checkout step',
                        '',
                        'Result Page',
                        FFAppConstants.nonQuestionAnswerItem.toList(),
                        '',
                        '',
                      );
                      await actions.redirectToCheckout();
                    },
                    text: 'START NOW →',
                    options: FFButtonOptions(
                      width: MediaQuery.sizeOf(context).width * 1.0,
                      height: 40.0,
                      padding:
                          EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
                      iconPadding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                      color: FlutterFlowTheme.of(context).orange,
                      textStyle:
                          FlutterFlowTheme.of(context).titleSmall.override(
                                fontFamily: 'Inter',
                                color: Colors.white,
                                letterSpacing: 0.0,
                              ),
                      elevation: 0.0,
                      borderRadius: BorderRadius.circular(8.0),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
