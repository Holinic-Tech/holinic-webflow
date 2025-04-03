import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'dashboard_widget_model.dart';
export 'dashboard_widget_model.dart';

/// Dashobaord header and details widget.
class DashboardWidgetWidget extends StatefulWidget {
  const DashboardWidgetWidget({
    super.key,
    required this.header,
    required this.value,
  });

  /// Header title
  final String? header;

  /// description value
  final String? value;

  @override
  State<DashboardWidgetWidget> createState() => _DashboardWidgetWidgetState();
}

class _DashboardWidgetWidgetState extends State<DashboardWidgetWidget> {
  late DashboardWidgetModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => DashboardWidgetModel());

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
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 3.0),
          child: Text(
            widget.header!,
            style: FlutterFlowTheme.of(context).bodyMedium.override(
                  fontFamily: 'Inter',
                  fontSize: 14.0,
                  letterSpacing: 0.0,
                  fontWeight: FontWeight.w600,
                ),
          ),
        ),
        Text(
          widget.value!,
          style: FlutterFlowTheme.of(context).bodyMedium.override(
                fontFamily: 'Inter',
                fontSize: 13.0,
                letterSpacing: 0.0,
                fontWeight: FontWeight.normal,
              ),
        ),
      ],
    );
  }
}
