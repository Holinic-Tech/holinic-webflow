import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/custom_code/actions/index.dart' as actions;
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:google_fonts/google_fonts.dart';
import 'titles_and_description_ans_body_model.dart';
export 'titles_and_description_ans_body_model.dart';

/// Question with answer titles and description.
class TitlesAndDescriptionAnsBodyWidget extends StatefulWidget {
  const TitlesAndDescriptionAnsBodyWidget({
    super.key,
    required this.answerList,
    required this.question,
    required this.description,
    required this.answerAction,
  });

  /// Title and desription
  final List<AnswerWithTitleAndDescriptionStruct>? answerList;

  final String? question;

  /// Question Description
  final String? description;

  /// Answer Action
  final Future Function()? answerAction;

  @override
  State<TitlesAndDescriptionAnsBodyWidget> createState() =>
      _TitlesAndDescriptionAnsBodyWidgetState();
}

class _TitlesAndDescriptionAnsBodyWidgetState
    extends State<TitlesAndDescriptionAnsBodyWidget> {
  late TitlesAndDescriptionAnsBodyModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => TitlesAndDescriptionAnsBodyModel());

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
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 10.0),
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
                          fontStyle:
                              FlutterFlowTheme.of(context).bodyMedium.fontStyle,
                        ),
                  ),
                ),
                if (widget.description != null && widget.description != '')
                  Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(20.0, 0.0, 20.0, 0.0),
                    child: Text(
                      widget.description!,
                      textAlign: TextAlign.center,
                      style: FlutterFlowTheme.of(context).bodyMedium.override(
                            font: GoogleFonts.inter(
                              fontWeight: FontWeight.normal,
                              fontStyle: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .fontStyle,
                            ),
                            color: FlutterFlowTheme.of(context).textRichBlack,
                            fontSize: 14.0,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.normal,
                            fontStyle: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .fontStyle,
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
                        separatorBuilder: (_, __) => SizedBox(height: () {
                          if (MediaQuery.sizeOf(context).width <
                              kBreakpointSmall) {
                            return 7.0;
                          } else if (MediaQuery.sizeOf(context).width <
                              kBreakpointMedium) {
                            return 10.0;
                          } else if (MediaQuery.sizeOf(context).width <
                              kBreakpointLarge) {
                            return 15.0;
                          } else {
                            return 15.0;
                          }
                        }()),
                        itemBuilder: (context, answerDataIndex) {
                          final answerDataItem = answerData[answerDataIndex];
                          return InkWell(
                            splashColor: Colors.transparent,
                            focusColor: Colors.transparent,
                            hoverColor: Colors.transparent,
                            highlightColor: Colors.transparent,
                            onTap: () async {
                              await Future.wait([
                                Future(() async {
                                  _model.selctedValue = answerDataIndex;
                                  _model.addToSelectedAnswer(answerDataItem.id);
                                  _model.questionId = answerDataItem.type;
                                  safeSetState(() {});
                                  await actions.trackGAEvent(
                                    'Question Answered',
                                    answerDataItem.type,
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
                                  color: _model.selctedValue == answerDataIndex
                                      ? FlutterFlowTheme.of(context)
                                          .secondaryPlum
                                      : FlutterFlowTheme.of(context)
                                          .transparent,
                                ),
                              ),
                              child: Padding(
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    20.0, 0.0, 20.0, 0.0),
                                child: Column(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceEvenly,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          0.0,
                                          valueOrDefault<double>(
                                            answerDataItem
                                                            .description ==
                                                        ''
                                                ? 10.0
                                                : 0.0,
                                            0.0,
                                          ),
                                          0.0,
                                          valueOrDefault<double>(
                                            answerDataItem
                                                            .description ==
                                                        ''
                                                ? 10.0
                                                : 0.0,
                                            0.0,
                                          )),
                                      child: Text(
                                        answerDataItem.title,
                                        textAlign: TextAlign.start,
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              font: GoogleFonts.inter(
                                                fontWeight: FontWeight.w600,
                                                fontStyle:
                                                    FlutterFlowTheme.of(context)
                                                        .bodyMedium
                                                        .fontStyle,
                                              ),
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .textRichBlack,
                                              fontSize: valueOrDefault<double>(
                                                MediaQuery.sizeOf(context)
                                                            .height <
                                                        649.0
                                                    ? 14.0
                                                    : 16.0,
                                                20.0,
                                              ),
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.w600,
                                              fontStyle:
                                                  FlutterFlowTheme.of(context)
                                                      .bodyMedium
                                                      .fontStyle,
                                            ),
                                      ),
                                    ),
                                    if (answerDataItem.description != '')
                                      AutoSizeText(
                                        answerDataItem.description,
                                        textAlign: TextAlign.start,
                                        minFontSize: 10.0,
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
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .textShadow,
                                              fontSize:
                                                  (MediaQuery.sizeOf(context)
                                                                  .height <
                                                              649.0) &&
                                                          (widget.answerList!
                                                                  .length >
                                                              4)
                                                      ? 12.0
                                                      : 14.0,
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.normal,
                                              fontStyle:
                                                  FlutterFlowTheme.of(context)
                                                      .bodyMedium
                                                      .fontStyle,
                                            ),
                                      ),
                                  ]
                                      .divide(SizedBox(
                                          height: (kBreakpointSmall != null) &&
                                                  (widget.answerList!.length >
                                                      3)
                                              ? 2.5
                                              : 5.0))
                                      .addToStart(SizedBox(height: 10.0))
                                      .addToEnd(SizedBox(height: 10.0)),
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
