import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import '/pitch_body_templates/pitch_widget/pitch_widget_widget.dart';
import '/custom_code/widgets/index.dart' as custom_widgets;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'pitch_body_text_images_body_similar_model.dart';
export 'pitch_body_text_images_body_similar_model.dart';

class PitchBodyTextImagesBodySimilarWidget extends StatefulWidget {
  const PitchBodyTextImagesBodySimilarWidget({
    super.key,
    String? image,
    required this.title,
    required this.description,
    required this.navigationTap,
  }) : this.image =
            image ?? 'https://assets.hairqare.co/Dont%20Know%20Hair.webp';

  final String image;
  final String? title;
  final String? description;

  /// Continue button on tap
  final Future Function()? navigationTap;

  @override
  State<PitchBodyTextImagesBodySimilarWidget> createState() =>
      _PitchBodyTextImagesBodySimilarWidgetState();
}

class _PitchBodyTextImagesBodySimilarWidgetState
    extends State<PitchBodyTextImagesBodySimilarWidget> {
  late PitchBodyTextImagesBodySimilarModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => PitchBodyTextImagesBodySimilarModel());

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
                  Padding(
                    padding: EdgeInsetsDirectional.fromSTEB(
                        0.0,
                        valueOrDefault<double>(
                          FFAppConstants.templateTopPadding,
                          0.0,
                        ),
                        0.0,
                        20.0),
                    child: Row(
                      mainAxisSize: MainAxisSize.max,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Profile Summary',
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Inter',
                                    fontSize: 22.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w600,
                                  ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    width: valueOrDefault<double>(
                      () {
                        if (MediaQuery.sizeOf(context).width <
                            kBreakpointSmall) {
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
                      500.0,
                    ),
                    height: MediaQuery.sizeOf(context).height * 0.15,
                    child: custom_widgets.HairDamageProgressBar(
                      width: valueOrDefault<double>(
                        () {
                          if (MediaQuery.sizeOf(context).width <
                              kBreakpointSmall) {
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
                        500.0,
                      ),
                      height: MediaQuery.sizeOf(context).height * 0.15,
                      value: 0.7,
                      scoreText: 'High!',
                      animate: true,
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
                    child: Row(
                      mainAxisSize: MainAxisSize.max,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Container(
                            height: 220.0,
                            decoration: BoxDecoration(),
                            child: Align(
                              alignment: AlignmentDirectional(-1.0, -1.0),
                              child: Padding(
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    10.0, 0.0, 0.0, 0.0),
                                child: Column(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceAround,
                                  children: [
                                    wrapWithModel(
                                      model: _model.pitchWidgetModel1,
                                      updateCallback: () => safeSetState(() {}),
                                      child: PitchWidgetWidget(
                                        header: 'Hair problem',
                                        image:
                                            'https://static.vecteezy.com/system/resources/previews/002/212/476/non_2x/line-icon-for-stress-vector.jpg',
                                        description: () {
                                          if (FFAppState()
                                              .quizProfile
                                              .qaPairs
                                              .contains(
                                                  QuestionAnswerPairStruct(
                                                questionId: 'hairConcern',
                                                answerIds: ['concern_hairloss'],
                                              ))) {
                                            return ' Hair loss';
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
                                            return ' Split ends / dryness';
                                          } else if (FFAppState()
                                              .quizProfile
                                              .qaPairs
                                              .contains(
                                                  QuestionAnswerPairStruct(
                                                questionId: 'hairConcern',
                                                answerIds: ['concern_scalp'],
                                              ))) {
                                            return 'Scalp issues';
                                          } else if (FFAppState()
                                              .quizProfile
                                              .qaPairs
                                              .contains(
                                                  QuestionAnswerPairStruct(
                                                questionId: 'hairConcern',
                                                answerIds: ['concern_damage'],
                                              ))) {
                                            return 'Damage';
                                          } else {
                                            return 'Mixed';
                                          }
                                        }(),
                                      ),
                                    ),
                                    wrapWithModel(
                                      model: _model.pitchWidgetModel2,
                                      updateCallback: () => safeSetState(() {}),
                                      child: PitchWidgetWidget(
                                        header: 'Current routine',
                                        image:
                                            'https://static.vecteezy.com/system/resources/previews/002/212/476/non_2x/line-icon-for-stress-vector.jpg',
                                        description: () {
                                          if (FFAppState()
                                              .quizProfile
                                              .qaPairs
                                              .contains(
                                                  QuestionAnswerPairStruct(
                                                questionId: 'currentRoutine',
                                                answerIds: ['routine_complex'],
                                              ))) {
                                            return 'Complex';
                                          } else if (FFAppState()
                                              .quizProfile
                                              .qaPairs
                                              .contains(
                                                  QuestionAnswerPairStruct(
                                                questionId: 'currentRoutine',
                                                answerIds: ['routine_basic'],
                                              ))) {
                                            return 'Basic';
                                          } else if (FFAppState()
                                              .quizProfile
                                              .qaPairs
                                              .contains(
                                                  QuestionAnswerPairStruct(
                                                questionId: 'currentRoutine',
                                                answerIds: [
                                                  'routine_intermediete'
                                                ],
                                              ))) {
                                            return 'Intermediete';
                                          } else if (FFAppState()
                                              .quizProfile
                                              .qaPairs
                                              .contains(
                                                  QuestionAnswerPairStruct(
                                                questionId: 'currentRoutine',
                                                answerIds: ['routine_natural'],
                                              ))) {
                                            return 'Natural';
                                          } else {
                                            return 'Vague';
                                          }
                                        }(),
                                      ),
                                    ),
                                    wrapWithModel(
                                      model: _model.pitchWidgetModel3,
                                      updateCallback: () => safeSetState(() {}),
                                      child: PitchWidgetWidget(
                                        header: 'External Damage',
                                        image:
                                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6R7yoHVIjhiysF1KmcGYjm0jdDitmQqosgA&s',
                                        description: 'Elevated',
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: Container(
                            width: 200.0,
                            height: 220.0,
                            decoration: BoxDecoration(
                              color: FlutterFlowTheme.of(context)
                                  .secondaryBackground,
                              image: DecorationImage(
                                fit: BoxFit.cover,
                                image: Image.network(
                                  widget.image,
                                ).image,
                              ),
                              borderRadius: BorderRadius.circular(10.0),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(0.0, 10.0, 0.0, 0.0),
                    child: Container(
                      width: double.infinity,
                      height: 130.0,
                      decoration: BoxDecoration(
                        color: Color(0xA2F2B485),
                        borderRadius: BorderRadius.circular(5.0),
                        border: Border.all(
                          color: FlutterFlowTheme.of(context).secondary,
                        ),
                      ),
                      child: Align(
                        alignment: AlignmentDirectional(0.0, 0.0),
                        child: Padding(
                          padding: EdgeInsets.all(10.0),
                          child: Row(
                            mainAxisSize: MainAxisSize.max,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Padding(
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    0.0, 0.0, 10.0, 0.0),
                                child: Icon(
                                  Icons.info_outline,
                                  color:
                                      FlutterFlowTheme.of(context).primaryText,
                                  size: 22.0,
                                ),
                              ),
                              Expanded(
                                child: Column(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      widget.title!,
                                      style: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .override(
                                            fontFamily: 'Inter',
                                            fontSize: 16.0,
                                            letterSpacing: 0.0,
                                            fontWeight: FontWeight.w600,
                                          ),
                                    ),
                                    Expanded(
                                      child: Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            0.0, 5.0, 0.0, 0.0),
                                        child: Text(
                                          widget.description!,
                                          style: FlutterFlowTheme.of(context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Inter',
                                                fontSize: 14.0,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.normal,
                                              ),
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
