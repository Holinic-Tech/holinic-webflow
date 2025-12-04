import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'multi_choice_question_check_box_model.dart';
export 'multi_choice_question_check_box_model.dart';

/// Question with multiple-choice answer with check box.
class MultiChoiceQuestionCheckBoxWidget extends StatefulWidget {
  const MultiChoiceQuestionCheckBoxWidget({
    super.key,
    required this.question,
    required this.answerList,
    required this.navigationTap,
  });

  final String? question;

  /// Multiple-choice answer with check box
  final List<MultiChoiceCheckBoxStruct>? answerList;

  /// Continue button tap
  final Future Function()? navigationTap;

  @override
  State<MultiChoiceQuestionCheckBoxWidget> createState() =>
      _MultiChoiceQuestionCheckBoxWidgetState();
}

class _MultiChoiceQuestionCheckBoxWidgetState
    extends State<MultiChoiceQuestionCheckBoxWidget> {
  late MultiChoiceQuestionCheckBoxModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => MultiChoiceQuestionCheckBoxModel());

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
                        FFLocalizations.of(context).getText(
                          'lvb6hgxh' /* Select the damaging practices ... */,
                        ),
                        textAlign: TextAlign.center,
                        style: FlutterFlowTheme.of(context).bodyMedium.override(
                              font: GoogleFonts.inter(
                                fontWeight: FontWeight.w500,
                                fontStyle: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .fontStyle,
                              ),
                              color: FlutterFlowTheme.of(context).textRichBlack,
                              fontSize: 27.0,
                              letterSpacing: 0.0,
                              fontWeight: FontWeight.w500,
                              fontStyle: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .fontStyle,
                            ),
                      ),
                    ),
                    Align(
                      alignment: AlignmentDirectional(0.0, -1.0),
                      child: Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(0.0, 20.0, 0.0, 0.0),
                        child: Text(
                          FFLocalizations.of(context).getText(
                            'nbepcvyq' /* (Select all that apply) */,
                          ),
                          textAlign: TextAlign.justify,
                          style: FlutterFlowTheme.of(context)
                              .bodyMedium
                              .override(
                                font: GoogleFonts.inter(
                                  fontWeight: FontWeight.normal,
                                  fontStyle: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .fontStyle,
                                ),
                                color:
                                    FlutterFlowTheme.of(context).textRichBlack,
                                fontSize: 12.0,
                                letterSpacing: 0.0,
                                fontWeight: FontWeight.normal,
                                fontStyle: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .fontStyle,
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
                                final answerData = widget.answerList!.toList();

                                return ListView.separated(
                                  padding: EdgeInsets.zero,
                                  primary: false,
                                  shrinkWrap: true,
                                  scrollDirection: Axis.vertical,
                                  itemCount: answerData.length,
                                  separatorBuilder: (_, __) =>
                                      SizedBox(height: 15.0),
                                  itemBuilder: (context, answerDataIndex) {
                                    final answerDataItem =
                                        answerData[answerDataIndex];
                                    return InkWell(
                                      splashColor: Colors.transparent,
                                      focusColor: Colors.transparent,
                                      hoverColor: Colors.transparent,
                                      highlightColor: Colors.transparent,
                                      onTap: () async {
                                        FFAppState()
                                            .updateMultiChoiceAnswerAtIndex(
                                          answerDataIndex,
                                          (e) => e..checkBox = !e.checkBox,
                                        );
                                        safeSetState(() {});
                                        _model.selctedValue = answerDataIndex;
                                        safeSetState(() {});
                                      },
                                      child: Container(
                                        decoration: BoxDecoration(
                                          color: answerDataItem.checkBox == true
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
                                            color: answerDataItem.checkBox ==
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
                                                  20.0, 17.0, 20.0, 17.0),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.max,
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text(
                                                answerDataItem.title,
                                                textAlign: TextAlign.start,
                                                style: FlutterFlowTheme.of(
                                                        context)
                                                    .bodyMedium
                                                    .override(
                                                      font: GoogleFonts.inter(
                                                        fontWeight:
                                                            FontWeight.w500,
                                                        fontStyle:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .bodyMedium
                                                                .fontStyle,
                                                      ),
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .textRichBlack,
                                                      fontSize: 14.0,
                                                      letterSpacing: 0.0,
                                                      fontWeight:
                                                          FontWeight.w500,
                                                      fontStyle:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .bodyMedium
                                                              .fontStyle,
                                                    ),
                                              ),
                                              Container(
                                                decoration: BoxDecoration(
                                                  color:
                                                      answerDataItem.checkBox ==
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
                                                    color: answerDataItem
                                                                .checkBox ==
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
                                0.0, 15.0, 0.0, 0.0),
                            child: InkWell(
                              splashColor: Colors.transparent,
                              focusColor: Colors.transparent,
                              hoverColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              onTap: () async {
                                while (_model.count <
                                    FFAppState().multiChoiceAnswer.length) {
                                  FFAppState().updateMultiChoiceAnswerAtIndex(
                                    _model.count,
                                    (e) => e..checkBox = false,
                                  );
                                  safeSetState(() {});
                                  _model.count = _model.count + 1;
                                  safeSetState(() {});
                                }
                                _model.count = 0;
                                safeSetState(() {});
                                _model.selctedValue = 1000;
                                safeSetState(() {});
                              },
                              child: Container(
                                decoration: BoxDecoration(
                                  color: _model.selctedValue == 1000
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
                                    color: _model.selctedValue == 1000
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
                                    child: Text(
                                      FFLocalizations.of(context).getText(
                                        'vzfmsa5z' /* None of the above */,
                                      ),
                                      textAlign: TextAlign.center,
                                      style: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .override(
                                            font: GoogleFonts.inter(
                                              fontWeight: FontWeight.w500,
                                              fontStyle:
                                                  FlutterFlowTheme.of(context)
                                                      .bodyMedium
                                                      .fontStyle,
                                            ),
                                            color: FlutterFlowTheme.of(context)
                                                .textRichBlack,
                                            fontSize: 14.0,
                                            letterSpacing: 0.0,
                                            fontWeight: FontWeight.w500,
                                            fontStyle:
                                                FlutterFlowTheme.of(context)
                                                    .bodyMedium
                                                    .fontStyle,
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
            if (_model.selctedValue != null)
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
