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
import '/pitch_body_templates/pitch_body_detailed_text_images/pitch_body_detailed_text_images_widget.dart';
import '/pitch_body_templates/pitch_body_simple_detailed_text_images/pitch_body_simple_detailed_text_images_widget.dart';
import '/pitch_body_templates/pitch_body_simple_text_images_body/pitch_body_simple_text_images_body_widget.dart';
import '/templates/image_background_ques_body/image_background_ques_body_widget.dart';
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
import 'package:flutter/scheduler.dart';
import 'package:google_fonts/google_fonts.dart';
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

    // On page load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      setAppLanguage(context, 'de');
    });

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
                    (FFAppState().quizIndex != 20) &&
                    (FFAppState().quizIndex != 19))
                  wrapWithModel(
                    model: _model.headerWithProgressBarModel,
                    updateCallback: () => safeSetState(() {}),
                    child: HeaderWithProgressBarWidget(
                      isProgress: (FFAppState().quizIndex != 0) &&
                          (FFAppState().quizIndex != 18) &&
                          (FFAppState().quizIndex != 19) &&
                          (FFAppState().quizIndex != 20),
                      isBack: (FFAppState().quizIndex != 0) &&
                          (FFAppState().quizIndex != 6) &&
                          (FFAppState().quizIndex != 8) &&
                          (FFAppState().quizIndex != 13) &&
                          ((FFAppState().quizIndex != 0) &&
                              (FFAppState().quizIndex != 18) &&
                              (FFAppState().quizIndex != 19) &&
                              (FFAppState().quizIndex != 20)) &&
                          (FFAppState().quizIndex != 7) &&
                          (FFAppState().quizIndex != 9) &&
                          (FFAppState().quizIndex != 17),
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
                        FFAppState().quizIndex = _model.pageViewCurrentIndex;
                        FFAppState().update(() {});
                      },
                      scrollDirection: Axis.horizontal,
                      children: [
                        Builder(
                          builder: (context) => wrapWithModel(
                            model: _model.startGoalImageBackgroundQuesBodyModel,
                            updateCallback: () => safeSetState(() {}),
                            child: ImageBackgroundQuesBodyWidget(
                              question: FFLocalizations.of(context).getText(
                                'nbe7i9d1' /* See if the Challenge is a fit ... */,
                              ),
                              answer1: FFLocalizations.of(context).getText(
                                'x8ai5u31' /*  */,
                              ),
                              answer2: FFLocalizations.of(context).getText(
                                'hjp0vvi2' /*  */,
                              ),
                              logoShow: true,
                              image:
                                  'https://assets.hairqare.co/sarah-quiz-start-cover.webp',
                              answer3: FFLocalizations.of(context).getText(
                                'd4329zzl' /*  */,
                              ),
                              questionId: 'hairGoal',
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
                                            .startGoalImageBackgroundQuesBodyModel
                                            .questionId,
                                        answerIds: _model
                                            .startGoalImageBackgroundQuesBodyModel
                                            .selectedAnswerId,
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
                                            .startGoalImageBackgroundQuesBodyModel
                                            .questionId,
                                        answerIds: _model
                                            .startGoalImageBackgroundQuesBodyModel
                                            .selectedAnswerId,
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
                                            .startGoalImageBackgroundQuesBodyModel
                                            .questionId,
                                        answerIds: _model
                                            .startGoalImageBackgroundQuesBodyModel
                                            .selectedAnswerId,
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
                            question: FFLocalizations.of(context).getText(
                              'g2q0w5rd' /* Which hair type do you have? */,
                            ),
                            subQuestion: FFLocalizations.of(context).getText(
                              'bdqv46ra' /*  */,
                            ),
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
                            question: FFLocalizations.of(context).getText(
                              'uaeia9o3' /* How old are you? */,
                            ),
                            subQuestion: FFLocalizations.of(context).getText(
                              'zf9jz0od' /*  */,
                            ),
                            answerList: FFAppState().age,
                            showBeforeQuestionTitle: false,
                            beforeQuestionTitle:
                                FFLocalizations.of(context).getText(
                              'i2ojmi0m' /*  */,
                            ),
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
                            question: FFLocalizations.of(context).getText(
                              '15jpp8px' /* What is your biggest hair conc... */,
                            ),
                            subQuestion: FFLocalizations.of(context).getText(
                              'onimc71u' /*  Select one */,
                            ),
                            answerList: FFAppState().hairConcern,
                            questionId: '',
                            showBeforeQuestionTitle: false,
                            beforeQuestionTitle:
                                FFLocalizations.of(context).getText(
                              '3qsxpsqp' /*  */,
                            ),
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
                            question: FFLocalizations.of(context).getText(
                              'zaokmujb' /* What best describes your curre... */,
                            ),
                            description: FFLocalizations.of(context).getText(
                              'dp0mkedt' /*  */,
                            ),
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
                                '${FFLocalizations.of(context).getVariableText(
                              enText: 'Do you already know exactly ',
                              esText: 'Do you already know exactly ',
                              deText: 'Weisst du schon genau ',
                            )}${valueOrDefault<String>(
                              () {
                                if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairConcern',
                                      answerIds: ['concern_hairloss'],
                                    ))) {
                                  return FFLocalizations.of(context)
                                      .getVariableText(
                                    enText:
                                        'what’s triggering your hair fall or thinning?',
                                    esText:
                                        'what’s triggering your hair fall or thinning?',
                                    deText:
                                        'was der Auslöser für deinen Haarausfall / dünner werdendes Haar ist?',
                                  );
                                } else if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairConcern',
                                      answerIds: ['concern_splitends'],
                                    ))) {
                                  return FFLocalizations.of(context)
                                      .getVariableText(
                                    enText:
                                        'how you can tame your frizz and dryness?',
                                    esText:
                                        'how you can tame your frizz and dryness?',
                                    deText:
                                        'was der Auslöser für Frizz und Trockenheit ist?',
                                  );
                                } else if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairConcern',
                                      answerIds: ['concern_scalp'],
                                    ))) {
                                  return FFLocalizations.of(context)
                                      .getVariableText(
                                    enText:
                                        'what’s behind your scalp irritation or dandruff issues?',
                                    esText:
                                        'what’s behind your scalp irritation or dandruff issues?',
                                    deText:
                                        'was der Auslöser für deine Kopfhautprobleme oder Schuppen ist?',
                                  );
                                } else if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairConcern',
                                      answerIds: ['concern_damage'],
                                    ))) {
                                  return FFLocalizations.of(context)
                                      .getVariableText(
                                    enText:
                                        'how you can save your hair from further damage?',
                                    esText:
                                        'how you can save your hair from further damage?',
                                    deText:
                                        'wie du die deine Haar vor mehr Bruch bewahren kannst?',
                                  );
                                } else {
                                  return FFLocalizations.of(context)
                                      .getVariableText(
                                    enText: 'what’s causing your hair issues?',
                                    esText: 'what’s causing your hair issues?',
                                    deText:
                                        'was der Auslöser für deine Haarprobleme ist?',
                                  );
                                }
                              }(),
                              'what’s causing your hair issues?',
                            )}',
                            answerList: FFAppState().knowledgeState,
                            questionId: '',
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
                          child: PitchBodySimpleTextImagesBodyWidget(
                            title: FFLocalizations.of(context).getText(
                              '7wg3bgoq' /* Don't worry! We got you. */,
                            ),
                            description: FFLocalizations.of(context).getText(
                              'blcnnajw' /*  */,
                            ),
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
                          model: _model
                              .hairqareMethodSingleChoiceQuestionSmalllmageModel,
                          updateCallback: () => safeSetState(() {}),
                          child: SingleChoiceQuestionSmalllmageWidget(
                            question: FFLocalizations.of(context).getText(
                              'm7uh7oex' /* How familiar are you with Hair... */,
                            ),
                            subQuestion: FFLocalizations.of(context).getText(
                              '646rpwwb' /*  */,
                            ),
                            questionId: 'hairqare',
                            showBeforeQuestionTitle: false,
                            beforeQuestionTitle:
                                FFLocalizations.of(context).getText(
                              'rn48g3to' /*  */,
                            ),
                            answerList: FFAppState().hairqareKnowledge,
                            answerAction: () async {
                              FFAppState().updateQuizProfileStruct(
                                (e) => e
                                  ..updateQaPairs(
                                    (e) => e.add(QuestionAnswerPairStruct(
                                      questionId: _model
                                          .hairqareMethodSingleChoiceQuestionSmalllmageModel
                                          .questionId,
                                      answerIds: _model
                                          .hairqareMethodSingleChoiceQuestionSmalllmageModel
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
                          model: _model.pitchBodyTextImagesHolisticModel,
                          updateCallback: () => safeSetState(() {}),
                          child: PitchBodyDetailedTextImagesWidget(
                            title: FFLocalizations.of(context).getText(
                              'g791wwh4' /* Beautiful hair needs more than... */,
                            ),
                            description: FFLocalizations.of(context).getText(
                              '5begehn5' /* Our evidence-based programs ar... */,
                            ),
                            claim: FFLocalizations.of(context).getText(
                              'dnzs3t47' /* Clinically proven to heal your... */,
                            ),
                            valueProp: FFLocalizations.of(context).getText(
                              's3viwwxq' /* Proven Results for: */,
                            ),
                            value1: FFLocalizations.of(context).getText(
                              'dhw0xi88' /* Any hair concern  */,
                            ),
                            value2: FFLocalizations.of(context).getText(
                              'vyzhveff' /* Any age */,
                            ),
                            value3: FFLocalizations.of(context).getText(
                              't05pit2o' /* Any hair type */,
                            ),
                            value4: FFLocalizations.of(context).getText(
                              'kuvd0wnn' /* Any hair goal */,
                            ),
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
                            question: FFLocalizations.of(context).getText(
                              'khaadglv' /* What best describes your diet? */,
                            ),
                            subQuestion: '',
                            answerList: FFAppState().diet,
                            questionId: '',
                            showBeforeQuestionTitle: true,
                            beforeQuestionTitle:
                                FFLocalizations.of(context).getText(
                              'x3t83a7y' /* What we eat affects our hair g... */,
                            ),
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
                            question: FFLocalizations.of(context).getText(
                              '25wr54y6' /* How much do you spend on a bot... */,
                            ),
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
                            question: FFLocalizations.of(context).getText(
                              'rihaqphi' /* Which of these hair care myths... */,
                            ),
                            answerList: FFAppState().hairMyth,
                            questionId: 'hairMyth',
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
                            question: FFLocalizations.of(context).getText(
                              'ugf9xggr' /* Select the damaging practices ... */,
                            ),
                            answerList: FFAppState().hairDamageActivity,
                            questionId: 'hairDamageActivity',
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
                          model: _model.pitchBodySimpleDetailedTextImagesModel,
                          updateCallback: () => safeSetState(() {}),
                          child: PitchBodySimpleDetailedTextImagesWidget(
                            title: FFLocalizations.of(context).getText(
                              'o7lj8r75' /*  */,
                            ),
                            description:
                                '${FFLocalizations.of(context).getVariableText(
                              enText: 'With the right routine it\'s fine to ',
                              esText: 'With the right routine it\'s fine to ',
                              deText:
                                  'Mit der richtigen Routine ist es kein Problem ',
                            )}${() {
                              if (() {
                                if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairDamageActivity',
                                      answerIds: ['damageAction_heat'],
                                    ))) {
                                  return true;
                                } else if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairDamageActivity',
                                      answerIds: ['damageAction_dye'],
                                    ))) {
                                  return true;
                                } else if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairDamageActivity',
                                      answerIds: ['damageAction_hairstyles'],
                                    ))) {
                                  return true;
                                } else {
                                  return false;
                                }
                              }()) {
                                return FFLocalizations.of(context)
                                    .getVariableText(
                                  enText: 'to style, curl or color your hair. ',
                                  esText: 'to style, curl or color your hair. ',
                                  deText:
                                      'deine Haare zu stylen, zu locken oder zu färben. ',
                                );
                              } else if (() {
                                if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairDamageActivity',
                                      answerIds: ['damageAction_swimming'],
                                    ))) {
                                  return true;
                                } else if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairDamageActivity',
                                      answerIds: ['damageAction_sun'],
                                    ))) {
                                  return true;
                                } else {
                                  return false;
                                }
                              }()) {
                                return FFLocalizations.of(context)
                                    .getVariableText(
                                  enText: 'live an active lifestyle. ',
                                  esText: 'live an active lifestyle. ',
                                  deText: 'einen aktiven Lebensstil führen.',
                                );
                              } else {
                                return 'deine Haare zu stylen, wie du möchtest, und den Hobbys nachzugehen, die dir Spaß machen. ';
                              }
                            }()}',
                            claim: () {
                              if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'currentRoutine',
                                    answerIds: ['routine_complex'],
                                  ))) {
                                return '${FFLocalizations.of(context).getVariableText(
                                  enText:
                                      'But if you are still struggling with',
                                  esText:
                                      'But if you are still struggling with',
                                  deText: 'Aber wenn du immernoch ',
                                )}${() {
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
                                }()}${FFLocalizations.of(context).getVariableText(
                                  enText:
                                      ' despite all the treatments, specialists and products you’ve tried',
                                  esText:
                                      ' despite all the treatments, specialists and products you’ve tried',
                                  deText:
                                      'hast, obwohl du in teure Behandlungen, Spezialisten und Produkte investiersts',
                                )}${FFLocalizations.of(context).getVariableText(
                                  enText:
                                      ', you’re missing important haircare knowledge. ',
                                  esText:
                                      ', you’re missing important haircare knowledge. ',
                                  deText:
                                      ', dann fehlt dir wichtiges Haarpflegewissen.',
                                )}';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'currentRoutine',
                                    answerIds: ['routine_basic'],
                                  ))) {
                                return '${FFLocalizations.of(context).getVariableText(
                                  enText:
                                      'But if you are still struggling with',
                                  esText:
                                      'But if you are still struggling with',
                                  deText: 'Aber wenn du immernoch ',
                                )}${() {
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
                                }()}${FFLocalizations.of(context).getVariableText(
                                  enText:
                                      ' while only relying on using shampoo & conditioner',
                                  esText:
                                      ' while only relying on using shampoo & conditioner',
                                  deText:
                                      ' hast, obwohl du deine Haarpflege auf das nötigste beschränkst',
                                )}${FFLocalizations.of(context).getVariableText(
                                  enText:
                                      ', you’re missing important haircare knowledge. ',
                                  esText:
                                      ', you’re missing important haircare knowledge. ',
                                  deText:
                                      ', dann fehlt dir wichtiges Haarpflegewissen.',
                                )}';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'currentRoutine',
                                    answerIds: ['routine_intermediete'],
                                  ))) {
                                return '${FFLocalizations.of(context).getVariableText(
                                  enText:
                                      'But if you are still struggling with',
                                  esText:
                                      'But if you are still struggling with',
                                  deText: 'Aber wenn du immernoch ',
                                )}${() {
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
                                }()}${FFLocalizations.of(context).getVariableText(
                                  enText:
                                      ' despite pampering your hair from time to time',
                                  esText:
                                      ' despite pampering your hair from time to time',
                                  deText:
                                      ' hast, obwohl du dir ab und an extra Zeit zur Haarpflege nimmst',
                                )}${FFLocalizations.of(context).getVariableText(
                                  enText:
                                      ', you’re missing important haircare knowledge. ',
                                  esText:
                                      ', you’re missing important haircare knowledge. ',
                                  deText:
                                      ', dann fehlt dir wichtiges Haarpflegewissen.',
                                )}';
                              } else if (FFAppState()
                                  .quizProfile
                                  .qaPairs
                                  .contains(QuestionAnswerPairStruct(
                                    questionId: 'currentRoutine',
                                    answerIds: ['routine_natural'],
                                  ))) {
                                return '${FFLocalizations.of(context).getVariableText(
                                  enText:
                                      'But if you are still struggling with',
                                  esText:
                                      'But if you are still struggling with',
                                  deText: 'Aber wenn du immernoch ',
                                )}${() {
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
                                }()}${FFLocalizations.of(context).getVariableText(
                                  enText:
                                      ' despite using organic products and home remedies',
                                  esText:
                                      ' despite using organic products and home remedies',
                                  deText:
                                      ' hast, obwohl du überwiegend Bio und natürliche Produkte benutzt',
                                )}${FFLocalizations.of(context).getVariableText(
                                  enText:
                                      ', you’re missing important haircare knowledge. ',
                                  esText:
                                      ', you’re missing important haircare knowledge. ',
                                  deText:
                                      ', dann fehlt dir wichtiges Haarpflegewissen.',
                                )}';
                              } else {
                                return '${FFLocalizations.of(context).getVariableText(
                                  enText:
                                      'But if you are still struggling with',
                                  esText:
                                      'But if you are still struggling with',
                                  deText: 'Aber wenn du immernoch ',
                                )}${() {
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
                                }()}${FFLocalizations.of(context).getVariableText(
                                  enText: ' despite what you’ve already tried',
                                  esText: ' despite what you’ve already tried',
                                  deText:
                                      ' hast, obwohl du schon so viel versucht hast',
                                )}${FFLocalizations.of(context).getVariableText(
                                  enText:
                                      ', you’re missing important haircare knowledge. ',
                                  esText:
                                      ', you’re missing important haircare knowledge. ',
                                  deText:
                                      ', dann fehlt dir wichtiges Haarpflegewissen.',
                                )}';
                              }
                            }(),
                            valueProp: FFLocalizations.of(context).getText(
                              'xgrtm968' /* Here is what you can achieve i... */,
                            ),
                            value1: FFLocalizations.of(context).getText(
                              'runyv089' /*  */,
                            ),
                            value2: FFLocalizations.of(context).getText(
                              '67s8av9p' /*  */,
                            ),
                            value3: FFLocalizations.of(context).getText(
                              'wrw01rih' /*  */,
                            ),
                            value4: FFLocalizations.of(context).getText(
                              '6atwdsko' /*  */,
                            ),
                            conclusion: FFLocalizations.of(context).getText(
                              '6beos8zn' /* That's why nothing has worked ... */,
                            ),
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
                            question: FFLocalizations.of(context).getText(
                              'vazebtnl' /* My reflection in the mirror af... */,
                            ),
                            subQuestion: FFLocalizations.of(context).getText(
                              'ltw8dxc6' /* How much do you relate to the ... */,
                            ),
                            questionId: 'confidence',
                            buttonAction: () async {
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
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
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
                            question: FFLocalizations.of(context).getText(
                              'zcjftwlh' /* I tend to compare my hair to o... */,
                            ),
                            subQuestion: FFLocalizations.of(context).getText(
                              'j1jzv4xz' /* How much do you relate to the ... */,
                            ),
                            questionId: 'comparison',
                            buttonAction: () async {
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
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
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
                            question: FFLocalizations.of(context).getText(
                              'hoc1sdcs' /* Did a professional refer you t... */,
                            ),
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
                            title: FFLocalizations.of(context).getText(
                              '44639e0e' /* Creating your personalized hai... */,
                            ),
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
                            concernResolutionChance:
                                '${FFLocalizations.of(context).getVariableText(
                              enText: 'Probability to fix your ',
                              esText: 'Probability to fix your ',
                              deText: 'Wahrscheinlichkeit, ',
                            )}${valueOrDefault<String>(
                              () {
                                if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairConcern',
                                      answerIds: ['concern_hairloss'],
                                    ))) {
                                  return FFLocalizations.of(context)
                                      .getVariableText(
                                    enText: 'hair loss',
                                    esText: 'hair loss',
                                    deText: 'deinen Haarausfall',
                                  );
                                } else if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairConcern',
                                      answerIds: ['concern_splitends'],
                                    ))) {
                                  return FFLocalizations.of(context)
                                      .getVariableText(
                                    enText: 'split-ends',
                                    esText: 'split-ends',
                                    deText: 'deinen frizz',
                                  );
                                } else if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairConcern',
                                      answerIds: ['concern_scalp'],
                                    ))) {
                                  return FFLocalizations.of(context)
                                      .getVariableText(
                                    enText: 'scalp issues',
                                    esText: 'scalp issues',
                                    deText: 'deine Kopfhautprobleme',
                                  );
                                } else if (FFAppState()
                                    .quizProfile
                                    .qaPairs
                                    .contains(QuestionAnswerPairStruct(
                                      questionId: 'hairConcern',
                                      answerIds: ['concern_damage'],
                                    ))) {
                                  return FFLocalizations.of(context)
                                      .getVariableText(
                                    enText: 'damaged hair',
                                    esText: 'damaged hair',
                                    deText: 'dein brüchiges Haar',
                                  );
                                } else {
                                  return FFLocalizations.of(context)
                                      .getVariableText(
                                    enText: 'hair problems',
                                    esText: 'hair problems',
                                    deText: 'deine Haarprobleme',
                                  );
                                }
                              }(),
                              'hair problems',
                            )}${FFLocalizations.of(context).getVariableText(
                              enText: ' in 14 days:',
                              esText: ' in 14 days:',
                              deText: ' in 14 Tagen zu lösen:',
                            )}',
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
                          model: _model.dashboardModel,
                          updateCallback: () => safeSetState(() {}),
                          child: DashboardWidget(
                            name: FFAppState().submittedContactDetails.name,
                            percentage: valueOrDefault<int>(
                              random_data.randomInteger(92, 97),
                              97,
                            ),
                            description: FFLocalizations.of(context).getText(
                              'v1fdv9fv' /* ewew */,
                            ),
                            goal: FFLocalizations.of(context).getText(
                              'k5vkwbbc' /* test */,
                            ),
                            startDate: getCurrentTimestamp,
                            startMyChallengeAction: () async {
                              FFAppState().showResultPageredirectLoader = true;
                              safeSetState(() {});
                              await actions.trackGAEvent(
                                'Go to  checkout',
                                '',
                                'Result Page',
                                FFAppConstants.nonQuestionAnswerItem.toList(),
                                '',
                                '',
                              );
                              await actions.redirectToCheckout();
                            },
                            reserveMySeatAction: () async {
                              FFAppState().showResultPageredirectLoader = true;
                              safeSetState(() {});
                              await actions.trackGAEvent(
                                'Go to  checkout',
                                '',
                                'Result Page',
                                FFAppConstants.nonQuestionAnswerItem.toList(),
                                '',
                                '',
                              );
                              await actions.redirectToCheckout();
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
                        Visibility(
                          visible: responsiveVisibility(
                            context: context,
                            phone: false,
                            tablet: false,
                            tabletLandscape: false,
                            desktop: false,
                          ),
                          child: wrapWithModel(
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
                              await _model.pageViewController?.nextPage(
                                duration: Duration(milliseconds: 300),
                                curve: Curves.ease,
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
                              answerImage1: '',
                              answerImage2: '',
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
                Container(
                  decoration: BoxDecoration(
                    color: FlutterFlowTheme.of(context).primaryText,
                  ),
                  alignment: AlignmentDirectional(0.0, 0.0),
                  child: Opacity(
                    opacity: 0.0,
                    child: Text(
                      FFLocalizations.of(context).getText(
                        'f1qq20i3' /* 🤓 🫧 🧖‍♀️ 🌿🤷‍♀️🙌😢😥🔒🔐�... */,
                      ),
                      style: FlutterFlowTheme.of(context).bodyMedium.override(
                            font: GoogleFonts.roboto(
                              fontWeight: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .fontWeight,
                              fontStyle: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .fontStyle,
                            ),
                            color: FlutterFlowTheme.of(context).primary,
                            fontSize: 1.0,
                            letterSpacing: 0.0,
                            fontWeight: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .fontWeight,
                            fontStyle: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .fontStyle,
                          ),
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
