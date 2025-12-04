import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import '/custom_code/widgets/index.dart' as custom_widgets;
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:google_fonts/google_fonts.dart';
import 'question_answer_additionl_info_model.dart';
export 'question_answer_additionl_info_model.dart';

/// Question with answer
class QuestionAnswerAdditionlInfoWidget extends StatefulWidget {
  const QuestionAnswerAdditionlInfoWidget({
    super.key,
    required this.question,
    required this.answerList,
    required this.answerAction,
  });

  final String? question;
  final List<AnswerWithAdditionalInfoStruct>? answerList;

  /// Answer call back
  final Future Function()? answerAction;

  @override
  State<QuestionAnswerAdditionlInfoWidget> createState() =>
      _QuestionAnswerAdditionlInfoWidgetState();
}

class _QuestionAnswerAdditionlInfoWidgetState
    extends State<QuestionAnswerAdditionlInfoWidget> {
  late QuestionAnswerAdditionlInfoModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => QuestionAnswerAdditionlInfoModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.answerList =
          widget.answerList!.toList().cast<AnswerWithAdditionalInfoStruct>();
      _model.question = widget.question;
      _model.answerId = [];
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
    return Stack(
      children: [
        Align(
          alignment: AlignmentDirectional(0.0, -1.0),
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
              color: FlutterFlowTheme.of(context).primaryWhite,
              image: DecorationImage(
                fit: BoxFit.cover,
                image: Image.network(
                  '',
                ).image,
              ),
            ),
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(
                  15.0,
                  valueOrDefault<double>(
                    FFAppConstants.templateTopPadding,
                    0.0,
                  ),
                  15.0,
                  0.0),
              child: Column(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(10.0, 0.0, 10.0, 10.0),
                    child: Text(
                      widget.question!,
                      textAlign: TextAlign.center,
                      style: FlutterFlowTheme.of(context).bodyMedium.override(
                            font: GoogleFonts.inter(
                              fontWeight: FontWeight.w500,
                              fontStyle: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .fontStyle,
                            ),
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
                            fontStyle: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .fontStyle,
                          ),
                    ),
                  ),
                  Expanded(
                    child: Padding(
                      padding: EdgeInsets.all(10.0),
                      child: Container(
                        width: double.infinity,
                        height: double.infinity,
                        child: custom_widgets.AnimatedText(
                          width: double.infinity,
                          height: double.infinity,
                          titleFontSize: 15.0,
                          descriptionFontSize: 13.0,
                          fontColor: FlutterFlowTheme.of(context).primaryText,
                          animateBoxColor:
                              FlutterFlowTheme.of(context).secondaryViolet,
                          animateBoxBorderColor:
                              FlutterFlowTheme.of(context).secondaryPlum,
                          selectedBoxColor:
                              FlutterFlowTheme.of(context).secondaryViolet,
                          unSelectedBoxColor:
                              FlutterFlowTheme.of(context).secondaryBackground,
                          selectedBoxBorderColor:
                              FlutterFlowTheme.of(context).secondaryPlum,
                          answerList: widget.answerList!,
                          onAnswerSelected: (indexInList) async {
                            // This action return the selected  answer index from the list.
                            // Index get in the variable "indexInList".
                            // "indexInList" type is int(index).
                            _model.selctedValue = indexInList;
                            _model.addToAnswerId(_model.answerList
                                .elementAtOrNull(_model.selctedValue!)!
                                .id);
                            _model.questionId =
                                _model.answerList.firstOrNull?.type;
                            _model.addToAnswer(_model.answerList
                                .elementAtOrNull(_model.selctedValue!)!
                                .answer);
                            safeSetState(() {});
                          },
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        if (_model.selctedValue != null)
          Align(
            alignment: AlignmentDirectional(0.0, 1.0),
            child: wrapWithModel(
              model: _model.footerButtonModel,
              updateCallback: () => safeSetState(() {}),
              child: FooterButtonWidget(
                buttonOnTap: () async {
                  await widget.answerAction?.call();
                },
              ),
            ),
          ),
      ],
    );
  }
}
