import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'pitch_body_simple_detailed_text_images_model.dart';
export 'pitch_body_simple_detailed_text_images_model.dart';

class PitchBodySimpleDetailedTextImagesWidget extends StatefulWidget {
  const PitchBodySimpleDetailedTextImagesWidget({
    super.key,
    String? image,
    this.title,
    String? description,
    required this.navigationTap,
    this.claim,
    this.valueProp,
    this.value1,
    this.value2,
    this.value3,
    this.value4,
    this.conclusion,
  })  : this.image =
            image ?? 'https://assets.hairqare.co/Dont%20Know%20Hair.webp',
        this.description = description ?? 'Description';

  final String image;
  final String? title;
  final String description;

  /// Continue button on tap
  final Future Function()? navigationTap;

  final String? claim;
  final String? valueProp;
  final String? value1;
  final String? value2;
  final String? value3;
  final String? value4;
  final String? conclusion;

  @override
  State<PitchBodySimpleDetailedTextImagesWidget> createState() =>
      _PitchBodySimpleDetailedTextImagesWidgetState();
}

class _PitchBodySimpleDetailedTextImagesWidgetState
    extends State<PitchBodySimpleDetailedTextImagesWidget> {
  late PitchBodySimpleDetailedTextImagesModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model =
        createModel(context, () => PitchBodySimpleDetailedTextImagesModel());

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
        child: Padding(
          padding: EdgeInsetsDirectional.fromSTEB(
              0.0,
              valueOrDefault<double>(
                FFAppConstants.templateTopPadding,
                0.0,
              ),
              0.0,
              0.0),
          child: Stack(
            children: [
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 80.0),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      if (responsiveVisibility(
                        context: context,
                        phone: false,
                        tablet: false,
                        tabletLandscape: false,
                        desktop: false,
                      ))
                        Align(
                          alignment: AlignmentDirectional(-1.0, 0.0),
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                0.0, 0.0, 0.0, 10.0),
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
                                        MediaQuery.sizeOf(context).height <
                                                500.0
                                            ? 16.0
                                            : 20.0,
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
                              0.0, 10.0, 0.0, 10.0),
                          child: RichText(
                            textScaler: MediaQuery.of(context).textScaler,
                            text: TextSpan(
                              children: [
                                TextSpan(
                                  text: widget.description,
                                  style: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .override(
                                        font: GoogleFonts.inter(
                                          fontWeight: FontWeight.normal,
                                          fontStyle:
                                              FlutterFlowTheme.of(context)
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
                                )
                              ],
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    font: GoogleFonts.inter(
                                      fontWeight: FontWeight.normal,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
                                    ),
                                    fontSize:
                                        MediaQuery.sizeOf(context).height <
                                                500.0
                                            ? 13.0
                                            : 16.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
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
                      Align(
                        alignment: AlignmentDirectional(-1.0, 0.0),
                        child: Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 10.0, 0.0, 10.0),
                          child: RichText(
                            textScaler: MediaQuery.of(context).textScaler,
                            text: TextSpan(
                              children: [
                                TextSpan(
                                  text: valueOrDefault<String>(
                                    widget.claim,
                                    'claim',
                                  ),
                                  style: GoogleFonts.inter(
                                    fontWeight: FontWeight.w300,
                                  ),
                                )
                              ],
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    font: GoogleFonts.inter(
                                      fontWeight: FontWeight.normal,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
                                    ),
                                    fontSize:
                                        MediaQuery.sizeOf(context).height <
                                                500.0
                                            ? 13.0
                                            : 16.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
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
                      Align(
                        alignment: AlignmentDirectional(-1.0, 0.0),
                        child: Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 10.0, 0.0, 10.0),
                          child: RichText(
                            textScaler: MediaQuery.of(context).textScaler,
                            text: TextSpan(
                              children: [
                                TextSpan(
                                  text: widget.conclusion!,
                                  style: GoogleFonts.inter(
                                    fontWeight: FontWeight.w500,
                                  ),
                                )
                              ],
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    font: GoogleFonts.inter(
                                      fontWeight: FontWeight.normal,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
                                    ),
                                    fontSize:
                                        MediaQuery.sizeOf(context).height <
                                                500.0
                                            ? 13.0
                                            : 16.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
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
                      Container(
                        width: 600.0,
                        constraints: BoxConstraints(
                          maxWidth: MediaQuery.sizeOf(context).width * 1.0,
                        ),
                        decoration: BoxDecoration(),
                        child: Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 20.0, 0.0, 30.0),
                          child: Column(
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              Divider(
                                thickness: 2.0,
                                color: FlutterFlowTheme.of(context).alternate,
                              ),
                              Align(
                                alignment: AlignmentDirectional(-1.0, 0.0),
                                child: RichText(
                                  textScaler: MediaQuery.of(context).textScaler,
                                  text: TextSpan(
                                    children: [
                                      TextSpan(
                                        text: valueOrDefault<String>(
                                          widget.valueProp,
                                          'valueProp',
                                        ),
                                        style: GoogleFonts.inter(
                                          color: FlutterFlowTheme.of(context)
                                              .secondary,
                                          fontWeight: FontWeight.normal,
                                        ),
                                      )
                                    ],
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          font: GoogleFonts.inter(
                                            fontWeight:
                                                FlutterFlowTheme.of(context)
                                                    .bodyMedium
                                                    .fontWeight,
                                            fontStyle:
                                                FlutterFlowTheme.of(context)
                                                    .bodyMedium
                                                    .fontStyle,
                                          ),
                                          fontSize: MediaQuery.sizeOf(context)
                                                      .height <
                                                  500.0
                                              ? 14.0
                                              : 16.0,
                                          letterSpacing: 0.0,
                                          fontWeight:
                                              FlutterFlowTheme.of(context)
                                                  .bodyMedium
                                                  .fontWeight,
                                          fontStyle:
                                              FlutterFlowTheme.of(context)
                                                  .bodyMedium
                                                  .fontStyle,
                                          lineHeight: 1.25,
                                        ),
                                  ),
                                  textAlign: TextAlign.start,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      Container(
                        width: 600.0,
                        constraints: BoxConstraints(
                          maxWidth: MediaQuery.sizeOf(context).width * 1.0,
                        ),
                        decoration: BoxDecoration(),
                        child: Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 0.0, 0.0, 10.0),
                          child: Column(
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              Padding(
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    0.0, 0.0, 0.0, 25.0),
                                child: Container(
                                  width: double.infinity,
                                  child: CarouselSlider(
                                    items: [
                                      ClipRRect(
                                        borderRadius:
                                            BorderRadius.circular(8.0),
                                        child: Image.network(
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
                                                return 'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe7670946a4f4efe78f27f_Hair%20loss%20Testimonial%202.webp';
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
                                                return 'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe76356f58f44bfa5512fa_Split%20Ends%20%20Testimonial%203.webp';
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
                                                return 'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe76ce650a4ff4c90f9b78_Dandruff%20%20Testimonial%203.webp';
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
                                                return 'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe769e9687b41e5951e1c4_Damage%20%20Testimonial%203.webp';
                                              } else {
                                                return 'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe75f0f77bbb2bd03633c7_Other%20issue%20Testimonial%203.webp';
                                              }
                                            }(),
                                            'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe75f0f77bbb2bd03633c7_Other%20issue%20Testimonial%203.webp',
                                          ),
                                          width: 300.0,
                                          height: 200.0,
                                          fit: BoxFit.contain,
                                        ),
                                      ),
                                      ClipRRect(
                                        borderRadius:
                                            BorderRadius.circular(8.0),
                                        child: Image.network(
                                          'https://assets.hairqare.co/text-only-recommended-testimonial.webp',
                                          width: 200.0,
                                          height: 200.0,
                                          fit: BoxFit.contain,
                                        ),
                                      ),
                                      ClipRRect(
                                        borderRadius:
                                            BorderRadius.circular(4.0),
                                        child: Image.network(
                                          'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66c7356034a5be779c112cf1_PITCH%203%20Testimonial%202.webp',
                                          width: 300.0,
                                          height: 200.0,
                                          fit: BoxFit.contain,
                                        ),
                                      ),
                                      ClipRRect(
                                        borderRadius:
                                            BorderRadius.circular(8.0),
                                        child: Image.network(
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
                                                return 'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe766f521064e5a70c318e_Hair%20loss%20Testimonial%203.webp';
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
                                                return 'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe7635420a4e34119c551b_Split%20Ends%20%20Testimonial%201.webp';
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
                                                return 'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe76ce81f8b661564e2394_Dandruff%20%20Testimonial%202.webp';
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
                                                return 'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe769f85dca920b329cf16_Damage%20%20Testimonial%201.webp';
                                              } else {
                                                return 'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe75efe655a39ef2c53565_Other%20issue%20Testimonial%201.webp';
                                              }
                                            }(),
                                            'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe75efe655a39ef2c53565_Other%20issue%20Testimonial%201.webp',
                                          ),
                                          width: 300.0,
                                          height: 200.0,
                                          fit: BoxFit.contain,
                                        ),
                                      ),
                                      Container(
                                        decoration: BoxDecoration(
                                          color: FlutterFlowTheme.of(context)
                                              .secondaryBackground,
                                          borderRadius:
                                              BorderRadius.circular(8.0),
                                        ),
                                        child: ClipRRect(
                                          borderRadius:
                                              BorderRadius.circular(8.0),
                                          child: Image.network(
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
                                                  return 'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe766f4e52e1e187b3c477_Hair%20loss%20Testimonial%204.webp';
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
                                                  return 'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe7635d9a4fcb363d5d162_Split%20Ends%20%20Testimonial%204.webp';
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
                                                  return 'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe76ceddf5ee9b84190120_Dandruff%20%20Testimonial%204.webp';
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
                                                  return 'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe769f77537071f1a60cdf_Damage%20%20Testimonial%204.webp';
                                                } else {
                                                  return 'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe75eff1bd5a87716d7f23_Other%20issue%20Testimonial%204.webp';
                                                }
                                              }(),
                                              'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe75eff1bd5a87716d7f23_Other%20issue%20Testimonial%204.webp',
                                            ),
                                            width: 300.0,
                                            height: 200.0,
                                            fit: BoxFit.contain,
                                          ),
                                        ),
                                      ),
                                    ],
                                    carouselController:
                                        _model.carouselController ??=
                                            CarouselSliderController(),
                                    options: CarouselOptions(
                                      initialPage: 1,
                                      viewportFraction: 0.6,
                                      disableCenter: true,
                                      enlargeCenterPage: true,
                                      enlargeFactor: 0.25,
                                      enableInfiniteScroll: true,
                                      scrollDirection: Axis.horizontal,
                                      autoPlay: true,
                                      autoPlayAnimationDuration:
                                          Duration(milliseconds: 800),
                                      autoPlayInterval:
                                          Duration(milliseconds: (800 + 3000)),
                                      autoPlayCurve: Curves.linear,
                                      pauseAutoPlayInFiniteScroll: true,
                                      onPageChanged: (index, _) =>
                                          _model.carouselCurrentIndex = index,
                                    ),
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
      ),
    );
  }
}
