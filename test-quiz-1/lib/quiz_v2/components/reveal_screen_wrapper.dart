import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import 'quiz_primary_button.dart';

/// Wrapper for reveal screens with fade-in animation
/// Used for all insight/revelation screens in the quiz
class RevealScreenWrapper extends StatefulWidget {
  final Widget child;
  final String? ctaText;
  final VoidCallback? onCtaPressed;
  final VoidCallback? onBackPressed;
  final bool showBackButton;
  final Duration animationDuration;

  const RevealScreenWrapper({
    super.key,
    required this.child,
    this.ctaText,
    this.onCtaPressed,
    this.onBackPressed,
    this.showBackButton = true,
    this.animationDuration = const Duration(milliseconds: 500),
  });

  @override
  State<RevealScreenWrapper> createState() => _RevealScreenWrapperState();
}

class _RevealScreenWrapperState extends State<RevealScreenWrapper>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.animationDuration,
      vsync: this,
    );
    _fadeAnimation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return SafeArea(
      child: Column(
        children: [
          // Optional back button at top
          if (widget.showBackButton && widget.onBackPressed != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              alignment: Alignment.centerLeft,
              child: GestureDetector(
                onTap: widget.onBackPressed,
                child: Container(
                  padding: const EdgeInsets.all(8),
                  child: Icon(
                    Icons.arrow_back_ios,
                    size: 20,
                    color: theme.primaryText,
                  ),
                ),
              ),
            ),

          // Main content with fade animation
          Expanded(
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: widget.child,
            ),
          ),

          // CTA button at bottom
          if (widget.ctaText != null && widget.onCtaPressed != null)
            Container(
              padding: const EdgeInsets.all(16),
              child: QuizPrimaryButton(
                text: widget.ctaText!,
                onPressed: widget.onCtaPressed,
              ),
            ),
        ],
      ),
    );
  }
}

/// Info card for reveal screens
class RevealInfoCard extends StatelessWidget {
  final String? icon;
  final String text;
  final Color? backgroundColor;
  final EdgeInsets? margin;

  const RevealInfoCard({
    super.key,
    this.icon,
    required this.text,
    this.backgroundColor,
    this.margin,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      margin: margin ?? const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: backgroundColor ?? theme.secondaryAlmond.withOpacity(0.3),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          if (icon != null && icon!.isNotEmpty) ...[
            Text(
              icon!,
              style: const TextStyle(fontSize: 20),
            ),
            const SizedBox(width: 12),
          ],
          Expanded(
            child: Text(
              text,
              style: theme.bodyMedium.copyWith(
                color: theme.primaryText,
                fontSize: 14,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Warning card for reveal screens (yellow/orange background)
class RevealWarningCard extends StatelessWidget {
  final String text;
  final EdgeInsets? margin;

  const RevealWarningCard({
    super.key,
    required this.text,
    this.margin,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      margin: margin ?? const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.accentTangerine.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: theme.accentTangerine.withOpacity(0.5),
          width: 1,
        ),
      ),
      child: Row(
        children: [
          const Text(
            '⚠️',
            style: TextStyle(fontSize: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: theme.bodyMedium.copyWith(
                color: theme.primaryText,
                fontSize: 14,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Section title for reveal screens
class RevealSectionTitle extends StatelessWidget {
  final String? emoji;
  final String text;
  final EdgeInsets? margin;
  final TextAlign? textAlign;

  const RevealSectionTitle({
    super.key,
    this.emoji,
    required this.text,
    this.margin,
    this.textAlign,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      margin: margin ?? const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisAlignment: textAlign == TextAlign.center
            ? MainAxisAlignment.center
            : MainAxisAlignment.start,
        children: [
          if (emoji != null && emoji!.isNotEmpty) ...[
            Text(
              emoji!,
              style: const TextStyle(fontSize: 24),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Text(
              text,
              style: theme.headlineSmall.copyWith(
                color: theme.primaryText,
                fontWeight: FontWeight.w700,
                fontSize: 22,
              ),
              textAlign: textAlign ?? TextAlign.left,
            ),
          ),
        ],
      ),
    );
  }
}

/// Body text for reveal screens
class RevealBodyText extends StatelessWidget {
  final String text;
  final EdgeInsets? margin;
  final TextAlign? textAlign;

  const RevealBodyText({
    super.key,
    required this.text,
    this.margin,
    this.textAlign,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Container(
      margin: margin ?? const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: Text(
        text,
        style: theme.bodyMedium.copyWith(
          color: theme.secondaryText,
          fontSize: 15,
          height: 1.5,
        ),
        textAlign: textAlign ?? TextAlign.left,
      ),
    );
  }
}
