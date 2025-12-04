// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class AnswerStruct extends BaseStruct {
  AnswerStruct({
    String? answer,

    /// Leading image
    String? image,

    /// Question Id
    String? id,
    String? type,
  })  : _answer = answer,
        _image = image,
        _id = id,
        _type = type;

  // "answer" field.
  String? _answer;
  String get answer => _answer ?? '';
  set answer(String? val) => _answer = val;

  bool hasAnswer() => _answer != null;

  // "image" field.
  String? _image;
  String get image => _image ?? '';
  set image(String? val) => _image = val;

  bool hasImage() => _image != null;

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

  static AnswerStruct fromMap(Map<String, dynamic> data) => AnswerStruct(
        answer: data['answer'] as String?,
        image: data['image'] as String?,
        id: data['id'] as String?,
        type: data['type'] as String?,
      );

  static AnswerStruct? maybeFromMap(dynamic data) =>
      data is Map ? AnswerStruct.fromMap(data.cast<String, dynamic>()) : null;

  Map<String, dynamic> toMap() => {
        'answer': _answer,
        'image': _image,
        'id': _id,
        'type': _type,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'answer': serializeParam(
          _answer,
          ParamType.String,
        ),
        'image': serializeParam(
          _image,
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

  static AnswerStruct fromSerializableMap(Map<String, dynamic> data) =>
      AnswerStruct(
        answer: deserializeParam(
          data['answer'],
          ParamType.String,
          false,
        ),
        image: deserializeParam(
          data['image'],
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
  String toString() => 'AnswerStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is AnswerStruct &&
        answer == other.answer &&
        image == other.image &&
        id == other.id &&
        type == other.type;
  }

  @override
  int get hashCode => const ListEquality().hash([answer, image, id, type]);
}

AnswerStruct createAnswerStruct({
  String? answer,
  String? image,
  String? id,
  String? type,
}) =>
    AnswerStruct(
      answer: answer,
      image: image,
      id: id,
      type: type,
    );
