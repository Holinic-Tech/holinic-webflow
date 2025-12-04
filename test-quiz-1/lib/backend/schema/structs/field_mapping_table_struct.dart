// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class FieldMappingTableStruct extends BaseStruct {
  FieldMappingTableStruct({
    String? questionId,
    int? acField,
    String? mpField,
  })  : _questionId = questionId,
        _acField = acField,
        _mpField = mpField;

  // "questionId" field.
  String? _questionId;
  String get questionId => _questionId ?? '';
  set questionId(String? val) => _questionId = val;

  bool hasQuestionId() => _questionId != null;

  // "acField" field.
  int? _acField;
  int get acField => _acField ?? 0;
  set acField(int? val) => _acField = val;

  void incrementAcField(int amount) => acField = acField + amount;

  bool hasAcField() => _acField != null;

  // "mpField" field.
  String? _mpField;
  String get mpField => _mpField ?? '';
  set mpField(String? val) => _mpField = val;

  bool hasMpField() => _mpField != null;

  static FieldMappingTableStruct fromMap(Map<String, dynamic> data) =>
      FieldMappingTableStruct(
        questionId: data['questionId'] as String?,
        acField: castToType<int>(data['acField']),
        mpField: data['mpField'] as String?,
      );

  static FieldMappingTableStruct? maybeFromMap(dynamic data) => data is Map
      ? FieldMappingTableStruct.fromMap(data.cast<String, dynamic>())
      : null;

  Map<String, dynamic> toMap() => {
        'questionId': _questionId,
        'acField': _acField,
        'mpField': _mpField,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'questionId': serializeParam(
          _questionId,
          ParamType.String,
        ),
        'acField': serializeParam(
          _acField,
          ParamType.int,
        ),
        'mpField': serializeParam(
          _mpField,
          ParamType.String,
        ),
      }.withoutNulls;

  static FieldMappingTableStruct fromSerializableMap(
          Map<String, dynamic> data) =>
      FieldMappingTableStruct(
        questionId: deserializeParam(
          data['questionId'],
          ParamType.String,
          false,
        ),
        acField: deserializeParam(
          data['acField'],
          ParamType.int,
          false,
        ),
        mpField: deserializeParam(
          data['mpField'],
          ParamType.String,
          false,
        ),
      );

  @override
  String toString() => 'FieldMappingTableStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is FieldMappingTableStruct &&
        questionId == other.questionId &&
        acField == other.acField &&
        mpField == other.mpField;
  }

  @override
  int get hashCode => const ListEquality().hash([questionId, acField, mpField]);
}

FieldMappingTableStruct createFieldMappingTableStruct({
  String? questionId,
  int? acField,
  String? mpField,
}) =>
    FieldMappingTableStruct(
      questionId: questionId,
      acField: acField,
      mpField: mpField,
    );
