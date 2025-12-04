import '/backend/schema/structs/quiz_profile_v2_struct.dart';
import '/backend/schema/structs/testimonial_v2_struct.dart';

/// Matches testimonials to user profile for maximum relevance
class TestimonialMatcher {
  /// Get testimonials sorted by best match to user profile
  /// Required: same primary concern
  /// Preferred: same age range
  /// Nice to have: same hair type
  static List<TestimonialV2Struct> getMatchedTestimonials(
    List<TestimonialV2Struct> allTestimonials,
    QuizProfileV2Struct profile,
  ) {
    // Filter by primary concern (required)
    final filtered = allTestimonials.where((t) {
      return t.concernMatch == profile.primaryConcern;
    }).toList();

    // If no matches on concern, return all (fallback)
    if (filtered.isEmpty) {
      return _sortByRelevance(allTestimonials, profile);
    }

    return _sortByRelevance(filtered, profile);
  }

  /// Sort testimonials by relevance score
  static List<TestimonialV2Struct> _sortByRelevance(
    List<TestimonialV2Struct> testimonials,
    QuizProfileV2Struct profile,
  ) {
    testimonials.sort((a, b) {
      int scoreA = _calculateMatchScore(a, profile);
      int scoreB = _calculateMatchScore(b, profile);
      return scoreB.compareTo(scoreA); // Higher score first
    });

    return testimonials;
  }

  /// Calculate match score for a single testimonial
  static int _calculateMatchScore(TestimonialV2Struct testimonial, QuizProfileV2Struct profile) {
    int score = 0;

    // Primary concern match (highest weight)
    if (testimonial.concernMatch == profile.primaryConcern) {
      score += 10;
    }

    // Age range match
    if (testimonial.ageRangeMatch == profile.ageRange) {
      score += 5;
    }

    // Hair type match
    if (testimonial.hairTypeMatch == profile.hairType) {
      score += 3;
    }

    return score;
  }

  /// Get top N testimonials for display
  static List<TestimonialV2Struct> getTopTestimonials(
    List<TestimonialV2Struct> allTestimonials,
    QuizProfileV2Struct profile, {
    int count = 5,
  }) {
    final matched = getMatchedTestimonials(allTestimonials, profile);
    return matched.take(count).toList();
  }

  /// Get a single best-match testimonial for entry screen
  static TestimonialV2Struct? getBestMatchTestimonial(
    List<TestimonialV2Struct> allTestimonials,
    QuizProfileV2Struct profile,
  ) {
    final matched = getMatchedTestimonials(allTestimonials, profile);
    return matched.isNotEmpty ? matched.first : null;
  }

  /// Sample testimonials data - replace with actual data from CMS/backend
  static List<TestimonialV2Struct> getSampleTestimonials() {
    return [
      // Thinning/Shedding testimonials
      TestimonialV2Struct(
        name: 'Sarah',
        age: 34,
        imageBeforeUrl: 'assets/images/testimonials/sarah_before.jpg',
        imageAfterUrl: 'assets/images/testimonials/sarah_after.jpg',
        quote: 'I finally stopped dreading the shower drain.',
        concernMatch: 'concern_shedding',
        ageRangeMatch: 'age_30to39',
        hairTypeMatch: 'type_straight',
        timeframe: '3 months',
        specificDetail: 'Mom of 2, noticed shedding after her second pregnancy',
      ),
      TestimonialV2Struct(
        name: 'Jennifer',
        age: 42,
        imageBeforeUrl: 'assets/images/testimonials/jennifer_before.jpg',
        imageAfterUrl: 'assets/images/testimonials/jennifer_after.jpg',
        quote: 'My hairline is back. I can\'t believe it.',
        concernMatch: 'concern_thinning',
        ageRangeMatch: 'age_40to49',
        hairTypeMatch: 'type_wavy',
        timeframe: '4 months',
        specificDetail: 'Started thinning in her late 30s',
      ),
      TestimonialV2Struct(
        name: 'Michelle',
        age: 28,
        imageBeforeUrl: 'assets/images/testimonials/michelle_before.jpg',
        imageAfterUrl: 'assets/images/testimonials/michelle_after.jpg',
        quote: 'The baby hairs around my face make me so happy.',
        concernMatch: 'concern_shedding',
        ageRangeMatch: 'age_18to29',
        hairTypeMatch: 'type_curly',
        timeframe: '2 months',
        specificDetail: 'Stress-related shedding from grad school',
      ),
      // Breakage testimonials
      TestimonialV2Struct(
        name: 'Ashley',
        age: 31,
        imageBeforeUrl: 'assets/images/testimonials/ashley_before.jpg',
        imageAfterUrl: 'assets/images/testimonials/ashley_after.jpg',
        quote: 'My hair finally grew past my shoulders!',
        concernMatch: 'concern_breakage',
        ageRangeMatch: 'age_30to39',
        hairTypeMatch: 'type_straight',
        timeframe: '5 months',
        specificDetail: 'Heat damage from years of styling',
      ),
      TestimonialV2Struct(
        name: 'Keisha',
        age: 26,
        imageBeforeUrl: 'assets/images/testimonials/keisha_before.jpg',
        imageAfterUrl: 'assets/images/testimonials/keisha_after.jpg',
        quote: 'No more breakage, my curls are thriving.',
        concernMatch: 'concern_breakage',
        ageRangeMatch: 'age_18to29',
        hairTypeMatch: 'type_coily',
        timeframe: '3 months',
        specificDetail: 'Protective styling damage',
      ),
      // Frizz testimonials
      TestimonialV2Struct(
        name: 'Emily',
        age: 35,
        imageBeforeUrl: 'assets/images/testimonials/emily_before.jpg',
        imageAfterUrl: 'assets/images/testimonials/emily_after.jpg',
        quote: 'My hair is finally smooth and manageable.',
        concernMatch: 'concern_frizz',
        ageRangeMatch: 'age_30to39',
        hairTypeMatch: 'type_wavy',
        timeframe: '6 weeks',
        specificDetail: 'Struggled with frizz in humidity',
      ),
      TestimonialV2Struct(
        name: 'Diana',
        age: 52,
        imageBeforeUrl: 'assets/images/testimonials/diana_before.jpg',
        imageAfterUrl: 'assets/images/testimonials/diana_after.jpg',
        quote: 'First time in years I can style it easily.',
        concernMatch: 'concern_frizz',
        ageRangeMatch: 'age_50plus',
        hairTypeMatch: 'type_curly',
        timeframe: '2 months',
        specificDetail: 'Menopause changed her hair texture',
      ),
      // Scalp testimonials
      TestimonialV2Struct(
        name: 'Lisa',
        age: 38,
        imageBeforeUrl: 'assets/images/testimonials/lisa_before.jpg',
        imageAfterUrl: 'assets/images/testimonials/lisa_after.jpg',
        quote: 'No more itching! I can finally wear black.',
        concernMatch: 'concern_scalp',
        ageRangeMatch: 'age_30to39',
        hairTypeMatch: 'type_straight',
        timeframe: '3 weeks',
        specificDetail: 'Years of dandruff and sensitivity',
      ),
      TestimonialV2Struct(
        name: 'Priya',
        age: 45,
        imageBeforeUrl: 'assets/images/testimonials/priya_before.jpg',
        imageAfterUrl: 'assets/images/testimonials/priya_after.jpg',
        quote: 'My scalp feels balanced for the first time.',
        concernMatch: 'concern_scalp',
        ageRangeMatch: 'age_40to49',
        hairTypeMatch: 'type_wavy',
        timeframe: '1 month',
        specificDetail: 'Product buildup causing irritation',
      ),
    ];
  }
}
