import '/common_widget/common_button/common_button_widget.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'footer_button_model.dart';
export 'footer_button_model.dart';

/// Header with Linear Progression bar & back button
class FooterButtonWidget extends StatefulWidget {
  const FooterButtonWidget({
    super.key,
    required this.buttonOnTap,
  });

  final Future Function()? buttonOnTap;

  @override
  State<FooterButtonWidget> createState() => _FooterButtonWidgetState();
}

class _FooterButtonWidgetState extends State<FooterButtonWidget> {
  late FooterButtonModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => FooterButtonModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return wrapWithModel(
      model: _model.commonButtonModel,
      updateCallback: () => safeSetState(() {}),
      child: CommonButtonWidget(
        buttonFillColor: Color(0xFFFE6903),
        buttonTextColor: FlutterFlowTheme.of(context).secondaryBackground,
        buttonName: FFAppConstants.continues,
        buttonRadius: 10,
        borderColor: FlutterFlowTheme.of(context).transparent,
        buttonOnTap: () async {
          await widget.buttonOnTap?.call();
        },
      ),
    );
  }
}
