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

class CarouselSliders extends StatefulWidget {
  const CarouselSliders({
    super.key,
    this.width,
    this.height,
    required this.imageList,
    required this.aspectRatio,
    required this.viewportFraction,
    required this.enlargeFactor,
    required this.activeDotColor,
    required this.inactiveDotColor,
    required this.dotSize,
  });

  final double? width;
  final double? height;
  final List<String> imageList;
  final double aspectRatio;
  final double viewportFraction;
  final double enlargeFactor;
  final Color activeDotColor;
  final Color inactiveDotColor;
  final double dotSize;

  @override
  State<CarouselSliders> createState() => _CarouselSlidersState();
}

class _CarouselSlidersState extends State<CarouselSliders> {
  int currentPage = 0;
  final CarouselSliderController _carouselController =
      CarouselSliderController();

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            CarouselSlider(
              carouselController: _carouselController, // ✅ Assign controller
              options: CarouselOptions(
                aspectRatio: widget.aspectRatio,
                viewportFraction: widget.viewportFraction,
                enlargeFactor: widget.enlargeFactor,
                enlargeCenterPage: true,
                scrollDirection: Axis.horizontal,
                autoPlay: false,
                onPageChanged: (index, reason) {
                  setState(() {
                    currentPage = index; // ✅ Update page index
                  });
                },
              ),
              items: widget.imageList
                  .map((item) => ClipRRect(
                        borderRadius: BorderRadius.all(Radius.circular(10.0)),
                        child: Image.network(item,
                            fit: BoxFit.cover, width: 1000.0),
                      ))
                  .toList(),
            ),
            // Left Button
            Visibility(
              visible: currentPage != 0,
              replacement: SizedBox(),
              child: Positioned(
                left: 10,
                child: GestureDetector(
                  onTap: () {
                    if (currentPage > 0) {
                      _carouselController.animateToPage(
                        currentPage - 1,
                        duration: Duration(milliseconds: 500),
                        curve: Curves.easeInOut,
                      );
                    }
                  },
                  child: Container(
                    height: 40,
                    width: 40,
                    decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(100)),
                    child: Center(
                      child: Icon(Icons.arrow_back_ios_sharp,
                          size: 25, color: Colors.white),
                    ),
                  ),
                ),
              ),
            ),
            // Right Button
            Visibility(
              visible: currentPage != widget.imageList.length - 1,
              replacement: SizedBox(),
              child: Positioned(
                right: 10,
                child: GestureDetector(
                  onTap: () {
                    if (currentPage < widget.imageList.length - 1) {
                      _carouselController.animateToPage(
                        currentPage + 1,
                        duration: Duration(milliseconds: 500),
                        curve: Curves.easeInOut,
                      );
                    }
                  },
                  child: Container(
                    height: 40,
                    width: 40,
                    decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(100)),
                    child: Center(
                      child: Icon(Icons.arrow_forward_ios_sharp,
                          size: 25, color: Colors.white),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        // Dots Indicator
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(widget.imageList.length, (index) {
            return AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              margin: const EdgeInsets.symmetric(horizontal: 4),
              height: widget.dotSize,
              width: widget.dotSize,
              decoration: BoxDecoration(
                color: currentPage == index
                    ? widget.activeDotColor
                    : widget.inactiveDotColor,
                borderRadius: BorderRadius.circular(4),
              ),
            );
          }),
        ),
      ],
    );
  }
}
