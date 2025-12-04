/// Helper class for all personalization text and content mapping in Quiz V2
class PersonalizationHelper {
  // Concern short text mapping
  static String getConcernShort(String concern) {
    return {
      'concern_thinning': 'thinning hair',
      'concern_shedding': 'hair shedding',
      'concern_breakage': 'breakage',
      'concern_frizz': 'frizz and dryness',
      'concern_scalp': 'scalp issues',
    }[concern] ?? 'hair issues';
  }

  // Age range display text
  static String getAgeRangeDisplay(String ageRange) {
    return {
      'age_18to29': '18-29',
      'age_30to39': '30-39',
      'age_40to49': '40-49',
      'age_50plus': '50+',
    }[ageRange] ?? '';
  }

  // Duration display text
  static String getDurationDisplay(String duration) {
    return {
      'duration_new': 'recently',
      'duration_year': 'about a year',
      'duration_years': 'a few years',
      'duration_long': 'a long time',
    }[duration] ?? '';
  }

  // Hair type display text
  static String getHairTypeDisplay(String hairType) {
    return {
      'type_straight': 'straight',
      'type_wavy': 'wavy',
      'type_curly': 'curly',
      'type_coily': 'coily',
    }[hairType] ?? '';
  }

  // Hair goal display text
  static String getHairGoalDisplay(String hairGoal) {
    return {
      'goal_stop_shedding': 'stopping the shedding',
      'goal_regrow': 'regrowing what you\'ve lost',
      'goal_strengthen': 'strengthening and repairing',
      'goal_transform': 'transforming your hair',
      'goal_length': 'growing it long',
      'goal_all': 'complete transformation',
    }[hairGoal] ?? 'your hair goals';
  }

  // Why tried things failed - for Screen 7
  static Map<String, String> getWhyItFailedMessages() {
    return {
      'tried_products': 'Products add more buildup on your scalp',
      'tried_supplements': 'Supplements can\'t reach blocked follicles',
      'tried_minoxidil': 'Minoxidil is a bandaid — stop using it and hair falls out again',
      'tried_diy': 'Oils help but don\'t fix the underlying issue',
      'tried_professional': 'Specialists treat one piece, miss the whole picture',
    };
  }

  // Buildup reveal message - for Screen 9
  static String getBuilupMessage(String usesSulfateFree, String washFrequency) {
    if (usesSulfateFree == 'yes') {
      return "\"Sulfate-free\" products often cause MORE buildup — they can't fully cleanse";
    } else if (washFrequency == 'twice_week') {
      return "Infrequent washing lets oils and products accumulate on your scalp";
    } else {
      return "Even regular products create invisible layers that build up over time";
    }
  }

  // Internal reveal message - for Screen 11
  static String getInternalMessage(List<String> bodyFactors) {
    if (bodyFactors.contains('body_stress') || bodyFactors.contains('body_lifechange')) {
      return "Your stress is likely redirecting nutrients away from hair";
    }
    if (bodyFactors.contains('body_diet')) {
      return "Your diet may be missing key hair-building nutrients";
    }
    if (bodyFactors.contains('body_hormones')) {
      return "Hormonal shifts directly affect your hair growth cycle";
    }
    if (bodyFactors.contains('body_illness')) {
      return "Your body is prioritizing healing over hair growth";
    }
    return "Even without major stressors, daily life creates low-grade nutrient competition";
  }

  // Body factor short text for display
  static String getBodyFactorShort(List<String> bodyFactors) {
    if (bodyFactors.contains('body_stress') || bodyFactors.contains('body_lifechange')) {
      return "stress";
    }
    if (bodyFactors.contains('body_diet')) {
      return "restricted diet";
    }
    if (bodyFactors.contains('body_hormones')) {
      return "hormonal changes";
    }
    if (bodyFactors.contains('body_illness')) {
      return "health situation";
    }
    return "daily stress";
  }

  // Timeline milestones by concern - for Screen 13
  static Map<String, String> getTimelineMilestones(String concern) {
    switch (concern) {
      case 'concern_thinning':
      case 'concern_shedding':
        return {
          'week1': 'Scalp feels lighter, less inflammation',
          'week2': 'Shedding noticeably reduced',
          'month1': 'Baby hairs appearing at hairline',
          'month3': 'Visible new density, friends notice',
        };
      case 'concern_breakage':
        return {
          'week1': 'Hair feels stronger when wet',
          'week2': 'Breakage dramatically reduced',
          'month1': 'Hair stretches without snapping',
          'month3': 'Growing past your \'stuck point\'',
        };
      case 'concern_frizz':
        return {
          'week1': 'Hair feels smoother, more manageable',
          'week2': 'Frizz visibly reduced',
          'month1': 'Natural texture pattern emerges',
          'month3': 'Hair holds style longer',
        };
      case 'concern_scalp':
        return {
          'week1': 'Scalp irritation calms',
          'week2': 'Flaking reduces significantly',
          'month1': 'Balanced scalp environment',
          'month3': 'Healthy foundation for growth',
        };
      default:
        return {
          'week1': 'Scalp feels refreshed',
          'week2': 'Visible improvement begins',
          'month1': 'Significant progress',
          'month3': 'Transformation complete',
        };
    }
  }

  // Predicted stats by concern - for Screen 16
  static List<String> getPredictedStats(String concern) {
    switch (concern) {
      case 'concern_thinning':
      case 'concern_shedding':
        return [
          '94% see reduced shedding in 2 weeks',
          '89% notice baby hairs within 30 days',
          '92% report thicker-feeling hair at 90 days',
        ];
      case 'concern_breakage':
        return [
          '91% see less breakage in 2 weeks',
          '87% grow past their \'stuck length\' by 60 days',
          '94% report stronger hair at 90 days',
        ];
      case 'concern_frizz':
        return [
          '93% see smoother hair in 2 weeks',
          '88% report more manageable texture by 30 days',
          '91% experience lasting frizz reduction',
        ];
      case 'concern_scalp':
        return [
          '96% see scalp improvement in 1 week',
          '92% report reduced flaking by 14 days',
          '89% maintain balanced scalp long-term',
        ];
      default:
        return [
          '94% see improvement in 2 weeks',
          '89% notice significant change by 30 days',
          '92% report transformation at 90 days',
        ];
    }
  }

  // Future pacing statements by concern - for Screen 23 Section 3
  static List<String> getFuturePacingStatements(String concern) {
    switch (concern) {
      case 'concern_thinning':
      case 'concern_shedding':
        return [
          'You wake up and actually LIKE what you see',
          'The shower drain doesn\'t fill you with dread',
          'Baby hairs frame your face like a crown',
          'Your ponytail feels thick again',
        ];
      case 'concern_breakage':
        return [
          'Your hair finally grows past your \'stuck point\'',
          'You don\'t dread brushing anymore',
          'Split ends become a thing of the past',
          'Your hair feels strong, not fragile',
        ];
      case 'concern_frizz':
        return [
          'Your hair cooperates, even on humid days',
          'Styling takes half the time',
          'Your natural texture finally shines',
          'You leave the house with confidence',
        ];
      case 'concern_scalp':
        return [
          'No more constant itching and scratching',
          'You wear dark colors without worry',
          'Your scalp feels balanced and calm',
          'Hair grows from a healthy foundation',
        ];
      default:
        return [
          'You wake up and actually LIKE what you see',
          'Hair care becomes simple and effective',
          'Friends ask what you\'ve been doing',
          'You stop thinking about your hair constantly',
        ];
    }
  }

  // Concern response data - for Screen 19
  static Map<String, dynamic> getConcernResponse(String biggestConcern, String concernShort, int rootCauseCount) {
    switch (biggestConcern) {
      case 'concern_works':
        return {
          'title': 'Here\'s why it works for your specific case',
          'response': 'Your $concernShort is caused by $rootCauseCount factors we identified. This method addresses ALL of them at once — that\'s why it works when single-solution approaches fail.',
          'proofPoints': [
            '94% of women with your pattern see results',
            '30-day money-back guarantee if you don\'t',
            '200,000+ women have done this',
          ],
        };
      case 'concern_time':
        return {
          'title': 'The time commitment',
          'response': 'Each day takes 10-15 minutes. That\'s actually LESS than most haircare routines — because you stop doing things that don\'t work.',
          'proofPoints': [
            '10-15 minutes per day',
            'Watch the lessons at your own pace',
            'Simple daily actions, not complex rituals',
          ],
        };
      case 'concern_diy':
        return {
          'title': 'About the DIY products',
          'response': 'The DIY shampoo is ONE optional component. It takes 10 minutes to make, uses 5 basic ingredients, and costs about \$10 for 6+ months of product. Most women are surprised how easy it is.',
          'proofPoints': [
            '5 simple ingredients you can get anywhere',
            'Takes 10 minutes, once',
            'You also learn which store products are safe',
          ],
        };
      case 'concern_disappointed':
        return {
          'title': 'We understand disappointment',
          'response': 'You\'ve tried things that treated symptoms, not root causes. That\'s not your fault — that\'s how the industry is designed. This is different because it addresses ALL $rootCauseCount factors at once.',
          'proofPoints': [
            'Different mechanism = different results',
            '30-day guarantee removes all risk',
            'See results or get your money back',
          ],
        };
      case 'concern_none':
        return {
          'title': 'You\'re ready!',
          'response': 'Love that energy. Let\'s get your personalized plan.',
          'proofPoints': <String>[],
        };
      default:
        return {
          'title': 'Let\'s get started',
          'response': 'Your personalized plan is ready.',
          'proofPoints': <String>[],
        };
    }
  }
}
