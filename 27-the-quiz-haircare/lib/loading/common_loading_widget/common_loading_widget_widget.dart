import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'common_loading_widget_model.dart';
export 'common_loading_widget_model.dart';

class CommonLoadingWidgetWidget extends StatefulWidget {
  const CommonLoadingWidgetWidget({
    super.key,
    required this.title,
  });

  final String? title;

  @override
  State<CommonLoadingWidgetWidget> createState() =>
      _CommonLoadingWidgetWidgetState();
}

class _CommonLoadingWidgetWidgetState extends State<CommonLoadingWidgetWidget> {
  late CommonLoadingWidgetModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => CommonLoadingWidgetModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 67.0,
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
        boxShadow: [
          BoxShadow(
            blurRadius: 3.0,
            color: Color(0x1F000000),
            offset: Offset(
              1.0,
              1.0,
            ),
          )
        ],
        borderRadius: BorderRadius.circular(11.0),
        border: Border.all(
          color: Color(0xFFD9D9D9),
        ),
      ),
      child: Align(
        alignment: AlignmentDirectional(0.0, 0.0),
        child: Text(
          valueOrDefault<String>(
            widget.title,
            '✅ Split ends that don\'t come back.',
          ),
          textAlign: TextAlign.center,
          maxLines: 3,
          style: FlutterFlowTheme.of(context).bodyMedium.override(
                fontFamily: 'Inter',
                letterSpacing: 0.0,
                fontWeight: FontWeight.w500,
              ),
        ),
      ),
    );
  }
}
