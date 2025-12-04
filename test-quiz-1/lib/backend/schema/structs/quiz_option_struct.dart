// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

/// Generic quiz option for single/multi select questions
class QuizOptionStruct extends BaseStruct {
  QuizOptionStruct({
    String? id,
    String? emoji,
    String? title,
    String? subtitle,
    String? imageUrl,
    bool? isSelected,
    bool? isExclusive,
  })  : _id = id,
        _emoji = emoji,
        _title = title,
        _subtitle = subtitle,
        _imageUrl = imageUrl,
        _isSelected = isSelected,
        _isExclusive = isExclusive;

  // "id" field - unique identifier for the option
  String? _id;
  String get id => _id ?? '';
  set id(String? val) => _id = val;
  bool hasId() => _id != null;

  // "emoji" field - optional emoji to display
  String? _emoji;
  String get emoji => _emoji ?? '';
  set emoji(String? val) => _emoji = val;
  bool hasEmoji() => _emoji != null;

  // "title" field - main display text
  String? _title;
  String get title => _title ?? '';
  set title(String? val) => _title = val;
  bool hasTitle() => _title != null;

  // "subtitle" field - secondary display text
  String? _subtitle;
  String get subtitle => _subtitle ?? '';
  set subtitle(String? val) => _subtitle = val;
  bool hasSubtitle() => _subtitle != null;

  // "imageUrl" field - optional image
  String? _imageUrl;
  String get imageUrl => _imageUrl ?? '';
  set imageUrl(String? val) => _imageUrl = val;
  bool hasImageUrl() => _imageUrl != null;

  // "isSelected" field - selection state
  bool? _isSelected;
  bool get isSelected => _isSelected ?? false;
  set isSelected(bool? val) => _isSelected = val;
  bool hasIsSelected() => _isSelected != null;

  // "isExclusive" field - if true, selecting this deselects others (e.g., "None of the above")
  bool? _isExclusive;
  bool get isExclusive => _isExclusive ?? false;
  set isExclusive(bool? val) => _isExclusive = val;
  bool hasIsExclusive() => _isExclusive != null;

  static QuizOptionStruct fromMap(Map<String, dynamic> data) =>
      QuizOptionStruct(
        id: data['id'] as String?,
        emoji: data['emoji'] as String?,
        title: data['title'] as String?,
        subtitle: data['subtitle'] as String?,
        imageUrl: data['imageUrl'] as String?,
        isSelected: data['isSelected'] as bool?,
        isExclusive: data['isExclusive'] as bool?,
      );

  static QuizOptionStruct? maybeFromMap(dynamic data) => data is Map
      ? QuizOptionStruct.fromMap(data.cast<String, dynamic>())
      : null;

  Map<String, dynamic> toMap() => {
        'id': _id,
        'emoji': _emoji,
        'title': _title,
        'subtitle': _subtitle,
        'imageUrl': _imageUrl,
        'isSelected': _isSelected,
        'isExclusive': _isExclusive,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'id': serializeParam(_id, ParamType.String),
        'emoji': serializeParam(_emoji, ParamType.String),
        'title': serializeParam(_title, ParamType.String),
        'subtitle': serializeParam(_subtitle, ParamType.String),
        'imageUrl': serializeParam(_imageUrl, ParamType.String),
        'isSelected': serializeParam(_isSelected, ParamType.bool),
        'isExclusive': serializeParam(_isExclusive, ParamType.bool),
      }.withoutNulls;

  static QuizOptionStruct fromSerializableMap(Map<String, dynamic> data) =>
      QuizOptionStruct(
        id: deserializeParam(data['id'], ParamType.String, false),
        emoji: deserializeParam(data['emoji'], ParamType.String, false),
        title: deserializeParam(data['title'], ParamType.String, false),
        subtitle: deserializeParam(data['subtitle'], ParamType.String, false),
        imageUrl: deserializeParam(data['imageUrl'], ParamType.String, false),
        isSelected: deserializeParam(data['isSelected'], ParamType.bool, false),
        isExclusive: deserializeParam(data['isExclusive'], ParamType.bool, false),
      );

  @override
  String toString() => 'QuizOptionStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is QuizOptionStruct &&
        id == other.id &&
        emoji == other.emoji &&
        title == other.title &&
        subtitle == other.subtitle &&
        imageUrl == other.imageUrl &&
        isSelected == other.isSelected &&
        isExclusive == other.isExclusive;
  }

  @override
  int get hashCode => const ListEquality().hash([
        id,
        emoji,
        title,
        subtitle,
        imageUrl,
        isSelected,
        isExclusive,
      ]);
}

QuizOptionStruct createQuizOptionStruct({
  String? id,
  String? emoji,
  String? title,
  String? subtitle,
  String? imageUrl,
  bool? isSelected,
  bool? isExclusive,
}) =>
    QuizOptionStruct(
      id: id,
      emoji: emoji,
      title: title,
      subtitle: subtitle,
      imageUrl: imageUrl,
      isSelected: isSelected,
      isExclusive: isExclusive,
    );
