import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import '/custom_code/actions/index.dart' as actions;
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'multi_choice_with_image_question_check_box_model.dart';
export 'multi_choice_with_image_question_check_box_model.dart';

/// Question with multiple-choice answer with check box.
class MultiChoiceWithImageQuestionCheckBoxWidget extends StatefulWidget {
  const MultiChoiceWithImageQuestionCheckBoxWidget({
    super.key,
    required this.question,
    required this.answerList,
    required this.navigationTap,
    this.questionId,
    this.selectedAnswers,
  });

  final String? question;

  /// Multiple-choice answer with check box
  final List<MultiChoiceWithImagesCheckBoxStruct>? answerList;

  /// Continue button on Tap
  final Future Function()? navigationTap;

  final String? questionId;
  final List<MultiChoiceWithImagesCheckBoxStruct>? selectedAnswers;

  @override
  State<MultiChoiceWithImageQuestionCheckBoxWidget> createState() =>
      _MultiChoiceWithImageQuestionCheckBoxWidgetState();
}

class _MultiChoiceWithImageQuestionCheckBoxWidgetState
    extends State<MultiChoiceWithImageQuestionCheckBoxWidget> {
  late MultiChoiceWithImageQuestionCheckBoxModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model =
        createModel(context, () => MultiChoiceWithImageQuestionCheckBoxModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.localAnswerList = widget.answerList!
          .toList()
          .cast<MultiChoiceWithImagesCheckBoxStruct>();
      _model.questionId = valueOrDefault<String>(
        _model.localAnswerList.firstOrNull?.type,
        'test',
      );
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
          color: FlutterFlowTheme.of(context).primary,
        ),
        child: Stack(
          children: [
            Padding(
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
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(15.0, 0.0, 15.0, 0.0),
                      child: Text(
                        valueOrDefault<String>(
                          widget.question,
                          'question',
                        ),
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
                    Align(
                      alignment: AlignmentDirectional(0.0, -1.0),
                      child: Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(0.0, 20.0, 0.0, 0.0),
                        child: Text(
                          'Select all that apply',
                          textAlign: TextAlign.justify,
                          style: FlutterFlowTheme.of(context)
                              .bodyMedium
                              .override(
                                fontFamily: 'Inter',
                                color:
                                    FlutterFlowTheme.of(context).textRichBlack,
                                fontSize: 15.0,
                                letterSpacing: 0.0,
                                fontWeight: FontWeight.normal,
                              ),
                        ),
                      ),
                    ),
                    Container(
                      constraints: BoxConstraints(
                        maxWidth: () {
                          if (MediaQuery.sizeOf(context).width <
                              kBreakpointSmall) {
                            return MediaQuery.sizeOf(context).width;
                          } else if (MediaQuery.sizeOf(context).width <
                              kBreakpointMedium) {
                            return MediaQuery.sizeOf(context).width;
                          } else if (MediaQuery.sizeOf(context).width <
                              kBreakpointLarge) {
                            return MediaQuery.sizeOf(context).width;
                          } else {
                            return (MediaQuery.sizeOf(context).width * 0.5);
                          }
                        }(),
                      ),
                      decoration: BoxDecoration(),
                      child: Column(
                        mainAxisSize: MainAxisSize.max,
                        children: [
                          Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                0.0, 32.0, 0.0, 0.0),
                            child: Builder(
                              builder: (context) {
                                final multichoiceData =
                                    _model.localAnswerList.toList();

                                return ListView.separated(
                                  padding: EdgeInsets.zero,
                                  primary: false,
                                  shrinkWrap: true,
                                  scrollDirection: Axis.vertical,
                                  itemCount: multichoiceData.length,
                                  separatorBuilder: (_, __) =>
                                      SizedBox(height: () {
                                    if ((MediaQuery.sizeOf(context).width <
                                            kBreakpointSmall) &&
                                        (widget.answerList!.length > 4)) {
                                      return 5.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointMedium) {
                                      return 10.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointLarge) {
                                      return 15.0;
                                    } else {
                                      return 15.0;
                                    }
                                  }()),
                                  itemBuilder: (context, multichoiceDataIndex) {
                                    final multichoiceDataItem =
                                        multichoiceData[multichoiceDataIndex];
                                    return InkWell(
                                      splashColor: Colors.transparent,
                                      focusColor: Colors.transparent,
                                      hoverColor: Colors.transparent,
                                      highlightColor: Colors.transparent,
                                      onTap: () async {
                                        _model.selectedValue =
                                            multichoiceDataIndex;
                                        _model.updateLocalAnswerListAtIndex(
                                          multichoiceDataIndex,
                                          (e) => e..checklBox = !e.checklBox,
                                        );
                                        _model.addToSelectedAnswer(
                                            valueOrDefault<String>(
                                          _model.localAnswerList
                                                      .elementAtOrNull(
                                                          multichoiceDataIndex)
                                                      ?.checklBox ==
                                                  true
                                              ? _model.localAnswerList
                                                  .elementAtOrNull(
                                                      multichoiceDataIndex)
                                                  ?.id
                                              : '',
                                          'test select',
                                        ));
                                        _model
                                            .addToAnswer(valueOrDefault<String>(
                                          _model.localAnswerList
                                                      .elementAtOrNull(
                                                          multichoiceDataIndex)
                                                      ?.checklBox ==
                                                  true
                                              ? _model.localAnswerList
                                                  .elementAtOrNull(
                                                      multichoiceDataIndex)
                                                  ?.title
                                              : '',
                                          'test select',
                                        ));
                                        safeSetState(() {});
                                      },
                                      child: Container(
                                        constraints: BoxConstraints(
                                          maxHeight: () {
                                            if ((MediaQuery.sizeOf(context)
                                                        .width <
                                                    kBreakpointSmall) &&
                                                (widget.answerList!.length >
                                                    3)) {
                                              return 60.0;
                                            } else if (MediaQuery.sizeOf(
                                                        context)
                                                    .width <
                                                kBreakpointMedium) {
                                              return 100.0;
                                            } else if (MediaQuery.sizeOf(
                                                        context)
                                                    .width <
                                                kBreakpointLarge) {
                                              return 100.0;
                                            } else {
                                              return 100.0;
                                            }
                                          }(),
                                        ),
                                        decoration: BoxDecoration(
                                          color:
                                              multichoiceDataItem.checklBox ==
                                                      true
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
                                          borderRadius:
                                              BorderRadius.circular(11.0),
                                          border: Border.all(
                                            color: multichoiceDataItem
                                                        .checklBox ==
                                                    true
                                                ? FlutterFlowTheme.of(context)
                                                    .secondaryPlum
                                                : FlutterFlowTheme.of(context)
                                                    .transparent,
                                          ),
                                        ),
                                        child: Padding(
                                          padding:
                                              EdgeInsetsDirectional.fromSTEB(
                                                  0.0, 0.0, 20.0, 0.0),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.max,
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              if (!widget.answerList!.contains(
                                                  MultiChoiceWithImagesCheckBoxStruct(
                                                image: '',
                                              )))
                                                Container(
                                                  width: 60.0,
                                                  height: 60.0,
                                                  decoration: BoxDecoration(
                                                    color: FlutterFlowTheme.of(
                                                            context)
                                                        .secondaryBackground,
                                                    image: DecorationImage(
                                                      fit: BoxFit.cover,
                                                      image: Image.network(
                                                        multichoiceDataItem
                                                            .image,
                                                      ).image,
                                                    ),
                                                    borderRadius:
                                                        BorderRadius.only(
                                                      bottomLeft:
                                                          Radius.circular(11.0),
                                                      bottomRight:
                                                          Radius.circular(0.0),
                                                      topLeft:
                                                          Radius.circular(11.0),
                                                      topRight:
                                                          Radius.circular(0.0),
                                                    ),
                                                  ),
                                                ),
                                              Expanded(
                                                child: Padding(
                                                  padding: EdgeInsetsDirectional
                                                      .fromSTEB(
                                                          10.0, 0.0, 10.0, 0.0),
                                                  child: Text(
                                                    multichoiceDataItem.title,
                                                    textAlign: TextAlign.start,
                                                    style: FlutterFlowTheme.of(
                                                            context)
                                                        .bodyMedium
                                                        .override(
                                                          fontFamily: 'Inter',
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .textRichBlack,
                                                          fontSize: 14.0,
                                                          letterSpacing: 0.0,
                                                          fontWeight:
                                                              FontWeight.w500,
                                                        ),
                                                  ),
                                                ),
                                              ),
                                              Container(
                                                decoration: BoxDecoration(
                                                  color: multichoiceDataItem
                                                              .checklBox ==
                                                          false
                                                      ? FlutterFlowTheme.of(
                                                              context)
                                                          .primaryWhite
                                                      : FlutterFlowTheme.of(
                                                              context)
                                                          .secondaryPlum,
                                                  borderRadius:
                                                      BorderRadius.circular(
                                                          3.0),
                                                  border: Border.all(
                                                    color: multichoiceDataItem
                                                                .checklBox ==
                                                            false
                                                        ? FlutterFlowTheme.of(
                                                                context)
                                                            .secondaryPlum
                                                        : FlutterFlowTheme.of(
                                                                context)
                                                            .backgroundDove,
                                                    width: 1.5,
                                                  ),
                                                ),
                                                child: Icon(
                                                  Icons.check_sharp,
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .primaryWhite,
                                                  size: 18.0,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    );
                                  },
                                );
                              },
                            ),
                          ),
                          Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                0.0,
                                valueOrDefault<double>(
                                  () {
                                    if ((MediaQuery.sizeOf(context).width <
                                            kBreakpointSmall) &&
                                        (widget.answerList!.length > 4)) {
                                      return 5.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointMedium) {
                                      return 10.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointLarge) {
                                      return 15.0;
                                    } else {
                                      return 15.0;
                                    }
                                  }(),
                                  0.0,
                                ),
                                0.0,
                                0.0),
                            child: InkWell(
                              splashColor: Colors.transparent,
                              focusColor: Colors.transparent,
                              hoverColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              onTap: () async {
                                while (
                                    _model.count < widget.answerList!.length) {
                                  FFAppState()
                                      .updateMultiChoiceWithImageAtIndex(
                                    _model.count,
                                    (e) => e..checklBox = false,
                                  );
                                  safeSetState(() {});
                                  _model.count = _model.count + 1;
                                  safeSetState(() {});
                                }
                                _model.count = 0;
                                safeSetState(() {});
                                _model.selectedValue = 1000;
                                safeSetState(() {});
                                _model.selectedAnswer = [];
                                safeSetState(() {});
                                _model.addToSelectedAnswer('n/a');
                                safeSetState(() {});
                                await widget.navigationTap?.call();
                              },
                              child: Container(
                                constraints: BoxConstraints(
                                  maxHeight: () {
                                    if ((MediaQuery.sizeOf(context).width <
                                            kBreakpointSmall) &&
                                        (widget.answerList!.length > 3)) {
                                      return 50.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointMedium) {
                                      return 60.0;
                                    } else if (MediaQuery.sizeOf(context)
                                            .width <
                                        kBreakpointLarge) {
                                      return 60.0;
                                    } else {
                                      return 60.0;
                                    }
                                  }(),
                                ),
                                decoration: BoxDecoration(
                                  color: _model.selectedValue == 1000
                                      ? FlutterFlowTheme.of(context)
                                          .secondaryViolet
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
                                  borderRadius: BorderRadius.circular(11.0),
                                  border: Border.all(
                                    color: _model.selectedValue == 1000
                                        ? FlutterFlowTheme.of(context)
                                            .secondaryPlum
                                        : FlutterFlowTheme.of(context)
                                            .transparent,
                                  ),
                                ),
                                child: Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      20.0, 17.0, 20.0, 17.0),
                                  child: Container(
                                    width: double.infinity,
                                    decoration: BoxDecoration(),
                                    child: Align(
                                      alignment:
                                          AlignmentDirectional(-1.0, 0.0),
                                      child: Text(
                                        'None of the above',
                                        textAlign: TextAlign.center,
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Inter',
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .textRichBlack,
                                              fontSize: 14.0,
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.w500,
                                            ),
                                      ),
                                    ),
                                  ),
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
            if (_model.selectedValue != null)
              Align(
                alignment: AlignmentDirectional(0.0, 1.0),
                child: wrapWithModel(
                  model: _model.footerButtonModel,
                  updateCallback: () => safeSetState(() {}),
                  child: FooterButtonWidget(
                    buttonOnTap: () async {
                      await actions.trackGAEvent(
                        'Question Answered',
                        widget.questionId,
                        widget.question,
                        _model.selectedAnswer.toList(),
                        '',
                        '',
                      );
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
