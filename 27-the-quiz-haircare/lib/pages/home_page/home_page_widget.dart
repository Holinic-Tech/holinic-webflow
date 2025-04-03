import '/backend/schema/structs/index.dart';
import '/dashboard/dashboard/dashboard_widget.dart';
import '/dashboard/final_pitch/final_pitch_widget.dart';
import '/dashboard/skip_dialog/skip_dialog_widget.dart';
import '/email_template/login_component/login_component_widget.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_youtube_player.dart';
import '/footer/footer_button/footer_button_widget.dart';
import '/header/header_with_progress_bar/header_with_progress_bar_widget.dart';
import '/loading_template/loading_screen_before_result/loading_screen_before_result_widget.dart';
import '/loading_template/start_loading_component/start_loading_component_widget.dart';
import '/pitch_body_templates/pitch_body_text_images_body/pitch_body_text_images_body_widget.dart';
import '/pitch_body_templates/pitch_body_text_images_body_copy/pitch_body_text_images_body_copy_widget.dart';
import '/pitch_body_templates/pitch_body_text_images_body_similar/pitch_body_text_images_body_similar_widget.dart';
import '/templates/image_background_ques_body_v3/image_background_ques_body_v3_widget.dart';
import '/templates/multi_choice_with_image_question_check_box/multi_choice_with_image_question_check_box_widget.dart';
import '/templates/question_answer/question_answer_widget.dart';
import '/templates/question_answer_additionl_info/question_answer_additionl_info_widget.dart';
import '/templates/rating_question_options/rating_question_options_widget.dart';
import '/templates/single_choice_question_large_image/single_choice_question_large_image_widget.dart';
import '/templates/single_choice_question_smalllmage/single_choice_question_smalllmage_widget.dart';
import '/templates/titles_and_description_ans_body/titles_and_description_ans_body_widget.dart';
import '/custom_code/actions/index.dart' as actions;
import '/flutter_flow/random_data_util.dart' as random_data;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:webviewx_plus/webviewx_plus.dart';
import 'home_page_model.dart';
export 'home_page_model.dart';

class HomePageWidget extends StatefulWidget {
  const HomePageWidget({super.key});

  static String routeName = 'HomePage';
  static String routePath = '/homePage';

  @override
  State<HomePageWidget> createState() => _HomePageWidgetState();
}

class _HomePageWidgetState extends State<HomePageWidget> {
  late HomePageModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => HomePageModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    context.watch<FFAppState>();

    return YoutubeFullScreenWrapper(
      child: GestureDetector(
        onTap: () {
          FocusScope.of(context).unfocus();
          FocusManager.instance.primaryFocus?.unfocus();
        },
        child: Scaffold(
          key: scaffoldKey,
          backgroundColor: FlutterFlowTheme.of(context).secondaryBackground,
          body: SafeArea(
            top: true,
            child: Column(
              mainAxisSize: MainAxisSize.max,
              children: [
                if (valueOrDefault<bool>(
                      FFAppState().quizIndex != 0,
                      true,
                    ) &&
                    (FFAppState().quizIndex != 21) &&
                    (FFAppState().quizIndex != 20) &&
                    (FFAppState().quizIndex != 1))
                  wrapWithModel(
                    model: _model.headerWithProgressBarModel,
                    updateCallback: () => safeSetState(() {}),
                    child: HeaderWithProgressBarWidget(
                      isProgress: (FFAppState().quizIndex != 0) &&
                          (FFAppState().quizIndex != 1) &&
                          (FFAppState().quizIndex != 19) &&
                          (FFAppState().quizIndex != 20) &&
                          (FFAppState().quizIndex != 21) &&
                          (FFAppState().quizIndex != 14),
                      isBack: (FFAppState().quizIndex != 0) &&
                          (FFAppState().quizIndex != 1) &&
                          (FFAppState().quizIndex != 7) &&
                          (FFAppState().quizIndex != 9) &&
                          (FFAppState().quizIndex != 14) &&
                          ((FFAppState().quizIndex != 0) &&
                              (FFAppState().quizIndex != 1) &&
                              (FFAppState().quizIndex != 19) &&
                              (FFAppState().quizIndex != 20) &&
                              (FFAppState().quizIndex != 21)) &&
                          (FFAppState().quizIndex != 8) &&
                          (FFAppState().quizIndex != 10) &&
                          (FFAppState().quizIndex != 12) &&
                          (FFAppState().quizIndex != 13) &&
                          (FFAppState().quizIndex != 18),
                      fillColor: FlutterFlowTheme.of(context).info,
                      totalQuestion: 19,
                      currentQuestion: FFAppState().quizIndex,
                      totalSegments: 5,
                      backAction: () async {
                        await _model.pageViewController?.previousPage(
                          duration: Duration(milliseconds: 300),
                          curve: Curves.ease,
                        );
                      },
                    ),
                  ),
                Expanded(
                  child: Container(
                    width: double.infinity,
                    height: double.infinity,
                    child: PageView(
                      physics: const NeverScrollableScrollPhysics(),
                      controller: _model.pageViewController ??=
                          PageController(initialPage: 0),
                      onPageChanged: (_) async {
                        FFAppState().quizIndex =
                            _model.pageViewCurrentIndex + 1;
                        FFAppState().update(() {});
                      },
                      scrollDirection: Axis.horizontal,
                      children: [
                        Builder(
                          builder: (context) => wrapWithModel(
                            model: _model.goalImageBackgroundQuesBodyV3Model,
                            updateCallback: () => safeSetState(() {}),
                            child: ImageBackgroundQuesBodyV3Widget(
                              question:
                                  'See if the Challenge is a fit for you and your hair profile',
                              answer1: '',
                              answer2: '',
                              logoShow: true,
                              answerImage1:
                                  'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/62cbaa353a301e2df7aa36c9_sarah-tran-holiniq-hairqare-2.webp',
                              answerImage2:
                                  'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/62cbaa353a301e2df7aa36c9_sarah-tran-holiniq-hairqare-2.webp',
                              answer3: '',
                              questionId: 'hairGoal',
                              aswerImage3:
                                  'https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/62cbaa353a301e2df7aa36c9_sarah-tran-holiniq-hairqare-2.webp',
                              answerList: FFAppState().hairGoal,
                              skipAction: () async {
                                await actions.trackGAEvent(
                                  'Opened Skip Dialog',
                                  '',
                                  '',
                                  FFAppConstants.nonQuestionAnswerItem.toList(),
                                  '',
                                  '',
                                );
                                await showDialog(
                                  context: context,
                                  builder: (dialogContext) {
                                    return Dialog(
                                      elevation: 0,
                                      insetPadding: EdgeInsets.zero,
                                      backgroundColor: Colors.transparent,
                                      alignment: AlignmentDirectional(0.0, 0.0)
                                          .resolve(Directionality.of(context)),
                                      child: WebViewAware(
                                        child: GestureDetector(
                                          onTap: () {
                                            FocusScope.of(dialogContext)
                                                .unfocus();
                                            FocusManager.instance.primaryFocus
                                                ?.unfocus();
                                          },
                                          child: SkipDialogWidget(),
                                        ),
                                      ),
                                    );
                                  },
                                );
                              },
                              checkBoxToggleOn: () async {},
                              checkBoxToggleOff: () async {},
                              answerAction1: () async {
                                FFAppState().updateQuizProfileStruct(
                                  (e) => e
                                    ..updateQaPairs(
                                      (e) => e.add(QuestionAnswerPairStruct(
                                        questionId: _model
                                            .goalImageBackgroundQuesBodyV3Model
                                            .questionId,
                                        answerIds: ['goal_hairloss'],
                                      )),
                                    ),
                                );
                                safeSetState(() {});
                                await _model.pageViewController?.nextPage(
                                  duration: Duration(milliseconds: 300),
                                  curve: Curves.ease,
                                );
                              },
                              answerAction2: () async {
                                FFAppState().updateQuizProfileStruct(
                                  (e) => e
                                    ..updateQaPairs(
                                      (e) => e.add(QuestionAnswerPairStruct(
                                        questionId: _model
                                            .goalImageBackgroundQuesBodyV3Model
                                            .questionId,
                                        answerIds: ['goal_betterhair'],
                                      )),
                                    ),
                                );
                                safeSetState(() {});
                                await _model.pageViewController?.nextPage(
                                  duration: Duration(milliseconds: 300),
                                  curve: Curves.ease,
                                );
                              },
                              answerAction3: () async {
                                FFAppState().updateQuizProfileStruct(
                                  (e) => e
                                    ..updateQaPairs(
                                      (e) => e.add(QuestionAnswerPairStruct(
                                        questionId: _model
                                            .goalImageBackgroundQuesBodyV3Model
                                            .questionId,
                                        answerIds: ['goal_both'],
                                      )),
                                    ),
                                );
                                safeSetState(() {});
                                await _model.pageViewController?.nextPage(
                                  duration: Duration(milliseconds: 300),
                                  curve: Curves.ease,
                                );
                              },
                            ),
                          ),
                        ),
                        wrapWithModel(
                          model: _model.typeSingleChoiceQuestionLargeImageModel,
                          updateCallback: () => safeSetState(() {}),
                          child: SingleChoiceQuestionLargeImageWidget(
                            question: 'What is your hair type? ',
                            answerData: FFAppState().hairType,
                            questionId: '',
                            answerAction: () async {
                              FFAppState().updateQuizProfileStruct(
                                (e) => e
                                  ..updateQaPairs(
                                    (e) => e.add(QuestionAnswerPairStruct(
                                      questionId: valueOrDefault<String>(
                                        _model
                                            .typeSingleChoiceQuestionLargeImageModel
                                            .questionId,
                                        'test',
                                      ),
                                      answerIds: _model
                                          .typeSingleChoiceQuestionLargeImageModel
                                          .selectedAnswer,
                                    )),
                                  ),
                              );
                              safeSetState(() {});
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                            },
                          ),
                        ),
                        wrapWithModel(
                          model: _model.ageSingleChoiceQuestionSmalllmageModel,
                          updateCallback: () => safeSetState(() {}),
                          child: SingleChoiceQuestionSmalllmageWidget(
                            question: 'How old are you?',
                            subQuestion: ' ',
                            answerList: FFAppState().age,
                            answerAction: () async {
                              FFAppState().updateQuizProfileStruct(
                                (e) => e
                                  ..updateQaPairs(
                                    (e) => e.add(QuestionAnswerPairStruct(
                                      questionId: _model
                                          .ageSingleChoiceQuestionSmalllmageModel
                                          .questionId,
                                      answerIds: _model
                                          .ageSingleChoiceQuestionSmalllmageModel
                                          .selectedAnswer,
                                    )),
                                  ),
                              );
                              safeSetState(() {});
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                            },
                          ),
                        ),
                        wrapWithModel(
                          model:
                              _model.concernSingleChoiceQuestionSmalllmageModel,
                          updateCallback: () => safeSetState(() {}),
                          child: SingleChoiceQuestionSmalllmageWidget(
                            question:
                                'What is your biggest \nhair concern right now?',
                            subQuestion: ' Select one',
                            answerList: FFAppState().hairConcern,
                            questionId: '',
                            answerAction: () async {
                              FFAppState().updateQuizProfileStruct(
                                (e) => e
                                  ..updateQaPairs(
                                    (e) => e.add(QuestionAnswerPairStruct(
                                      questionId: _model
                                          .concernSingleChoiceQuestionSmalllmageModel
                                          .questionId,
                                      answerIds: _model
                                          .concernSingleChoiceQuestionSmalllmageModel
                                          .selectedAnswer,
                                    )),
                                  ),
                              );
                              safeSetState(() {});
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                            },
                          ),
                        ),
                        wrapWithModel(
                          model: _model.routineTitlesAndDescriptionAnsBodyModel,
                          updateCallback: () => safeSetState(() {}),
                          child: TitlesAndDescriptionAnsBodyWidget(
                            question:
                                'What best describes your current haircare routine?',
                            description: 'Select one',
                            answerList: FFAppState().currentRoutine,
                            answerAction: () async {
                              FFAppState().updateQuizProfileStruct(
                                (e) => e
                                  ..updateQaPairs(
                                    (e) => e.add(QuestionAnswerPairStruct(
                                      questionId: _model
                                          .routineTitlesAndDescriptionAnsBodyModel
                                          .questionId,
                                      answerIds: _model
                                          .routineTitlesAndDescriptionAnsBodyModel
                                          .selectedAnswer,
                                    )),
                                  ),
                              );
                              safeSetState(() {});
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                            },
                          ),
                        ),
                        wrapWithModel(
                          model: _model.damageQuestionAnswerModel,
                          updateCallback: () => safeSetState(() {}),
                          child: QuestionAnswerWidget(
                            question:
                                'Do you know what’s causing your hair problem and how to solve it?',
                            answerList: FFAppState().knowledgeState,
                            answerAction: () async {
                              FFAppState().updateQuizProfileStruct(
                                (e) => e
                                  ..updateQaPairs(
                                    (e) => e.add(QuestionAnswerPairStruct(
                                      questionId: _model
                                          .damageQuestionAnswerModel.questionId,
                                      answerIds: _model
                                          .damageQuestionAnswerModel
                                          .selectedAnswer,
                                    )),
                                  ),
                              );
                              safeSetState(() {});
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                            },
                          ),
                        ),
                        wrapWithModel(
                          model: _model.damagePitchBodyTextImagesBodyCopyModel,
                          updateCallback: () => safeSetState(() {}),
                          child: PitchBodyTextImagesBodyCopyWidget(
                            title: 'Don\'t worry! We got you.',
                            navigationTap: () async {
                              await actions.trackGAEvent(
                                'Continued From Pitch',
                                '',
                                'Damage Pitch',
                                FFAppConstants.nonQuestionAnswerItem.toList(),
                                '',
                                '',
                              );
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                            },
                          ),
                        ),
                        wrapWithModel(
                          model:
                              _model.holisticQuestionAnswerAdditionlInfoModel,
                          updateCallback: () => safeSetState(() {}),
                          child: QuestionAnswerAdditionlInfoWidget(
                            question:
                                'Do you believe your hair problems could be influenced by factors beyond just products?',
                            answerList: FFAppState().mindsetState,
                            answerAction: () async {
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                              await actions.trackGAEvent(
                                'Question Answered',
                                _model.holisticQuestionAnswerAdditionlInfoModel
                                    .questionId,
                                _model.holisticQuestionAnswerAdditionlInfoModel
                                    .question,
                                _model.holisticQuestionAnswerAdditionlInfoModel
                                    .answerId
                                    .toList(),
                                '',
                                '',
                              );
                              FFAppState().updateQuizProfileStruct(
                                (e) => e
                                  ..updateQaPairs(
                                    (e) => e.add(QuestionAnswerPairStruct(
                                      questionId: _model
                                          .holisticQuestionAnswerAdditionlInfoModel
                                          .questionId,
                                      answerIds: _model
                                          .holisticQuestionAnswerAdditionlInfoModel
                                          .answerId,
                                    )),
                                  ),
                              );
                              safeSetState(() {});
                            },
                          ),
                        ),
                        wrapWithModel(
                          model: _model.pitchBodyTextImagesHolisticModel,
                          updateCallback: () => safeSetState(() {}),
                          child: PitchBodyTextImagesBodyWidget(
                            title: 'Time for haircare that actually works!',
                            navigationTap: () async {
                              await actions.trackGAEvent(
                                'Continued From Pitch',
                                '',
                                'Holistic Pitch',
                                FFAppConstants.nonQuestionAnswerItem.toList(),
                                '',
                                '',
                              );
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                            },
                          ),
                        ),
                        wrapWithModel(
                          model: _model.dietSingleChoiceQuestionSmalllmageModel,
                          updateCallback: () => safeSetState(() {}),
                          child: SingleChoiceQuestionSmalllmageWidget(
                            question: 'What best describes your diet?',
                            subQuestion: ' ',
                            answerList: FFAppState().diet,
                            questionId: '',
                            answerAction: () async {
                              FFAppState().updateQuizProfileStruct(
                                (e) => e
                                  ..updateQaPairs(
                                    (e) => e.add(QuestionAnswerPairStruct(
                                      questionId: _model
                                          .dietSingleChoiceQuestionSmalllmageModel
                                          .questionId,
                                      answerIds: _model
                                          .dietSingleChoiceQuestionSmalllmageModel
                                          .selectedAnswer,
                                    )),
                                  ),
                              );
                              safeSetState(() {});
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                            },
                          ),
                        ),
                        wrapWithModel(
                          model: _model.spendQuestionAnswerAdditionlInfoModel,
                          updateCallback: () => safeSetState(() {}),
                          child: QuestionAnswerAdditionlInfoWidget(
                            question:
                                'How much do you spend on a bottle of shampoo?',
                            answerList: FFAppState().shampooSpending,
                            answerAction: () async {
                              FFAppState().updateQuizProfileStruct(
                                (e) => e
                                  ..updateQaPairs(
                                    (e) => e.add(QuestionAnswerPairStruct(
                                      questionId: _model
                                          .spendQuestionAnswerAdditionlInfoModel
                                          .questionId,
                                      answerIds: _model
                                          .spendQuestionAnswerAdditionlInfoModel
                                          .answerId,
                                    )),
                                  ),
                              );
                              safeSetState(() {});
                              await actions.trackGAEvent(
                                'Question Answered',
                                _model.spendQuestionAnswerAdditionlInfoModel
                                    .questionId,
                                _model.spendQuestionAnswerAdditionlInfoModel
                                    .question,
                                _model.spendQuestionAnswerAdditionlInfoModel
                                    .answerId
                                    .toList(),
                                '',
                                '',
                              );
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                            },
                          ),
                        ),
                        wrapWithModel(
                          model: _model
                              .mythsMultiChoiceWithImageQuestionCheckBoxModel,
                          updateCallback: () => safeSetState(() {}),
                          child: MultiChoiceWithImageQuestionCheckBoxWidget(
                            question:
                                'Which of these hair care myths do you believe?',
                            answerList: FFAppState().hairMyth,
                            questionId: '',
                            navigationTap: () async {
                              FFAppState().updateQuizProfileStruct(
                                (e) => e
                                  ..updateQaPairs(
                                    (e) => e.add(QuestionAnswerPairStruct(
                                      answerIds: _model
                                          .mythsMultiChoiceWithImageQuestionCheckBoxModel
                                          .selectedAnswer,
                                      questionId: _model
                                          .mythsMultiChoiceWithImageQuestionCheckBoxModel
                                          .questionId,
                                    )),
                                  ),
                              );
                              safeSetState(() {});
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                            },
                          ),
                        ),
                        wrapWithModel(
                          model: _model
                              .damagePracticeMultiChoiceWithImageQuestionCheckBoxModel,
                          updateCallback: () => safeSetState(() {}),
                          child: MultiChoiceWithImageQuestionCheckBoxWidget(
                            question:
                                'Which of these damaging practices do you regularly do?',
                            answerList: FFAppState().hairDamageActivity,
                            navigationTap: () async {
                              FFAppState().updateQuizProfileStruct(
                                (e) => e
                                  ..updateQaPairs(
                                    (e) => e.add(QuestionAnswerPairStruct(
                                      answerIds: _model
                                          .damagePracticeMultiChoiceWithImageQuestionCheckBoxModel
                                          .selectedAnswer,
                                      questionId: _model
                                          .damagePracticeMultiChoiceWithImageQuestionCheckBoxModel
                                          .questionId,
                                    )),
                                  ),
                              );
                              safeSetState(() {});
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                            },
                          ),
                        ),
                        wrapWithModel(
                          model:
                              _model.damagePitchBodyTextImagesBodySimilarModel,
                          updateCallback: () => safeSetState(() {}),
                          child: PitchBodyTextImagesBodySimilarWidget(
                            image: valueOrDefault<String>(
                              () {
                                if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairType',
                                      answerIds: ['hairType_wavy'],
                                    ))) {
                                  return 'https://assets.hairqare.co/Wavy%20Hair.webp';
                                } else if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairType',
                                      answerIds: ['hairType_curly'],
                                    ))) {
                                  return 'https://assets.hairqare.co/Curly%20Hair.webp';
                                } else if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairType',
                                      answerIds: ['hairType_coily'],
                                    ))) {
                                  return 'https://assets.hairqare.co/Coily%20Hair.webp';
                                } else if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairType',
                                      answerIds: ['hairType_straight'],
                                    ))) {
                                  return 'https://assets.hairqare.co/Straight%20Hair%20.webp';
                                } else {
                                  return 'https://assets.hairqare.co/Q1-Not%20Sure.webp';
                                }
                              }(),
                              'https://assets.hairqare.co/Q1-Not%20Sure.webp',
                            ),
                            title: 'Ineffective Routine',
                            description: () {
                              if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'currentRoutine',
                                    answerIds: ['routine_complex'],
                                  ))) {
                                return 'You are still struggling with${() {
                                  if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_hairloss'],
                                      ))) {
                                    return ' hair loss and thinning';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_splitends'],
                                      ))) {
                                    return ' split ends and dryness';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_scalp'],
                                      ))) {
                                    return ' dandruff and scalp irritation';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_damage'],
                                      ))) {
                                    return ' damaged hair and breakage';
                                  } else {
                                    return ' mixed hair issues';
                                  }
                                }()}, despite following a complex haircare routine. This means your routine is not tailored to your lifestyle and not suited to fix the root cause of your problems.';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'currentRoutine',
                                    answerIds: ['routine_basic'],
                                  ))) {
                                return 'You are still struggling with${() {
                                  if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_hairloss'],
                                      ))) {
                                    return ' hair loss and thinning';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_splitends'],
                                      ))) {
                                    return ' split ends and dryness';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_scalp'],
                                      ))) {
                                    return ' dandruff and scalp irritation';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_damage'],
                                      ))) {
                                    return ' damaged hair and breakage';
                                  } else {
                                    return ' mixed hair issues';
                                  }
                                }()}. This means your basic routine is not tailored to your lifestyle and not suited to fix the root cause of your problems.';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'currentRoutine',
                                    answerIds: ['routine_intermediete'],
                                  ))) {
                                return 'You are still struggling with${() {
                                  if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_hairloss'],
                                      ))) {
                                    return ' hair loss and thinning';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_splitends'],
                                      ))) {
                                    return ' split ends and dryness';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_scalp'],
                                      ))) {
                                    return ' dandruff and scalp irritation';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_damage'],
                                      ))) {
                                    return ' damaged hair and breakage';
                                  } else {
                                    return ' mixed hair issues';
                                  }
                                }()}, despite occasionally pampering your hair. This means your routine is not tailored to your lifestyle and not suited to fix the root cause of your problems.';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'currentRoutine',
                                    answerIds: ['routine_natural'],
                                  ))) {
                                return 'You are still struggling with${() {
                                  if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_hairloss'],
                                      ))) {
                                    return ' hair loss and thinning';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_splitends'],
                                      ))) {
                                    return ' split ends and dryness';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_scalp'],
                                      ))) {
                                    return ' dandruff and scalp irritation';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_damage'],
                                      ))) {
                                    return ' damaged hair and breakage';
                                  } else {
                                    return ' mixed hair issues';
                                  }
                                }()}, despite mostly relying on natural solutions. This means your routine is not tailored to your lifestyle and not suited to fix the root cause of your problems.';
                              } else {
                                return 'You are still struggling with${() {
                                  if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_hairloss'],
                                      ))) {
                                    return ' hair loss and thinning';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_splitends'],
                                      ))) {
                                    return ' split ends and dryness';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_scalp'],
                                      ))) {
                                    return ' dandruff and scalp irritation';
                                  } else if (FFAppState()
                                      .quizProfile
                                      .qaPairs
                                      .contains(QuestionAnswerPairStruct(
                                        questionId: 'hairConcern',
                                        answerIds: ['concern_damage'],
                                      ))) {
                                    return ' damaged hair and breakage';
                                  } else {
                                    return ' mixed hair issues';
                                  }
                                }()}. This means your routine is not tailored to your lifestyle and not suited to fix the root cause of your problems.';
                              }
                            }(),
                            navigationTap: () async {
                              await actions.trackGAEvent(
                                'Continued From Pitch',
                                '',
                                'Damage Practices Pitch',
                                FFAppConstants.nonQuestionAnswerItem.toList(),
                                '',
                                '',
                              );
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                            },
                          ),
                        ),
                        wrapWithModel(
                          model: _model.mirrorRatingQuestionOptionsModel,
                          updateCallback: () => safeSetState(() {}),
                          child: RatingQuestionOptionsWidget(
                            question:
                                'My reflection in the mirror affects my mood and self-esteem.',
                            subQuestion:
                                'Select how much you agree with the statement:',
                            questionId: 'confidence',
                            buttonAction: () async {
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                              await actions.trackGAEvent(
                                'Question Answered',
                                _model.mirrorRatingQuestionOptionsModel
                                    .questionId,
                                _model
                                    .mirrorRatingQuestionOptionsModel.question,
                                _model.mirrorRatingQuestionOptionsModel
                                    .selectedAnswer
                                    .toList(),
                                '',
                                '',
                              );
                              FFAppState().updateQuizProfileStruct(
                                (e) => e
                                  ..updateQaPairs(
                                    (e) => e.add(QuestionAnswerPairStruct(
                                      questionId: _model
                                          .mirrorRatingQuestionOptionsModel
                                          .questionId,
                                      answerIds: _model
                                          .mirrorRatingQuestionOptionsModel
                                          .selectedAnswer,
                                    )),
                                  ),
                              );
                              safeSetState(() {});
                            },
                          ),
                        ),
                        wrapWithModel(
                          model: _model.compareRatingQuestionOptionsModel,
                          updateCallback: () => safeSetState(() {}),
                          child: RatingQuestionOptionsWidget(
                            question:
                                'I tend to compare my hair to others\' and it makes me frustrated.',
                            subQuestion:
                                'Select how much you agree with the statement:',
                            questionId: 'comparison',
                            buttonAction: () async {
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                              await actions.trackGAEvent(
                                'Question Answered',
                                _model.compareRatingQuestionOptionsModel
                                    .questionId,
                                _model
                                    .compareRatingQuestionOptionsModel.question,
                                _model.compareRatingQuestionOptionsModel
                                    .selectedAnswer
                                    .toList(),
                                '',
                                '',
                              );
                              FFAppState().updateQuizProfileStruct(
                                (e) => e
                                  ..updateQaPairs(
                                    (e) => e.add(QuestionAnswerPairStruct(
                                      questionId: _model
                                          .compareRatingQuestionOptionsModel
                                          .questionId,
                                      answerIds: _model
                                          .compareRatingQuestionOptionsModel
                                          .selectedAnswer,
                                    )),
                                  ),
                              );
                              safeSetState(() {});
                            },
                          ),
                        ),
                        wrapWithModel(
                          model: _model.professionalQuestionAnswerModel,
                          updateCallback: () => safeSetState(() {}),
                          child: QuestionAnswerWidget(
                            question: 'Did a professional refer you to us?',
                            answerList: FFAppState().professionalReferral,
                            answerAction: () async {
                              FFAppState().updateQuizProfileStruct(
                                (e) => e
                                  ..updateQaPairs(
                                    (e) => e.add(QuestionAnswerPairStruct(
                                      questionId: _model
                                          .professionalQuestionAnswerModel
                                          .questionId,
                                      answerIds: _model
                                          .professionalQuestionAnswerModel
                                          .selectedAnswer,
                                    )),
                                  ),
                              );
                              safeSetState(() {});
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                            },
                          ),
                        ),
                        wrapWithModel(
                          model: _model.loadingScreenBeforeResultModel,
                          updateCallback: () => safeSetState(() {}),
                          child: LoadingScreenBeforeResultWidget(
                            title:
                                'Creating your personalized haircare program',
                            carouselImageList: FFAppState().imageList,
                            checkPointList: FFAppState().beforeLoadingData,
                            autoNavigation: () async {
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                            },
                          ),
                        ),
                        wrapWithModel(
                          model: _model.loginComponentModel,
                          updateCallback: () => safeSetState(() {}),
                          child: LoginComponentWidget(
                            progressBarValue: 90.0,
                            concernResolutionChance: _model
                                        .concernSingleChoiceQuestionSmalllmageModel
                                        .selctedIndex ==
                                    0
                                ? 'Probabaility to reduce your hairloss in 14 days:'
                                : '',
                            submitAction: () async {
                              _model.capitalisedName =
                                  await actions.convertToTitleCase(
                                _model.loginComponentModel
                                    .nameTextFieldTextController.text,
                              );
                              FFAppState().updateSubmittedContactDetailsStruct(
                                (e) => e
                                  ..name = _model.capitalisedName
                                  ..email = _model.loginComponentModel
                                      .emailTextFieldTextController.text,
                              );
                              safeSetState(() {});
                              await actions.webhookCallQuizProfile();
                              await actions.webhookCallcvg();
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );

                              safeSetState(() {});
                            },
                          ),
                        ),
                        wrapWithModel(
                          model: _model.finalPitchModel,
                          updateCallback: () => safeSetState(() {}),
                          child: FinalPitchWidget(
                            previousDiscountPercentage: 30,
                            discountPercentage: 85,
                          ),
                        ),
                        wrapWithModel(
                          model: _model.dashboardModel,
                          updateCallback: () => safeSetState(() {}),
                          child: DashboardWidget(
                            name: FFAppState().submittedContactDetails.name,
                            percentage: valueOrDefault<double>(
                              random_data.randomDouble(90.0, 97.0),
                              96.0,
                            ),
                            description: 'ewew',
                            goal: 'test',
                            startDate: getCurrentTimestamp,
                            startMyChallengeAction: () async {
                              await actions.redirectToCheckout();
                            },
                            reserveMySeatAction: () async {
                              await actions.redirectToCheckout();
                            },
                          ),
                        ),
                        wrapWithModel(
                          model: _model.startLoadingComponentModel,
                          updateCallback: () => safeSetState(() {}),
                          child: StartLoadingComponentWidget(
                            navigation: () async {
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                if ((FFAppState().quizIndex == null) ||
                    (FFAppState().quizIndex < 0))
                  wrapWithModel(
                    model: _model.footerButtonModel,
                    updateCallback: () => safeSetState(() {}),
                    child: FooterButtonWidget(
                      buttonOnTap: () async {
                        await _model.pageViewController?.nextPage(
                          duration: Duration(milliseconds: 300),
                          curve: Curves.ease,
                        );
                      },
                    ),
                  ),
                Opacity(
                  opacity: 0.0,
                  child: Text(
                    '🤓 🫧 🧖‍♀️ 🌿🤷‍♀️🙌😢😥',
                    style: FlutterFlowTheme.of(context).bodyMedium.override(
                          fontFamily: 'Roboto',
                          fontSize: 1.0,
                          letterSpacing: 0.0,
                        ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
