// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class ImageAnswerStruct extends BaseStruct {
  ImageAnswerStruct({
    String? image,
    String? answer,

    /// Question Id
    String? id,
    String? type,
  })  : _image = image,
        _answer = answer,
        _id = id,
        _type = type;

  // "image" field.
  String? _image;
  String get image => _image ?? '';
  set image(String? val) => _image = val;

  bool hasImage() => _image != null;

  // "answer" field.
  String? _answer;
  String get answer => _answer ?? '';
  set answer(String? val) => _answer = val;

  bool hasAnswer() => _answer != null;

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

  static ImageAnswerStruct fromMap(Map<String, dynamic> data) =>
      ImageAnswerStruct(
        image: data['image'] as String?,
        answer: data['answer'] as String?,
        id: data['id'] as String?,
        type: data['type'] as String?,
      );

  static ImageAnswerStruct? maybeFromMap(dynamic data) => data is Map
      ? ImageAnswerStruct.fromMap(data.cast<String, dynamic>())
      : null;

  Map<String, dynamic> toMap() => {
        'image': _image,
        'answer': _answer,
        'id': _id,
        'type': _type,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'image': serializeParam(
          _image,
          ParamType.String,
        ),
        'answer': serializeParam(
          _answer,
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

  static ImageAnswerStruct fromSerializableMap(Map<String, dynamic> data) =>
      ImageAnswerStruct(
        image: deserializeParam(
          data['image'],
          ParamType.String,
          false,
        ),
        answer: deserializeParam(
          data['answer'],
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
  String toString() => 'ImageAnswerStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is ImageAnswerStruct &&
        image == other.image &&
        answer == other.answer &&
        id == other.id &&
        type == other.type;
  }

  @override
  int get hashCode => const ListEquality().hash([image, answer, id, type]);
}

ImageAnswerStruct createImageAnswerStruct({
  String? image,
  String? answer,
  String? id,
  String? type,
}) =>
    ImageAnswerStruct(
      image: image,
      answer: answer,
      id: id,
      type: type,
    );
