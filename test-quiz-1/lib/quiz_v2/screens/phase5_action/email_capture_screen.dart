import 'package:flutter/material.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/quiz_v2/components/components.dart';

/// Screen 21: Email Capture Screen
/// Purpose: Capture lead for follow-up
/// Emotion: Anticipation
class EmailCaptureScreen extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const EmailCaptureScreen({
    super.key,
    required this.onNext,
    required this.onBack,
  });

  @override
  State<EmailCaptureScreen> createState() => _EmailCaptureScreenState();
}

class _EmailCaptureScreenState extends State<EmailCaptureScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  bool get _canSubmit =>
      _nameController.text.isNotEmpty && _isValidEmail(_emailController.text);

  bool _isValidEmail(String email) {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
  }

  Future<void> _onSubmit() async {
    if (!_canSubmit || _isLoading) return;

    setState(() {
      _isLoading = true;
    });

    // Save to state
    FFAppState().update(() {
      FFAppState().quizProfileV2.userName = _nameController.text;
      FFAppState().quizProfileV2.userEmail = _emailController.text;
      FFAppState().quizProfileV2.quizCompleteTime = DateTime.now();
    });

    // TODO: Fire webhook to CRM/Klaviyo here
    // await webhookCallQuizProfile();

    // TODO: Fire conversion tracking
    // trackGAEvent('quiz_email_captured');

    // Small delay to show loading state
    await Future.delayed(const Duration(milliseconds: 500));

    if (mounted) {
      widget.onNext();
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return SafeArea(
      child: Column(
        children: [
          // Header with progress
          QuizHeaderV2(
            currentStep: 12,
            totalSteps: 12,
            showBackButton: true,
            onBackPressed: widget.onBack,
          ),

          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    const SizedBox(height: 24),

                    // Title
                    Text(
                      'Your personalized plan is ready!',
                      style: theme.headlineSmall.copyWith(
                        color: theme.primaryText,
                        fontWeight: FontWeight.w700,
                        fontSize: 22,
                      ),
                      textAlign: TextAlign.center,
                    ),

                    const SizedBox(height: 24),

                    // Preview visual (blurred/teased)
                    Container(
                      width: double.infinity,
                      height: 140,
                      decoration: BoxDecoration(
                        color: theme.backgroundDove,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: theme.progessUnselected),
                      ),
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          // Blurred content preview
                          Opacity(
                            opacity: 0.3,
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Container(
                                  width: 60,
                                  height: 60,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: theme.button.withOpacity(0.3),
                                  ),
                                  child: Center(
                                    child: Text(
                                      '94%',
                                      style: TextStyle(
                                        color: theme.button,
                                        fontWeight: FontWeight.w700,
                                        fontSize: 16,
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Container(
                                  width: 120,
                                  height: 8,
                                  decoration: BoxDecoration(
                                    color: theme.primaryText.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Container(
                                  width: 80,
                                  height: 6,
                                  decoration: BoxDecoration(
                                    color: theme.primaryText.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(3),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          // Lock icon overlay
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.1),
                                  blurRadius: 10,
                                ),
                              ],
                            ),
                            child: Icon(
                              Icons.lock_outline,
                              color: theme.button,
                              size: 24,
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Subtitle
                    Text(
                      'Enter your details to see your results:',
                      style: theme.bodyMedium.copyWith(
                        color: theme.secondaryText,
                        fontSize: 14,
                      ),
                      textAlign: TextAlign.center,
                    ),

                    const SizedBox(height: 20),

                    // Name input
                    _InputField(
                      controller: _nameController,
                      label: 'Your name',
                      hint: 'Enter your first name',
                      keyboardType: TextInputType.name,
                      textCapitalization: TextCapitalization.words,
                      onChanged: (value) => setState(() {}),
                    ),

                    const SizedBox(height: 16),

                    // Email input
                    _InputField(
                      controller: _emailController,
                      label: 'Your email',
                      hint: 'Enter your email address',
                      keyboardType: TextInputType.emailAddress,
                      onChanged: (value) => setState(() {}),
                    ),

                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
          ),

          // Submit button
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                QuizPrimaryButton(
                  text: 'SEE MY RESULTS',
                  isEnabled: _canSubmit,
                  isLoading: _isLoading,
                  onPressed: _onSubmit,
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.lock,
                      size: 14,
                      color: theme.secondaryText,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'Your info is safe with us',
                      style: theme.bodySmall.copyWith(
                        color: theme.secondaryText,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _InputField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final String hint;
  final TextInputType keyboardType;
  final TextCapitalization textCapitalization;
  final Function(String)? onChanged;

  const _InputField({
    required this.controller,
    required this.label,
    required this.hint,
    this.keyboardType = TextInputType.text,
    this.textCapitalization = TextCapitalization.none,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: theme.labelMedium.copyWith(
            color: theme.primaryText,
            fontWeight: FontWeight.w600,
            fontSize: 14,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          textCapitalization: textCapitalization,
          onChanged: onChanged,
          style: theme.bodyMedium.copyWith(
            color: theme.primaryText,
            fontSize: 16,
          ),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: theme.bodyMedium.copyWith(
              color: theme.secondaryText.withOpacity(0.5),
              fontSize: 16,
            ),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 16,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: theme.progessUnselected),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: theme.progessUnselected),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: theme.button, width: 2),
            ),
          ),
        ),
      ],
    );
  }
}
