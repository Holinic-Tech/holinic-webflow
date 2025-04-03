// Automatic FlutterFlow imports
import '/backend/schema/structs/index.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'index.dart'; // Imports other custom actions
import '/flutter_flow/custom_functions.dart'; // Imports custom functions
import 'package:flutter/material.dart';
// Begin custom action code
// DO NOT REMOVE OR MODIFY THE CODE ABOVE!

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:js' as js;

Future<void> webhookCallcvg() async {
  try {
    // Get the app state values
    final quizProfile = FFAppState().quizProfile;
    final contactDetails = FFAppState().submittedContactDetails;

    // Parse name into first name and last name
    String fullName = contactDetails.name ?? '';
    String firstName = fullName;
    String lastName = '';

    if (fullName.isNotEmpty) {
      // Split the name by space
      List<String> nameParts = fullName.trim().split(' ');

      // If there are multiple parts, assume first part is first name and rest is last name
      if (nameParts.length > 1) {
        firstName = nameParts[0];
        lastName = nameParts
            .sublist(1)
            .join(' '); // Join all remaining parts as last name
      }
    }

    // Convert quiz answers to serializable format for the JS call
    var answersData = quizProfile.qaPairs
        .map((qaPair) => {
              'questionId': qaPair.questionId,
              'answerIds': qaPair.answerIds,
            })
        .toList();

    // Call the JavaScript tracking function
    js.context.callMethod('trackEvent', [
      'Completed Quiz',
      js.JsObject.jsify({
        'answers': answersData,
        'name': fullName,
        'firstName': firstName,
        'lastName': lastName,
        'email': contactDetails.email,
      }),
      null, // Event ID, if available, else null
      js.JsObject.jsify({
        '\$email': contactDetails.email,
      }), // Profile properties
      js.JsObject.jsify(['urn:email:${contactDetails.email}']), // Aliases
    ]);

    print("CVG tracking event called successfully");
  } catch (e, stackTrace) {
    // Handle any exceptions here
    print("Exception caught in webhookCallcvg:");
    print("Error message: $e");
    print("Stack trace: $stackTrace");
  }
}
