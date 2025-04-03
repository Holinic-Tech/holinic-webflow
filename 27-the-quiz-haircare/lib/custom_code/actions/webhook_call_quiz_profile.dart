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

Future<void> webhookCallQuizProfile() async {
  try {
    // Get the app state values
    final quizProfile = FFAppState().quizProfile;
    final cdpMapping = FFAppState().cdpMapping;
    final contactDetails = FFAppState().submittedContactDetails;

    // Create webhook URL
    var url =
        Uri.parse('https://hook.us1.make.com/3d6vksxwtqukhrx465bjymy4y6sfdkr6');

    // Prepare ActiveCampaign fields mapping
    var acFields = <String, dynamic>{};
    // Prepare Mixpanel fields mapping
    var mpFields = <String, dynamic>{};

    // Process each answer in the quiz profile
    if (quizProfile.qaPairs != null) {
      for (var qaPair in quizProfile.qaPairs) {
        // Find the mapping for this questionId
        var mappings = cdpMapping
            .where((mapping) => mapping.questionId == qaPair.questionId)
            .toList();

        if (mappings.isNotEmpty) {
          // Get the first mapping that matches (should be only one)
          var mapping = mappings.first;

          // Add to ActiveCampaign fields if acField is defined
          if (mapping.acField != null && mapping.acField > 0) {
            // For AC, always join multiple values with commas
            String answer = qaPair.answerIds.join(', ');
            acFields['field_' + mapping.acField.toString()] = answer;
          }

          // Add to Mixpanel fields if mpField is defined
          if (mapping.mpField != null && mapping.mpField.isNotEmpty) {
            // For Mixpanel, keep as array for multiple answers, string for single
            if (qaPair.answerIds.length > 1) {
              // Multiple answers - keep as array for Mixpanel
              mpFields[mapping.mpField] = qaPair.answerIds;
            } else {
              // Single answer - send as string
              mpFields[mapping.mpField] =
                  qaPair.answerIds.isNotEmpty ? qaPair.answerIds.first : '';
            }
          }
        }
      }
    }

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

    // Prepare the payload
    var payload = {
      'name': fullName, // Keep the original full name
      'firstName': firstName,
      'lastName': lastName,
      'email': contactDetails.email,
      'quizData': {
        'rawAnswers': quizProfile.qaPairs
            .map((qaPair) => {
                  'questionId': qaPair.questionId,
                  'answerIds': qaPair.answerIds,
                })
            .toList(),
      },
      'activeCampaign': acFields,
      'mixpanel': mpFields,
    };

    // Convert the payload to JSON
    var jsonPayload = jsonEncode(payload);

    // Log the payload for debugging
    print("Sending quiz profile to webhook:");
    print(jsonPayload);

    // Send the POST request without awaiting the response
    // This will allow the custom action to complete without waiting for the webhook response
    http
        .post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonPayload,
    )
        .then((response) {
      // This will run asynchronously after the response is received
      print("Webhook response: Status Code: ${response.statusCode}");
      print("Response body: ${response.body}");

      // Retry once if the first attempt fails
      if (response.statusCode != 200) {
        print("First attempt failed, trying again...");
        http
            .post(
          url,
          headers: {'Content-Type': 'application/json'},
          body: jsonPayload,
        )
            .then((retryResponse) {
          print(
              "Second attempt response: Status Code: ${retryResponse.statusCode}");
          print("Response body: ${retryResponse.body}");
        }).catchError((e) {
          print("Error in retry request: $e");
        });
      }
    }).catchError((e) {
      // Handle errors gracefully
      print("Exception caught in webhook call:");
      print("Error message: $e");
    });

    // The function returns immediately without waiting for the HTTP response
  } catch (e, stackTrace) {
    // Handle errors gracefully
    print("Exception caught in webhookCallQuizProfile:");
    print("Error message: $e");
    print("Stack trace: $stackTrace");
  }
}
