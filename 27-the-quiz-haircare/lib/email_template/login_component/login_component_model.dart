import '/common_widget/common_button/common_button_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'login_component_widget.dart' show LoginComponentWidget;
import 'package:flutter/material.dart';

class LoginComponentModel extends FlutterFlowModel<LoginComponentWidget> {
  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  // State field(s) for ListView widget.
  ScrollController? listViewController;
  // State field(s) for NameTextField widget.
  FocusNode? nameTextFieldFocusNode;
  TextEditingController? nameTextFieldTextController;
  String? Function(BuildContext, String?)? nameTextFieldTextControllerValidator;
  String? _nameTextFieldTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return 'Name is required';
    }

    return null;
  }

  // State field(s) for EmailTextField widget.
  FocusNode? emailTextFieldFocusNode;
  TextEditingController? emailTextFieldTextController;
  String? Function(BuildContext, String?)?
      emailTextFieldTextControllerValidator;
  String? _emailTextFieldTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return 'Email is required';
    }

    if (!RegExp(kTextValidatorEmailRegex).hasMatch(val)) {
      return 'Please enter valid email';
    }
    return null;
  }

  // Model for CommonButton component.
  late CommonButtonModel commonButtonModel;
  // Stores action output result for [Validate Form] action in CommonButton widget.
  bool? formResult;

  @override
  void initState(BuildContext context) {
    listViewController = ScrollController();
    nameTextFieldTextControllerValidator =
        _nameTextFieldTextControllerValidator;
    emailTextFieldTextControllerValidator =
        _emailTextFieldTextControllerValidator;
    commonButtonModel = createModel(context, () => CommonButtonModel());
  }

  @override
  void dispose() {
    listViewController?.dispose();
    nameTextFieldFocusNode?.dispose();
    nameTextFieldTextController?.dispose();

    emailTextFieldFocusNode?.dispose();
    emailTextFieldTextController?.dispose();

    commonButtonModel.dispose();
  }
}
