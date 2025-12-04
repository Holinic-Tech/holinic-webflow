import '/flutter_flow/flutter_flow_util.dart';
import 'rating_question_options_widget.dart' show RatingQuestionOptionsWidget;
import 'package:flutter/material.dart';

class RatingQuestionOptionsModel
    extends FlutterFlowModel<RatingQuestionOptionsWidget> {
  ///  Local state fields for this component.

  List<int> ratingList = [1, 2, 3, 4, 5];
  void addToRatingList(int item) => ratingList.add(item);
  void removeFromRatingList(int item) => ratingList.remove(item);
  void removeAtIndexFromRatingList(int index) => ratingList.removeAt(index);
  void insertAtIndexInRatingList(int index, int item) =>
      ratingList.insert(index, item);
  void updateRatingListAtIndex(int index, Function(int) updateFn) =>
      ratingList[index] = updateFn(ratingList[index]);

  /// Selcted rating options store in this variable.
  int? selectedRating;

  String? questionId;

  List<String> selectedAnswer = [];
  void addToSelectedAnswer(String item) => selectedAnswer.add(item);
  void removeFromSelectedAnswer(String item) => selectedAnswer.remove(item);
  void removeAtIndexFromSelectedAnswer(int index) =>
      selectedAnswer.removeAt(index);
  void insertAtIndexInSelectedAnswer(int index, String item) =>
      selectedAnswer.insert(index, item);
  void updateSelectedAnswerAtIndex(int index, Function(String) updateFn) =>
      selectedAnswer[index] = updateFn(selectedAnswer[index]);

  String? question;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
