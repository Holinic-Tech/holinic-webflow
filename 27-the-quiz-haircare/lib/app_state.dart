import 'package:flutter/material.dart';
import '/backend/schema/structs/index.dart';
import 'flutter_flow/flutter_flow_util.dart';

class FFAppState extends ChangeNotifier {
  static FFAppState _instance = FFAppState._internal();

  factory FFAppState() {
    return _instance;
  }

  FFAppState._internal();

  static void reset() {
    _instance = FFAppState._internal();
  }

  Future initializePersistedState() async {}

  void update(VoidCallback callback) {
    callback();
    notifyListeners();
  }

  List<String> _dummyData = [
    'Hello World',
    'Hello World',
    'Hello World',
    'Hello World',
    'Hello World',
    'Hello World',
    'Hello World',
    'Hello World',
    'Hello World',
    'Hello World',
    'Hello World'
  ];
  List<String> get dummyData => _dummyData;
  set dummyData(List<String> value) {
    _dummyData = value;
  }

  void addToDummyData(String value) {
    dummyData.add(value);
  }

  void removeFromDummyData(String value) {
    dummyData.remove(value);
  }

  void removeAtIndexFromDummyData(int index) {
    dummyData.removeAt(index);
  }

  void updateDummyDataAtIndex(
    int index,
    String Function(String) updateFn,
  ) {
    dummyData[index] = updateFn(_dummyData[index]);
  }

  void insertAtIndexInDummyData(int index, String value) {
    dummyData.insert(index, value);
  }

  List<String> _beforeLoadingData = [
    'Checking your hair condition',
    'Analysing your routine',
    'Checking your challenge-fit'
  ];
  List<String> get beforeLoadingData => _beforeLoadingData;
  set beforeLoadingData(List<String> value) {
    _beforeLoadingData = value;
  }

  void addToBeforeLoadingData(String value) {
    beforeLoadingData.add(value);
  }

  void removeFromBeforeLoadingData(String value) {
    beforeLoadingData.remove(value);
  }

  void removeAtIndexFromBeforeLoadingData(int index) {
    beforeLoadingData.removeAt(index);
  }

  void updateBeforeLoadingDataAtIndex(
    int index,
    String Function(String) updateFn,
  ) {
    beforeLoadingData[index] = updateFn(_beforeLoadingData[index]);
  }

  void insertAtIndexInBeforeLoadingData(int index, String value) {
    beforeLoadingData.insert(index, value);
  }

  ///  Multiple-choice answer with check box
  List<MultiChoiceCheckBoxStruct> _multiChoiceAnswer = [
    MultiChoiceCheckBoxStruct.fromSerializableMap(
        jsonDecode('{\"title\":\"Heat styling\",\"checkBox\":\"false\"}')),
    MultiChoiceCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"Bleaching / hair colour\",\"checkBox\":\"false\"}')),
    MultiChoiceCheckBoxStruct.fromSerializableMap(
        jsonDecode('{\"title\":\"Sun exposure\",\"checkBox\":\"false\"}')),
    MultiChoiceCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"Tight hair styles (braids, bun, ponytail...)\",\"checkBox\":\"false\"}'))
  ];
  List<MultiChoiceCheckBoxStruct> get multiChoiceAnswer => _multiChoiceAnswer;
  set multiChoiceAnswer(List<MultiChoiceCheckBoxStruct> value) {
    _multiChoiceAnswer = value;
  }

  void addToMultiChoiceAnswer(MultiChoiceCheckBoxStruct value) {
    multiChoiceAnswer.add(value);
  }

  void removeFromMultiChoiceAnswer(MultiChoiceCheckBoxStruct value) {
    multiChoiceAnswer.remove(value);
  }

  void removeAtIndexFromMultiChoiceAnswer(int index) {
    multiChoiceAnswer.removeAt(index);
  }

  void updateMultiChoiceAnswerAtIndex(
    int index,
    MultiChoiceCheckBoxStruct Function(MultiChoiceCheckBoxStruct) updateFn,
  ) {
    multiChoiceAnswer[index] = updateFn(_multiChoiceAnswer[index]);
  }

  void insertAtIndexInMultiChoiceAnswer(
      int index, MultiChoiceCheckBoxStruct value) {
    multiChoiceAnswer.insert(index, value);
  }

  /// Answer title and description data.
  List<AnswerWithTitleAndDescriptionStruct> _answerWithTitleAndDescription = [
    AnswerWithTitleAndDescriptionStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"No specific diet\",\"description\":\"I don\'t have any dietary restrictions\"}')),
    AnswerWithTitleAndDescriptionStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"Vegetarian\",\"description\":\"I abstain from meat, fish, and poultry\\nproducts\"}')),
    AnswerWithTitleAndDescriptionStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"Gluten-free\",\"description\":\"I avoid wheat, barley, rye or other grains\"}')),
    AnswerWithTitleAndDescriptionStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"Vegan\",\"description\":\"I avoid all animal-based products: meat,\\neggs, dairy, etc. Plant-based foods only\"}')),
    AnswerWithTitleAndDescriptionStruct.fromSerializableMap(
        jsonDecode('{\"title\":\"Other\",\"description\":\"\"}'))
  ];
  List<AnswerWithTitleAndDescriptionStruct> get answerWithTitleAndDescription =>
      _answerWithTitleAndDescription;
  set answerWithTitleAndDescription(
      List<AnswerWithTitleAndDescriptionStruct> value) {
    _answerWithTitleAndDescription = value;
  }

  void addToAnswerWithTitleAndDescription(
      AnswerWithTitleAndDescriptionStruct value) {
    answerWithTitleAndDescription.add(value);
  }

  void removeFromAnswerWithTitleAndDescription(
      AnswerWithTitleAndDescriptionStruct value) {
    answerWithTitleAndDescription.remove(value);
  }

  void removeAtIndexFromAnswerWithTitleAndDescription(int index) {
    answerWithTitleAndDescription.removeAt(index);
  }

  void updateAnswerWithTitleAndDescriptionAtIndex(
    int index,
    AnswerWithTitleAndDescriptionStruct Function(
            AnswerWithTitleAndDescriptionStruct)
        updateFn,
  ) {
    answerWithTitleAndDescription[index] =
        updateFn(_answerWithTitleAndDescription[index]);
  }

  void insertAtIndexInAnswerWithTitleAndDescription(
      int index, AnswerWithTitleAndDescriptionStruct value) {
    answerWithTitleAndDescription.insert(index, value);
  }

  /// Question with single-choice answer Image
  List<ImageAnswerStruct> _answerWithImageChoice = [
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/62cbaa353a301e2d7eaa36cb_62a20099979bdb2469305727_haircare-done-right%20(2).jpeg\",\"answer\":\"Answer 1\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/62cbaa353a301e2d7eaa36cb_62a20099979bdb2469305727_haircare-done-right%20(2).jpeg\",\"answer\":\"Answer 2\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/62cbaa353a301e2d7eaa36cb_62a20099979bdb2469305727_haircare-done-right%20(2).jpeg\",\"answer\":\"Answer 3\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/62cbaa353a301e2d7eaa36cb_62a20099979bdb2469305727_haircare-done-right%20(2).jpeg\",\"answer\":\"Answer 4\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://picsum.photos/seed/515/600\",\"answer\":\"Hello World\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://picsum.photos/seed/152/600\",\"answer\":\"Hello World\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://picsum.photos/seed/258/600\",\"answer\":\"Hello World\"}'))
  ];
  List<ImageAnswerStruct> get answerWithImageChoice => _answerWithImageChoice;
  set answerWithImageChoice(List<ImageAnswerStruct> value) {
    _answerWithImageChoice = value;
  }

  void addToAnswerWithImageChoice(ImageAnswerStruct value) {
    answerWithImageChoice.add(value);
  }

  void removeFromAnswerWithImageChoice(ImageAnswerStruct value) {
    answerWithImageChoice.remove(value);
  }

  void removeAtIndexFromAnswerWithImageChoice(int index) {
    answerWithImageChoice.removeAt(index);
  }

  void updateAnswerWithImageChoiceAtIndex(
    int index,
    ImageAnswerStruct Function(ImageAnswerStruct) updateFn,
  ) {
    answerWithImageChoice[index] = updateFn(_answerWithImageChoice[index]);
  }

  void insertAtIndexInAnswerWithImageChoice(
      int index, ImageAnswerStruct value) {
    answerWithImageChoice.insert(index, value);
  }

  /// Question with answer.
  List<AnswerStruct> _answer = [
    AnswerStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"Heat styling\",\"image\":\"https://cdn.pixabay.com/photo/2020/12/27/20/25/smile-5865209_1280.png\"}')),
    AnswerStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"Bleaching / hair colour\",\"image\":\"https://cdn.pixabay.com/photo/2020/12/27/20/25/smile-5865209_1280.png\"}')),
    AnswerStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"Frequent swimming\",\"image\":\"https://cdn.pixabay.com/photo/2020/12/27/20/25/smile-5865209_1280.png\"}')),
    AnswerStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"Sun exposure\",\"image\":\"https://cdn.pixabay.com/photo/2020/12/27/20/25/smile-5865209_1280.png\"}')),
    AnswerStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"Tight hair styles (braids, bun, ponytail...)\",\"image\":\"https://cdn.pixabay.com/photo/2020/12/27/20/25/smile-5865209_1280.png\"}')),
    AnswerStruct.fromSerializableMap(
        jsonDecode('{\"answer\":\"None of the above\"}'))
  ];
  List<AnswerStruct> get answer => _answer;
  set answer(List<AnswerStruct> value) {
    _answer = value;
  }

  void addToAnswer(AnswerStruct value) {
    answer.add(value);
  }

  void removeFromAnswer(AnswerStruct value) {
    answer.remove(value);
  }

  void removeAtIndexFromAnswer(int index) {
    answer.removeAt(index);
  }

  void updateAnswerAtIndex(
    int index,
    AnswerStruct Function(AnswerStruct) updateFn,
  ) {
    answer[index] = updateFn(_answer[index]);
  }

  void insertAtIndexInAnswer(int index, AnswerStruct value) {
    answer.insert(index, value);
  }

  int _quizIndex = 0;
  int get quizIndex => _quizIndex;
  set quizIndex(int value) {
    _quizIndex = value;
  }

  List<ImageAnswerStruct> _hairConcern = [
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Q3%20Hair%20loss.webp\",\"answer\":\"Hair loss or hair thinning\",\"id\":\"concern_hairloss\",\"type\":\"hairConcern\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Q3%20Damage%20Hair.webp\",\"answer\":\"Damage from dye, heat, or chemical treatments\",\"id\":\"concern_damage\",\"type\":\"hairConcern\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Q3%20Irritation.webp\",\"answer\":\"Scalp irritation or dandruff\",\"id\":\"concern_scalp\",\"type\":\"hairConcern\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Q3%20Split%20ends.webp\",\"answer\":\"Split ends, frizz, and dryness\",\"id\":\"concern_splitends\",\"type\":\"hairConcern\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Q3%20other.webp\",\"answer\":\"Other, mixed issues\",\"id\":\"concern_mixed\",\"type\":\"hairConcern\"}'))
  ];
  List<ImageAnswerStruct> get hairConcern => _hairConcern;
  set hairConcern(List<ImageAnswerStruct> value) {
    _hairConcern = value;
  }

  void addToHairConcern(ImageAnswerStruct value) {
    hairConcern.add(value);
  }

  void removeFromHairConcern(ImageAnswerStruct value) {
    hairConcern.remove(value);
  }

  void removeAtIndexFromHairConcern(int index) {
    hairConcern.removeAt(index);
  }

  void updateHairConcernAtIndex(
    int index,
    ImageAnswerStruct Function(ImageAnswerStruct) updateFn,
  ) {
    hairConcern[index] = updateFn(_hairConcern[index]);
  }

  void insertAtIndexInHairConcern(int index, ImageAnswerStruct value) {
    hairConcern.insert(index, value);
  }

  /// Start loading screen data
  List<String> _loadingWidget = [
    '🚫 No more hidden harmful ingredients.',
    '🌱 Reduced hair loss and new baby hair growth.',
    '✅ Split ends that don\'t come back.',
    '💛 The best of science, made easy at home.'
  ];
  List<String> get loadingWidget => _loadingWidget;
  set loadingWidget(List<String> value) {
    _loadingWidget = value;
  }

  void addToLoadingWidget(String value) {
    loadingWidget.add(value);
  }

  void removeFromLoadingWidget(String value) {
    loadingWidget.remove(value);
  }

  void removeAtIndexFromLoadingWidget(int index) {
    loadingWidget.removeAt(index);
  }

  void updateLoadingWidgetAtIndex(
    int index,
    String Function(String) updateFn,
  ) {
    loadingWidget[index] = updateFn(_loadingWidget[index]);
  }

  void insertAtIndexInLoadingWidget(int index, String value) {
    loadingWidget.insert(index, value);
  }

  /// Multi select checkbox with images
  List<MultiChoiceWithImagesCheckBoxStruct> _multiChoiceWithImage = [
    MultiChoiceWithImagesCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/62cbaa353a301ee4ebaa36ce_IMG_1173-scaled-p-500.jpeg\",\"title\":\"Rosemary oil is a universal treatment\",\"checklBox\":\"false\"}')),
    MultiChoiceWithImagesCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/62cbaa353a301ee4ebaa36ce_IMG_1173-scaled-p-500.jpeg\",\"title\":\"Coconut oil is the best hair oil\",\"checklBox\":\"false\"}')),
    MultiChoiceWithImagesCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/62cbaa353a301ee4ebaa36ce_IMG_1173-scaled-p-500.jpeg\",\"title\":\"Rice water will make your hair grow faster\",\"checklBox\":\"false\"}')),
    MultiChoiceWithImagesCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/62cbaa353a301ee4ebaa36ce_IMG_1173-scaled-p-500.jpeg\",\"title\":\"Natural and organic products are better\",\"checklBox\":\"false\"}')),
    MultiChoiceWithImagesCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/62cbaa353a301ee4ebaa36ce_IMG_1173-scaled-p-500.jpeg\",\"title\":\"Hair can heal like the skin\",\"checklBox\":\"false\"}'))
  ];
  List<MultiChoiceWithImagesCheckBoxStruct> get multiChoiceWithImage =>
      _multiChoiceWithImage;
  set multiChoiceWithImage(List<MultiChoiceWithImagesCheckBoxStruct> value) {
    _multiChoiceWithImage = value;
  }

  void addToMultiChoiceWithImage(MultiChoiceWithImagesCheckBoxStruct value) {
    multiChoiceWithImage.add(value);
  }

  void removeFromMultiChoiceWithImage(
      MultiChoiceWithImagesCheckBoxStruct value) {
    multiChoiceWithImage.remove(value);
  }

  void removeAtIndexFromMultiChoiceWithImage(int index) {
    multiChoiceWithImage.removeAt(index);
  }

  void updateMultiChoiceWithImageAtIndex(
    int index,
    MultiChoiceWithImagesCheckBoxStruct Function(
            MultiChoiceWithImagesCheckBoxStruct)
        updateFn,
  ) {
    multiChoiceWithImage[index] = updateFn(_multiChoiceWithImage[index]);
  }

  void insertAtIndexInMultiChoiceWithImage(
      int index, MultiChoiceWithImagesCheckBoxStruct value) {
    multiChoiceWithImage.insert(index, value);
  }

  List<String> _imageList = [
    'https://assets.hairqare.co/Hair%20loss%20Testimonial%202.webp',
    'https://assets.hairqare.co/Other%20issue%20Testimonial%201.webp',
    'https://assets.hairqare.co/Hair%20loss%20Testimonial%203.webp'
  ];
  List<String> get imageList => _imageList;
  set imageList(List<String> value) {
    _imageList = value;
  }

  void addToImageList(String value) {
    imageList.add(value);
  }

  void removeFromImageList(String value) {
    imageList.remove(value);
  }

  void removeAtIndexFromImageList(int index) {
    imageList.removeAt(index);
  }

  void updateImageListAtIndex(
    int index,
    String Function(String) updateFn,
  ) {
    imageList[index] = updateFn(_imageList[index]);
  }

  void insertAtIndexInImageList(int index, String value) {
    imageList.insert(index, value);
  }

  /// Answer show with their animated additional info just like title and
  /// description.
  List<AnswerWithAdditionalInfoStruct> _AnswerWithAdditionalInfo = [
    AnswerWithAdditionalInfoStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"Never\",\"image\":\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLYlCFrIs7OelYi4FFlx23TEc4Z_evhDZkoQ&s\",\"AnswerTitle\":\"A Balanced Mind Leads to a Healthy Life\",\"AnswerDescription\":\"Studies suggest that maintaining a stress-free lifestyle enhances overall well-being, boosts productivity, and improves mental clarity.\"}')),
    AnswerWithAdditionalInfoStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"Rarely\",\"image\":\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLYlCFrIs7OelYi4FFlx23TEc4Z_evhDZkoQ&s\",\"AnswerTitle\":\"Managing Stress Before It Manages You\",\"AnswerDescription\":\"While occasional stress is normal, addressing small stressors early can prevent them from building up.\"}')),
    AnswerWithAdditionalInfoStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"Often\",\"image\":\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLYlCFrIs7OelYi4FFlx23TEc4Z_evhDZkoQ&s\",\"AnswerTitle\":\"Understanding & Reducing Stress\",\"AnswerDescription\":\"Studies reveal that chronic stress can impact both physical and mental health.\"}')),
    AnswerWithAdditionalInfoStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"All the time\",\"image\":\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLYlCFrIs7OelYi4FFlx23TEc4Z_evhDZkoQ&s\",\"AnswerTitle\":\"Prioritizing Mental Well-Being\",\"AnswerDescription\":\"If stress is a constant part of life, it may be helpful to explore structured stress management strategies, such as therapy, mindfulness training, or guided relaxation techniques.\"}'))
  ];
  List<AnswerWithAdditionalInfoStruct> get AnswerWithAdditionalInfo =>
      _AnswerWithAdditionalInfo;
  set AnswerWithAdditionalInfo(List<AnswerWithAdditionalInfoStruct> value) {
    _AnswerWithAdditionalInfo = value;
  }

  void addToAnswerWithAdditionalInfo(AnswerWithAdditionalInfoStruct value) {
    AnswerWithAdditionalInfo.add(value);
  }

  void removeFromAnswerWithAdditionalInfo(
      AnswerWithAdditionalInfoStruct value) {
    AnswerWithAdditionalInfo.remove(value);
  }

  void removeAtIndexFromAnswerWithAdditionalInfo(int index) {
    AnswerWithAdditionalInfo.removeAt(index);
  }

  void updateAnswerWithAdditionalInfoAtIndex(
    int index,
    AnswerWithAdditionalInfoStruct Function(AnswerWithAdditionalInfoStruct)
        updateFn,
  ) {
    AnswerWithAdditionalInfo[index] =
        updateFn(_AnswerWithAdditionalInfo[index]);
  }

  void insertAtIndexInAnswerWithAdditionalInfo(
      int index, AnswerWithAdditionalInfoStruct value) {
    AnswerWithAdditionalInfo.insert(index, value);
  }

  /// Plan data list
  List<PlanStruct> _PlanData = [
    PlanStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"14 Day Challenge\",\"actualPrice\":\"300\",\"discountedPrice\":\"37\",\"perDayActualPrice\":\"300\",\"discountedPerDayPrice\":\"85\",\"isPopularPlan\":\"true\"}'))
  ];
  List<PlanStruct> get PlanData => _PlanData;
  set PlanData(List<PlanStruct> value) {
    _PlanData = value;
  }

  void addToPlanData(PlanStruct value) {
    PlanData.add(value);
  }

  void removeFromPlanData(PlanStruct value) {
    PlanData.remove(value);
  }

  void removeAtIndexFromPlanData(int index) {
    PlanData.removeAt(index);
  }

  void updatePlanDataAtIndex(
    int index,
    PlanStruct Function(PlanStruct) updateFn,
  ) {
    PlanData[index] = updateFn(_PlanData[index]);
  }

  void insertAtIndexInPlanData(int index, PlanStruct value) {
    PlanData.insert(index, value);
  }

  /// Personal plan dialog data list
  List<PersonalPlanStruct> _personalPlan = [
    PersonalPlanStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"14 Day Haircare Journal & Templates\",\"price\":\"29\",\"discountedPrice\":\"0\"}')),
    PersonalPlanStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"DIY Luxury Shampoo Workshop\",\"price\":\"39\",\"discountedPrice\":\"0\"}')),
    PersonalPlanStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"Haircare Ingredients No-No List\",\"price\":\"35\",\"discountedPrice\":\"0\"}')),
    PersonalPlanStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"Total Hair Wellness Handbook\",\"price\":\"29\",\"discountedPrice\":\"0\"}')),
    PersonalPlanStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"Silicones & Sulfates Smart Usage Manual\",\"price\":\"29\",\"discountedPrice\":\"0\"}')),
    PersonalPlanStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"30 Day Hair Mindfulness Experience\",\"price\":\"15\",\"discountedPrice\":\"0\"}')),
    PersonalPlanStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"Exclusive Members-Only Community\",\"price\":\"20\",\"discountedPrice\":\"0\",\"id\":\"\"}')),
    PersonalPlanStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"Haircare Product Analyzer\",\"price\":\"5\",\"discountedPrice\":\"0\",\"id\":\"\"}')),
    PersonalPlanStruct.fromSerializableMap(
        jsonDecode('{\"title\":\"Certificate of Completion\",\"id\":\"\"}'))
  ];
  List<PersonalPlanStruct> get personalPlan => _personalPlan;
  set personalPlan(List<PersonalPlanStruct> value) {
    _personalPlan = value;
  }

  void addToPersonalPlan(PersonalPlanStruct value) {
    personalPlan.add(value);
  }

  void removeFromPersonalPlan(PersonalPlanStruct value) {
    personalPlan.remove(value);
  }

  void removeAtIndexFromPersonalPlan(int index) {
    personalPlan.removeAt(index);
  }

  void updatePersonalPlanAtIndex(
    int index,
    PersonalPlanStruct Function(PersonalPlanStruct) updateFn,
  ) {
    personalPlan[index] = updateFn(_personalPlan[index]);
  }

  void insertAtIndexInPersonalPlan(int index, PersonalPlanStruct value) {
    personalPlan.insert(index, value);
  }

  List<AnswerStruct> _hairGoal = [
    AnswerStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"Stop hair loss and thinning\",\"image\":\"https://picsum.photos/seed/493/600\",\"id\":\"goal_hairloss\",\"type\":\"hairGoal\"}')),
    AnswerStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"Longer, better looking hair\",\"image\":\"https://picsum.photos/seed/121/600\",\"id\":\"goal_betterhair\",\"type\":\"hairGoal\"}')),
    AnswerStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"I want both\",\"image\":\"https://picsum.photos/seed/682/600\",\"id\":\"goal_both\",\"type\":\"hairGoal\"}'))
  ];
  List<AnswerStruct> get hairGoal => _hairGoal;
  set hairGoal(List<AnswerStruct> value) {
    _hairGoal = value;
  }

  void addToHairGoal(AnswerStruct value) {
    hairGoal.add(value);
  }

  void removeFromHairGoal(AnswerStruct value) {
    hairGoal.remove(value);
  }

  void removeAtIndexFromHairGoal(int index) {
    hairGoal.removeAt(index);
  }

  void updateHairGoalAtIndex(
    int index,
    AnswerStruct Function(AnswerStruct) updateFn,
  ) {
    hairGoal[index] = updateFn(_hairGoal[index]);
  }

  void insertAtIndexInHairGoal(int index, AnswerStruct value) {
    hairGoal.insert(index, value);
  }

  List<ImageAnswerStruct> _hairType = [
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Straight%20Hair%20.webp\",\"answer\":\"Straight\",\"id\":\"hairType_straight\",\"type\":\"hairType\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Wavy%20Hair.webp\",\"answer\":\"Wavy\",\"id\":\"hairType_wavy\",\"type\":\"hairType\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Curly%20Hair.webp\",\"answer\":\"Curly\",\"id\":\"hairType_curly\",\"type\":\"hairType\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Coily%20Hair.webp\",\"answer\":\"Coily\",\"id\":\"hairType_coily\",\"type\":\"hairType\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Q1-Not%20Sure.webp\",\"answer\":\"I don\'t know\",\"id\":\"hairType_unknown\",\"type\":\"hairType\"}'))
  ];
  List<ImageAnswerStruct> get hairType => _hairType;
  set hairType(List<ImageAnswerStruct> value) {
    _hairType = value;
  }

  void addToHairType(ImageAnswerStruct value) {
    hairType.add(value);
  }

  void removeFromHairType(ImageAnswerStruct value) {
    hairType.remove(value);
  }

  void removeAtIndexFromHairType(int index) {
    hairType.removeAt(index);
  }

  void updateHairTypeAtIndex(
    int index,
    ImageAnswerStruct Function(ImageAnswerStruct) updateFn,
  ) {
    hairType[index] = updateFn(_hairType[index]);
  }

  void insertAtIndexInHairType(int index, ImageAnswerStruct value) {
    hairType.insert(index, value);
  }

  List<ImageAnswerStruct> _age = [
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Age%2018-29.webp\",\"answer\":\"18 - 29\",\"id\":\"age_18to29\",\"type\":\"age\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Age%2030-39.webp\",\"answer\":\"30 - 39\",\"id\":\"age_30to39\",\"type\":\"age\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Age%2040-49.webp\",\"answer\":\"40 - 49\",\"id\":\"age_40to49\",\"type\":\"age\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Age%2050%2B.webp\",\"answer\":\"50 +\",\"id\":\"age_50+\",\"type\":\"age\"}'))
  ];
  List<ImageAnswerStruct> get age => _age;
  set age(List<ImageAnswerStruct> value) {
    _age = value;
  }

  void addToAge(ImageAnswerStruct value) {
    age.add(value);
  }

  void removeFromAge(ImageAnswerStruct value) {
    age.remove(value);
  }

  void removeAtIndexFromAge(int index) {
    age.removeAt(index);
  }

  void updateAgeAtIndex(
    int index,
    ImageAnswerStruct Function(ImageAnswerStruct) updateFn,
  ) {
    age[index] = updateFn(_age[index]);
  }

  void insertAtIndexInAge(int index, ImageAnswerStruct value) {
    age.insert(index, value);
  }

  List<AnswerStruct> _knowledgeState = [
    AnswerStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"🙌 Yes, but I need more support\",\"image\":\"\",\"id\":\"knowledge_yes\",\"type\":\"knowledgeState\"}')),
    AnswerStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"😢 No and I\'m tired of searching\",\"image\":\"\",\"id\":\"knowledge_no\",\"type\":\"knowledgeState\"}')),
    AnswerStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"😥 Not sure, it\'s complicated by myself\",\"image\":\"\",\"id\":\"knowledge_notsure\",\"type\":\"knowledgeState\"}'))
  ];
  List<AnswerStruct> get knowledgeState => _knowledgeState;
  set knowledgeState(List<AnswerStruct> value) {
    _knowledgeState = value;
  }

  void addToKnowledgeState(AnswerStruct value) {
    knowledgeState.add(value);
  }

  void removeFromKnowledgeState(AnswerStruct value) {
    knowledgeState.remove(value);
  }

  void removeAtIndexFromKnowledgeState(int index) {
    knowledgeState.removeAt(index);
  }

  void updateKnowledgeStateAtIndex(
    int index,
    AnswerStruct Function(AnswerStruct) updateFn,
  ) {
    knowledgeState[index] = updateFn(_knowledgeState[index]);
  }

  void insertAtIndexInKnowledgeState(int index, AnswerStruct value) {
    knowledgeState.insert(index, value);
  }

  List<AnswerWithAdditionalInfoStruct> _mindsetState = [
    AnswerWithAdditionalInfoStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"Yes, definitely\",\"image\":\"https://assets.hairqare.co/Natural.webp\",\"AnswerTitle\":\"You\'re absolutely right!\",\"AnswerDescription\":\"Diet, stress, environment, and internal health all impact your hair. Our holistic approach addresses ALL these factors for truly transformative results.\",\"id\":\"mindset_aware\",\"type\":\"mindsetState\"}')),
    AnswerWithAdditionalInfoStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"Maybe, I\'m not sure\",\"image\":\"https://assets.hairqare.co/None.webp\",\"AnswerTitle\":\"You\'re on the right track!\",\"AnswerDescription\":\"Diet, stress, environment, and internal health all impact your hair. Our holistic approach addresses ALL these factors for truly transformative results.\",\"id\":\"mindset_unsure\",\"type\":\"mindsetState\"}')),
    AnswerWithAdditionalInfoStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"I\'ve never considered that\",\"image\":\"https://assets.hairqare.co/Occasional.webp\",\"AnswerTitle\":\"You\'ll be surprised!\",\"AnswerDescription\":\"Diet, stress, environment, and internal health all impact your hair. Our holistic approach addresses ALL these factors for truly transformative results.\",\"id\":\"mindset_unaware\",\"type\":\"mindsetState\"}')),
    AnswerWithAdditionalInfoStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"No, I just need the right product\",\"image\":\"https://assets.hairqare.co/Basic%20care.webp\",\"AnswerTitle\":\"It\'s a common misconception\",\"AnswerDescription\":\"Most women focus only on external treatments, missing 50% of what determines hair health. Our approach changes that by addressing both internal and external factors for complete hair transformation.\",\"id\":\"mindset_oblivious\",\"type\":\"mindsetState\"}'))
  ];
  List<AnswerWithAdditionalInfoStruct> get mindsetState => _mindsetState;
  set mindsetState(List<AnswerWithAdditionalInfoStruct> value) {
    _mindsetState = value;
  }

  void addToMindsetState(AnswerWithAdditionalInfoStruct value) {
    mindsetState.add(value);
  }

  void removeFromMindsetState(AnswerWithAdditionalInfoStruct value) {
    mindsetState.remove(value);
  }

  void removeAtIndexFromMindsetState(int index) {
    mindsetState.removeAt(index);
  }

  void updateMindsetStateAtIndex(
    int index,
    AnswerWithAdditionalInfoStruct Function(AnswerWithAdditionalInfoStruct)
        updateFn,
  ) {
    mindsetState[index] = updateFn(_mindsetState[index]);
  }

  void insertAtIndexInMindsetState(
      int index, AnswerWithAdditionalInfoStruct value) {
    mindsetState.insert(index, value);
  }

  List<ImageAnswerStruct> _diet = [
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Mostly%20unhealthy%20diet.webp\",\"answer\":\"Fast food / Processed food diet\",\"id\":\"diet_processed\",\"type\":\"diet\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Healthy%20and%20balanced%20diet.webp\",\"answer\":\"Balanced / Whole foods\",\"id\":\"diet_balanced\",\"type\":\"diet\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Professional%20planned%20diet.webp\",\"answer\":\"Custom nutrition protocol\",\"id\":\"diet_custom\",\"type\":\"diet\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Vegan-vegetarian%20diet.webp\",\"answer\":\"Vegan / vegetarian\",\"id\":\"diet_vegan\",\"type\":\"diet\"}')),
    ImageAnswerStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/None.webp\",\"answer\":\"Something else\",\"id\":\"diet_other\",\"type\":\"diet\"}'))
  ];
  List<ImageAnswerStruct> get diet => _diet;
  set diet(List<ImageAnswerStruct> value) {
    _diet = value;
  }

  void addToDiet(ImageAnswerStruct value) {
    diet.add(value);
  }

  void removeFromDiet(ImageAnswerStruct value) {
    diet.remove(value);
  }

  void removeAtIndexFromDiet(int index) {
    diet.removeAt(index);
  }

  void updateDietAtIndex(
    int index,
    ImageAnswerStruct Function(ImageAnswerStruct) updateFn,
  ) {
    diet[index] = updateFn(_diet[index]);
  }

  void insertAtIndexInDiet(int index, ImageAnswerStruct value) {
    diet.insert(index, value);
  }

  List<AnswerWithAdditionalInfoStruct> _shampooSpending = [
    AnswerWithAdditionalInfoStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"Less than \$10\",\"image\":\"https://assets.hairqare.co/Less%20than%20%2410.webp\",\"AnswerTitle\":\"Awesome 🤩 you\'re budget conscious!\",\"AnswerDescription\":\"You can actually have amazing results without spending more than you do now (or even less) while avoiding harmful products that secretly ruin your hair. You just need the right routine for your unique situation.\",\"id\":\"spend_under10\",\"type\":\"shampooSpending\"}')),
    AnswerWithAdditionalInfoStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"\$10 - \$20\",\"image\":\"https://assets.hairqare.co/%2410%20-%20%2420.webp\",\"AnswerTitle\":\"Amazing 🙌 you value your hair!\",\"AnswerDescription\":\"You\'re spending thoughtfully, but likely still paying for marketing rather than results. With the right routine, you could get truly transformative results tailored to your unique needs without spending more.\",\"id\":\"spend_10to20\",\"type\":\"shampooSpending\"}')),
    AnswerWithAdditionalInfoStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"\$20 - \$50\",\"image\":\"https://assets.hairqare.co/%2420-%2450.webp\",\"AnswerTitle\":\"You clearly care about your hair 💜\",\"AnswerDescription\":\"Did you know, in the premium category up to 90% of what you\'re paying funds packaging and marketing, not quality ingredients? With the right routine, you can actually get the premium results you\'re looking for without the price tag.\",\"id\":\"spend_20to50\",\"type\":\"shampooSpending\"}')),
    AnswerWithAdditionalInfoStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"More than \$50\",\"image\":\"https://assets.hairqare.co/More%20than%20%2450.webp\",\"AnswerTitle\":\"Your hair deserves the best ✨\",\"AnswerDescription\":\"Did you know premium haircare often uses the same ingredients as budget options? With the right personalized routine, you can actually achieve the results those luxury brands are just promising.\",\"id\":\"spend_over50\",\"type\":\"shampooSpending\"}'))
  ];
  List<AnswerWithAdditionalInfoStruct> get shampooSpending => _shampooSpending;
  set shampooSpending(List<AnswerWithAdditionalInfoStruct> value) {
    _shampooSpending = value;
  }

  void addToShampooSpending(AnswerWithAdditionalInfoStruct value) {
    shampooSpending.add(value);
  }

  void removeFromShampooSpending(AnswerWithAdditionalInfoStruct value) {
    shampooSpending.remove(value);
  }

  void removeAtIndexFromShampooSpending(int index) {
    shampooSpending.removeAt(index);
  }

  void updateShampooSpendingAtIndex(
    int index,
    AnswerWithAdditionalInfoStruct Function(AnswerWithAdditionalInfoStruct)
        updateFn,
  ) {
    shampooSpending[index] = updateFn(_shampooSpending[index]);
  }

  void insertAtIndexInShampooSpending(
      int index, AnswerWithAdditionalInfoStruct value) {
    shampooSpending.insert(index, value);
  }

  List<MultiChoiceWithImagesCheckBoxStruct> _hairMyth = [
    MultiChoiceWithImagesCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Rosemary%20Oil.webp\",\"title\":\"Rosemary oil is reduces hair loss\",\"checklBox\":\"false\",\"Id\":\"myth_rosemary\",\"type\":\"hairMyth\"}')),
    MultiChoiceWithImagesCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Coconut%20Oil.webp\",\"title\":\"Coconut oil is the best hair oil\",\"checklBox\":\"false\",\"Id\":\"myth_coconut\",\"type\":\"hairMyth\"}')),
    MultiChoiceWithImagesCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Rice%20Water.webp\",\"title\":\"Rice water makes hair grow faster\",\"checklBox\":\"false\",\"Id\":\"myth_ricewater\",\"type\":\"hairMyth\"}')),
    MultiChoiceWithImagesCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Natural.webp\",\"title\":\"Natural / organic products are better\",\"checklBox\":\"false\",\"Id\":\"myth_organic\",\"type\":\"hairMyth\"}')),
    MultiChoiceWithImagesCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Heal.webp\",\"title\":\"Hair can heal like skin\",\"checklBox\":\"false\",\"Id\":\"myth_hairhealing\",\"type\":\"hairMyth\"}')),
    MultiChoiceWithImagesCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/Not%20Washing.webp\",\"title\":\"Not washing hair is good for the scalp\",\"checklBox\":\"false\",\"Id\":\"myth_nopoo\",\"type\":\"hairMyth\"}'))
  ];
  List<MultiChoiceWithImagesCheckBoxStruct> get hairMyth => _hairMyth;
  set hairMyth(List<MultiChoiceWithImagesCheckBoxStruct> value) {
    _hairMyth = value;
  }

  void addToHairMyth(MultiChoiceWithImagesCheckBoxStruct value) {
    hairMyth.add(value);
  }

  void removeFromHairMyth(MultiChoiceWithImagesCheckBoxStruct value) {
    hairMyth.remove(value);
  }

  void removeAtIndexFromHairMyth(int index) {
    hairMyth.removeAt(index);
  }

  void updateHairMythAtIndex(
    int index,
    MultiChoiceWithImagesCheckBoxStruct Function(
            MultiChoiceWithImagesCheckBoxStruct)
        updateFn,
  ) {
    hairMyth[index] = updateFn(_hairMyth[index]);
  }

  void insertAtIndexInHairMyth(
      int index, MultiChoiceWithImagesCheckBoxStruct value) {
    hairMyth.insert(index, value);
  }

  List<MultiChoiceWithImagesCheckBoxStruct> _hairDamageActivity = [
    MultiChoiceWithImagesCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/heat.webp\",\"title\":\"Heat styling\",\"checklBox\":\"false\",\"Id\":\"damageAction_heat\",\"type\":\"hairDamageActivity\"}')),
    MultiChoiceWithImagesCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/dye.webp\",\"title\":\"Bleaching / hair colouring\",\"checklBox\":\"false\",\"Id\":\"damageAction_dye\",\"type\":\"hairDamageActivity\"}')),
    MultiChoiceWithImagesCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/sun.webp\",\"title\":\"Sun exposure\",\"checklBox\":\"false\",\"Id\":\"damageAction_sun\",\"type\":\"hairDamageActivity\"}')),
    MultiChoiceWithImagesCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/swim.webp\",\"title\":\"Frequent swimming\",\"checklBox\":\"false\",\"Id\":\"damageAction_swimming\",\"type\":\"hairDamageActivity\"}')),
    MultiChoiceWithImagesCheckBoxStruct.fromSerializableMap(jsonDecode(
        '{\"image\":\"https://assets.hairqare.co/hairstyle.webp\",\"title\":\"Tight hair styles (braids, bun, ponytail...)\",\"checklBox\":\"false\",\"Id\":\"damageAction_hairstyles\",\"type\":\"hairDamageActivity\"}'))
  ];
  List<MultiChoiceWithImagesCheckBoxStruct> get hairDamageActivity =>
      _hairDamageActivity;
  set hairDamageActivity(List<MultiChoiceWithImagesCheckBoxStruct> value) {
    _hairDamageActivity = value;
  }

  void addToHairDamageActivity(MultiChoiceWithImagesCheckBoxStruct value) {
    hairDamageActivity.add(value);
  }

  void removeFromHairDamageActivity(MultiChoiceWithImagesCheckBoxStruct value) {
    hairDamageActivity.remove(value);
  }

  void removeAtIndexFromHairDamageActivity(int index) {
    hairDamageActivity.removeAt(index);
  }

  void updateHairDamageActivityAtIndex(
    int index,
    MultiChoiceWithImagesCheckBoxStruct Function(
            MultiChoiceWithImagesCheckBoxStruct)
        updateFn,
  ) {
    hairDamageActivity[index] = updateFn(_hairDamageActivity[index]);
  }

  void insertAtIndexInHairDamageActivity(
      int index, MultiChoiceWithImagesCheckBoxStruct value) {
    hairDamageActivity.insert(index, value);
  }

  List<AnswerStruct> _professionalReferral = [
    AnswerStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"Yes\",\"image\":\"\",\"id\":\"professional_yes\",\"type\":\"professionalReferral\"}')),
    AnswerStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"No\",\"image\":\"\",\"id\":\"professional_no\",\"type\":\"professionalReferral\"}')),
    AnswerStruct.fromSerializableMap(jsonDecode(
        '{\"answer\":\"I\'m a professional\",\"image\":\"\",\"id\":\"professional_self\",\"type\":\"professionalReferral\"}'))
  ];
  List<AnswerStruct> get professionalReferral => _professionalReferral;
  set professionalReferral(List<AnswerStruct> value) {
    _professionalReferral = value;
  }

  void addToProfessionalReferral(AnswerStruct value) {
    professionalReferral.add(value);
  }

  void removeFromProfessionalReferral(AnswerStruct value) {
    professionalReferral.remove(value);
  }

  void removeAtIndexFromProfessionalReferral(int index) {
    professionalReferral.removeAt(index);
  }

  void updateProfessionalReferralAtIndex(
    int index,
    AnswerStruct Function(AnswerStruct) updateFn,
  ) {
    professionalReferral[index] = updateFn(_professionalReferral[index]);
  }

  void insertAtIndexInProfessionalReferral(int index, AnswerStruct value) {
    professionalReferral.insert(index, value);
  }

  /// The users quiz answer profile
  ProfileStruct _quizProfile = ProfileStruct();
  ProfileStruct get quizProfile => _quizProfile;
  set quizProfile(ProfileStruct value) {
    _quizProfile = value;
  }

  void updateQuizProfileStruct(Function(ProfileStruct) updateFn) {
    updateFn(_quizProfile);
  }

  ContactDetailsStruct _submittedContactDetails = ContactDetailsStruct();
  ContactDetailsStruct get submittedContactDetails => _submittedContactDetails;
  set submittedContactDetails(ContactDetailsStruct value) {
    _submittedContactDetails = value;
  }

  void updateSubmittedContactDetailsStruct(
      Function(ContactDetailsStruct) updateFn) {
    updateFn(_submittedContactDetails);
  }

  List<FieldMappingTableStruct> _cdpMapping = [
    FieldMappingTableStruct.fromSerializableMap(jsonDecode(
        '{\"questionId\":\"hairGoal\",\"acField\":\"48\",\"mpField\":\"Hair Goal\"}')),
    FieldMappingTableStruct.fromSerializableMap(jsonDecode(
        '{\"questionId\":\"hairType\",\"acField\":\"20\",\"mpField\":\"Hair Type\"}')),
    FieldMappingTableStruct.fromSerializableMap(jsonDecode(
        '{\"questionId\":\"age\",\"acField\":\"6\",\"mpField\":\"Age Cohort\"}')),
    FieldMappingTableStruct.fromSerializableMap(jsonDecode(
        '{\"questionId\":\"hairConcern\",\"acField\":\"8\",\"mpField\":\"Hair Concern Type\"}')),
    FieldMappingTableStruct.fromSerializableMap(jsonDecode(
        '{\"questionId\":\"knowledgeState\",\"acField\":\"50\",\"mpField\":\"Hair Current Issues\"}')),
    FieldMappingTableStruct.fromSerializableMap(jsonDecode(
        '{\"questionId\":\"mindsetState\",\"acField\":\"56\",\"mpField\":\"Hairqare Knowledge\"}')),
    FieldMappingTableStruct.fromSerializableMap(jsonDecode(
        '{\"questionId\":\"diet\",\"acField\":\"34\",\"mpField\":\"Diet\"}')),
    FieldMappingTableStruct.fromSerializableMap(jsonDecode(
        '{\"questionId\":\"shampooSpending\",\"acField\":\"7\",\"mpField\":\"Spending\"}')),
    FieldMappingTableStruct.fromSerializableMap(jsonDecode(
        '{\"questionId\":\"hairMyth\",\"acField\":\"35\",\"mpField\":\"hairMyth\"}')),
    FieldMappingTableStruct.fromSerializableMap(jsonDecode(
        '{\"questionId\":\"hairDamageActivity\",\"acField\":\"51\",\"mpField\":\"hairDamageActivity\"}')),
    FieldMappingTableStruct.fromSerializableMap(jsonDecode(
        '{\"questionId\":\"professionalReferral\",\"mpField\":\"professionalReferral\"}')),
    FieldMappingTableStruct.fromSerializableMap(jsonDecode(
        '{\"questionId\":\"confidence\",\"acField\":\"53\",\"mpField\":\"Emotions Mirror\"}')),
    FieldMappingTableStruct.fromSerializableMap(jsonDecode(
        '{\"questionId\":\"comparison\",\"acField\":\"54\",\"mpField\":\"Emotions Comparison\"}')),
    FieldMappingTableStruct.fromSerializableMap(jsonDecode(
        '{\"questionId\":\"currentRoutine\",\"acField\":\"18\",\"mpField\":\"Haircare Background\"}'))
  ];
  List<FieldMappingTableStruct> get cdpMapping => _cdpMapping;
  set cdpMapping(List<FieldMappingTableStruct> value) {
    _cdpMapping = value;
  }

  void addToCdpMapping(FieldMappingTableStruct value) {
    cdpMapping.add(value);
  }

  void removeFromCdpMapping(FieldMappingTableStruct value) {
    cdpMapping.remove(value);
  }

  void removeAtIndexFromCdpMapping(int index) {
    cdpMapping.removeAt(index);
  }

  void updateCdpMappingAtIndex(
    int index,
    FieldMappingTableStruct Function(FieldMappingTableStruct) updateFn,
  ) {
    cdpMapping[index] = updateFn(_cdpMapping[index]);
  }

  void insertAtIndexInCdpMapping(int index, FieldMappingTableStruct value) {
    cdpMapping.insert(index, value);
  }

  List<AnswerWithTitleAndDescriptionStruct> _currentRoutine = [
    AnswerWithTitleAndDescriptionStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"🤓 Advanced\",\"description\":\"Salon visits, premium products, specialists, supplements\",\"id\":\"routine_complex\",\"type\":\"currentRoutine\"}')),
    AnswerWithTitleAndDescriptionStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"🫧 Basic care\",\"description\":\"Mostly just shampoo and conditioner\",\"id\":\"routine_basic\",\"type\":\"currentRoutine\"}')),
    AnswerWithTitleAndDescriptionStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"🧖‍♀️ Occasional pampering\",\"description\":\"Basic care and occasional hair masks\",\"id\":\"routine_intermediete\",\"type\":\"currentRoutine\"}')),
    AnswerWithTitleAndDescriptionStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"🌿 Natural remedies\",\"description\":\"Mostly oils, herbs or DIY treatments\",\"id\":\"routine_natural\",\"type\":\"currentRoutine\"}')),
    AnswerWithTitleAndDescriptionStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"🤷‍♀️ None of the above\",\"description\":\"I follow a different haircare routine\",\"id\":\"routine_other\",\"type\":\"currentRoutine\"}'))
  ];
  List<AnswerWithTitleAndDescriptionStruct> get currentRoutine =>
      _currentRoutine;
  set currentRoutine(List<AnswerWithTitleAndDescriptionStruct> value) {
    _currentRoutine = value;
  }

  void addToCurrentRoutine(AnswerWithTitleAndDescriptionStruct value) {
    currentRoutine.add(value);
  }

  void removeFromCurrentRoutine(AnswerWithTitleAndDescriptionStruct value) {
    currentRoutine.remove(value);
  }

  void removeAtIndexFromCurrentRoutine(int index) {
    currentRoutine.removeAt(index);
  }

  void updateCurrentRoutineAtIndex(
    int index,
    AnswerWithTitleAndDescriptionStruct Function(
            AnswerWithTitleAndDescriptionStruct)
        updateFn,
  ) {
    currentRoutine[index] = updateFn(_currentRoutine[index]);
  }

  void insertAtIndexInCurrentRoutine(
      int index, AnswerWithTitleAndDescriptionStruct value) {
    currentRoutine.insert(index, value);
  }

  List<TestimonialsStruct> _testimonialMapping = [
    TestimonialsStruct.fromSerializableMap(jsonDecode(
        '{\"questionId\":\"mindsetState\",\"answerId\":\"any\",\"link\":\"https://assets.hairqare.co/Pitch%202%20Lindsey%20Review.webp\"}'))
  ];
  List<TestimonialsStruct> get testimonialMapping => _testimonialMapping;
  set testimonialMapping(List<TestimonialsStruct> value) {
    _testimonialMapping = value;
  }

  void addToTestimonialMapping(TestimonialsStruct value) {
    testimonialMapping.add(value);
  }

  void removeFromTestimonialMapping(TestimonialsStruct value) {
    testimonialMapping.remove(value);
  }

  void removeAtIndexFromTestimonialMapping(int index) {
    testimonialMapping.removeAt(index);
  }

  void updateTestimonialMappingAtIndex(
    int index,
    TestimonialsStruct Function(TestimonialsStruct) updateFn,
  ) {
    testimonialMapping[index] = updateFn(_testimonialMapping[index]);
  }

  void insertAtIndexInTestimonialMapping(int index, TestimonialsStruct value) {
    testimonialMapping.insert(index, value);
  }

  List<String> _mindsetStateTestimonials = [
    'https://assets.hairqare.co/Pitch%202%20Lindsey%20Review.webp',
    'https://assets.hairqare.co/Pitch%202%20beingdani%20Review.webp',
    'https://assets.hairqare.co/Pitch%202%20Melodie%20Review.webp',
    'https://assets.hairqare.co/Pitch%202%20Charlie%20Green%20Review.webp',
    'https://assets.hairqare.co/Pitch%202%20Larissa%20Review.webp'
  ];
  List<String> get mindsetStateTestimonials => _mindsetStateTestimonials;
  set mindsetStateTestimonials(List<String> value) {
    _mindsetStateTestimonials = value;
  }

  void addToMindsetStateTestimonials(String value) {
    mindsetStateTestimonials.add(value);
  }

  void removeFromMindsetStateTestimonials(String value) {
    mindsetStateTestimonials.remove(value);
  }

  void removeAtIndexFromMindsetStateTestimonials(int index) {
    mindsetStateTestimonials.removeAt(index);
  }

  void updateMindsetStateTestimonialsAtIndex(
    int index,
    String Function(String) updateFn,
  ) {
    mindsetStateTestimonials[index] =
        updateFn(_mindsetStateTestimonials[index]);
  }

  void insertAtIndexInMindsetStateTestimonials(int index, String value) {
    mindsetStateTestimonials.insert(index, value);
  }

  List<String> _damagePracticeTestimonials = [
    'https://assets.hairqare.co/Hair%20loss%20Testimonial%203.webp',
    'https://assets.hairqare.co/PITCH%203%20Testimonial%202.webp',
    'https://assets.hairqare.co/Hair%20loss%20Testimonial%204.webp'
  ];
  List<String> get damagePracticeTestimonials => _damagePracticeTestimonials;
  set damagePracticeTestimonials(List<String> value) {
    _damagePracticeTestimonials = value;
  }

  void addToDamagePracticeTestimonials(String value) {
    damagePracticeTestimonials.add(value);
  }

  void removeFromDamagePracticeTestimonials(String value) {
    damagePracticeTestimonials.remove(value);
  }

  void removeAtIndexFromDamagePracticeTestimonials(int index) {
    damagePracticeTestimonials.removeAt(index);
  }

  void updateDamagePracticeTestimonialsAtIndex(
    int index,
    String Function(String) updateFn,
  ) {
    damagePracticeTestimonials[index] =
        updateFn(_damagePracticeTestimonials[index]);
  }

  void insertAtIndexInDamagePracticeTestimonials(int index, String value) {
    damagePracticeTestimonials.insert(index, value);
  }

  bool _showDlfBanner = false;
  bool get showDlfBanner => _showDlfBanner;
  set showDlfBanner(bool value) {
    _showDlfBanner = value;
  }

  int _timerSecElapsed = 1800000;
  int get timerSecElapsed => _timerSecElapsed;
  set timerSecElapsed(int value) {
    _timerSecElapsed = value;
  }
}
