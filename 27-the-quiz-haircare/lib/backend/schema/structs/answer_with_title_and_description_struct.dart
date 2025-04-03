// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class AnswerWithTitleAndDescriptionStruct extends BaseStruct {
  AnswerWithTitleAndDescriptionStruct({
    String? title,
    String? description,

    /// Question Id
    String? id,
    String? type,
  })  : _title = title,
        _description = description,
        _id = id,
        _type = type;

  // "title" field.
  String? _title;
  String get title => _title ?? '';
  set title(String? val) => _title = val;

  bool hasTitle() => _title != null;

  // "description" field.
  String? _description;
  String get description => _description ?? '';
  set description(String? val) => _description = val;

  bool hasDescription() => _description != null;

  // "id" field.
  String? _id;
  String get id => _id ?? '';
  set id(String? val) => _id = val;

  bool hasId() => _id != null;

  // "type" field.
  String? _type;
  String get type => _type ?? '';
  set type(String? val) => _type = val;

  bool hasType() => _type != null;

  static AnswerWithTitleAndDescriptionStruct fromMap(
          Map<String, dynamic> data) =>
      AnswerWithTitleAndDescriptionStruct(
        title: data['title'] as String?,
        description: data['description'] as String?,
        id: data['id'] as String?,
        type: data['type'] as String?,
      );

  static AnswerWithTitleAndDescriptionStruct? maybeFromMap(dynamic data) =>
      data is Map
          ? AnswerWithTitleAndDescriptionStruct.fromMap(
              data.cast<String, dynamic>())
          : null;

  Map<String, dynamic> toMap() => {
        'title': _title,
        'description': _description,
        'id': _id,
        'type': _type,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'title': serializeParam(
          _title,
          ParamType.String,
        ),
        'description': serializeParam(
          _description,
          ParamType.String,
        ),
        'id': serializeParam(
          _id,
          ParamType.String,
        ),
        'type': serializeParam(
          _type,
          ParamType.String,
        ),
      }.withoutNulls;

  static AnswerWithTitleAndDescriptionStruct fromSerializableMap(
          Map<String, dynamic> data) =>
      AnswerWithTitleAndDescriptionStruct(
        title: deserializeParam(
          data['title'],
          ParamType.String,
          false,
        ),
        description: deserializeParam(
          data['description'],
          ParamType.String,
          false,
        ),
        id: deserializeParam(
          data['id'],
          ParamType.String,
          false,
        ),
        type: deserializeParam(
          data['type'],
          ParamType.String,
          false,
        ),
      );

  @override
  String toString() => 'AnswerWithTitleAndDescriptionStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is AnswerWithTitleAndDescriptionStruct &&
        title == other.title &&
        description == other.description &&
        id == other.id &&
        type == other.type;
  }

  @override
  int get hashCode => const ListEquality().hash([title, description, id, type]);
}

AnswerWithTitleAndDescriptionStruct createAnswerWithTitleAndDescriptionStruct({
  String? title,
  String? description,
  String? id,
  String? type,
}) =>
    AnswerWithTitleAndDescriptionStruct(
      title: title,
      description: description,
      id: id,
      type: type,
    );
