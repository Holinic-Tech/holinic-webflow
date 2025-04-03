import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/custom_code/widgets/index.dart' as custom_widgets;
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import 'start_loading_component_model.dart';
export 'start_loading_component_model.dart';

class StartLoadingComponentWidget extends StatefulWidget {
  const StartLoadingComponentWidget({
    super.key,
    required this.navigation,
  });

  final Future Function()? navigation;

  @override
  State<StartLoadingComponentWidget> createState() =>
      _StartLoadingComponentWidgetState();
}

class _StartLoadingComponentWidgetState
    extends State<StartLoadingComponentWidget> with TickerProviderStateMixin {
  late StartLoadingComponentModel _model;

  final animationsMap = <String, AnimationInfo>{};

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => StartLoadingComponentModel());

    animationsMap.addAll({
      'textOnPageLoadAnimation': AnimationInfo(
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
        height: double.infinity,
        constraints: BoxConstraints(
          maxWidth: 500.0,
        ),
        decoration: BoxDecoration(
          color: FlutterFlowTheme.of(context).secondaryBackground,
        ),
        child: Padding(
          padding: EdgeInsetsDirectional.fromSTEB(16.0, 30.0, 16.0, 0.0),
          child: Column(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Align(
                alignment: AlignmentDirectional(0.0, -1.0),
                child: Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 20.0, 0.0, 40.0),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(0.0),
                    child: Image.asset(
                      'assets/images/image_448_(1).png',
                      width: 100.0,
                      height: 20.0,
                      fit: BoxFit.fitWidth,
                    ),
                  ),
                ),
              ),
              Align(
                alignment: AlignmentDirectional(0.0, -1.0),
                child: Text(
                  'Find out if the Haircare Challenge is right for you',
                  textAlign: TextAlign.center,
                  style: FlutterFlowTheme.of(context).bodyMedium.override(
                        fontFamily: 'Inter',
                        fontSize: 28.0,
                        letterSpacing: 0.0,
                        fontWeight: FontWeight.w500,
                      ),
                ),
              ),
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(17.0, 30.0, 17.0, 0.0),
                child: Builder(
                  builder: (context) {
                    final loadingData = FFAppState().loadingWidget.toList();

                    return ListView.separated(
                      padding: EdgeInsets.fromLTRB(
                        0,
                        20.0,
                        0,
                        60.0,
                      ),
                      shrinkWrap: true,
                      scrollDirection: Axis.vertical,
                      itemCount: loadingData.length,
                      separatorBuilder: (_, __) => SizedBox(height: 15.0),
                      itemBuilder: (context, loadingDataIndex) {
                        final loadingDataItem = loadingData[loadingDataIndex];
                        return Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 8.0, 0.0, 8.0),
                          child: Text(
                            loadingDataItem,
                            textAlign: TextAlign.start,
                            style: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Inter',
                                  fontSize: 16.0,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.w500,
                                ),
                          ).animateOnPageLoad(
                            animationsMap['textOnPageLoadAnimation']!,
                            effects: [
                              MoveEffect(
                                curve: Curves.easeInOut,
                                delay: (1200 * loadingDataIndex).toDouble().ms,
                                duration: 600.0.ms,
                                begin: Offset(0.0, 21.0),
                                end: Offset(0.0, 0.0),
                              ),
                              FadeEffect(
                                curve: Curves.easeInOut,
                                delay: (1200 * loadingDataIndex).toDouble().ms,
                                duration: 600.0.ms,
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
              Align(
                alignment: AlignmentDirectional(-1.0, 0.0),
                child: Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(25.0, 0.0, 0.0, 0.0),
                  child: Text(
                    'Personal space loading',
                    textAlign: TextAlign.center,
                    maxLines: 3,
                    style: FlutterFlowTheme.of(context).bodyMedium.override(
                          fontFamily: 'Inter',
                          letterSpacing: 0.0,
                          fontWeight: FontWeight.w500,
                        ),
                  ),
                ),
              ),
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(20.0, 20.0, 20.0, 0.0),
                child: Container(
                  width: double.infinity,
                  height: 30.0,
                  child: custom_widgets.LoadingProgressBar(
                    width: double.infinity,
                    height: 30.0,
                    backgroundColor: Color(0xFFD9D9D9),
                    radius: 20.0,
                    minHeight: 30.0,
                    itemsCount: FFAppState().loadingWidget.length,
                    delay: 1000,
                    activeColor: FFAppConstants.appGradient,
                    borderWidth: 3.0,
                    isDesktop: () {
                      if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
                        return false;
                      } else if (MediaQuery.sizeOf(context).width <
                          kBreakpointMedium) {
                        return true;
                      } else if (MediaQuery.sizeOf(context).width <
                          kBreakpointLarge) {
                        return false;
                      } else {
                        return true;
                      }
                    }(),
                    navigation: () async {
                      await widget.navigation?.call();
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
