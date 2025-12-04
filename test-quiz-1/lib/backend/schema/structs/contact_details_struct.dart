// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class ContactDetailsStruct extends BaseStruct {
  ContactDetailsStruct({
    String? name,
    String? email,
  })  : _name = name,
        _email = email;

  // "Name" field.
  String? _name;
  String get name => _name ?? '';
  set name(String? val) => _name = val;

  bool hasName() => _name != null;

  // "Email" field.
  String? _email;
  String get email => _email ?? '';
  set email(String? val) => _email = val;

  bool hasEmail() => _email != null;

  static ContactDetailsStruct fromMap(Map<String, dynamic> data) =>
      ContactDetailsStruct(
        name: data['Name'] as String?,
        email: data['Email'] as String?,
      );

  static ContactDetailsStruct? maybeFromMap(dynamic data) => data is Map
      ? ContactDetailsStruct.fromMap(data.cast<String, dynamic>())
      : null;

  Map<String, dynamic> toMap() => {
        'Name': _name,
        'Email': _email,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'Name': serializeParam(
          _name,
          ParamType.String,
        ),
        'Email': serializeParam(
          _email,
          ParamType.String,
        ),
      }.withoutNulls;

  static ContactDetailsStruct fromSerializableMap(Map<String, dynamic> data) =>
      ContactDetailsStruct(
        name: deserializeParam(
          data['Name'],
          ParamType.String,
          false,
        ),
        email: deserializeParam(
          data['Email'],
          ParamType.String,
          false,
        ),
      );

  @override
  String toString() => 'ContactDetailsStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is ContactDetailsStruct &&
        name == other.name &&
        email == other.email;
  }

  @override
  int get hashCode => const ListEquality().hash([name, email]);
}

ContactDetailsStruct createContactDetailsStruct({
  String? name,
  String? email,
}) =>
    ContactDetailsStruct(
      name: name,
      email: email,
    );
