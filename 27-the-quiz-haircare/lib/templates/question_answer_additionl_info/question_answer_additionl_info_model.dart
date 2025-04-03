import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/footer/footer_button/footer_button_widget.dart';
import 'question_answer_additionl_info_widget.dart'
    show QuestionAnswerAdditionlInfoWidget;
import 'package:flutter/material.dart';

class QuestionAnswerAdditionlInfoModel
    extends FlutterFlowModel<QuestionAnswerAdditionlInfoWidget> {
  ///  Local state fields for this component.
  /// selcted answer in list
  int? selctedValue;

  /// Animated title of the selected answer.
  String? animatedTitle;

  /// Animated description of the selected answer.
  String? animatedDescription;

  String? questionId;

  List<String> answerId = [];
  void addToAnswerId(String item) => answerId.add(item);
  void removeFromAnswerId(String item) => answerId.remove(item);
  void removeAtIndexFromAnswerId(int index) => answerId.removeAt(index);
  void insertAtIndexInAnswerId(int index, String item) =>
      answerId.insert(index, item);
  void updateAnswerIdAtIndex(int index, Function(String) updateFn) =>
      answerId[index] = updateFn(answerId[index]);

  List<AnswerWithAdditionalInfoStruct> answerList = [];
  void addToAnswerList(AnswerWithAdditionalInfoStruct item) =>
      answerList.add(item);
  void removeFromAnswerList(AnswerWithAdditionalInfoStruct item) =>
      answerList.remove(item);
  void removeAtIndexFromAnswerList(int index) => answerList.removeAt(index);
  void insertAtIndexInAnswerList(
          int index, AnswerWithAdditionalInfoStruct item) =>
      answerList.insert(index, item);
  void updateAnswerListAtIndex(
          int index, Function(AnswerWithAdditionalInfoStruct) updateFn) =>
      answerList[index] = updateFn(answerList[index]);

  List<String> answer = [];
  void addToAnswer(String item) => answer.add(item);
  void removeFromAnswer(String item) => answer.remove(item);
  void removeAtIndexFromAnswer(int index) => answer.removeAt(index);
  void insertAtIndexInAnswer(int index, String item) =>
      answer.insert(index, item);
  void updateAnswerAtIndex(int index, Function(String) updateFn) =>
      answer[index] = updateFn(answer[index]);

  String? question;

  ///  State fields for stateful widgets in this component.

  // Model for FooterButton component.
  late FooterButtonModel footerButtonModel;

  @override
  void initState(BuildContext context) {
    footerButtonModel = createModel(context, () => FooterButtonModel());
  }

  @override
  void dispose() {
    footerButtonModel.dispose();
  }
}
