// Automatic FlutterFlow imports
import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'index.dart'; // Imports other custom actions
import '/flutter_flow/custom_functions.dart'; // Imports custom functions
import 'package:flutter/material.dart';
// Begin custom action code
// DO NOT REMOVE OR MODIFY THE CODE ABOVE!

import 'dart:js' as js;
import 'dart:convert';

Future<void> trackGAEvent(
  String eventName,
  String? questionId,
  String? question,
  List<String>? selectedAnswer,
  String? name,
  String? email,
  // List<String>? answer, // COMMENTED OUT: Re-enable this parameter if you need to track specific answer text
) async {
  try {
    print('⚡ TRACKING EVENT: $eventName');

    // Get the quiz index from app state
    final quizIndex = FFAppState().quizIndex;
    print('📊 Position: $quizIndex');

    // Create event parameters map
    final params = <String, dynamic>{
      'event': eventName,
      'event_category': 'Quiz',
      'position': quizIndex,
    };

    // Add optional parameters if they exist
    if (questionId != null) params['question_id'] = questionId;
    if (question != null) params['question'] = question;

    // COMMENTED OUT: Answer parameter handling
    // To re-enable answer tracking:
    // 1. Uncomment the parameter in the function definition above
    // 2. Uncomment the line below
    // 3. Pass a List<String> when calling this function
    // params['answer'] = answer ?? [];

    // Add selected answer as a list
    params['selected_answer'] = selectedAnswer ?? [];

    // Use q_name and q_email field names to avoid conflicts
    if (name != null && name.isNotEmpty) params['q_name'] = name;
    if (email != null && email.isNotEmpty) params['q_email'] = email;

    // For debugging
    print('📤 Sending event parameters: ${jsonEncode(params)}');

    // Use the js.JsObject approach directly
    try {
      // Convert params to a JS object directly
      final jsParams = js.JsObject.jsify(params);

      // Check if dataLayer exists and push
      final dataLayerExists = js.context.hasProperty('dataLayer');

      if (dataLayerExists) {
        // Get the dataLayer array
        final dataLayer = js.context['dataLayer'];

        // Push to dataLayer
        dataLayer.callMethod('push', [jsParams]);

        print('✅ Direct dataLayer push completed');
      } else {
        print('❌ dataLayer not found, trying gtag fallback');
        throw Exception('dataLayer not defined');
      }
    } catch (e) {
      print('⚠️ Error in direct push: $e');

      // Fallback to gtag
      try {
        js.context.callMethod(
            'gtag', ['event', eventName, js.JsObject.jsify(params)]);
        print('✅ Fallback gtag call completed');
      } catch (gtagError) {
        print('⚠️ Fallback gtag error: $gtagError');
      }
    }
  } catch (e) {
    // Handle exceptions gracefully
    print('❌ ERROR tracking GA event: $e');
  }
}
