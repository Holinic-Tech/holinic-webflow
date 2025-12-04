// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

/// Testimonial data for before/after matching
class TestimonialV2Struct extends BaseStruct {
  TestimonialV2Struct({
    String? name,
    int? age,
    String? imageBeforeUrl,
    String? imageAfterUrl,
    String? quote,
    String? concernMatch,
    String? ageRangeMatch,
    String? hairTypeMatch,
    String? timeframe,
    String? specificDetail,
  })  : _name = name,
        _age = age,
        _imageBeforeUrl = imageBeforeUrl,
        _imageAfterUrl = imageAfterUrl,
        _quote = quote,
        _concernMatch = concernMatch,
        _ageRangeMatch = ageRangeMatch,
        _hairTypeMatch = hairTypeMatch,
        _timeframe = timeframe,
        _specificDetail = specificDetail;

  // "name" field
  String? _name;
  String get name => _name ?? '';
  set name(String? val) => _name = val;
  bool hasName() => _name != null;

  // "age" field
  int? _age;
  int get age => _age ?? 0;
  set age(int? val) => _age = val;
  bool hasAge() => _age != null;

  // "imageBeforeUrl" field
  String? _imageBeforeUrl;
  String get imageBeforeUrl => _imageBeforeUrl ?? '';
  set imageBeforeUrl(String? val) => _imageBeforeUrl = val;
  bool hasImageBeforeUrl() => _imageBeforeUrl != null;

  // "imageAfterUrl" field
  String? _imageAfterUrl;
  String get imageAfterUrl => _imageAfterUrl ?? '';
  set imageAfterUrl(String? val) => _imageAfterUrl = val;
  bool hasImageAfterUrl() => _imageAfterUrl != null;

  // "quote" field
  String? _quote;
  String get quote => _quote ?? '';
  set quote(String? val) => _quote = val;
  bool hasQuote() => _quote != null;

  // "concernMatch" field - concern_thinning | concern_shedding | concern_breakage | concern_frizz | concern_scalp
  String? _concernMatch;
  String get concernMatch => _concernMatch ?? '';
  set concernMatch(String? val) => _concernMatch = val;
  bool hasConcernMatch() => _concernMatch != null;

  // "ageRangeMatch" field - age_18to29 | age_30to39 | age_40to49 | age_50plus
  String? _ageRangeMatch;
  String get ageRangeMatch => _ageRangeMatch ?? '';
  set ageRangeMatch(String? val) => _ageRangeMatch = val;
  bool hasAgeRangeMatch() => _ageRangeMatch != null;

  // "hairTypeMatch" field - type_straight | type_wavy | type_curly | type_coily
  String? _hairTypeMatch;
  String get hairTypeMatch => _hairTypeMatch ?? '';
  set hairTypeMatch(String? val) => _hairTypeMatch = val;
  bool hasHairTypeMatch() => _hairTypeMatch != null;

  // "timeframe" field - e.g., "3 months"
  String? _timeframe;
  String get timeframe => _timeframe ?? '';
  set timeframe(String? val) => _timeframe = val;
  bool hasTimeframe() => _timeframe != null;

  // "specificDetail" field - extra detail for display
  String? _specificDetail;
  String get specificDetail => _specificDetail ?? '';
  set specificDetail(String? val) => _specificDetail = val;
  bool hasSpecificDetail() => _specificDetail != null;

  static TestimonialV2Struct fromMap(Map<String, dynamic> data) =>
      TestimonialV2Struct(
        name: data['name'] as String?,
        age: data['age'] as int?,
        imageBeforeUrl: data['imageBeforeUrl'] as String?,
        imageAfterUrl: data['imageAfterUrl'] as String?,
        quote: data['quote'] as String?,
        concernMatch: data['concernMatch'] as String?,
        ageRangeMatch: data['ageRangeMatch'] as String?,
        hairTypeMatch: data['hairTypeMatch'] as String?,
        timeframe: data['timeframe'] as String?,
        specificDetail: data['specificDetail'] as String?,
      );

  static TestimonialV2Struct? maybeFromMap(dynamic data) => data is Map
      ? TestimonialV2Struct.fromMap(data.cast<String, dynamic>())
      : null;

  Map<String, dynamic> toMap() => {
        'name': _name,
        'age': _age,
        'imageBeforeUrl': _imageBeforeUrl,
        'imageAfterUrl': _imageAfterUrl,
        'quote': _quote,
        'concernMatch': _concernMatch,
        'ageRangeMatch': _ageRangeMatch,
        'hairTypeMatch': _hairTypeMatch,
        'timeframe': _timeframe,
        'specificDetail': _specificDetail,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'name': serializeParam(_name, ParamType.String),
        'age': serializeParam(_age, ParamType.int),
        'imageBeforeUrl': serializeParam(_imageBeforeUrl, ParamType.String),
        'imageAfterUrl': serializeParam(_imageAfterUrl, ParamType.String),
        'quote': serializeParam(_quote, ParamType.String),
        'concernMatch': serializeParam(_concernMatch, ParamType.String),
        'ageRangeMatch': serializeParam(_ageRangeMatch, ParamType.String),
        'hairTypeMatch': serializeParam(_hairTypeMatch, ParamType.String),
        'timeframe': serializeParam(_timeframe, ParamType.String),
        'specificDetail': serializeParam(_specificDetail, ParamType.String),
      }.withoutNulls;

  static TestimonialV2Struct fromSerializableMap(Map<String, dynamic> data) =>
      TestimonialV2Struct(
        name: deserializeParam(data['name'], ParamType.String, false),
        age: deserializeParam(data['age'], ParamType.int, false),
        imageBeforeUrl: deserializeParam(data['imageBeforeUrl'], ParamType.String, false),
        imageAfterUrl: deserializeParam(data['imageAfterUrl'], ParamType.String, false),
        quote: deserializeParam(data['quote'], ParamType.String, false),
        concernMatch: deserializeParam(data['concernMatch'], ParamType.String, false),
        ageRangeMatch: deserializeParam(data['ageRangeMatch'], ParamType.String, false),
        hairTypeMatch: deserializeParam(data['hairTypeMatch'], ParamType.String, false),
        timeframe: deserializeParam(data['timeframe'], ParamType.String, false),
        specificDetail: deserializeParam(data['specificDetail'], ParamType.String, false),
      );

  @override
  String toString() => 'TestimonialV2Struct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is TestimonialV2Struct &&
        name == other.name &&
        age == other.age &&
        imageBeforeUrl == other.imageBeforeUrl &&
        imageAfterUrl == other.imageAfterUrl &&
        quote == other.quote &&
        concernMatch == other.concernMatch &&
        ageRangeMatch == other.ageRangeMatch &&
        hairTypeMatch == other.hairTypeMatch &&
        timeframe == other.timeframe &&
        specificDetail == other.specificDetail;
  }

  @override
  int get hashCode => const ListEquality().hash([
        name,
        age,
        imageBeforeUrl,
        imageAfterUrl,
        quote,
        concernMatch,
        ageRangeMatch,
        hairTypeMatch,
        timeframe,
        specificDetail,
      ]);
}

TestimonialV2Struct createTestimonialV2Struct({
  String? name,
  int? age,
  String? imageBeforeUrl,
  String? imageAfterUrl,
  String? quote,
  String? concernMatch,
  String? ageRangeMatch,
  String? hairTypeMatch,
  String? timeframe,
  String? specificDetail,
}) =>
    TestimonialV2Struct(
      name: name,
      age: age,
      imageBeforeUrl: imageBeforeUrl,
      imageAfterUrl: imageAfterUrl,
      quote: quote,
      concernMatch: concernMatch,
      ageRangeMatch: ageRangeMatch,
      hairTypeMatch: hairTypeMatch,
      timeframe: timeframe,
      specificDetail: specificDetail,
    );
