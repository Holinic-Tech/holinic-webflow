import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'pitch_body_text_images_body_model.dart';
export 'pitch_body_text_images_body_model.dart';

class PitchBodyTextImagesBodyWidget extends StatefulWidget {
  const PitchBodyTextImagesBodyWidget({
    super.key,
    String? image,
    required this.title,
    String? description,
    required this.navigationTap,
  })  : this.image =
            image ?? 'https://assets.hairqare.co/Dont%20Know%20Hair.webp',
        this.description = description ?? 'Description';

  final String image;
  final String? title;
  final String description;

  /// Continue button on tap
  final Future Function()? navigationTap;

  @override
  State<PitchBodyTextImagesBodyWidget> createState() =>
      _PitchBodyTextImagesBodyWidgetState();
}

class _PitchBodyTextImagesBodyWidgetState
    extends State<PitchBodyTextImagesBodyWidget> {
  late PitchBodyTextImagesBodyModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => PitchBodyTextImagesBodyModel());

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
                  Align(
                    alignment: AlignmentDirectional(-1.0, 0.0),
                    child: Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 46.0, 0.0, 30.0),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8.0),
                        child: Image.network(
                          'https://assets.hairqare.co/Pitch%202%20Lindsey%20Review.webp',
                          height: 200.0,
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
                        style: FlutterFlowTheme.of(context).bodyMedium.override(
                              fontFamily: 'Inter',
                              fontSize: 28.0,
                              letterSpacing: 0.0,
                              fontWeight: FontWeight.w500,
                            ),
                      ),
                    ),
                  ),
                  RichText(
                    textScaler: MediaQuery.of(context).textScaler,
                    text: TextSpan(
                      children: [
                        TextSpan(
                          text:
                              'Our holistic approach identifies the ideal haircare routine that works for your individual situation. \n\nCreated by a team of experts and clinically proven to be up to 5 times more effective than traditional haircare products, with 90% of students seeing visible results in just 14 days.',
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Inter',
                                    fontSize: 16.0,
                                    letterSpacing: 0.0,
                                  ),
                        )
                      ],
                      style: FlutterFlowTheme.of(context).bodyMedium.override(
                            fontFamily: 'Inter',
                            fontSize: 16.0,
                            letterSpacing: 0.0,
                            lineHeight: 1.25,
                          ),
                    ),
                    textAlign: TextAlign.start,
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
