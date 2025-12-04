import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'pitch_widget_model.dart';
export 'pitch_widget_model.dart';

/// Pitch body widget title -description with icon(image).
class PitchWidgetWidget extends StatefulWidget {
  const PitchWidgetWidget({
    super.key,
    String? header,
    required this.image,
    required this.description,
  }) : this.header = header ?? '';

  /// Header title
  final String header;

  /// Image icon
  final String? image;

  /// Description
  final String? description;

  @override
  State<PitchWidgetWidget> createState() => _PitchWidgetWidgetState();
}

class _PitchWidgetWidgetState extends State<PitchWidgetWidget> {
  late PitchWidgetModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => PitchWidgetModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.max,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.header,
          style: FlutterFlowTheme.of(context).bodyMedium.override(
                font: GoogleFonts.inter(
                  fontWeight: FontWeight.normal,
                  fontStyle: FlutterFlowTheme.of(context).bodyMedium.fontStyle,
                ),
                color: FlutterFlowTheme.of(context).secondaryText,
                fontSize:
                    MediaQuery.sizeOf(context).height < 500.0 ? 13.0 : 15.0,
                letterSpacing: 0.0,
                fontWeight: FontWeight.normal,
                fontStyle: FlutterFlowTheme.of(context).bodyMedium.fontStyle,
              ),
        ),
        Row(
          mainAxisSize: MainAxisSize.max,
          children: [
            Padding(
              padding: EdgeInsetsDirectional.fromSTEB(0.0, 5.0, 5.0, 5.0),
              child: Image.network(
                widget.image!,
                width: MediaQuery.sizeOf(context).height < 500.0 ? 13.0 : 18.0,
                height: MediaQuery.sizeOf(context).height < 500.0 ? 13.0 : 18.0,
                fit: BoxFit.cover,
              ),
            ),
            Padding(
              padding: EdgeInsetsDirectional.fromSTEB(5.0, 0.0, 0.0, 0.0),
              child: Text(
                widget.description!,
                style: FlutterFlowTheme.of(context).bodyMedium.override(
                      font: GoogleFonts.inter(
                        fontWeight: FontWeight.w600,
                        fontStyle:
                            FlutterFlowTheme.of(context).bodyMedium.fontStyle,
                      ),
                      fontSize: MediaQuery.sizeOf(context).height < 500.0
                          ? 15.0
                          : 17.0,
                      letterSpacing: 0.0,
                      fontWeight: FontWeight.w600,
                      fontStyle:
                          FlutterFlowTheme.of(context).bodyMedium.fontStyle,
                    ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
