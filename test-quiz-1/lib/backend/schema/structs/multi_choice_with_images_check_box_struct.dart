// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class MultiChoiceWithImagesCheckBoxStruct extends BaseStruct {
  MultiChoiceWithImagesCheckBoxStruct({
    String? image,
    String? title,
    bool? checklBox,

    /// Question Id
    String? id,
    String? type,
  })  : _image = image,
        _title = title,
        _checklBox = checklBox,
        _id = id,
        _type = type;

  // "image" field.
  String? _image;
  String get image => _image ?? '';
  set image(String? val) => _image = val;

  bool hasImage() => _image != null;

  // "title" field.
  String? _title;
  String get title => _title ?? '';
  set title(String? val) => _title = val;

  bool hasTitle() => _title != null;

  // "checklBox" field.
  bool? _checklBox;
  bool get checklBox => _checklBox ?? false;
  set checklBox(bool? val) => _checklBox = val;

  bool hasChecklBox() => _checklBox != null;

  // "Id" field.
  String? _id;
  String get id => _id ?? '';
  set id(String? val) => _id = val;

  bool hasId() => _id != null;

  // "type" field.
  String? _type;
  String get type => _type ?? '';
  set type(String? val) => _type = val;

  bool hasType() => _type != null;

  static MultiChoiceWithImagesCheckBoxStruct fromMap(
          Map<String, dynamic> data) =>
      MultiChoiceWithImagesCheckBoxStruct(
        image: data['image'] as String?,
        title: data['title'] as String?,
        checklBox: data['checklBox'] as bool?,
        id: data['Id'] as String?,
        type: data['type'] as String?,
      );

  static MultiChoiceWithImagesCheckBoxStruct? maybeFromMap(dynamic data) =>
      data is Map
          ? MultiChoiceWithImagesCheckBoxStruct.fromMap(
              data.cast<String, dynamic>())
          : null;

  Map<String, dynamic> toMap() => {
        'image': _image,
        'title': _title,
        'checklBox': _checklBox,
        'Id': _id,
        'type': _type,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'image': serializeParam(
          _image,
          ParamType.String,
        ),
        'title': serializeParam(
          _title,
          ParamType.String,
        ),
        'checklBox': serializeParam(
          _checklBox,
          ParamType.bool,
        ),
        'Id': serializeParam(
          _id,
          ParamType.String,
        ),
        'type': serializeParam(
          _type,
          ParamType.String,
        ),
      }.withoutNulls;

  static MultiChoiceWithImagesCheckBoxStruct fromSerializableMap(
          Map<String, dynamic> data) =>
      MultiChoiceWithImagesCheckBoxStruct(
        image: deserializeParam(
          data['image'],
          ParamType.String,
          false,
        ),
        title: deserializeParam(
          data['title'],
          ParamType.String,
          false,
        ),
        checklBox: deserializeParam(
          data['checklBox'],
          ParamType.bool,
          false,
        ),
        id: deserializeParam(
          data['Id'],
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
  String toString() => 'MultiChoiceWithImagesCheckBoxStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is MultiChoiceWithImagesCheckBoxStruct &&
        image == other.image &&
        title == other.title &&
        checklBox == other.checklBox &&
        id == other.id &&
        type == other.type;
  }

  @override
  int get hashCode =>
      const ListEquality().hash([image, title, checklBox, id, type]);
}

MultiChoiceWithImagesCheckBoxStruct createMultiChoiceWithImagesCheckBoxStruct({
  String? image,
  String? title,
  bool? checklBox,
  String? id,
  String? type,
}) =>
    MultiChoiceWithImagesCheckBoxStruct(
      image: image,
      title: title,
      checklBox: checklBox,
      id: id,
      type: type,
    );
