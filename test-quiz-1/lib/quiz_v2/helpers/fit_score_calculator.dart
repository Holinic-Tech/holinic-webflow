import 'dart:math';
import '/backend/schema/structs/quiz_profile_v2_struct.dart';

/// Calculator for determining user's fit score and root causes
class FitScoreCalculator {
  /// Calculate the fit score based on quiz profile data
  /// Returns a score between 85-98
  static int calculateFitScore(QuizProfileV2Struct profile) {
    int score = 85; // Base score

    // Duration bonus (longer = higher potential for improvement)
    if (profile.struggleDuration == 'duration_years' ||
        profile.struggleDuration == 'duration_long') {
      score += 5;
    } else if (profile.struggleDuration == 'duration_year') {
      score += 3;
    }

    // Multiple root causes = better fit for comprehensive solution
    int rootCauseCount = calculateRootCauseCount(profile);
    score += rootCauseCount * 3;

    // Body factors indicate internal issues we can address
    if (profile.bodyFactors.isNotEmpty && !profile.bodyFactors.contains('body_none')) {
      score += 2;
    }

    // Tried multiple things before indicates readiness
    if (profile.triedBefore.length > 2 && !profile.triedBefore.contains('tried_nothing')) {
      score += 2;
    }

    // Cap at 98
    return min(98, score);
  }

  /// Calculate root causes based on profile answers
  static List<String> calculateRootCauses(QuizProfileV2Struct profile) {
    List<String> rootCauses = [];

    // Always add buildup (everyone has some level)
    rootCauses.add('cause_buildup');

    // Add internal if body factors exist (excluding none)
    if (profile.bodyFactors.isNotEmpty && !profile.bodyFactors.contains('body_none')) {
      rootCauses.add('cause_internal');
    }

    // Add mismatch if they tried things that didn't work
    if (profile.triedBefore.isNotEmpty && !profile.triedBefore.contains('tried_nothing')) {
      rootCauses.add('cause_mismatch');
    }

    return rootCauses;
  }

  /// Count of root causes
  static int calculateRootCauseCount(QuizProfileV2Struct profile) {
    return calculateRootCauses(profile).length;
  }

  /// Determine upsell flags based on profile
  static Map<String, bool> calculateUpsellFlags(QuizProfileV2Struct profile) {
    return {
      'showScalpUpsell': profile.primaryConcern == 'concern_scalp',
      'showNutritionUpsell': profile.bodyFactors.contains('body_diet'),
      'showStressUpsell': profile.bodyFactors.contains('body_stress') ||
          profile.bodyFactors.contains('body_lifechange'),
    };
  }

  /// Apply all calculations to a profile and return updated profile
  static QuizProfileV2Struct applyCalculations(QuizProfileV2Struct profile) {
    final rootCauses = calculateRootCauses(profile);
    final fitScore = calculateFitScore(profile);
    final upsellFlags = calculateUpsellFlags(profile);

    profile.rootCauses = rootCauses;
    profile.rootCauseCount = rootCauses.length;
    profile.fitScore = fitScore;
    profile.showScalpUpsell = upsellFlags['showScalpUpsell'] ?? false;
    profile.showNutritionUpsell = upsellFlags['showNutritionUpsell'] ?? false;
    profile.showStressUpsell = upsellFlags['showStressUpsell'] ?? false;

    return profile;
  }

  /// Get display text for root causes
  static List<String> getRootCauseDisplayTexts(List<String> rootCauses) {
    Map<String, String> displayMap = {
      'cause_buildup': 'Product buildup blocking your follicles',
      'cause_internal': 'Internal stress redirecting nutrients',
      'cause_mismatch': 'Wrong routine for your unique hair profile',
    };

    return rootCauses.map((cause) => displayMap[cause] ?? cause).toList();
  }
}
