import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/backend/schema/structs/testimonial_v2_struct.dart';

/// Carousel for displaying before/after testimonials
class TestimonialCarousel extends StatefulWidget {
  final List<TestimonialV2Struct> testimonials;
  final double height;
  final EdgeInsets? margin;

  const TestimonialCarousel({
    super.key,
    required this.testimonials,
    this.height = 380,
    this.margin,
  });

  @override
  State<TestimonialCarousel> createState() => _TestimonialCarouselState();
}

class _TestimonialCarouselState extends State<TestimonialCarousel> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      margin: widget.margin,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Carousel
          SizedBox(
            height: widget.height,
            child: PageView.builder(
              controller: _pageController,
              itemCount: widget.testimonials.length,
              onPageChanged: (index) {
                setState(() {
                  _currentIndex = index;
                });
              },
              itemBuilder: (context, index) {
                return TestimonialCard(
                  testimonial: widget.testimonials[index],
                );
              },
            ),
          ),
          const SizedBox(height: 12),
          // Dots indicator
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              widget.testimonials.length,
              (index) => Container(
                width: 8,
                height: 8,
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: _currentIndex == index
                      ? theme.button
                      : theme.progessUnselected,
                ),
              ),
            ),
          ),
          // Swipe hint
          if (widget.testimonials.length > 1) ...[
            const SizedBox(height: 8),
            Text(
              '← SWIPE FOR MORE →',
              style: theme.bodySmall.copyWith(
                color: theme.secondaryText,
                fontSize: 11,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Individual testimonial card
class TestimonialCard extends StatelessWidget {
  final TestimonialV2Struct testimonial;
  final EdgeInsets? padding;

  const TestimonialCard({
    super.key,
    required this.testimonial,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: padding ?? const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Before/After images
          Expanded(
            child: _BeforeAfterImages(
              beforeUrl: testimonial.imageBeforeUrl,
              afterUrl: testimonial.imageAfterUrl,
            ),
          ),
          const SizedBox(height: 12),
          // Name and age
          Text(
            '${testimonial.name}, ${testimonial.age}',
            style: theme.titleMedium.copyWith(
              color: theme.primaryText,
              fontWeight: FontWeight.w600,
              fontSize: 16,
            ),
          ),
          // Concern match
          if (testimonial.specificDetail.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(
              testimonial.specificDetail,
              style: theme.bodySmall.copyWith(
                color: theme.secondaryText,
                fontSize: 13,
              ),
              textAlign: TextAlign.center,
            ),
          ],
          // Timeframe
          const SizedBox(height: 4),
          Text(
            testimonial.timeframe,
            style: theme.bodySmall.copyWith(
              color: theme.button,
              fontWeight: FontWeight.w600,
              fontSize: 13,
            ),
          ),
          // Quote if available
          if (testimonial.quote.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              '"${testimonial.quote}"',
              style: theme.bodyMedium.copyWith(
                color: theme.primaryText,
                fontStyle: FontStyle.italic,
                fontSize: 14,
              ),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ],
      ),
    );
  }
}

/// Before/After image pair
class _BeforeAfterImages extends StatelessWidget {
  final String beforeUrl;
  final String afterUrl;

  const _BeforeAfterImages({
    required this.beforeUrl,
    required this.afterUrl,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Row(
      children: [
        // Before image
        Expanded(
          child: Column(
            children: [
              Expanded(
                child: _ImageContainer(
                  imageUrl: beforeUrl,
                  label: 'BEFORE',
                ),
              ),
            ],
          ),
        ),
        // Arrow
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Icon(
            Icons.arrow_forward,
            color: theme.button,
            size: 24,
          ),
        ),
        // After image
        Expanded(
          child: Column(
            children: [
              Expanded(
                child: _ImageContainer(
                  imageUrl: afterUrl,
                  label: 'AFTER',
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ImageContainer extends StatelessWidget {
  final String imageUrl;
  final String label;

  const _ImageContainer({
    required this.imageUrl,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Column(
      children: [
        // Label
        Text(
          label,
          style: theme.bodySmall.copyWith(
            color: theme.secondaryText,
            fontSize: 10,
            fontWeight: FontWeight.w600,
            letterSpacing: 1,
          ),
        ),
        const SizedBox(height: 4),
        // Image
        Expanded(
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              color: theme.backgroundDove,
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: imageUrl.isNotEmpty
                  ? Image.network(
                      imageUrl,
                      fit: BoxFit.cover,
                      width: double.infinity,
                      errorBuilder: (context, error, stackTrace) {
                        return _buildPlaceholder(context);
                      },
                      loadingBuilder: (context, child, loadingProgress) {
                        if (loadingProgress == null) return child;
                        return Center(
                          child: CircularProgressIndicator(
                            value: loadingProgress.expectedTotalBytes != null
                                ? loadingProgress.cumulativeBytesLoaded /
                                    loadingProgress.expectedTotalBytes!
                                : null,
                            strokeWidth: 2,
                            color: theme.button,
                          ),
                        );
                      },
                    )
                  : _buildPlaceholder(context),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPlaceholder(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);
    return Center(
      child: Icon(
        Icons.person,
        size: 40,
        color: theme.secondaryText.withOpacity(0.3),
      ),
    );
  }
}

/// Simple before/after pair for entry screen
class BeforeAfterPair extends StatelessWidget {
  final String beforeUrl;
  final String afterUrl;
  final String name;
  final int age;
  final String timeframe;
  final double height;

  const BeforeAfterPair({
    super.key,
    required this.beforeUrl,
    required this.afterUrl,
    required this.name,
    required this.age,
    required this.timeframe,
    this.height = 200,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            height: height,
            child: _BeforeAfterImages(
              beforeUrl: beforeUrl,
              afterUrl: afterUrl,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '$name, $age — $timeframe',
            style: theme.bodySmall.copyWith(
              color: theme.secondaryText,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}
