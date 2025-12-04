import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'pitch_body_simple_text_images_body_model.dart';
export 'pitch_body_simple_text_images_body_model.dart';

class PitchBodySimpleTextImagesBodyWidget extends StatefulWidget {
  const PitchBodySimpleTextImagesBodyWidget({
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
  State<PitchBodySimpleTextImagesBodyWidget> createState() =>
      _PitchBodySimpleTextImagesBodyWidgetState();
}

class _PitchBodySimpleTextImagesBodyWidgetState
    extends State<PitchBodySimpleTextImagesBodyWidget> {
  late PitchBodySimpleTextImagesBodyModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => PitchBodySimpleTextImagesBodyModel());

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
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Align(
                      alignment: AlignmentDirectional(-1.0, 0.0),
                      child: Padding(
                        padding: EdgeInsetsDirectional.fromSTEB(
                            0.0, 35.0, 0.0, 20.0),
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
                            height: MediaQuery.sizeOf(context).height < 500.0
                                ? 160.0
                                : 200.0,
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
                          style: FlutterFlowTheme.of(context)
                              .bodyMedium
                              .override(
                                font: GoogleFonts.inter(
                                  fontWeight: FontWeight.w500,
                                  fontStyle: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .fontStyle,
                                ),
                                fontSize:
                                    MediaQuery.sizeOf(context).height < 500.0
                                        ? 16.0
                                        : 22.0,
                                letterSpacing: 0.0,
                                fontWeight: FontWeight.w500,
                                fontStyle: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .fontStyle,
                              ),
                        ),
                      ),
                    ),
                    Align(
                      alignment: AlignmentDirectional(-1.0, 0.0),
                      child: Padding(
                        padding: EdgeInsetsDirectional.fromSTEB(
                            0.0,
                            0.0,
                            0.0,
                            valueOrDefault<double>(
                              MediaQuery.sizeOf(context).height < 500.0
                                  ? 80.0
                                  : 0.0,
                              0.0,
                            )),
                        child: RichText(
                          textScaler: MediaQuery.of(context).textScaler,
                          text: TextSpan(
                            children: [
                              TextSpan(
                                text:
                                    FFLocalizations.of(context).getVariableText(
                                  enText: 'Did you know research shows that',
                                  esText: 'Did you know research shows that',
                                  deText:
                                      'Wusstest du, dass neuste Untersuchungen zeigen, dass',
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
                                      fontSize: 16.0,
                                      letterSpacing: 0.0,
                                      fontWeight: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontWeight,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
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
                                    return ' 96.3% ';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_splitends'],
                                      ))) {
                                    return ' 92.5% ';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_scalp'],
                                      ))) {
                                    return ' 93.8% ';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_damage'],
                                      ))) {
                                    return ' 91.2% ';
                                  } else {
                                    return ' 90%+ ';
                                  }
                                }(),
                                style: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      font: GoogleFonts.inter(
                                        fontWeight: FontWeight.normal,
                                        fontStyle: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .fontStyle,
                                      ),
                                      fontSize: 16.0,
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.normal,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
                                    ),
                              ),
                              TextSpan(
                                text:
                                    FFLocalizations.of(context).getVariableText(
                                  enText: ' of women, struggling with',
                                  esText: ' of women, struggling with',
                                  deText: ' aller Frauen mit',
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
                                      fontSize: 16.0,
                                      letterSpacing: 0.0,
                                      fontWeight: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontWeight,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
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
                                    return FFLocalizations.of(context)
                                        .getVariableText(
                                      enText: ' hair loss and thinning',
                                      esText: ' pérdida de cabello',
                                      deText: ' Haarausfall',
                                    );
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_splitends'],
                                      ))) {
                                    return FFLocalizations.of(context)
                                        .getVariableText(
                                      enText: ' split-ends',
                                      esText: ' split-ends',
                                      deText: ' Frizz und Spliss',
                                    );
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_scalp'],
                                      ))) {
                                    return FFLocalizations.of(context)
                                        .getVariableText(
                                      enText: ' dandruff and scalp irritation',
                                      esText: ' dandruff and scalp irritation',
                                      deText: ' Schuppen und Kopfhautproblemen',
                                    );
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_damage'],
                                      ))) {
                                    return FFLocalizations.of(context)
                                        .getVariableText(
                                      enText: ' damaged hair and breakage',
                                      esText: ' damaged hair and breakage',
                                      deText:
                                          ' beschädigtes und brüchiges Haar',
                                    );
                                  } else {
                                    return FFLocalizations.of(context)
                                        .getVariableText(
                                      enText: ' mixed hair issues',
                                      esText: ' mixed hair issues',
                                      deText: ' gemischten Haarproblemen',
                                    );
                                  }
                                }(),
                                style: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      font: GoogleFonts.inter(
                                        fontWeight: FontWeight.normal,
                                        fontStyle: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .fontStyle,
                                      ),
                                      fontSize: 16.0,
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.normal,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
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
                                    return FFLocalizations.of(context)
                                        .getVariableText(
                                      enText: ' in their twenties,',
                                      esText: ' in their twenties,',
                                      deText: ' unter Dreißig,',
                                    );
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'age',
                                        answerIds: ['age_30to39'],
                                      ))) {
                                    return FFLocalizations.of(context)
                                        .getVariableText(
                                      enText: ' in their thirties,',
                                      esText: ' in their thirties,',
                                      deText: ' über 30,',
                                    );
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'age',
                                        answerIds: ['age_40to49'],
                                      ))) {
                                    return FFLocalizations.of(context)
                                        .getVariableText(
                                      enText: ' in their fourties,',
                                      esText: ' in their fourties,',
                                      deText: ' über Vierzig,',
                                    );
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'age',
                                        answerIds: ['age_50+'],
                                      ))) {
                                    return FFLocalizations.of(context)
                                        .getVariableText(
                                      enText: ' after the age of 50,',
                                      esText: ' after the age of 50,',
                                      deText: ' über Fünfzig,',
                                    );
                                  } else {
                                    return FFLocalizations.of(context)
                                        .getVariableText(
                                      enText: ' regardless of their age,',
                                      esText: ' regardless of their age,',
                                      deText: ' altersunabhängig,',
                                    );
                                  }
                                }(),
                                style: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      font: GoogleFonts.inter(
                                        fontWeight: FontWeight.normal,
                                        fontStyle: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .fontStyle,
                                      ),
                                      fontSize: 16.0,
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.normal,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
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
                                    return FFLocalizations.of(context)
                                        .getVariableText(
                                      enText:
                                          ' see visibly denser and thicker hair ',
                                      esText:
                                          ' see visibly denser and thicker hair ',
                                      deText:
                                          ' sichtbar dichteres und volleres Haar ',
                                    );
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_splitends'],
                                      ))) {
                                    return FFLocalizations.of(context)
                                        .getVariableText(
                                      enText:
                                          ' see visibly denser and thicker hair',
                                      esText:
                                          ' see visibly denser and thicker hair',
                                      deText:
                                          ' sichtbar dichteres und volleres Haar',
                                    );
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_scalp'],
                                      ))) {
                                    return FFLocalizations.of(context)
                                        .getVariableText(
                                      enText:
                                          ' stop experiencing scalp irritation and flakes',
                                      esText:
                                          ' stop experiencing scalp irritation and flakes',
                                      deText:
                                          ' keine Kopfhautreizungen und Schuppen mehr',
                                    );
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_damage'],
                                      ))) {
                                    return FFLocalizations.of(context)
                                        .getVariableText(
                                      enText:
                                          ' experience less breakage and more density',
                                      esText:
                                          ' experience less breakage and more density',
                                      deText:
                                          ' weniger Haarbruch und volleres Haar',
                                    );
                                  } else {
                                    return FFLocalizations.of(context)
                                        .getVariableText(
                                      enText: ' visibly better hair',
                                      esText: ' visibly better hair',
                                      deText: ' sichtbar besseres Haar',
                                    );
                                  }
                                }(),
                                style: TextStyle(),
                              ),
                              TextSpan(
                                text:
                                    FFLocalizations.of(context).getVariableText(
                                  enText:
                                      ' within 14 days of switching to a holistic haircare routine.',
                                  esText:
                                      ' within 14 days of switching to a holistic haircare routine.',
                                  deText:
                                      'erzielen. In nur 14 Tage nach dem Umstieg auf eine ganzheitliche Haarpflegeroutine.',
                                ),
                                style: TextStyle(),
                              )
                            ],
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
                                  fontSize:
                                      MediaQuery.sizeOf(context).height < 500.0
                                          ? 13.0
                                          : 16.0,
                                  letterSpacing: 0.0,
                                  fontWeight: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .fontWeight,
                                  fontStyle: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .fontStyle,
                                  lineHeight: 1.25,
                                ),
                          ),
                          textAlign: TextAlign.start,
                        ),
                      ),
                    ),
                  ],
                ),
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
