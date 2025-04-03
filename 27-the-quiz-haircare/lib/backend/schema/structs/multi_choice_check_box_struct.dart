// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class MultiChoiceCheckBoxStruct extends BaseStruct {
  MultiChoiceCheckBoxStruct({
    String? title,
    bool? checkBox,

    /// Question Id
    String? id,
    String? type,
  })  : _title = title,
        _checkBox = checkBox,
        _id = id,
        _type = type;

  // "title" field.
  String? _title;
  String get title => _title ?? '';
  set title(String? val) => _title = val;

  bool hasTitle() => _title != null;

  // "checkBox" field.
  bool? _checkBox;
  bool get checkBox => _checkBox ?? false;
  set checkBox(bool? val) => _checkBox = val;

  bool hasCheckBox() => _checkBox != null;

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

  static MultiChoiceCheckBoxStruct fromMap(Map<String, dynamic> data) =>
      MultiChoiceCheckBoxStruct(
        title: data['title'] as String?,
        checkBox: data['checkBox'] as bool?,
        id: data['id'] as String?,
        type: data['type'] as String?,
      );

  static MultiChoiceCheckBoxStruct? maybeFromMap(dynamic data) => data is Map
      ? MultiChoiceCheckBoxStruct.fromMap(data.cast<String, dynamic>())
      : null;

  Map<String, dynamic> toMap() => {
        'title': _title,
        'checkBox': _checkBox,
        'id': _id,
        'type': _type,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'title': serializeParam(
          _title,
          ParamType.String,
        ),
        'checkBox': serializeParam(
          _checkBox,
          ParamType.bool,
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

  static MultiChoiceCheckBoxStruct fromSerializableMap(
          Map<String, dynamic> data) =>
      MultiChoiceCheckBoxStruct(
        title: deserializeParam(
          data['title'],
          ParamType.String,
          false,
        ),
        checkBox: deserializeParam(
          data['checkBox'],
          ParamType.bool,
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
  String toString() => 'MultiChoiceCheckBoxStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is MultiChoiceCheckBoxStruct &&
        title == other.title &&
        checkBox == other.checkBox &&
        id == other.id &&
        type == other.type;
  }

  @override
  int get hashCode => const ListEquality().hash([title, checkBox, id, type]);
}

MultiChoiceCheckBoxStruct createMultiChoiceCheckBoxStruct({
  String? title,
  bool? checkBox,
  String? id,
  String? type,
}) =>
    MultiChoiceCheckBoxStruct(
      title: title,
      checkBox: checkBox,
      id: id,
      type: type,
    );
