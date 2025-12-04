// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

/// Question and answer given by user
class QuestionAnswerPairStruct extends BaseStruct {
  QuestionAnswerPairStruct({
    String? questionId,
    List<String>? answerIds,
  })  : _questionId = questionId,
        _answerIds = answerIds;

  // "questionId" field.
  String? _questionId;
  String get questionId => _questionId ?? '';
  set questionId(String? val) => _questionId = val;

  bool hasQuestionId() => _questionId != null;

  // "answerIds" field.
  List<String>? _answerIds;
  List<String> get answerIds => _answerIds ?? const [];
  set answerIds(List<String>? val) => _answerIds = val;

  void updateAnswerIds(Function(List<String>) updateFn) {
    updateFn(_answerIds ??= []);
  }

  bool hasAnswerIds() => _answerIds != null;

  static QuestionAnswerPairStruct fromMap(Map<String, dynamic> data) =>
      QuestionAnswerPairStruct(
        questionId: data['questionId'] as String?,
        answerIds: getDataList(data['answerIds']),
      );

  static QuestionAnswerPairStruct? maybeFromMap(dynamic data) => data is Map
      ? QuestionAnswerPairStruct.fromMap(data.cast<String, dynamic>())
      : null;

  Map<String, dynamic> toMap() => {
        'questionId': _questionId,
        'answerIds': _answerIds,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'questionId': serializeParam(
          _questionId,
          ParamType.String,
        ),
        'answerIds': serializeParam(
          _answerIds,
          ParamType.String,
          isList: true,
        ),
      }.withoutNulls;

  static QuestionAnswerPairStruct fromSerializableMap(
          Map<String, dynamic> data) =>
      QuestionAnswerPairStruct(
        questionId: deserializeParam(
          data['questionId'],
          ParamType.String,
          false,
        ),
        answerIds: deserializeParam<String>(
          data['answerIds'],
          ParamType.String,
          true,
        ),
      );

  @override
  String toString() => 'QuestionAnswerPairStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    const listEquality = ListEquality();
    return other is QuestionAnswerPairStruct &&
        questionId == other.questionId &&
        listEquality.equals(answerIds, other.answerIds);
  }

  @override
  int get hashCode => const ListEquality().hash([questionId, answerIds]);
}

QuestionAnswerPairStruct createQuestionAnswerPairStruct({
  String? questionId,
}) =>
    QuestionAnswerPairStruct(
      questionId: questionId,
    );
