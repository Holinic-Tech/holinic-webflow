import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';

/// Screen 24: Checkout Redirect
/// Purpose: Redirect to WooCommerce checkout with all profile data
class CheckoutRedirect extends StatefulWidget {
  const CheckoutRedirect({super.key});

  @override
  State<CheckoutRedirect> createState() => _CheckoutRedirectState();
}

class _CheckoutRedirectState extends State<CheckoutRedirect> {
  @override
  void initState() {
    super.initState();
    _redirectToCheckout();
  }

  Future<void> _redirectToCheckout() async {
    final profile = FFAppState().quizProfileV2;

    // Build checkout URL with profile data
    final Map<String, String> params = {
      'email': profile.userEmail,
      'name': profile.userName,
      'hair_goal': profile.hairGoal,
      'concern': profile.primaryConcern,
      'age_range': profile.ageRange,
      'hair_type': profile.hairType,
      'duration': profile.struggleDuration,
      'fit_score': profile.fitScore.toString(),
      'root_cause_count': profile.rootCauseCount.toString(),
    };

    // Filter out empty values
    params.removeWhere((key, value) => value.isEmpty);

    // Build query string
    final queryString = params.entries
        .map((e) => '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}')
        .join('&');

    // TODO: Replace with actual checkout URL
    final checkoutUrl = 'https://checkout.hairqare.co/challenge?$queryString';

    // TODO: Track conversion event
    // trackGAEvent('checkout_initiated', params);

    // Launch URL
    try {
      await launchURL(checkoutUrl);
    } catch (e) {
      debugPrint('Failed to launch checkout URL: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Scaffold(
      backgroundColor: theme.primaryBackground,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(theme.button),
              ),
              const SizedBox(height: 24),
              Text(
                'Redirecting to checkout...',
                style: theme.titleMedium.copyWith(
                  color: theme.primaryText,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Please wait a moment',
                style: theme.bodyMedium.copyWith(
                  color: theme.secondaryText,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
