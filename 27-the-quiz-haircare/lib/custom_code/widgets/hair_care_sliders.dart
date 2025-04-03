// Automatic FlutterFlow imports
import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'index.dart'; // Imports other custom widgets
import '/custom_code/actions/index.dart'; // Imports custom actions
import '/flutter_flow/custom_functions.dart'; // Imports custom functions
import 'package:flutter/material.dart';
// Begin custom widget code
// DO NOT REMOVE OR MODIFY THE CODE ABOVE!

import 'package:carousel_slider/carousel_slider.dart';

class HairCareSliders extends StatefulWidget {
  const HairCareSliders(
      {super.key,
      this.width,
      this.height,
      required this.imageList,
      required this.aspectRatio,
      required this.autoPlayInterval,
      required this.autoPlayAnimationDuration});

  final double? width;
  final double? height;
  final List<String> imageList;
  final double aspectRatio;
  final int autoPlayInterval;
  final int autoPlayAnimationDuration;

  @override
  State<HairCareSliders> createState() => _HairCareSlidersState();
}

class _HairCareSlidersState extends State<HairCareSliders> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CarouselSlider(
        options: CarouselOptions(
          height: widget.height,
          aspectRatio: widget.aspectRatio,
          enlargeCenterPage: true,
          autoPlayInterval: Duration(milliseconds: widget.autoPlayInterval),
          autoPlayAnimationDuration:
              Duration(milliseconds: widget.autoPlayAnimationDuration),
          enableInfiniteScroll: true,
          autoPlay: true,
        ),
        items: widget.imageList
            .map(
                (item) => Image.network(item, fit: BoxFit.cover, width: 1000.0))
            .toList(),
      ),
    );
  }
}
