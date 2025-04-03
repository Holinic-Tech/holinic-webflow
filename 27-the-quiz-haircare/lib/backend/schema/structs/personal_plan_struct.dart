// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

/// Personal plan dialog data
///
class PersonalPlanStruct extends BaseStruct {
  PersonalPlanStruct({
    /// Title of personal plan
    String? title,

    /// Actual price of personal plan
    double? price,

    /// Discounted price
    double? discountedPrice,

    /// Question Id
    String? id,
  })  : _title = title,
        _price = price,
        _discountedPrice = discountedPrice,
        _id = id;

  // "title" field.
  String? _title;
  String get title => _title ?? '';
  set title(String? val) => _title = val;

  bool hasTitle() => _title != null;

  // "price" field.
  double? _price;
  double get price => _price ?? 0.0;
  set price(double? val) => _price = val;

  void incrementPrice(double amount) => price = price + amount;

  bool hasPrice() => _price != null;

  // "discountedPrice" field.
  double? _discountedPrice;
  double get discountedPrice => _discountedPrice ?? 0.0;
  set discountedPrice(double? val) => _discountedPrice = val;

  void incrementDiscountedPrice(double amount) =>
      discountedPrice = discountedPrice + amount;

  bool hasDiscountedPrice() => _discountedPrice != null;

  // "id" field.
  String? _id;
  String get id => _id ?? '';
  set id(String? val) => _id = val;

  bool hasId() => _id != null;

  static PersonalPlanStruct fromMap(Map<String, dynamic> data) =>
      PersonalPlanStruct(
        title: data['title'] as String?,
        price: castToType<double>(data['price']),
        discountedPrice: castToType<double>(data['discountedPrice']),
        id: data['id'] as String?,
      );

  static PersonalPlanStruct? maybeFromMap(dynamic data) => data is Map
      ? PersonalPlanStruct.fromMap(data.cast<String, dynamic>())
      : null;

  Map<String, dynamic> toMap() => {
        'title': _title,
        'price': _price,
        'discountedPrice': _discountedPrice,
        'id': _id,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'title': serializeParam(
          _title,
          ParamType.String,
        ),
        'price': serializeParam(
          _price,
          ParamType.double,
        ),
        'discountedPrice': serializeParam(
          _discountedPrice,
          ParamType.double,
        ),
        'id': serializeParam(
          _id,
          ParamType.String,
        ),
      }.withoutNulls;

  static PersonalPlanStruct fromSerializableMap(Map<String, dynamic> data) =>
      PersonalPlanStruct(
        title: deserializeParam(
          data['title'],
          ParamType.String,
          false,
        ),
        price: deserializeParam(
          data['price'],
          ParamType.double,
          false,
        ),
        discountedPrice: deserializeParam(
          data['discountedPrice'],
          ParamType.double,
          false,
        ),
        id: deserializeParam(
          data['id'],
          ParamType.String,
          false,
        ),
      );

  @override
  String toString() => 'PersonalPlanStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is PersonalPlanStruct &&
        title == other.title &&
        price == other.price &&
        discountedPrice == other.discountedPrice &&
        id == other.id;
  }

  @override
  int get hashCode =>
      const ListEquality().hash([title, price, discountedPrice, id]);
}

PersonalPlanStruct createPersonalPlanStruct({
  String? title,
  double? price,
  double? discountedPrice,
  String? id,
}) =>
    PersonalPlanStruct(
      title: title,
      price: price,
      discountedPrice: discountedPrice,
      id: id,
    );
