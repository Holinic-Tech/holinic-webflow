// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

/// Answer info like a title and description of their additional info.
class AnswerWithAdditionalInfoStruct extends BaseStruct {
  AnswerWithAdditionalInfoStruct({
    /// Answer text
    String? answer,

    /// Answer images (e.g.
    ///
    /// Emojis)
    String? image,

    /// Answer addtiontional info title.
    String? answerTitle,

    /// Answer addtiontional info description.
    String? answerDescription,

    /// Question ID
    String? id,
    String? type,
  })  : _answer = answer,
        _image = image,
        _answerTitle = answerTitle,
        _answerDescription = answerDescription,
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

  // "AnswerTitle" field.
  String? _answerTitle;
  String get answerTitle => _answerTitle ?? '';
  set answerTitle(String? val) => _answerTitle = val;

  bool hasAnswerTitle() => _answerTitle != null;

  // "AnswerDescription" field.
  String? _answerDescription;
  String get answerDescription => _answerDescription ?? '';
  set answerDescription(String? val) => _answerDescription = val;

  bool hasAnswerDescription() => _answerDescription != null;

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

  static AnswerWithAdditionalInfoStruct fromMap(Map<String, dynamic> data) =>
      AnswerWithAdditionalInfoStruct(
        answer: data['answer'] as String?,
        image: data['image'] as String?,
        answerTitle: data['AnswerTitle'] as String?,
        answerDescription: data['AnswerDescription'] as String?,
        id: data['id'] as String?,
        type: data['type'] as String?,
      );

  static AnswerWithAdditionalInfoStruct? maybeFromMap(dynamic data) =>
      data is Map
          ? AnswerWithAdditionalInfoStruct.fromMap(data.cast<String, dynamic>())
          : null;

  Map<String, dynamic> toMap() => {
        'answer': _answer,
        'image': _image,
        'AnswerTitle': _answerTitle,
        'AnswerDescription': _answerDescription,
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
        'AnswerTitle': serializeParam(
          _answerTitle,
          ParamType.String,
        ),
        'AnswerDescription': serializeParam(
          _answerDescription,
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

  static AnswerWithAdditionalInfoStruct fromSerializableMap(
          Map<String, dynamic> data) =>
      AnswerWithAdditionalInfoStruct(
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
        answerTitle: deserializeParam(
          data['AnswerTitle'],
          ParamType.String,
          false,
        ),
        answerDescription: deserializeParam(
          data['AnswerDescription'],
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
  String toString() => 'AnswerWithAdditionalInfoStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is AnswerWithAdditionalInfoStruct &&
        answer == other.answer &&
        image == other.image &&
        answerTitle == other.answerTitle &&
        answerDescription == other.answerDescription &&
        id == other.id &&
        type == other.type;
  }

  @override
  int get hashCode => const ListEquality()
      .hash([answer, image, answerTitle, answerDescription, id, type]);
}

AnswerWithAdditionalInfoStruct createAnswerWithAdditionalInfoStruct({
  String? answer,
  String? image,
  String? answerTitle,
  String? answerDescription,
  String? id,
  String? type,
}) =>
    AnswerWithAdditionalInfoStruct(
      answer: answer,
      image: image,
      answerTitle: answerTitle,
      answerDescription: answerDescription,
      id: id,
      type: type,
    );
