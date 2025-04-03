// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class TestimonialsStruct extends BaseStruct {
  TestimonialsStruct({
    String? questionId,
    String? answerId,
    String? link,
  })  : _questionId = questionId,
        _answerId = answerId,
        _link = link;

  // "questionId" field.
  String? _questionId;
  String get questionId => _questionId ?? '';
  set questionId(String? val) => _questionId = val;

  bool hasQuestionId() => _questionId != null;

  // "answerId" field.
  String? _answerId;
  String get answerId => _answerId ?? '';
  set answerId(String? val) => _answerId = val;

  bool hasAnswerId() => _answerId != null;

  // "link" field.
  String? _link;
  String get link => _link ?? '';
  set link(String? val) => _link = val;

  bool hasLink() => _link != null;

  static TestimonialsStruct fromMap(Map<String, dynamic> data) =>
      TestimonialsStruct(
        questionId: data['questionId'] as String?,
        answerId: data['answerId'] as String?,
        link: data['link'] as String?,
      );

  static TestimonialsStruct? maybeFromMap(dynamic data) => data is Map
      ? TestimonialsStruct.fromMap(data.cast<String, dynamic>())
      : null;

  Map<String, dynamic> toMap() => {
        'questionId': _questionId,
        'answerId': _answerId,
        'link': _link,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'questionId': serializeParam(
          _questionId,
          ParamType.String,
        ),
        'answerId': serializeParam(
          _answerId,
          ParamType.String,
        ),
        'link': serializeParam(
          _link,
          ParamType.String,
        ),
      }.withoutNulls;

  static TestimonialsStruct fromSerializableMap(Map<String, dynamic> data) =>
      TestimonialsStruct(
        questionId: deserializeParam(
          data['questionId'],
          ParamType.String,
          false,
        ),
        answerId: deserializeParam(
          data['answerId'],
          ParamType.String,
          false,
        ),
        link: deserializeParam(
          data['link'],
          ParamType.String,
          false,
        ),
      );

  @override
  String toString() => 'TestimonialsStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is TestimonialsStruct &&
        questionId == other.questionId &&
        answerId == other.answerId &&
        link == other.link;
  }

  @override
  int get hashCode => const ListEquality().hash([questionId, answerId, link]);
}

TestimonialsStruct createTestimonialsStruct({
  String? questionId,
  String? answerId,
  String? link,
}) =>
    TestimonialsStruct(
      questionId: questionId,
      answerId: answerId,
      link: link,
    );
