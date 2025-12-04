// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

/// Purchase plan
class PlanStruct extends BaseStruct {
  PlanStruct({
    /// Plan Title
    String? title,

    /// Actual price (Without discount).
    double? actualPrice,

    /// Discounted plan price
    double? discountedPrice,

    /// Per day actual price (Without discount)
    double? perDayActualPrice,

    /// Discounted per day price
    double? discountedPerDayPrice,

    /// if most popular plan then it's value will be true otherwise false.
    bool? isPopularPlan,

    /// Question Id
    String? id,
  })  : _title = title,
        _actualPrice = actualPrice,
        _discountedPrice = discountedPrice,
        _perDayActualPrice = perDayActualPrice,
        _discountedPerDayPrice = discountedPerDayPrice,
        _isPopularPlan = isPopularPlan,
        _id = id;

  // "title" field.
  String? _title;
  String get title => _title ?? '';
  set title(String? val) => _title = val;

  bool hasTitle() => _title != null;

  // "actualPrice" field.
  double? _actualPrice;
  double get actualPrice => _actualPrice ?? 0.0;
  set actualPrice(double? val) => _actualPrice = val;

  void incrementActualPrice(double amount) =>
      actualPrice = actualPrice + amount;

  bool hasActualPrice() => _actualPrice != null;

  // "discountedPrice" field.
  double? _discountedPrice;
  double get discountedPrice => _discountedPrice ?? 0.0;
  set discountedPrice(double? val) => _discountedPrice = val;

  void incrementDiscountedPrice(double amount) =>
      discountedPrice = discountedPrice + amount;

  bool hasDiscountedPrice() => _discountedPrice != null;

  // "perDayActualPrice" field.
  double? _perDayActualPrice;
  double get perDayActualPrice => _perDayActualPrice ?? 0.0;
  set perDayActualPrice(double? val) => _perDayActualPrice = val;

  void incrementPerDayActualPrice(double amount) =>
      perDayActualPrice = perDayActualPrice + amount;

  bool hasPerDayActualPrice() => _perDayActualPrice != null;

  // "discountedPerDayPrice" field.
  double? _discountedPerDayPrice;
  double get discountedPerDayPrice => _discountedPerDayPrice ?? 0.0;
  set discountedPerDayPrice(double? val) => _discountedPerDayPrice = val;

  void incrementDiscountedPerDayPrice(double amount) =>
      discountedPerDayPrice = discountedPerDayPrice + amount;

  bool hasDiscountedPerDayPrice() => _discountedPerDayPrice != null;

  // "isPopularPlan" field.
  bool? _isPopularPlan;
  bool get isPopularPlan => _isPopularPlan ?? false;
  set isPopularPlan(bool? val) => _isPopularPlan = val;

  bool hasIsPopularPlan() => _isPopularPlan != null;

  // "Id" field.
  String? _id;
  String get id => _id ?? '';
  set id(String? val) => _id = val;

  bool hasId() => _id != null;

  static PlanStruct fromMap(Map<String, dynamic> data) => PlanStruct(
        title: data['title'] as String?,
        actualPrice: castToType<double>(data['actualPrice']),
        discountedPrice: castToType<double>(data['discountedPrice']),
        perDayActualPrice: castToType<double>(data['perDayActualPrice']),
        discountedPerDayPrice:
            castToType<double>(data['discountedPerDayPrice']),
        isPopularPlan: data['isPopularPlan'] as bool?,
        id: data['Id'] as String?,
      );

  static PlanStruct? maybeFromMap(dynamic data) =>
      data is Map ? PlanStruct.fromMap(data.cast<String, dynamic>()) : null;

  Map<String, dynamic> toMap() => {
        'title': _title,
        'actualPrice': _actualPrice,
        'discountedPrice': _discountedPrice,
        'perDayActualPrice': _perDayActualPrice,
        'discountedPerDayPrice': _discountedPerDayPrice,
        'isPopularPlan': _isPopularPlan,
        'Id': _id,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'title': serializeParam(
          _title,
          ParamType.String,
        ),
        'actualPrice': serializeParam(
          _actualPrice,
          ParamType.double,
        ),
        'discountedPrice': serializeParam(
          _discountedPrice,
          ParamType.double,
        ),
        'perDayActualPrice': serializeParam(
          _perDayActualPrice,
          ParamType.double,
        ),
        'discountedPerDayPrice': serializeParam(
          _discountedPerDayPrice,
          ParamType.double,
        ),
        'isPopularPlan': serializeParam(
          _isPopularPlan,
          ParamType.bool,
        ),
        'Id': serializeParam(
          _id,
          ParamType.String,
        ),
      }.withoutNulls;

  static PlanStruct fromSerializableMap(Map<String, dynamic> data) =>
      PlanStruct(
        title: deserializeParam(
          data['title'],
          ParamType.String,
          false,
        ),
        actualPrice: deserializeParam(
          data['actualPrice'],
          ParamType.double,
          false,
        ),
        discountedPrice: deserializeParam(
          data['discountedPrice'],
          ParamType.double,
          false,
        ),
        perDayActualPrice: deserializeParam(
          data['perDayActualPrice'],
          ParamType.double,
          false,
        ),
        discountedPerDayPrice: deserializeParam(
          data['discountedPerDayPrice'],
          ParamType.double,
          false,
        ),
        isPopularPlan: deserializeParam(
          data['isPopularPlan'],
          ParamType.bool,
          false,
        ),
        id: deserializeParam(
          data['Id'],
          ParamType.String,
          false,
        ),
      );

  @override
  String toString() => 'PlanStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is PlanStruct &&
        title == other.title &&
        actualPrice == other.actualPrice &&
        discountedPrice == other.discountedPrice &&
        perDayActualPrice == other.perDayActualPrice &&
        discountedPerDayPrice == other.discountedPerDayPrice &&
        isPopularPlan == other.isPopularPlan &&
        id == other.id;
  }

  @override
  int get hashCode => const ListEquality().hash([
        title,
        actualPrice,
        discountedPrice,
        perDayActualPrice,
        discountedPerDayPrice,
        isPopularPlan,
        id
      ]);
}

PlanStruct createPlanStruct({
  String? title,
  double? actualPrice,
  double? discountedPrice,
  double? perDayActualPrice,
  double? discountedPerDayPrice,
  bool? isPopularPlan,
  String? id,
}) =>
    PlanStruct(
      title: title,
      actualPrice: actualPrice,
      discountedPrice: discountedPrice,
      perDayActualPrice: perDayActualPrice,
      discountedPerDayPrice: discountedPerDayPrice,
      isPopularPlan: isPopularPlan,
      id: id,
    );
