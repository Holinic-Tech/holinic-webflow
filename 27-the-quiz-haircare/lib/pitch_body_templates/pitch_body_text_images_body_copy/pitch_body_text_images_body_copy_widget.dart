import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:provider/provider.dart';
import 'pitch_body_text_images_body_copy_model.dart';
export 'pitch_body_text_images_body_copy_model.dart';

class PitchBodyTextImagesBodyCopyWidget extends StatefulWidget {
  const PitchBodyTextImagesBodyCopyWidget({
    super.key,
    this.image,
    this.title,
    this.description,
    required this.navigationTap,
  });

  final String? image;
  final String? title;
  final String? description;

  /// Continue button on tap
  final Future Function()? navigationTap;

  @override
  State<PitchBodyTextImagesBodyCopyWidget> createState() =>
      _PitchBodyTextImagesBodyCopyWidgetState();
}

class _PitchBodyTextImagesBodyCopyWidgetState
    extends State<PitchBodyTextImagesBodyCopyWidget> {
  late PitchBodyTextImagesBodyCopyModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => PitchBodyTextImagesBodyCopyModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.pitchTitle = widget.title;
      _model.pitchDescription = widget.description;
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
    context.watch<FFAppState>();

    return Align(
      alignment: AlignmentDirectional(0.0, -1.0),
      child: Container(
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
        child: Stack(
          children: [
            Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
              child: Column(
                mainAxisSize: MainAxisSize.max,
                children: [
                  Align(
                    alignment: AlignmentDirectional(-1.0, 0.0),
                    child: Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 46.0, 0.0, 30.0),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8.0),
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
                                return 'https://assets.hairqare.co/P3%20Hair%20Loss.webp';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'hairConcern',
                                    answerIds: ['concern_splitends'],
                                  ))) {
                                return 'https://assets.hairqare.co/P5%20Split%20Ends.webp';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'hairConcern',
                                    answerIds: ['concern_scalp'],
                                  ))) {
                                return 'https://assets.hairqare.co/P2%20Dandruff.webp';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'hairConcern',
                                    answerIds: ['concern_damage'],
                                  ))) {
                                return 'https://assets.hairqare.co/P1%20Damage%20Hair.webp';
                              } else {
                                return 'https://assets.hairqare.co/P4%20Others.webp';
                              }
                            }(),
                            'https://assets.hairqare.co/P4%20Others.webp',
                          ),
                          width: 200.0,
                          height: 200.0,
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ),
                  Align(
                    alignment: AlignmentDirectional(-1.0, 0.0),
                    child: Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 10.0),
                      child: Text(
                        widget.title!,
                        textAlign: TextAlign.start,
                        style: FlutterFlowTheme.of(context).bodyMedium.override(
                              fontFamily: 'Inter',
                              fontSize: 28.0,
                              letterSpacing: 0.0,
                              fontWeight: FontWeight.w500,
                            ),
                      ),
                    ),
                  ),
                  Align(
                    alignment: AlignmentDirectional(-1.0, 0.0),
                    child: RichText(
                      textScaler: MediaQuery.of(context).textScaler,
                      text: TextSpan(
                        children: [
                          TextSpan(
                            text: 'Research shows that',
                            style: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Inter',
                                  fontSize: 16.0,
                                  letterSpacing: 0.0,
                                ),
                          ),
                          TextSpan(
                            text: () {
                              if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'hairConcern',
                                    answerIds: ['concern_hairloss'],
                                  ))) {
                                return ' 96.3%';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'hairConcern',
                                    answerIds: ['concern_splitends'],
                                  ))) {
                                return ' 92.5%';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'hairConcern',
                                    answerIds: ['concern_scalp'],
                                  ))) {
                                return ' 93.8%';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'hairConcern',
                                    answerIds: ['concern_damage'],
                                  ))) {
                                return ' 91.2%';
                              } else {
                                return ' over 90%';
                              }
                            }(),
                            style: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Inter',
                                  fontSize: 16.0,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.normal,
                                ),
                          ),
                          TextSpan(
                            text: ' of women, struggling with',
                            style: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Inter',
                                  fontSize: 16.0,
                                  letterSpacing: 0.0,
                                ),
                          ),
                          TextSpan(
                            text: () {
                              if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'hairConcern',
                                    answerIds: ['concern_hairloss'],
                                  ))) {
                                return ' hair loss and thinning';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'hairConcern',
                                    answerIds: ['concern_splitends'],
                                  ))) {
                                return ' split ends and dryness';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'hairConcern',
                                    answerIds: ['concern_scalp'],
                                  ))) {
                                return ' dandruff and scalp irritation';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'hairConcern',
                                    answerIds: ['concern_damage'],
                                  ))) {
                                return ' damaged hair and breakage';
                              } else {
                                return ' mixed hair issues';
                              }
                            }(),
                            style: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Inter',
                                  fontSize: 16.0,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.normal,
                                ),
                          ),
                          TextSpan(
                            text: () {
                              if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'age',
                                    answerIds: ['age_18to29'],
                                  ))) {
                                return ' in their teens and twenties,';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'age',
                                    answerIds: ['age_30to39'],
                                  ))) {
                                return ' in their thirties,';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'age',
                                    answerIds: ['age_40to49'],
                                  ))) {
                                return ' in their fourties,';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'age',
                                    answerIds: ['age_50+'],
                                  ))) {
                                return ' after the age of 50,';
                              } else {
                                return ' regardless of their age,';
                              }
                            }(),
                            style: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Inter',
                                  fontSize: 16.0,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.normal,
                                ),
                          ),
                          TextSpan(
                            text: () {
                              if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'hairConcern',
                                    answerIds: ['concern_hairloss'],
                                  ))) {
                                return ' see visibly denser and thicker hair';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'hairConcern',
                                    answerIds: ['concern_splitends'],
                                  ))) {
                                return ' see visibly see visibly denser hair and less frizz';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'hairConcern',
                                    answerIds: ['concern_scalp'],
                                  ))) {
                                return ' stop experiencing scalp irritation and flakes';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'hairConcern',
                                    answerIds: ['concern_damage'],
                                  ))) {
                                return ' experience less breakage and more density';
                              } else {
                                return ' achieve visibly better hair';
                              }
                            }(),
                            style: TextStyle(),
                          ),
                          TextSpan(
                            text:
                                ' within 14 days of switching to a holistic haircare routine.',
                            style: TextStyle(),
                          )
                        ],
                        style: FlutterFlowTheme.of(context).bodyMedium.override(
                              fontFamily: 'Inter',
                              fontSize: 16.0,
                              letterSpacing: 0.0,
                              lineHeight: 1.25,
                            ),
                      ),
                      textAlign: TextAlign.start,
                    ),
                  ),
                ],
              ),
            ),
            Align(
              alignment: AlignmentDirectional(0.0, 1.0),
              child: wrapWithModel(
                model: _model.footerButtonModel,
                updateCallback: () => safeSetState(() {}),
                child: FooterButtonWidget(
                  buttonOnTap: () async {
                    await widget.navigationTap?.call();
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
