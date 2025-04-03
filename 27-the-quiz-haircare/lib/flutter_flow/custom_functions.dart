import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:timeago/timeago.dart' as timeago;
import 'lat_lng.dart';
import 'place.dart';
import 'uploaded_file.dart';
import '/backend/schema/structs/index.dart';

double slideAnimationDuration(
  int index,
  int delay,
) {
  int value = index * delay;
  return double.parse(value.toString());
}

double getSliderValue(double percentage) {
  double value = (percentage * 220) / 100;
  return value;
}

String formatNumber(double value) {
  if (value % 1 == 0) {
    // If there's no decimal part, return as an integer
    return value.toInt().toString();
  } else {
    // Round to 2 decimal places and convert to string
    return value.toStringAsFixed(2);
  }
}

String doubleToInt(double value) {
  return value.toInt().toString();
}
