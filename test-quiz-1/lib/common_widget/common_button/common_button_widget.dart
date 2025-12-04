import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'common_button_model.dart';
export 'common_button_model.dart';

/// Header with Linear Progression bar & back button
class CommonButtonWidget extends StatefulWidget {
  const CommonButtonWidget({
    super.key,
    required this.buttonFillColor,
    required this.buttonTextColor,
    required this.buttonOnTap,
    required this.buttonName,
    required this.buttonRadius,
    required this.borderColor,
  });

  final Color? buttonFillColor;
  final Color? buttonTextColor;
  final Future Function()? buttonOnTap;
  final String? buttonName;
  final int? buttonRadius;
  final Color? borderColor;

  @override
  State<CommonButtonWidget> createState() => _CommonButtonWidgetState();
}

class _CommonButtonWidgetState extends State<CommonButtonWidget> {
  late CommonButtonModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => CommonButtonModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(20.0, 0.0, 20.0, 20.0),
      child: FFButtonWidget(
        onPressed: () async {
          await widget.buttonOnTap?.call();
        },
        text: widget.buttonName!,
        options: FFButtonOptions(
          width: () {
            if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
              return double.infinity;
            } else if (MediaQuery.sizeOf(context).width < kBreakpointMedium) {
              return 450.0;
            } else if (MediaQuery.sizeOf(context).width < kBreakpointLarge) {
              return 450.0;
            } else {
              return 450.0;
            }
          }(),
          height: 50.0,
          padding: EdgeInsetsDirectional.fromSTEB(20.0, 0.0, 20.0, 0.0),
          iconPadding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
          color: widget.buttonFillColor,
          textStyle: FlutterFlowTheme.of(context).titleSmall.override(
                font: GoogleFonts.inter(
                  fontWeight:
                      FlutterFlowTheme.of(context).titleSmall.fontWeight,
                  fontStyle: FlutterFlowTheme.of(context).titleSmall.fontStyle,
                ),
                color: widget.buttonTextColor,
                letterSpacing: 0.0,
                fontWeight: FlutterFlowTheme.of(context).titleSmall.fontWeight,
                fontStyle: FlutterFlowTheme.of(context).titleSmall.fontStyle,
              ),
          elevation: 0.0,
          borderSide: BorderSide(
            color: widget.borderColor!,
          ),
          borderRadius: BorderRadius.circular(valueOrDefault<double>(
            widget.buttonRadius?.toDouble(),
            0.0,
          )),
        ),
      ),
    );
  }
}
