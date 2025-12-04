// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

/// Complete user profile from V2 quiz flow
class QuizProfileV2Struct extends BaseStruct {
  QuizProfileV2Struct({
    // Identity (Screens 2-5)
    String? hairGoal,
    String? primaryConcern,
    String? ageRange,
    String? hairType,
    String? struggleDuration,
    // Discovery (Screens 6-11)
    List<String>? triedBefore,
    String? usesSulfateFree,
    String? washFrequency,
    List<String>? bodyFactors,
    // Conviction (Screens 18-19)
    String? biggestConcern,
    // Action (Screens 20-21)
    bool? canCommit,
    String? userName,
    String? userEmail,
    // Calculated Fields
    int? fitScore,
    List<String>? rootCauses,
    int? rootCauseCount,
    // Upsell Flags
    bool? showScalpUpsell,
    bool? showNutritionUpsell,
    bool? showStressUpsell,
    // Timestamps
    DateTime? quizStartTime,
    DateTime? quizCompleteTime,
  })  : _hairGoal = hairGoal,
        _primaryConcern = primaryConcern,
        _ageRange = ageRange,
        _hairType = hairType,
        _struggleDuration = struggleDuration,
        _triedBefore = triedBefore,
        _usesSulfateFree = usesSulfateFree,
        _washFrequency = washFrequency,
        _bodyFactors = bodyFactors,
        _biggestConcern = biggestConcern,
        _canCommit = canCommit,
        _userName = userName,
        _userEmail = userEmail,
        _fitScore = fitScore,
        _rootCauses = rootCauses,
        _rootCauseCount = rootCauseCount,
        _showScalpUpsell = showScalpUpsell,
        _showNutritionUpsell = showNutritionUpsell,
        _showStressUpsell = showStressUpsell,
        _quizStartTime = quizStartTime,
        _quizCompleteTime = quizCompleteTime;

  // "hairGoal" field - goal_stop_shedding | goal_regrow | goal_strengthen | goal_transform | goal_length | goal_all
  String? _hairGoal;
  String get hairGoal => _hairGoal ?? '';
  set hairGoal(String? val) => _hairGoal = val;
  bool hasHairGoal() => _hairGoal != null;

  // "primaryConcern" field - concern_thinning | concern_shedding | concern_breakage | concern_frizz | concern_scalp
  String? _primaryConcern;
  String get primaryConcern => _primaryConcern ?? '';
  set primaryConcern(String? val) => _primaryConcern = val;
  bool hasPrimaryConcern() => _primaryConcern != null;

  // "ageRange" field - age_18to29 | age_30to39 | age_40to49 | age_50plus
  String? _ageRange;
  String get ageRange => _ageRange ?? '';
  set ageRange(String? val) => _ageRange = val;
  bool hasAgeRange() => _ageRange != null;

  // "hairType" field - type_straight | type_wavy | type_curly | type_coily
  String? _hairType;
  String get hairType => _hairType ?? '';
  set hairType(String? val) => _hairType = val;
  bool hasHairType() => _hairType != null;

  // "struggleDuration" field - duration_new | duration_year | duration_years | duration_long
  String? _struggleDuration;
  String get struggleDuration => _struggleDuration ?? '';
  set struggleDuration(String? val) => _struggleDuration = val;
  bool hasStruggleDuration() => _struggleDuration != null;

  // "triedBefore" field - tried_products | tried_supplements | tried_minoxidil | tried_diy | tried_professional | tried_nothing
  List<String>? _triedBefore;
  List<String> get triedBefore => _triedBefore ?? const [];
  set triedBefore(List<String>? val) => _triedBefore = val;
  void updateTriedBefore(Function(List<String>) updateFn) {
    updateFn(_triedBefore ??= []);
  }
  bool hasTriedBefore() => _triedBefore != null;

  // "usesSulfateFree" field - yes | no
  String? _usesSulfateFree;
  String get usesSulfateFree => _usesSulfateFree ?? '';
  set usesSulfateFree(String? val) => _usesSulfateFree = val;
  bool hasUsesSulfateFree() => _usesSulfateFree != null;

  // "washFrequency" field - daily | everyother | twice_week
  String? _washFrequency;
  String get washFrequency => _washFrequency ?? '';
  set washFrequency(String? val) => _washFrequency = val;
  bool hasWashFrequency() => _washFrequency != null;

  // "bodyFactors" field - body_stress | body_lifechange | body_diet | body_hormones | body_illness | body_none
  List<String>? _bodyFactors;
  List<String> get bodyFactors => _bodyFactors ?? const [];
  set bodyFactors(List<String>? val) => _bodyFactors = val;
  void updateBodyFactors(Function(List<String>) updateFn) {
    updateFn(_bodyFactors ??= []);
  }
  bool hasBodyFactors() => _bodyFactors != null;

  // "biggestConcern" field - concern_works | concern_time | concern_diy | concern_disappointed | concern_none
  String? _biggestConcern;
  String get biggestConcern => _biggestConcern ?? '';
  set biggestConcern(String? val) => _biggestConcern = val;
  bool hasBiggestConcern() => _biggestConcern != null;

  // "canCommit" field
  bool? _canCommit;
  bool get canCommit => _canCommit ?? false;
  set canCommit(bool? val) => _canCommit = val;
  bool hasCanCommit() => _canCommit != null;

  // "userName" field
  String? _userName;
  String get userName => _userName ?? '';
  set userName(String? val) => _userName = val;
  bool hasUserName() => _userName != null;

  // "userEmail" field
  String? _userEmail;
  String get userEmail => _userEmail ?? '';
  set userEmail(String? val) => _userEmail = val;
  bool hasUserEmail() => _userEmail != null;

  // "fitScore" field - 85-98
  int? _fitScore;
  int get fitScore => _fitScore ?? 85;
  set fitScore(int? val) => _fitScore = val;
  bool hasFitScore() => _fitScore != null;

  // "rootCauses" field - cause_buildup | cause_internal | cause_mismatch
  List<String>? _rootCauses;
  List<String> get rootCauses => _rootCauses ?? const [];
  set rootCauses(List<String>? val) => _rootCauses = val;
  void updateRootCauses(Function(List<String>) updateFn) {
    updateFn(_rootCauses ??= []);
  }
  bool hasRootCauses() => _rootCauses != null;

  // "rootCauseCount" field
  int? _rootCauseCount;
  int get rootCauseCount => _rootCauseCount ?? 0;
  set rootCauseCount(int? val) => _rootCauseCount = val;
  bool hasRootCauseCount() => _rootCauseCount != null;

  // "showScalpUpsell" field
  bool? _showScalpUpsell;
  bool get showScalpUpsell => _showScalpUpsell ?? false;
  set showScalpUpsell(bool? val) => _showScalpUpsell = val;
  bool hasShowScalpUpsell() => _showScalpUpsell != null;

  // "showNutritionUpsell" field
  bool? _showNutritionUpsell;
  bool get showNutritionUpsell => _showNutritionUpsell ?? false;
  set showNutritionUpsell(bool? val) => _showNutritionUpsell = val;
  bool hasShowNutritionUpsell() => _showNutritionUpsell != null;

  // "showStressUpsell" field
  bool? _showStressUpsell;
  bool get showStressUpsell => _showStressUpsell ?? false;
  set showStressUpsell(bool? val) => _showStressUpsell = val;
  bool hasShowStressUpsell() => _showStressUpsell != null;

  // "quizStartTime" field
  DateTime? _quizStartTime;
  DateTime? get quizStartTime => _quizStartTime;
  set quizStartTime(DateTime? val) => _quizStartTime = val;
  bool hasQuizStartTime() => _quizStartTime != null;

  // "quizCompleteTime" field
  DateTime? _quizCompleteTime;
  DateTime? get quizCompleteTime => _quizCompleteTime;
  set quizCompleteTime(DateTime? val) => _quizCompleteTime = val;
  bool hasQuizCompleteTime() => _quizCompleteTime != null;

  static QuizProfileV2Struct fromMap(Map<String, dynamic> data) =>
      QuizProfileV2Struct(
        hairGoal: data['hairGoal'] as String?,
        primaryConcern: data['primaryConcern'] as String?,
        ageRange: data['ageRange'] as String?,
        hairType: data['hairType'] as String?,
        struggleDuration: data['struggleDuration'] as String?,
        triedBefore: getDataList<String>(data['triedBefore']),
        usesSulfateFree: data['usesSulfateFree'] as String?,
        washFrequency: data['washFrequency'] as String?,
        bodyFactors: getDataList<String>(data['bodyFactors']),
        biggestConcern: data['biggestConcern'] as String?,
        canCommit: data['canCommit'] as bool?,
        userName: data['userName'] as String?,
        userEmail: data['userEmail'] as String?,
        fitScore: data['fitScore'] as int?,
        rootCauses: getDataList<String>(data['rootCauses']),
        rootCauseCount: data['rootCauseCount'] as int?,
        showScalpUpsell: data['showScalpUpsell'] as bool?,
        showNutritionUpsell: data['showNutritionUpsell'] as bool?,
        showStressUpsell: data['showStressUpsell'] as bool?,
        quizStartTime: data['quizStartTime'] is DateTime
            ? data['quizStartTime']
            : null,
        quizCompleteTime: data['quizCompleteTime'] is DateTime
            ? data['quizCompleteTime']
            : null,
      );

  static QuizProfileV2Struct? maybeFromMap(dynamic data) => data is Map
      ? QuizProfileV2Struct.fromMap(data.cast<String, dynamic>())
      : null;

  Map<String, dynamic> toMap() => {
        'hairGoal': _hairGoal,
        'primaryConcern': _primaryConcern,
        'ageRange': _ageRange,
        'hairType': _hairType,
        'struggleDuration': _struggleDuration,
        'triedBefore': _triedBefore,
        'usesSulfateFree': _usesSulfateFree,
        'washFrequency': _washFrequency,
        'bodyFactors': _bodyFactors,
        'biggestConcern': _biggestConcern,
        'canCommit': _canCommit,
        'userName': _userName,
        'userEmail': _userEmail,
        'fitScore': _fitScore,
        'rootCauses': _rootCauses,
        'rootCauseCount': _rootCauseCount,
        'showScalpUpsell': _showScalpUpsell,
        'showNutritionUpsell': _showNutritionUpsell,
        'showStressUpsell': _showStressUpsell,
        'quizStartTime': _quizStartTime?.toIso8601String(),
        'quizCompleteTime': _quizCompleteTime?.toIso8601String(),
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'hairGoal': serializeParam(_hairGoal, ParamType.String),
        'primaryConcern': serializeParam(_primaryConcern, ParamType.String),
        'ageRange': serializeParam(_ageRange, ParamType.String),
        'hairType': serializeParam(_hairType, ParamType.String),
        'struggleDuration': serializeParam(_struggleDuration, ParamType.String),
        'triedBefore': serializeParam(_triedBefore, ParamType.String, isList: true),
        'usesSulfateFree': serializeParam(_usesSulfateFree, ParamType.String),
        'washFrequency': serializeParam(_washFrequency, ParamType.String),
        'bodyFactors': serializeParam(_bodyFactors, ParamType.String, isList: true),
        'biggestConcern': serializeParam(_biggestConcern, ParamType.String),
        'canCommit': serializeParam(_canCommit, ParamType.bool),
        'userName': serializeParam(_userName, ParamType.String),
        'userEmail': serializeParam(_userEmail, ParamType.String),
        'fitScore': serializeParam(_fitScore, ParamType.int),
        'rootCauses': serializeParam(_rootCauses, ParamType.String, isList: true),
        'rootCauseCount': serializeParam(_rootCauseCount, ParamType.int),
        'showScalpUpsell': serializeParam(_showScalpUpsell, ParamType.bool),
        'showNutritionUpsell': serializeParam(_showNutritionUpsell, ParamType.bool),
        'showStressUpsell': serializeParam(_showStressUpsell, ParamType.bool),
        'quizStartTime': serializeParam(_quizStartTime, ParamType.DateTime),
        'quizCompleteTime': serializeParam(_quizCompleteTime, ParamType.DateTime),
      }.withoutNulls;

  static QuizProfileV2Struct fromSerializableMap(Map<String, dynamic> data) =>
      QuizProfileV2Struct(
        hairGoal: deserializeParam(data['hairGoal'], ParamType.String, false),
        primaryConcern: deserializeParam(data['primaryConcern'], ParamType.String, false),
        ageRange: deserializeParam(data['ageRange'], ParamType.String, false),
        hairType: deserializeParam(data['hairType'], ParamType.String, false),
        struggleDuration: deserializeParam(data['struggleDuration'], ParamType.String, false),
        triedBefore: deserializeParam<String>(data['triedBefore'], ParamType.String, true),
        usesSulfateFree: deserializeParam(data['usesSulfateFree'], ParamType.String, false),
        washFrequency: deserializeParam(data['washFrequency'], ParamType.String, false),
        bodyFactors: deserializeParam<String>(data['bodyFactors'], ParamType.String, true),
        biggestConcern: deserializeParam(data['biggestConcern'], ParamType.String, false),
        canCommit: deserializeParam(data['canCommit'], ParamType.bool, false),
        userName: deserializeParam(data['userName'], ParamType.String, false),
        userEmail: deserializeParam(data['userEmail'], ParamType.String, false),
        fitScore: deserializeParam(data['fitScore'], ParamType.int, false),
        rootCauses: deserializeParam<String>(data['rootCauses'], ParamType.String, true),
        rootCauseCount: deserializeParam(data['rootCauseCount'], ParamType.int, false),
        showScalpUpsell: deserializeParam(data['showScalpUpsell'], ParamType.bool, false),
        showNutritionUpsell: deserializeParam(data['showNutritionUpsell'], ParamType.bool, false),
        showStressUpsell: deserializeParam(data['showStressUpsell'], ParamType.bool, false),
        quizStartTime: deserializeParam(data['quizStartTime'], ParamType.DateTime, false),
        quizCompleteTime: deserializeParam(data['quizCompleteTime'], ParamType.DateTime, false),
      );

  @override
  String toString() => 'QuizProfileV2Struct(${toMap()})';

  @override
  bool operator ==(Object other) {
    const listEquality = ListEquality();
    return other is QuizProfileV2Struct &&
        hairGoal == other.hairGoal &&
        primaryConcern == other.primaryConcern &&
        ageRange == other.ageRange &&
        hairType == other.hairType &&
        struggleDuration == other.struggleDuration &&
        listEquality.equals(triedBefore, other.triedBefore) &&
        usesSulfateFree == other.usesSulfateFree &&
        washFrequency == other.washFrequency &&
        listEquality.equals(bodyFactors, other.bodyFactors) &&
        biggestConcern == other.biggestConcern &&
        canCommit == other.canCommit &&
        userName == other.userName &&
        userEmail == other.userEmail &&
        fitScore == other.fitScore &&
        listEquality.equals(rootCauses, other.rootCauses) &&
        rootCauseCount == other.rootCauseCount &&
        showScalpUpsell == other.showScalpUpsell &&
        showNutritionUpsell == other.showNutritionUpsell &&
        showStressUpsell == other.showStressUpsell &&
        quizStartTime == other.quizStartTime &&
        quizCompleteTime == other.quizCompleteTime;
  }

  @override
  int get hashCode => const ListEquality().hash([
        hairGoal,
        primaryConcern,
        ageRange,
        hairType,
        struggleDuration,
        triedBefore,
        usesSulfateFree,
        washFrequency,
        bodyFactors,
        biggestConcern,
        canCommit,
        userName,
        userEmail,
        fitScore,
        rootCauses,
        rootCauseCount,
        showScalpUpsell,
        showNutritionUpsell,
        showStressUpsell,
        quizStartTime,
        quizCompleteTime,
      ]);
}

QuizProfileV2Struct createQuizProfileV2Struct({
  String? hairGoal,
  String? primaryConcern,
  String? ageRange,
  String? hairType,
  String? struggleDuration,
  String? usesSulfateFree,
  String? washFrequency,
  String? biggestConcern,
  bool? canCommit,
  String? userName,
  String? userEmail,
  int? fitScore,
  int? rootCauseCount,
  bool? showScalpUpsell,
  bool? showNutritionUpsell,
  bool? showStressUpsell,
  DateTime? quizStartTime,
  DateTime? quizCompleteTime,
}) =>
    QuizProfileV2Struct(
      hairGoal: hairGoal,
      primaryConcern: primaryConcern,
      ageRange: ageRange,
      hairType: hairType,
      struggleDuration: struggleDuration,
      usesSulfateFree: usesSulfateFree,
      washFrequency: washFrequency,
      biggestConcern: biggestConcern,
      canCommit: canCommit,
      userName: userName,
      userEmail: userEmail,
      fitScore: fitScore,
      rootCauseCount: rootCauseCount,
      showScalpUpsell: showScalpUpsell,
      showNutritionUpsell: showNutritionUpsell,
      showStressUpsell: showStressUpsell,
      quizStartTime: quizStartTime,
      quizCompleteTime: quizCompleteTime,
    );
