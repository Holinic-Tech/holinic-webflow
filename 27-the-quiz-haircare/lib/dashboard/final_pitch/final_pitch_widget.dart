import '/backend/schema/structs/index.dart';
import '/dashboard/dashboard_widget/dashboard_widget_widget.dart';
import '/dashboard/pitch_plan_dialog/pitch_plan_dialog_widget.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_timer.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/custom_code/actions/index.dart' as actions;
import '/custom_code/widgets/index.dart' as custom_widgets;
import 'package:stop_watch_timer/stop_watch_timer.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:provider/provider.dart';
import 'package:webviewx_plus/webviewx_plus.dart';
import 'final_pitch_model.dart';
export 'final_pitch_model.dart';

class FinalPitchWidget extends StatefulWidget {
  const FinalPitchWidget({
    super.key,
    required this.previousDiscountPercentage,
    required this.discountPercentage,
    bool? disableSlider,
  }) : this.disableSlider = disableSlider ?? true;

  /// Previos  discount Percentage
  final int? previousDiscountPercentage;

  /// Diuscount in percentage
  final int? discountPercentage;

  final bool disableSlider;

  @override
  State<FinalPitchWidget> createState() => _FinalPitchWidgetState();
}

class _FinalPitchWidgetState extends State<FinalPitchWidget> {
  late FinalPitchModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => FinalPitchModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.addToProfile(FFAppState().quizProfile);
      safeSetState(() {});
      _model.timerController.onStartTimer();
      await actions.trackGAEvent(
        'Viewed Results Page',
        '',
        '',
        FFAppConstants.nonQuestionAnswerItem.toList(),
        '',
        '',
      );
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
        width: () {
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
          color: FlutterFlowTheme.of(context).primaryWhite,
        ),
        child: Stack(
          children: [
            Padding(
              padding: EdgeInsetsDirectional.fromSTEB(
                  20.0,
                  valueOrDefault<double>(
                    FFAppConstants.templateTopPadding,
                    0.0,
                  ),
                  20.0,
                  0.0),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Align(
                          alignment: AlignmentDirectional(0.0, -1.0),
                          child: Text(
                            'We\'ve found the right \nHaircare Program for you 🎉',
                            textAlign: TextAlign.center,
                            style: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Inter',
                                  fontSize: 20.0,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.w500,
                                ),
                          ),
                        ),
                        if (responsiveVisibility(
                          context: context,
                          phone: false,
                          tablet: false,
                          tabletLandscape: false,
                          desktop: false,
                        ))
                          Align(
                            alignment: AlignmentDirectional(0.0, -1.0),
                            child: Text(
                              '${widget.previousDiscountPercentage?.toString()}%',
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Inter',
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryPlum,
                                    fontSize: 20.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w500,
                                    decoration: TextDecoration.lineThrough,
                                  ),
                            ),
                          ),
                      ],
                    ),
                    Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 25.0, 0.0, 0.0),
                      child: Container(
                        decoration: BoxDecoration(
                          color: FlutterFlowTheme.of(context).secondaryViolet,
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                        child: Padding(
                          padding: EdgeInsets.all(8.0),
                          child: Row(
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              Padding(
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    10.0, 0.0, 0.0, 0.0),
                                child: Icon(
                                  Icons.card_giftcard,
                                  color: FlutterFlowTheme.of(context)
                                      .secondaryPlum,
                                  size: 28.0,
                                ),
                              ),
                              Expanded(
                                child: Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      35.0, 0.0, 25.0, 0.0),
                                  child: RichText(
                                    textScaler:
                                        MediaQuery.of(context).textScaler,
                                    text: TextSpan(
                                      children: [
                                        TextSpan(
                                          text: 'Personal plan for ',
                                          style: FlutterFlowTheme.of(context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Inter',
                                                fontSize: 18.0,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.normal,
                                              ),
                                        ),
                                        TextSpan(
                                          text: valueOrDefault<String>(
                                            FFAppState()
                                                .submittedContactDetails
                                                .name,
                                            'you',
                                          ),
                                          style: FlutterFlowTheme.of(context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Inter',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .secondaryPlum,
                                                fontSize: 18.0,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.w500,
                                              ),
                                        ),
                                        TextSpan(
                                          text: ' has been reserved.',
                                          style: FlutterFlowTheme.of(context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Inter',
                                                fontSize: 18.0,
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
                                            fontWeight: FontWeight.normal,
                                          ),
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 20.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.max,
                        children: [
                          Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                0.0, 25.0, 0.0, 0.0),
                            child: ClipRRect(
                              borderRadius: BorderRadius.only(
                                bottomLeft: Radius.circular(0.0),
                                bottomRight: Radius.circular(0.0),
                                topLeft: Radius.circular(8.0),
                                topRight: Radius.circular(8.0),
                              ),
                              child: Image.network(
                                valueOrDefault<String>(
                                  () {
                                    if (FFAppState()
                                        .quizProfile
                                        .qaPairs
                                        .contains(QuestionAnswerPairStruct(
                                          questionId: 'hairConcern',
                                          answerIds: ['concern_hairloss'],
                                        ))) {
                                      return 'https://assets.hairqare.co/RP%20Hairloss.webp';
                                    } else if (FFAppState()
                                        .quizProfile
                                        .qaPairs
                                        .contains(QuestionAnswerPairStruct(
                                          questionId: 'hairConcern',
                                          answerIds: ['concern_splitends'],
                                        ))) {
                                      return 'https://assets.hairqare.co/RP%20Split%20ends.webp';
                                    } else if (FFAppState()
                                        .quizProfile
                                        .qaPairs
                                        .contains(QuestionAnswerPairStruct(
                                          questionId: 'hairConcern',
                                          answerIds: ['concern_scalp'],
                                        ))) {
                                      return 'https://assets.hairqare.co/RP%20Dandruff.webp';
                                    } else if (FFAppState()
                                        .quizProfile
                                        .qaPairs
                                        .contains(QuestionAnswerPairStruct(
                                          questionId: 'hairConcern',
                                          answerIds: ['concern_damage'],
                                        ))) {
                                      return 'https://assets.hairqare.co/RP%20Damage.webp';
                                    } else {
                                      return 'https://assets.hairqare.co/RP%20Others.webp';
                                    }
                                  }(),
                                  'https://assets.hairqare.co/RP%20Others.webp',
                                ),
                                width: double.infinity,
                                fit: BoxFit.contain,
                              ),
                            ),
                          ),
                          Align(
                            alignment: AlignmentDirectional(0.0, -1.0),
                            child: Padding(
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  0.0, 0.0, 0.0, 25.0),
                              child: Image.network(
                                valueOrDefault<String>(
                                  () {
                                    if (FFAppState()
                                        .quizProfile
                                        .qaPairs
                                        .contains(QuestionAnswerPairStruct(
                                          questionId: 'hairConcern',
                                          answerIds: ['concern_hairloss'],
                                        ))) {
                                      return 'https://assets.hairqare.co/RP%20hairloss%20timeline.webp';
                                    } else if (FFAppState()
                                        .quizProfile
                                        .qaPairs
                                        .contains(QuestionAnswerPairStruct(
                                          questionId: 'hairConcern',
                                          answerIds: ['concern_splitends'],
                                        ))) {
                                      return 'https://assets.hairqare.co/RP%20Split%20ends%20timeline.webp';
                                    } else if (FFAppState()
                                        .quizProfile
                                        .qaPairs
                                        .contains(QuestionAnswerPairStruct(
                                          questionId: 'hairConcern',
                                          answerIds: ['concern_scalp'],
                                        ))) {
                                      return 'https://assets.hairqare.co/RP%20dandruff%20timeline.webp';
                                    } else if (FFAppState()
                                        .quizProfile
                                        .qaPairs
                                        .contains(QuestionAnswerPairStruct(
                                          questionId: 'hairConcern',
                                          answerIds: ['concern_damage'],
                                        ))) {
                                      return 'https://assets.hairqare.co/RP%20damage%20timeline.webp';
                                    } else {
                                      return 'https://assets.hairqare.co/RP%20others%20timeline.webp';
                                    }
                                  }(),
                                  'https://assets.hairqare.co/RP%20others%20timeline.webp',
                                ),
                                width: double.infinity,
                                height: () {
                                  if (MediaQuery.sizeOf(context).width <
                                      kBreakpointSmall) {
                                    return 160.0;
                                  } else if (MediaQuery.sizeOf(context).width <
                                      kBreakpointMedium) {
                                    return 200.0;
                                  } else if (MediaQuery.sizeOf(context).width <
                                      kBreakpointLarge) {
                                    return 200.0;
                                  } else {
                                    return 200.0;
                                  }
                                }(),
                                fit: BoxFit.fitWidth,
                              ),
                            ),
                          ),
                          Row(
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              Expanded(
                                child: Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      0.0, 0.0, 8.0, 0.0),
                                  child: Column(
                                    mainAxisSize: MainAxisSize.max,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            0.0, 0.0, 0.0, 12.0),
                                        child: Container(
                                          decoration: BoxDecoration(),
                                          child: wrapWithModel(
                                            model: _model.dashboardWidgetModel1,
                                            updateCallback: () =>
                                                safeSetState(() {}),
                                            child: DashboardWidgetWidget(
                                              header: 'Hair goal',
                                              value: '😢 Unrealized',
                                            ),
                                          ),
                                        ),
                                      ),
                                      Divider(
                                        thickness: 1.0,
                                        color: FlutterFlowTheme.of(context)
                                            .alternate,
                                      ),
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            0.0, 12.0, 0.0, 12.0),
                                        child: Column(
                                          mainAxisSize: MainAxisSize.max,
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Container(
                                              decoration: BoxDecoration(),
                                              child: wrapWithModel(
                                                model: _model
                                                    .dashboardWidgetModel2,
                                                updateCallback: () =>
                                                    safeSetState(() {}),
                                                child: DashboardWidgetWidget(
                                                  header: 'Confidence',
                                                  value: 'Low',
                                                ),
                                              ),
                                            ),
                                            Padding(
                                              padding: EdgeInsetsDirectional
                                                  .fromSTEB(
                                                      0.0, 10.0, 0.0, 0.0),
                                              child: Container(
                                                width: double.infinity,
                                                height: 7.0,
                                                child: custom_widgets
                                                    .HeaderProgressBar(
                                                  width: double.infinity,
                                                  height: 7.0,
                                                  totalQuestions: 5,
                                                  currentQuestion: 1,
                                                  totalSegments: 5,
                                                  valueColor:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .redColor,
                                                  backgroundColor:
                                                      Color(0x83AB0018),
                                                  progressBarHeight: 6.0,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Divider(
                                        thickness: 1.0,
                                        color: FlutterFlowTheme.of(context)
                                            .alternate,
                                      ),
                                      Column(
                                        mainAxisSize: MainAxisSize.max,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Padding(
                                            padding:
                                                EdgeInsetsDirectional.fromSTEB(
                                                    0.0, 12.0, 0.0, 0.0),
                                            child: Container(
                                              decoration: BoxDecoration(),
                                              child: wrapWithModel(
                                                model: _model
                                                    .dashboardWidgetModel3,
                                                updateCallback: () =>
                                                    safeSetState(() {}),
                                                child: DashboardWidgetWidget(
                                                  header:
                                                      valueOrDefault<String>(
                                                    () {
                                                      if (FFAppState()
                                                          .quizProfile
                                                          .qaPairs
                                                          .contains(
                                                              QuestionAnswerPairStruct(
                                                            questionId:
                                                                'hairConcern',
                                                            answerIds: [
                                                              'concern_hairloss'
                                                            ],
                                                          ))) {
                                                        return ' Hair loss';
                                                      } else if (FFAppState()
                                                          .quizProfile
                                                          .qaPairs
                                                          .contains(
                                                              QuestionAnswerPairStruct(
                                                            questionId:
                                                                'hairConcern',
                                                            answerIds: [
                                                              'concern_splitends'
                                                            ],
                                                          ))) {
                                                        return ' Split ends / dryness';
                                                      } else if (FFAppState()
                                                          .quizProfile
                                                          .qaPairs
                                                          .contains(
                                                              QuestionAnswerPairStruct(
                                                            questionId:
                                                                'hairConcern',
                                                            answerIds: [
                                                              'concern_scalp'
                                                            ],
                                                          ))) {
                                                        return 'Scalp issues';
                                                      } else if (FFAppState()
                                                          .quizProfile
                                                          .qaPairs
                                                          .contains(
                                                              QuestionAnswerPairStruct(
                                                            questionId:
                                                                'hairConcern',
                                                            answerIds: [
                                                              'concern_damage'
                                                            ],
                                                          ))) {
                                                        return 'Damage';
                                                      } else {
                                                        return 'Hair problems';
                                                      }
                                                    }(),
                                                    'Hair problems',
                                                  ),
                                                  value: 'High',
                                                ),
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            0.0, 10.0, 0.0, 0.0),
                                        child: Container(
                                          width: double.infinity,
                                          height: 7.0,
                                          child:
                                              custom_widgets.HeaderProgressBar(
                                            width: double.infinity,
                                            height: 7.0,
                                            totalQuestions: 5,
                                            currentQuestion: 5,
                                            totalSegments: 5,
                                            valueColor:
                                                FlutterFlowTheme.of(context)
                                                    .redColor,
                                            backgroundColor: Color(0x83AB0018),
                                            progressBarHeight: 6.0,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              SizedBox(
                                height: 250.0,
                                child: VerticalDivider(
                                  thickness: 1.0,
                                  color: FlutterFlowTheme.of(context).alternate,
                                ),
                              ),
                              Expanded(
                                child: Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      8.0, 0.0, 0.0, 0.0),
                                  child: Column(
                                    mainAxisSize: MainAxisSize.max,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            0.0, 0.0, 0.0, 12.0),
                                        child: Container(
                                          decoration: BoxDecoration(),
                                          child: wrapWithModel(
                                            model: _model.dashboardWidgetModel4,
                                            updateCallback: () =>
                                                safeSetState(() {}),
                                            child: DashboardWidgetWidget(
                                              header: 'Hair goal',
                                              value: '🎯 Achieved',
                                            ),
                                          ),
                                        ),
                                      ),
                                      Divider(
                                        thickness: 1.0,
                                        color: FlutterFlowTheme.of(context)
                                            .alternate,
                                      ),
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            0.0, 12.0, 0.0, 12.0),
                                        child: Column(
                                          mainAxisSize: MainAxisSize.max,
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Container(
                                              decoration: BoxDecoration(),
                                              child: wrapWithModel(
                                                model: _model
                                                    .dashboardWidgetModel5,
                                                updateCallback: () =>
                                                    safeSetState(() {}),
                                                child: DashboardWidgetWidget(
                                                  header: 'Confidence',
                                                  value: 'High',
                                                ),
                                              ),
                                            ),
                                            Padding(
                                              padding: EdgeInsetsDirectional
                                                  .fromSTEB(
                                                      0.0, 10.0, 0.0, 0.0),
                                              child: Container(
                                                width: double.infinity,
                                                height: 7.0,
                                                child: custom_widgets
                                                    .HeaderProgressBar(
                                                  width: double.infinity,
                                                  height: 7.0,
                                                  totalQuestions: 5,
                                                  currentQuestion: 5,
                                                  totalSegments: 5,
                                                  valueColor:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .secondaryPlum,
                                                  backgroundColor:
                                                      Color(0xB3B1BAE3),
                                                  progressBarHeight: 6.0,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Divider(
                                        thickness: 1.0,
                                        color: FlutterFlowTheme.of(context)
                                            .alternate,
                                      ),
                                      Column(
                                        mainAxisSize: MainAxisSize.max,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Padding(
                                            padding:
                                                EdgeInsetsDirectional.fromSTEB(
                                                    0.0, 12.0, 0.0, 0.0),
                                            child: Container(
                                              decoration: BoxDecoration(),
                                              child: wrapWithModel(
                                                model: _model
                                                    .dashboardWidgetModel6,
                                                updateCallback: () =>
                                                    safeSetState(() {}),
                                                child: DashboardWidgetWidget(
                                                  header:
                                                      valueOrDefault<String>(
                                                    () {
                                                      if (FFAppState()
                                                          .quizProfile
                                                          .qaPairs
                                                          .contains(
                                                              QuestionAnswerPairStruct(
                                                            questionId:
                                                                'hairConcern',
                                                            answerIds: [
                                                              'concern_hairloss'
                                                            ],
                                                          ))) {
                                                        return ' Hair loss';
                                                      } else if (FFAppState()
                                                          .quizProfile
                                                          .qaPairs
                                                          .contains(
                                                              QuestionAnswerPairStruct(
                                                            questionId:
                                                                'hairConcern',
                                                            answerIds: [
                                                              'concern_splitends'
                                                            ],
                                                          ))) {
                                                        return ' Split ends / dryness';
                                                      } else if (FFAppState()
                                                          .quizProfile
                                                          .qaPairs
                                                          .contains(
                                                              QuestionAnswerPairStruct(
                                                            questionId:
                                                                'hairConcern',
                                                            answerIds: [
                                                              'concern_scalp'
                                                            ],
                                                          ))) {
                                                        return 'Scalp issues';
                                                      } else if (FFAppState()
                                                          .quizProfile
                                                          .qaPairs
                                                          .contains(
                                                              QuestionAnswerPairStruct(
                                                            questionId:
                                                                'hairConcern',
                                                            answerIds: [
                                                              'concern_damage'
                                                            ],
                                                          ))) {
                                                        return 'Damage';
                                                      } else {
                                                        return 'Hair problems';
                                                      }
                                                    }(),
                                                    'Hair problems',
                                                  ),
                                                  value: 'Low',
                                                ),
                                              ),
                                            ),
                                          ),
                                          Padding(
                                            padding:
                                                EdgeInsetsDirectional.fromSTEB(
                                                    0.0, 10.0, 0.0, 0.0),
                                            child: Container(
                                              width: double.infinity,
                                              height: 7.0,
                                              child: custom_widgets
                                                  .HeaderProgressBar(
                                                width: double.infinity,
                                                height: 7.0,
                                                totalQuestions: 5,
                                                currentQuestion: 1,
                                                totalSegments: 5,
                                                valueColor:
                                                    FlutterFlowTheme.of(context)
                                                        .secondaryPlum,
                                                backgroundColor:
                                                    Color(0xB3B1BAE3),
                                                progressBarHeight: 6.0,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                          Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                0.0, 40.0, 0.0, 5.0),
                            child: RichText(
                              textScaler: MediaQuery.of(context).textScaler,
                              text: TextSpan(
                                children: [
                                  TextSpan(
                                    text: valueOrDefault<String>(
                                      '${valueOrDefault<String>(
                                        FFAppState()
                                            .submittedContactDetails
                                            .name,
                                        'Your',
                                      )}\'s ',
                                      'Your',
                                    ),
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          color: FlutterFlowTheme.of(context)
                                              .primaryText,
                                          fontSize: 24.0,
                                          letterSpacing: 0.0,
                                          fontWeight: FontWeight.w600,
                                        ),
                                  ),
                                  TextSpan(
                                    text: 'Holistic Haircare Routine ',
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          color: FlutterFlowTheme.of(context)
                                              .primaryText,
                                          fontSize: 24.0,
                                          letterSpacing: 0.0,
                                          fontWeight: FontWeight.w600,
                                        ),
                                  ),
                                  TextSpan(
                                    text: 'plan is ready!',
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          color: FlutterFlowTheme.of(context)
                                              .primaryText,
                                          fontSize: 24.0,
                                          letterSpacing: 0.0,
                                          fontWeight: FontWeight.w600,
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
                              textAlign: TextAlign.center,
                            ),
                          ),
                          RichText(
                            textScaler: MediaQuery.of(context).textScaler,
                            text: TextSpan(
                              children: [
                                TextSpan(
                                  text:
                                      'Start today and become unrecognizable in 14 days with ',
                                  style: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .override(
                                        fontFamily: 'Inter',
                                        fontSize: 15.0,
                                        letterSpacing: 0.0,
                                      ),
                                ),
                                TextSpan(
                                  text: valueOrDefault<String>(
                                    () {
                                      if (FFAppState()
                                          .quizProfile
                                          .qaPairs
                                          .contains(QuestionAnswerPairStruct(
                                            questionId: 'hairConcern',
                                            answerIds: ['concern_hairloss'],
                                          ))) {
                                        return 'thicker, fuller hair without constantly worrying about visible scalp or covering up thin spots.';
                                      } else if (FFAppState()
                                          .quizProfile
                                          .qaPairs
                                          .contains(QuestionAnswerPairStruct(
                                            questionId: 'hairConcern',
                                            answerIds: ['concern_splitends'],
                                          ))) {
                                        return 'smoother, more manageable hair without the constant battle against frizz and flyaways.';
                                      } else if (FFAppState()
                                          .quizProfile
                                          .qaPairs
                                          .contains(QuestionAnswerPairStruct(
                                            questionId: 'hairConcern',
                                            answerIds: ['concern_damage'],
                                          ))) {
                                        return 'stronger, more resilient hair that can handle heat styling and coloring without becoming dry, brittle or straw-like.';
                                      } else if (FFAppState()
                                          .quizProfile
                                          .qaPairs
                                          .contains(QuestionAnswerPairStruct(
                                            questionId: 'hairConcern',
                                            answerIds: ['concern_scalp'],
                                          ))) {
                                        return 'a calmer, itch and flake free scalp that allows you to go through your day without constant distraction or embarrassment from scratching.';
                                      } else {
                                        return 'healthier, problem-free hair that behaves exactly how you want it to, letting you enjoy your hair without constantly battling different problems.';
                                      }
                                    }(),
                                    'healthier, problem-free hair that behaves exactly how you want it to, letting you enjoy your hair without constantly battling different problems.',
                                  ),
                                  style: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .override(
                                        fontFamily: 'Inter',
                                        fontSize: 15.0,
                                        letterSpacing: 0.0,
                                        fontWeight: FontWeight.normal,
                                      ),
                                )
                              ],
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Inter',
                                    fontSize: 14.0,
                                    letterSpacing: 0.0,
                                  ),
                            ),
                            textAlign: TextAlign.center,
                          ),
                          Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                0.0, 20.0, 0.0, 0.0),
                            child: Row(
                              mainAxisSize: MainAxisSize.max,
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    children: [
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            0.0, 5.0, 7.0, 5.0),
                                        child: Image.network(
                                          'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSc5A6NA9rY73h5Czz4s5nVgb_ltdPfAFEjaHcNHYru2g4wgR1-',
                                          width: 25.0,
                                          height: 25.0,
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                      Column(
                                        mainAxisSize: MainAxisSize.max,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            'Main trigger: ',
                                            style: FlutterFlowTheme.of(context)
                                                .bodyMedium
                                                .override(
                                                  fontFamily: 'Inter',
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .secondaryText,
                                                  fontSize: 15.0,
                                                  letterSpacing: 0.0,
                                                  fontWeight: FontWeight.normal,
                                                ),
                                          ),
                                          Text(
                                            'Wrong routine',
                                            style: FlutterFlowTheme.of(context)
                                                .bodyMedium
                                                .override(
                                                  fontFamily: 'Inter',
                                                  fontSize: 17.0,
                                                  letterSpacing: 0.0,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                                SizedBox(
                                  height: 50.0,
                                  child: VerticalDivider(
                                    thickness: 2.0,
                                    color:
                                        FlutterFlowTheme.of(context).alternate,
                                  ),
                                ),
                                Expanded(
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    children: [
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            0.0, 5.0, 7.0, 5.0),
                                        child: Image.network(
                                          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDqqF-2L9D1OfleU46FC6vHyYmda9CvHoZBA&s',
                                          width: 25.0,
                                          height: 25.0,
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                      Column(
                                        mainAxisSize: MainAxisSize.max,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            'Plan focus:',
                                            style: FlutterFlowTheme.of(context)
                                                .bodyMedium
                                                .override(
                                                  fontFamily: 'Inter',
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .secondaryText,
                                                  fontSize: 15.0,
                                                  letterSpacing: 0.0,
                                                  fontWeight: FontWeight.normal,
                                                ),
                                          ),
                                          Text(
                                            valueOrDefault<String>(
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
                                                  return 'Hair loss';
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
                                                  return 'Split ends';
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
                                                  return 'Scalp issues';
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
                                                  return 'Damage';
                                                } else {
                                                  return 'Complex issues';
                                                }
                                              }(),
                                              'Complex issues',
                                            ),
                                            style: FlutterFlowTheme.of(context)
                                                .bodyMedium
                                                .override(
                                                  fontFamily: 'Inter',
                                                  fontSize: 17.0,
                                                  letterSpacing: 0.0,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Builder(
                            builder: (context) {
                              final planData = FFAppState().PlanData.toList();

                              return ListView.builder(
                                padding: EdgeInsets.zero,
                                primary: false,
                                shrinkWrap: true,
                                scrollDirection: Axis.vertical,
                                itemCount: planData.length,
                                itemBuilder: (context, planDataIndex) {
                                  final planDataItem = planData[planDataIndex];
                                  return Opacity(
                                    opacity:
                                        planDataItem.isPopularPlan ? 1.0 : 0.5,
                                    child: Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          0.0, 20.0, 0.0, 0.0),
                                      child: ClipRRect(
                                        borderRadius:
                                            BorderRadius.circular(15.0),
                                        child: Container(
                                          width: double.infinity,
                                          decoration: BoxDecoration(
                                            color: FlutterFlowTheme.of(context)
                                                .secondaryBackground,
                                            borderRadius:
                                                BorderRadius.circular(15.0),
                                            border: Border.all(
                                              color: _model.selctedValue ==
                                                      planDataIndex
                                                  ? FlutterFlowTheme.of(context)
                                                      .secondaryPlum
                                                  : FlutterFlowTheme.of(context)
                                                      .tertiary,
                                              width: _model.selctedValue ==
                                                      planDataIndex
                                                  ? 2.0
                                                  : 1.0,
                                            ),
                                          ),
                                          child: Column(
                                            mainAxisSize: MainAxisSize.max,
                                            children: [
                                              if (planDataItem.isPopularPlan)
                                                ClipRRect(
                                                  child: Container(
                                                    width: double.infinity,
                                                    height: 20.0,
                                                    decoration: BoxDecoration(
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .secondaryPlum,
                                                      border: Border.all(
                                                        color:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .secondaryPlum,
                                                      ),
                                                    ),
                                                    child: Row(
                                                      mainAxisSize:
                                                          MainAxisSize.max,
                                                      mainAxisAlignment:
                                                          MainAxisAlignment
                                                              .center,
                                                      crossAxisAlignment:
                                                          CrossAxisAlignment
                                                              .center,
                                                      children: [
                                                        Icon(
                                                          Icons.star_rounded,
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .primaryBackground,
                                                          size: 17.0,
                                                        ),
                                                        Align(
                                                          alignment:
                                                              AlignmentDirectional(
                                                                  0.0, -1.0),
                                                          child: Padding(
                                                            padding:
                                                                EdgeInsetsDirectional
                                                                    .fromSTEB(
                                                                        5.0,
                                                                        0.0,
                                                                        0.0,
                                                                        0.0),
                                                            child: Text(
                                                              'YOUR PERSONALIZED PLAN',
                                                              style: FlutterFlowTheme
                                                                      .of(context)
                                                                  .bodyMedium
                                                                  .override(
                                                                    fontFamily:
                                                                        'Inter',
                                                                    color: FlutterFlowTheme.of(
                                                                            context)
                                                                        .primaryBackground,
                                                                    letterSpacing:
                                                                        0.0,
                                                                    fontWeight:
                                                                        FontWeight
                                                                            .w600,
                                                                  ),
                                                            ),
                                                          ),
                                                        ),
                                                      ],
                                                    ),
                                                  ),
                                                ),
                                              Padding(
                                                padding: EdgeInsets.all(10.0),
                                                child: Row(
                                                  mainAxisSize:
                                                      MainAxisSize.max,
                                                  children: [
                                                    Container(
                                                      width: 20.0,
                                                      height: 20.0,
                                                      decoration: BoxDecoration(
                                                        color:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .primary,
                                                        shape: BoxShape.circle,
                                                        border: Border.all(
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .secondary,
                                                          width: 2.0,
                                                        ),
                                                      ),
                                                      child: Align(
                                                        alignment:
                                                            AlignmentDirectional(
                                                                0.0, 0.0),
                                                        child: Container(
                                                          width: 10.0,
                                                          height: 10.0,
                                                          decoration:
                                                              BoxDecoration(
                                                            color: FlutterFlowTheme
                                                                    .of(context)
                                                                .secondaryPlum,
                                                            shape:
                                                                BoxShape.circle,
                                                          ),
                                                        ),
                                                      ),
                                                    ),
                                                    Expanded(
                                                      child: Padding(
                                                        padding:
                                                            EdgeInsetsDirectional
                                                                .fromSTEB(
                                                                    10.0,
                                                                    0.0,
                                                                    0.0,
                                                                    0.0),
                                                        child: Column(
                                                          mainAxisSize:
                                                              MainAxisSize.max,
                                                          crossAxisAlignment:
                                                              CrossAxisAlignment
                                                                  .start,
                                                          children: [
                                                            Padding(
                                                              padding:
                                                                  EdgeInsetsDirectional
                                                                      .fromSTEB(
                                                                          0.0,
                                                                          0.0,
                                                                          0.0,
                                                                          5.0),
                                                              child: Text(
                                                                planDataItem
                                                                    .title,
                                                                style: FlutterFlowTheme.of(
                                                                        context)
                                                                    .bodyMedium
                                                                    .override(
                                                                      fontFamily:
                                                                          'Inter',
                                                                      fontSize:
                                                                          16.0,
                                                                      letterSpacing:
                                                                          0.0,
                                                                      fontWeight:
                                                                          FontWeight
                                                                              .w600,
                                                                    ),
                                                              ),
                                                            ),
                                                            Row(
                                                              mainAxisSize:
                                                                  MainAxisSize
                                                                      .max,
                                                              mainAxisAlignment:
                                                                  MainAxisAlignment
                                                                      .spaceBetween,
                                                              children: [
                                                                Row(
                                                                  mainAxisSize:
                                                                      MainAxisSize
                                                                          .max,
                                                                  children: [
                                                                    Text(
                                                                      valueOrDefault<
                                                                          String>(
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
                                                                            return 'Focus: Hair loss';
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
                                                                            return 'Focus: Split ends';
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
                                                                            return 'Focus: Scalp healing';
                                                                          } else if (FFAppState()
                                                                              .quizProfile
                                                                              .qaPairs
                                                                              .contains(QuestionAnswerPairStruct(
                                                                                questionId: 'hairConcern',
                                                                                answerIds: [
                                                                                  'concern_damage'
                                                                                ],
                                                                              ))) {
                                                                            return 'Focus: Damage';
                                                                          } else {
                                                                            return 'Focus: Hair health';
                                                                          }
                                                                        }(),
                                                                        'Focus: Hair health',
                                                                      ),
                                                                      style: FlutterFlowTheme.of(
                                                                              context)
                                                                          .bodyMedium
                                                                          .override(
                                                                            fontFamily:
                                                                                'Inter',
                                                                            color:
                                                                                FlutterFlowTheme.of(context).secondaryText,
                                                                            fontSize:
                                                                                14.0,
                                                                            letterSpacing:
                                                                                0.0,
                                                                            fontWeight:
                                                                                FontWeight.normal,
                                                                          ),
                                                                    ),
                                                                  ],
                                                                ),
                                                                Padding(
                                                                  padding: EdgeInsetsDirectional
                                                                      .fromSTEB(
                                                                          0.0,
                                                                          0.0,
                                                                          10.0,
                                                                          0.0),
                                                                  child: Row(
                                                                    mainAxisSize:
                                                                        MainAxisSize
                                                                            .max,
                                                                    children: [
                                                                      if (planDataItem
                                                                          .isPopularPlan)
                                                                        Text(
                                                                          '\$${formatNumber(
                                                                            planDataItem.perDayActualPrice,
                                                                            formatType:
                                                                                FormatType.decimal,
                                                                            decimalType:
                                                                                DecimalType.automatic,
                                                                          )}',
                                                                          style: FlutterFlowTheme.of(context)
                                                                              .bodyMedium
                                                                              .override(
                                                                                fontFamily: 'Inter',
                                                                                color: FlutterFlowTheme.of(context).primaryText,
                                                                                fontSize: 14.0,
                                                                                letterSpacing: 0.0,
                                                                                fontWeight: FontWeight.normal,
                                                                                decoration: TextDecoration.lineThrough,
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
                                                    Container(
                                                      decoration: BoxDecoration(
                                                        color: _model
                                                                    .selctedValue ==
                                                                planDataIndex
                                                            ? FlutterFlowTheme
                                                                    .of(context)
                                                                .secondary
                                                            : FlutterFlowTheme
                                                                    .of(context)
                                                                .secondaryViolet,
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(10.0),
                                                      ),
                                                      child: Padding(
                                                        padding:
                                                            EdgeInsets.all(7.0),
                                                        child: Row(
                                                          mainAxisSize:
                                                              MainAxisSize.max,
                                                          crossAxisAlignment:
                                                              CrossAxisAlignment
                                                                  .start,
                                                          children: [
                                                            Text(
                                                              '\$',
                                                              style: FlutterFlowTheme
                                                                      .of(context)
                                                                  .bodyMedium
                                                                  .override(
                                                                    fontFamily:
                                                                        'Inter',
                                                                    color: _model.selctedValue ==
                                                                            planDataIndex
                                                                        ? FlutterFlowTheme.of(context)
                                                                            .primaryWhite
                                                                        : FlutterFlowTheme.of(context)
                                                                            .secondaryPlum,
                                                                    letterSpacing:
                                                                        0.0,
                                                                    fontWeight:
                                                                        FontWeight
                                                                            .bold,
                                                                  ),
                                                            ),
                                                            Padding(
                                                              padding:
                                                                  EdgeInsetsDirectional
                                                                      .fromSTEB(
                                                                          2.0,
                                                                          3.0,
                                                                          0.0,
                                                                          0.0),
                                                              child: Text(
                                                                formatNumber(
                                                                  planDataItem
                                                                      .discountedPrice,
                                                                  formatType:
                                                                      FormatType
                                                                          .decimal,
                                                                  decimalType:
                                                                      DecimalType
                                                                          .automatic,
                                                                ),
                                                                style: FlutterFlowTheme.of(
                                                                        context)
                                                                    .bodyMedium
                                                                    .override(
                                                                      fontFamily:
                                                                          'Inter',
                                                                      color: _model.selctedValue ==
                                                                              planDataIndex
                                                                          ? FlutterFlowTheme.of(context)
                                                                              .primaryWhite
                                                                          : FlutterFlowTheme.of(context)
                                                                              .secondaryPlum,
                                                                      fontSize:
                                                                          30.0,
                                                                      letterSpacing:
                                                                          0.0,
                                                                      fontWeight:
                                                                          FontWeight
                                                                              .w600,
                                                                    ),
                                                              ),
                                                            ),
                                                            if (planDataItem
                                                                .isPopularPlan)
                                                              Padding(
                                                                padding:
                                                                    EdgeInsetsDirectional
                                                                        .fromSTEB(
                                                                            2.0,
                                                                            0.0,
                                                                            0.0,
                                                                            0.0),
                                                                child: Column(
                                                                  mainAxisSize:
                                                                      MainAxisSize
                                                                          .max,
                                                                  mainAxisAlignment:
                                                                      MainAxisAlignment
                                                                          .start,
                                                                  crossAxisAlignment:
                                                                      CrossAxisAlignment
                                                                          .start,
                                                                  children: [
                                                                    Text(
                                                                      '${planDataItem.discountedPerDayPrice.toString()}% OFF',
                                                                      style: FlutterFlowTheme.of(
                                                                              context)
                                                                          .bodyMedium
                                                                          .override(
                                                                            fontFamily:
                                                                                'Inter',
                                                                            color: _model.selctedValue == planDataIndex
                                                                                ? FlutterFlowTheme.of(context).accent1
                                                                                : FlutterFlowTheme.of(context).orange,
                                                                            fontSize:
                                                                                14.0,
                                                                            letterSpacing:
                                                                                0.0,
                                                                            fontWeight:
                                                                                FontWeight.w600,
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
                                            ],
                                          ),
                                        ),
                                      ),
                                    ),
                                  );
                                },
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                    Row(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 0.0, 10.0, 0.0),
                          child: Icon(
                            Icons.info_outline,
                            color: FlutterFlowTheme.of(context).orange,
                            size: 24.0,
                          ),
                        ),
                        Expanded(
                          child: Text(
                            'People using this program see visible results in 14 days.',
                            style: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Inter',
                                  fontSize: 14.0,
                                  letterSpacing: 0.0,
                                ),
                          ),
                        ),
                      ],
                    ),
                    Builder(
                      builder: (context) => Padding(
                        padding: EdgeInsetsDirectional.fromSTEB(
                            0.0, 30.0, 0.0, 80.0),
                        child: InkWell(
                          splashColor: Colors.transparent,
                          focusColor: Colors.transparent,
                          hoverColor: Colors.transparent,
                          highlightColor: Colors.transparent,
                          onTap: () async {
                            await actions.trackGAEvent(
                              'Opened Plan Details',
                              'Result Page',
                              '',
                              FFAppConstants.nonQuestionAnswerItem.toList(),
                              '',
                              '',
                            );
                            FFAppState().showDlfBanner =
                                !(FFAppState().showDlfBanner ?? true);
                            FFAppState().timerSecElapsed =
                                _model.timerMilliseconds;
                            safeSetState(() {});
                            await showDialog(
                              context: context,
                              builder: (dialogContext) {
                                return Dialog(
                                  elevation: 0,
                                  insetPadding: EdgeInsets.zero,
                                  backgroundColor: Colors.transparent,
                                  alignment: AlignmentDirectional(0.0, 0.0)
                                      .resolve(Directionality.of(context)),
                                  child: WebViewAware(
                                    child: PitchPlanDialogWidget(),
                                  ),
                                );
                              },
                            );
                          },
                          child: Container(
                            width: double.infinity,
                            decoration: BoxDecoration(
                              color: FlutterFlowTheme.of(context).orange,
                              borderRadius: BorderRadius.circular(10.0),
                            ),
                            child: Align(
                              alignment: AlignmentDirectional(0.0, 0.0),
                              child: Padding(
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    35.0, 12.0, 35.0, 12.0),
                                child: Text(
                                  'GET MY PLAN',
                                  style: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .override(
                                        fontFamily: 'Inter',
                                        color: FlutterFlowTheme.of(context)
                                            .primaryWhite,
                                        fontSize: 16.0,
                                        letterSpacing: 0.0,
                                        fontWeight: FontWeight.normal,
                                      ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ]
                      .addToStart(SizedBox(height: 10.0))
                      .addToEnd(SizedBox(height: 30.0)),
                ),
              ),
            ),
            Align(
              alignment: AlignmentDirectional(0.0, 1.0),
              child: Padding(
                padding: EdgeInsetsDirectional.fromSTEB(10.0, 0.0, 10.0, 20.0),
                child: Container(
                  width: 600.0,
                  height: 55.0,
                  constraints: BoxConstraints(
                    maxWidth: MediaQuery.sizeOf(context).width * 5.0,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.black,
                    boxShadow: [
                      BoxShadow(
                        blurRadius: 15.0,
                        color: Color(0x41000000),
                        offset: Offset(
                          5.0,
                          5.0,
                        ),
                        spreadRadius: 3.0,
                      )
                    ],
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                  child: Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(10.0, 10.0, 10.0, 10.0),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Expanded(
                          child: Container(
                            constraints: BoxConstraints(
                              maxWidth: MediaQuery.sizeOf(context).width * 0.55,
                            ),
                            decoration: BoxDecoration(),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  mainAxisSize: MainAxisSize.max,
                                  children: [
                                    Align(
                                      alignment:
                                          AlignmentDirectional(-1.0, 0.0),
                                      child: Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            10.0, 0.0, 0.0, 0.0),
                                        child: Text(
                                          ' 85% OFF valid for:',
                                          style: FlutterFlowTheme.of(context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Inter',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .primaryBackground,
                                                letterSpacing: 0.0,
                                              ),
                                        ),
                                      ),
                                    ),
                                    Align(
                                      alignment:
                                          AlignmentDirectional(-1.0, 0.0),
                                      child: Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            10.0, 0.0, 0.0, 0.0),
                                        child: FlutterFlowTimer(
                                          initialTime:
                                              FFAppState().timerSecElapsed,
                                          getDisplayTime: (value) =>
                                              StopWatchTimer.getDisplayTime(
                                            value,
                                            hours: false,
                                            milliSecond: false,
                                          ),
                                          controller: _model.timerController,
                                          updateStateInterval:
                                              Duration(milliseconds: 60),
                                          onChanged: (value, displayTime,
                                              shouldUpdate) {
                                            _model.timerMilliseconds = value;
                                            _model.timerValue = displayTime;
                                            if (shouldUpdate)
                                              safeSetState(() {});
                                          },
                                          textAlign: TextAlign.start,
                                          style: FlutterFlowTheme.of(context)
                                              .headlineSmall
                                              .override(
                                                fontFamily: 'Inter',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .secondaryBackground,
                                                fontSize: 20.0,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.normal,
                                              ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                        Builder(
                          builder: (context) => Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                0.0, 0.0, 10.0, 0.0),
                            child: FFButtonWidget(
                              onPressed: () async {
                                await actions.trackGAEvent(
                                  'Opened Plan Details',
                                  'Result Page',
                                  '',
                                  FFAppConstants.nonQuestionAnswerItem.toList(),
                                  '',
                                  '',
                                );
                                FFAppState().showDlfBanner =
                                    !(FFAppState().showDlfBanner ?? true);
                                FFAppState().timerSecElapsed =
                                    _model.timerMilliseconds;
                                safeSetState(() {});
                                await showDialog(
                                  context: context,
                                  builder: (dialogContext) {
                                    return Dialog(
                                      elevation: 0,
                                      insetPadding: EdgeInsets.zero,
                                      backgroundColor: Colors.transparent,
                                      alignment: AlignmentDirectional(0.0, 0.0)
                                          .resolve(Directionality.of(context)),
                                      child: WebViewAware(
                                        child: PitchPlanDialogWidget(),
                                      ),
                                    );
                                  },
                                );
                              },
                              text: 'Start Now',
                              options: FFButtonOptions(
                                height: 50.0,
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    24.0, 0.0, 24.0, 0.0),
                                iconPadding: EdgeInsetsDirectional.fromSTEB(
                                    0.0, 0.0, 0.0, 0.0),
                                color: FlutterFlowTheme.of(context).orange,
                                textStyle: FlutterFlowTheme.of(context)
                                    .titleSmall
                                    .override(
                                      fontFamily: 'Inter',
                                      color: FlutterFlowTheme.of(context)
                                          .secondaryBackground,
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.w500,
                                    ),
                                elevation: 3.0,
                                borderSide: BorderSide(
                                  color: Colors.transparent,
                                  width: 1.0,
                                ),
                                borderRadius: BorderRadius.circular(10.0),
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
          ],
        ),
      ),
    );
  }
}
