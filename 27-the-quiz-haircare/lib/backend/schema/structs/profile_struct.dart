// ignore_for_file: unnecessary_getters_setters


import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

/// Answers the user has given
class ProfileStruct extends BaseStruct {
  ProfileStruct({
    /// Question and answer pairs
    List<QuestionAnswerPairStruct>? qaPairs,
  }) : _qaPairs = qaPairs;

  // "qaPairs" field.
  List<QuestionAnswerPairStruct>? _qaPairs;
  List<QuestionAnswerPairStruct> get qaPairs => _qaPairs ?? const [];
  set qaPairs(List<QuestionAnswerPairStruct>? val) => _qaPairs = val;

  void updateQaPairs(Function(List<QuestionAnswerPairStruct>) updateFn) {
    updateFn(_qaPairs ??= []);
  }

  bool hasQaPairs() => _qaPairs != null;

  static ProfileStruct fromMap(Map<String, dynamic> data) => ProfileStruct(
        qaPairs: getStructList(
          data['qaPairs'],
          QuestionAnswerPairStruct.fromMap,
        ),
      );

  static ProfileStruct? maybeFromMap(dynamic data) =>
      data is Map ? ProfileStruct.fromMap(data.cast<String, dynamic>()) : null;

  Map<String, dynamic> toMap() => {
        'qaPairs': _qaPairs?.map((e) => e.toMap()).toList(),
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'qaPairs': serializeParam(
          _qaPairs,
          ParamType.DataStruct,
          isList: true,
        ),
      }.withoutNulls;

  static ProfileStruct fromSerializableMap(Map<String, dynamic> data) =>
      ProfileStruct(
        qaPairs: deserializeStructParam<QuestionAnswerPairStruct>(
          data['qaPairs'],
          ParamType.DataStruct,
          true,
          structBuilder: QuestionAnswerPairStruct.fromSerializableMap,
        ),
      );

  @override
  String toString() => 'ProfileStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    const listEquality = ListEquality();
    return other is ProfileStruct &&
        listEquality.equals(qaPairs, other.qaPairs);
  }

  @override
  int get hashCode => const ListEquality().hash([qaPairs]);
}

ProfileStruct createProfileStruct() => ProfileStruct();
