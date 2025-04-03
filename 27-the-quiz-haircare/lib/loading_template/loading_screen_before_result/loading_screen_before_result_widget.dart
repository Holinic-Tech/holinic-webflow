import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/custom_code/widgets/index.dart' as custom_widgets;
import '/flutter_flow/custom_functions.dart' as functions;
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import 'loading_screen_before_result_model.dart';
export 'loading_screen_before_result_model.dart';

class LoadingScreenBeforeResultWidget extends StatefulWidget {
  const LoadingScreenBeforeResultWidget({
    super.key,
    required this.autoNavigation,
    String? title,
    required this.carouselImageList,
    required this.checkPointList,
  }) : this.title = title ?? 'The only haircare program you’ll ever need';

  /// page navigation
  final Future Function()? autoNavigation;

  final String title;
  final List<String>? carouselImageList;

  /// Check points data list
  final List<String>? checkPointList;

  @override
  State<LoadingScreenBeforeResultWidget> createState() =>
      _LoadingScreenBeforeResultWidgetState();
}

class _LoadingScreenBeforeResultWidgetState
    extends State<LoadingScreenBeforeResultWidget>
    with TickerProviderStateMixin {
  late LoadingScreenBeforeResultModel _model;

  final animationsMap = <String, AnimationInfo>{};

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => LoadingScreenBeforeResultModel());

    animationsMap.addAll({
      'rowOnPageLoadAnimation': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: null,
      ),
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
              16.0,
              valueOrDefault<double>(
                FFAppConstants.templateTopPadding,
                0.0,
              ),
              16.0,
              0.0),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Text(
                  'The only haircare program you’ll ever need',
                  textAlign: TextAlign.center,
                  style: FlutterFlowTheme.of(context).bodyMedium.override(
                        fontFamily: 'Inter',
                        fontSize: 28.0,
                        letterSpacing: 0.0,
                        fontWeight: FontWeight.w500,
                      ),
                ),
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(
                      0.0,
                      valueOrDefault<double>(
                        () {
                          if (MediaQuery.sizeOf(context).width <
                              kBreakpointSmall) {
                            return 20.0;
                          } else if (MediaQuery.sizeOf(context).width <
                              kBreakpointMedium) {
                            return 40.0;
                          } else if (MediaQuery.sizeOf(context).width <
                              kBreakpointLarge) {
                            return 40.0;
                          } else {
                            return 40.0;
                          }
                        }(),
                        0.0,
                      ),
                      0.0,
                      valueOrDefault<double>(
                        () {
                          if (MediaQuery.sizeOf(context).width <
                              kBreakpointSmall) {
                            return 20.0;
                          } else if (MediaQuery.sizeOf(context).width <
                              kBreakpointMedium) {
                            return 40.0;
                          } else if (MediaQuery.sizeOf(context).width <
                              kBreakpointLarge) {
                            return 40.0;
                          } else {
                            return 40.0;
                          }
                        }(),
                        0.0,
                      )),
                  child: Container(
                    width: double.infinity,
                    height: () {
                      if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
                        return 250.0;
                      } else if (MediaQuery.sizeOf(context).width <
                          kBreakpointMedium) {
                        return 317.0;
                      } else if (MediaQuery.sizeOf(context).width <
                          kBreakpointLarge) {
                        return 317.0;
                      } else {
                        return 317.0;
                      }
                    }(),
                    child: custom_widgets.HairCareSliders(
                      width: double.infinity,
                      height: () {
                        if (MediaQuery.sizeOf(context).width <
                            kBreakpointSmall) {
                          return 250.0;
                        } else if (MediaQuery.sizeOf(context).width <
                            kBreakpointMedium) {
                          return 317.0;
                        } else if (MediaQuery.sizeOf(context).width <
                            kBreakpointLarge) {
                          return 317.0;
                        } else {
                          return 317.0;
                        }
                      }(),
                      aspectRatio: 2.0,
                      imageList: FFAppState().imageList,
                      autoPlayInterval: 1200,
                      autoPlayAnimationDuration: 800,
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(20.0, 0.0, 20.0, 0.0),
                  child: Container(
                    width: 470.0,
                    height: 30.0,
                    child: custom_widgets.LoadingProgressBar(
                      width: 470.0,
                      height: 30.0,
                      backgroundColor: Color(0xFFD9D9D9),
                      radius: 20.0,
                      minHeight: 30.0,
                      itemsCount: 3,
                      delay: 1000,
                      borderWidth: 3.0,
                      activeColor: FFAppConstants.appGradient,
                      isDesktop: () {
                        if (MediaQuery.sizeOf(context).width <
                            kBreakpointSmall) {
                          return false;
                        } else if (MediaQuery.sizeOf(context).width <
                            kBreakpointMedium) {
                          return true;
                        } else if (MediaQuery.sizeOf(context).width <
                            kBreakpointLarge) {
                          return true;
                        } else {
                          return true;
                        }
                      }(),
                      navigation: () async {
                        await widget.autoNavigation?.call();
                      },
                    ),
                  ),
                ),
                Align(
                  alignment: AlignmentDirectional(0.0, 0.0),
                  child: Container(
                    width: 480.0,
                    decoration: BoxDecoration(),
                    child: Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 20.0, 0.0, 0.0),
                      child: Builder(
                        builder: (context) {
                          final beforeLoading =
                              widget.checkPointList!.toList();

                          return ListView.builder(
                            padding: EdgeInsets.zero,
                            primary: false,
                            shrinkWrap: true,
                            scrollDirection: Axis.vertical,
                            itemCount: beforeLoading.length,
                            itemBuilder: (context, beforeLoadingIndex) {
                              final beforeLoadingItem =
                                  beforeLoading[beforeLoadingIndex];
                              return Padding(
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    50.0, 0.0, 0.0, 0.0),
                                child: Row(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(8.0),
                                      child: Image.asset(
                                        'assets/images/m9sar_.png',
                                        width: 22.0,
                                        height: 22.0,
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                    Padding(
                                      padding: EdgeInsets.all(9.0),
                                      child: Text(
                                        valueOrDefault<String>(
                                          FFAppState()
                                              .beforeLoadingData
                                              .elementAtOrNull(
                                                  beforeLoadingIndex),
                                          'beforeLoading',
                                        ),
                                        textAlign: TextAlign.start,
                                        maxLines: 3,
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Inter',
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.w500,
                                            ),
                                      ),
                                    ),
                                  ],
                                ).animateOnPageLoad(
                                  animationsMap['rowOnPageLoadAnimation']!,
                                  effects: [
                                    MoveEffect(
                                      curve: Curves.easeInOut,
                                      delay: valueOrDefault<double>(
                                        functions.slideAnimationDuration(
                                            beforeLoadingIndex, 250),
                                        150.0,
                                      ).ms,
                                      duration: 610.0.ms,
                                      begin: Offset(15.0, 0.0),
                                      end: Offset(0.0, 0.0),
                                    ),
                                    FadeEffect(
                                      curve: Curves.easeInOut,
                                      delay: valueOrDefault<double>(
                                        functions.slideAnimationDuration(
                                            beforeLoadingIndex, 250),
                                        150.0,
                                      ).ms,
                                      duration: 610.0.ms,
                                      begin: 0.0,
                                      end: 1.0,
                                    ),
                                  ],
                                ),
                              );
                            },
                          );
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
    );
  }
}
