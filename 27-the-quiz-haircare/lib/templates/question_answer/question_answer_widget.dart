import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/custom_code/actions/index.dart' as actions;
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'question_answer_model.dart';
export 'question_answer_model.dart';

/// Question with answer
class QuestionAnswerWidget extends StatefulWidget {
  const QuestionAnswerWidget({
    super.key,
    required this.question,
    required this.answerList,
    required this.answerAction,
    this.questionId,
  });

  final String? question;
  final List<AnswerStruct>? answerList;

  /// Answer call back
  final Future Function()? answerAction;

  final String? questionId;

  @override
  State<QuestionAnswerWidget> createState() => _QuestionAnswerWidgetState();
}

class _QuestionAnswerWidgetState extends State<QuestionAnswerWidget> {
  late QuestionAnswerModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => QuestionAnswerModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
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
        width: double.infinity,
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
          child: SingleChildScrollView(
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
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 32.0, 0.0, 0.0),
                  child: Builder(
                    builder: (context) {
                      final answerData = widget.answerList!.toList();

                      return ListView.separated(
                        padding: EdgeInsets.zero,
                        primary: false,
                        shrinkWrap: true,
                        scrollDirection: Axis.vertical,
                        itemCount: answerData.length,
                        separatorBuilder: (_, __) => SizedBox(height: 15.0),
                        itemBuilder: (context, answerDataIndex) {
                          final answerDataItem = answerData[answerDataIndex];
                          return Align(
                            alignment: AlignmentDirectional(0.0, 0.0),
                            child: InkWell(
                              splashColor: Colors.transparent,
                              focusColor: Colors.transparent,
                              hoverColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              onTap: () async {
                                _model.selctedValue = answerDataIndex;
                                _model
                                    .addToSelectedAnswer(valueOrDefault<String>(
                                  answerDataItem.id,
                                  'test',
                                ));
                                _model.questionId = valueOrDefault<String>(
                                  answerDataItem.type,
                                  'test',
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
                              },
                              child: Container(
                                width: double.infinity,
                                decoration: BoxDecoration(
                                  color: _model.selctedValue == answerDataIndex
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
                                    color:
                                        _model.selctedValue == answerDataIndex
                                            ? FlutterFlowTheme.of(context)
                                                .secondaryPlum
                                            : FlutterFlowTheme.of(context)
                                                .transparent,
                                  ),
                                ),
                                child: Builder(
                                  builder: (context) {
                                    if (answerDataItem.image != '') {
                                      return Row(
                                        mainAxisSize: MainAxisSize.max,
                                        children: [
                                          if (answerDataItem.image == '')
                                            Padding(
                                              padding: EdgeInsets.all(10.0),
                                              child: Container(
                                                width: 38.0,
                                                height: 38.0,
                                                decoration: BoxDecoration(
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .secondaryBackground,
                                                  image: DecorationImage(
                                                    fit: BoxFit.cover,
                                                    image: Image.network(
                                                      'https://cdn.pixabay.com/photo/2020/12/27/20/25/smile-5865209_1280.png',
                                                    ).image,
                                                  ),
                                                ),
                                              ),
                                            ),
                                          Expanded(
                                            child: Align(
                                              alignment: AlignmentDirectional(
                                                  -1.0, -1.0),
                                              child: Padding(
                                                padding: EdgeInsetsDirectional
                                                    .fromSTEB(
                                                        0.0, 20.0, 0.0, 20.0),
                                                child: Text(
                                                  answerDataItem.answer,
                                                  textAlign: TextAlign.start,
                                                  style: FlutterFlowTheme.of(
                                                          context)
                                                      .bodyMedium
                                                      .override(
                                                        fontFamily: 'Inter',
                                                        color:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .textRichBlack,
                                                        fontSize: 16.0,
                                                        letterSpacing: 0.0,
                                                        fontWeight:
                                                            FontWeight.w500,
                                                      ),
                                                ),
                                              ),
                                            ),
                                          ),
                                        ],
                                      );
                                    } else {
                                      return Align(
                                        alignment:
                                            AlignmentDirectional(0.0, -1.0),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.max,
                                          children: [
                                            Expanded(
                                              child: Align(
                                                alignment: AlignmentDirectional(
                                                    -1.0, 0.0),
                                                child: Padding(
                                                  padding: EdgeInsetsDirectional
                                                      .fromSTEB(20.0, 20.0, 0.0,
                                                          20.0),
                                                  child: Text(
                                                    answerDataItem.answer,
                                                    textAlign: TextAlign.start,
                                                    style: FlutterFlowTheme.of(
                                                            context)
                                                        .bodyMedium
                                                        .override(
                                                          fontFamily: 'Inter',
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .textRichBlack,
                                                          fontSize: 16.0,
                                                          letterSpacing: 0.0,
                                                          fontWeight:
                                                              FontWeight.w500,
                                                        ),
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      );
                                    }
                                  },
                                ),
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
        ),
      ),
    );
  }
}
