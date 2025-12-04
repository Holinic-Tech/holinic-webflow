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

Future<void> redirectToCheckout() async {
  try {
    // Base URL for checkout
    String baseUrl =
        "https://checkout.hairqare.co/de/buy/hairqare-challenge-save-85-5/";

    // Get values from app state
    final contactDetails = FFAppState().submittedContactDetails;
    String? email = contactDetails.email;

    String? firstName;
    String? lastName;
    if (contactDetails.name != null && contactDetails.name.isNotEmpty) {
      final nameParts = contactDetails.name.split(' ');
      firstName = nameParts.isNotEmpty ? nameParts.first : null;
      lastName = nameParts.length > 1 ? nameParts.sublist(1).join(' ') : null;
    }

    // Build URL parameters
    List<String> queryParams = [];

    // Add contact details parameters
    if (email != null && email.isNotEmpty) {
      queryParams.add('billing_email=${Uri.encodeComponent(email)}');
    }

    if (firstName != null && firstName.isNotEmpty) {
      queryParams.add('billing_first_name=${Uri.encodeComponent(firstName)}');
    }

    if (lastName != null && lastName.isNotEmpty) {
      queryParams.add('billing_last_name=${Uri.encodeComponent(lastName)}');
    }

    // Get CVG cookie value directly (without relying on another action)
    String cvgUid = '';
    try {
      // Define the JavaScript function to get cookie value
      const jsFunctionDefinition = '''
        if (typeof window.getCookieValue !== 'function') {
          window.getCookieValue = function(cookieName) {
            const name = cookieName + "=";
            const decodedCookie = decodeURIComponent(document.cookie);
            const cookieArray = decodedCookie.split(';');
            
            for (let i = 0; i < cookieArray.length; i++) {
              let cookie = cookieArray[i].trim();
              if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
              }
            }
            return "";
          };
        }
      ''';

      // Ensure the function is defined
      js.context.callMethod('eval', [jsFunctionDefinition]);

      // Call the function to get the cookie value
      final cookieName = '__cvg_uid';
      final result = js.context.callMethod('getCookieValue', [cookieName]);

      // Store the cookie value
      cvgUid = result != null ? result.toString() : '';
      print('Retrieved CVG cookie: $cvgUid');
    } catch (cookieError) {
      print('Error getting cookie: $cookieError');
      // Continue without the cookie if there's an error
    }

    // Add the CVG UID if it exists
    if (cvgUid.isNotEmpty) {
      queryParams.add('__cvg_uid=${Uri.encodeComponent(cvgUid)}');
    }

    // Construct final URL with all parameters
    if (queryParams.isNotEmpty) {
      baseUrl += '?' + queryParams.join('&');
    }

    // Log for debugging
    print('Redirecting to checkout: $baseUrl');

    // Redirect to the checkout URL
    js.context.callMethod('open', [baseUrl, '_self']);
  } catch (e) {
    print('Error redirecting to checkout: $e');

    // Fallback to base URL if something goes wrong
    js.context.callMethod('open', [
      'https://checkout.hairqare.co/de/buy/hairqare-challenge-save-85-5/',
      '_self'
    ]);
  }
}
