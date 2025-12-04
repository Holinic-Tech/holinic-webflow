import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

const _kLocaleStorageKey = '__locale_key__';

class FFLocalizations {
  FFLocalizations(this.locale);

  final Locale locale;

  static FFLocalizations of(BuildContext context) =>
      Localizations.of<FFLocalizations>(context, FFLocalizations)!;

  static List<String> languages() => ['en', 'es', 'de'];

  static late SharedPreferences _prefs;
  static Future initialize() async =>
      _prefs = await SharedPreferences.getInstance();
  static Future storeLocale(String locale) =>
      _prefs.setString(_kLocaleStorageKey, locale);
  static Locale? getStoredLocale() {
    final locale = _prefs.getString(_kLocaleStorageKey);
    return locale != null && locale.isNotEmpty ? createLocale(locale) : null;
  }

  String get languageCode => locale.toString();
  String? get languageShortCode =>
      _languagesWithShortCode.contains(locale.toString())
          ? '${locale.toString()}_short'
          : null;
  int get languageIndex => languages().contains(languageCode)
      ? languages().indexOf(languageCode)
      : 0;

  String getText(String key) =>
      (kTranslationsMap[key] ?? {})[locale.toString()] ?? '';

  String getVariableText({
    String? enText = '',
    String? esText = '',
    String? deText = '',
  }) =>
      [enText, esText, deText][languageIndex] ?? '';

  static const Set<String> _languagesWithShortCode = {
    'ar',
    'az',
    'ca',
    'cs',
    'da',
    'de',
    'dv',
    'en',
    'es',
    'et',
    'fi',
    'fr',
    'gr',
    'he',
    'hi',
    'hu',
    'it',
    'km',
    'ku',
    'mn',
    'ms',
    'no',
    'pt',
    'ro',
    'ru',
    'rw',
    'sv',
    'th',
    'uk',
    'vi',
  };
}

/// Used if the locale is not supported by GlobalMaterialLocalizations.
class FallbackMaterialLocalizationDelegate
    extends LocalizationsDelegate<MaterialLocalizations> {
  const FallbackMaterialLocalizationDelegate();

  @override
  bool isSupported(Locale locale) => _isSupportedLocale(locale);

  @override
  Future<MaterialLocalizations> load(Locale locale) async =>
      SynchronousFuture<MaterialLocalizations>(
        const DefaultMaterialLocalizations(),
      );

  @override
  bool shouldReload(FallbackMaterialLocalizationDelegate old) => false;
}

/// Used if the locale is not supported by GlobalCupertinoLocalizations.
class FallbackCupertinoLocalizationDelegate
    extends LocalizationsDelegate<CupertinoLocalizations> {
  const FallbackCupertinoLocalizationDelegate();

  @override
  bool isSupported(Locale locale) => _isSupportedLocale(locale);

  @override
  Future<CupertinoLocalizations> load(Locale locale) =>
      SynchronousFuture<CupertinoLocalizations>(
        const DefaultCupertinoLocalizations(),
      );

  @override
  bool shouldReload(FallbackCupertinoLocalizationDelegate old) => false;
}

class FFLocalizationsDelegate extends LocalizationsDelegate<FFLocalizations> {
  const FFLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => _isSupportedLocale(locale);

  @override
  Future<FFLocalizations> load(Locale locale) =>
      SynchronousFuture<FFLocalizations>(FFLocalizations(locale));

  @override
  bool shouldReload(FFLocalizationsDelegate old) => false;
}

Locale createLocale(String language) => language.contains('_')
    ? Locale.fromSubtags(
        languageCode: language.split('_').first,
        scriptCode: language.split('_').last,
      )
    : Locale(language);

bool _isSupportedLocale(Locale locale) {
  final language = locale.toString();
  return FFLocalizations.languages().contains(
    language.endsWith('_')
        ? language.substring(0, language.length - 1)
        : language,
  );
}

final kTranslationsMap = <Map<String, Map<String, String>>>[
  // HomePage
  {
    'nbe7i9d1': {
      'en': 'See if the Challenge is a fit for you and your hair profile',
      'de':
          'Finde heraus, ob die Challenge das Richtige für dich und dein Haarprofil ist.',
      'es': 'Descubre si el reto es adecuado para ti y tu perfil capilar.',
    },
    'x8ai5u31': {
      'en': '',
      'de': '',
      'es': '',
    },
    'hjp0vvi2': {
      'en': '',
      'de': '',
      'es': '',
    },
    'd4329zzl': {
      'en': '',
      'de': '',
      'es': '',
    },
    'g2q0w5rd': {
      'en': 'Which hair type do you have?',
      'de': 'Was ist dein Haartyp?',
      'es': '¿Qué tipo de cabello tienes?',
    },
    'bdqv46ra': {
      'en': '',
      'de': '',
      'es': '',
    },
    'uaeia9o3': {
      'en': 'How old are you?',
      'de': 'Wie alt bist du?',
      'es': '¿Cuántos años tiene?',
    },
    'zf9jz0od': {
      'en': '',
      'de': '',
      'es': '',
    },
    'i2ojmi0m': {
      'en': '',
      'de': '',
      'es': '',
    },
    '15jpp8px': {
      'en': 'What is your biggest hair concern right now?',
      'de': 'Was ist im Moment dein größtes Haarproblem?',
      'es': '¿Cuál es tu mayor preocupación capilar en este momento?',
    },
    'onimc71u': {
      'en': ' Select one',
      'de': 'Wähle eines',
      'es': 'Seleccione uno',
    },
    '3qsxpsqp': {
      'en': '',
      'de': '',
      'es': '',
    },
    'zaokmujb': {
      'en': 'What best describes your current haircare routine?',
      'de': 'Was beschreibt deine aktuelle Haarpflegeroutine am besten?',
      'es': '¿Qué describe mejor tu rutina actual de cuidado del cabello?',
    },
    'dp0mkedt': {
      'en': '',
      'de': '',
      'es': '',
    },
    '7wg3bgoq': {
      'en': 'Don\'t worry! We got you.',
      'de': 'Keine Sorge! Wir kümmern uns um dich.',
      'es': '¡No te preocupes! Te tenemos cubierto.',
    },
    'blcnnajw': {
      'en': '',
      'de': '',
      'es': '',
    },
    'm7uh7oex': {
      'en':
          'How familiar are you with HairQare and our approach to holistic haircare?',
      'de':
          'Wie gut kennst du HairQare und unseren Ansatz zur ganzheitlichen Haarpflege?',
      'es':
          '¿Qué tan familiarizado está con HairQare y nuestro enfoque en el cuidado holístico del cabello?',
    },
    '646rpwwb': {
      'en': '',
      'de': '',
      'es': '',
    },
    'rn48g3to': {
      'en': '',
      'de': '',
      'es': '',
    },
    'g791wwh4': {
      'en': 'Beautiful hair needs more than just products.',
      'de': 'Schönes Haar braucht mehr als nur Produkte.',
      'es': 'Un cabello hermoso necesita más que sólo productos.',
    },
    '5begehn5': {
      'en':
          'Our evidence-based programs are developed by Sarah Tran, a certified hair loss specialist, along with a team of researchers, formulation scientists, and medical professionals. ',
      'de':
          'Unsere evidenzbasierten Programme werden von Sarah Tran, einer zertifizierten Haarausfallspezialistin, zusammen mit einem Team aus Forschern, Formulierungswissenschaftlern und medizinischem Fachpersonal entwickelt.',
      'es':
          'Nuestros programas basados en evidencia son desarrollados por Sarah Tran, especialista certificada en pérdida del cabello, junto con un equipo de investigadores, científicos de formulación y profesionales médicos.',
    },
    'dnzs3t47': {
      'en': 'Clinically proven to heal your hair quickly and permanently.',
      'de': 'Klinisch erwiesen: Heilt Ihr Haar schnell und dauerhaft.',
      'es':
          'Clínicamente probado para curar tu cabello de forma rápida y permanente.',
    },
    's3viwwxq': {
      'en': 'Proven Results for:',
      'de': 'Nachgewiesene Ergebnisse für:',
      'es': 'Resultados comprobados para:',
    },
    'dhw0xi88': {
      'en': 'Any hair concern ',
      'de': 'Jedes Haarproblem',
      'es': '¿Alguna preocupación sobre el cabello?',
    },
    'vyzhveff': {
      'en': 'Any age',
      'de': 'Jedes Alter',
      'es': 'Cualquier edad',
    },
    't05pit2o': {
      'en': 'Any hair type',
      'de': 'Jeder Haartyp',
      'es': 'Cualquier tipo de cabello',
    },
    'kuvd0wnn': {
      'en': 'Any hair goal',
      'de': 'Jedes Haarziel',
      'es': 'Cualquier objetivo capilar',
    },
    'khaadglv': {
      'en': 'What best describes your diet?',
      'de': 'Was beschreibt deine Ernährung am besten?',
      'es': '¿Qué describe mejor tu dieta?',
    },
    'x3t83a7y': {
      'en': 'What we eat affects our hair growth and quality.',
      'de':
          'Was wir essen, beeinflusst unser Haarwachstum und unsere Haarqualität.',
      'es':
          'Lo que comemos afecta el crecimiento y la calidad de nuestro cabello.',
    },
    '25wr54y6': {
      'en': 'How much do you spend on a bottle of shampoo?',
      'de': 'Wie viel geben Sie für eine Flasche Shampoo aus?',
      'es': '¿Cuánto gastas en una botella de champú?',
    },
    'rihaqphi': {
      'en': 'Which of these hair care myths do you believe?',
      'de': 'Welche dieser Haarpflegemythen glaubst du sind wahr?',
      'es': '¿En cuál de estos mitos sobre el cuidado del cabello crees?',
    },
    'ugf9xggr': {
      'en': 'Select the damaging practices that you regularly do',
      'de': 'Welche dieser haarschädlichen Sachen machst du regelmäßig?',
      'es': 'Selecciona las prácticas dañinas que realizas habitualmente',
    },
    'o7lj8r75': {
      'en': '',
      'de': '',
      'es': '',
    },
    'xgrtm968': {
      'en':
          'Here is what you can achieve in 14 days of following the right routine for your hair:',
      'de':
          'Das kannst du in nur 14 Tagen erreichen, wenn du die richtige Routine für deine Haare hast:',
      'es':
          'Esto es lo que puedes lograr en 14 días siguiendo la rutina adecuada para tu cabello:',
    },
    'runyv089': {
      'en': '',
      'de': '',
      'es': '',
    },
    '67s8av9p': {
      'en': '',
      'de': '',
      'es': '',
    },
    'wrw01rih': {
      'en': '',
      'de': '',
      'es': '',
    },
    '6atwdsko': {
      'en': '',
      'de': '',
      'es': '',
    },
    '6beos8zn': {
      'en': 'That\'s why nothing has worked so far.',
      'de': 'Deshalb hat bisher nichts funktioniert.',
      'es': 'Es por eso que nada ha funcionado hasta ahora.',
    },
    'vazebtnl': {
      'en': 'My reflection in the mirror affects my mood and self-esteem.',
      'de':
          'Mein Spiegelbild beeinflusst meine Stimmung und mein Selbstwertgefühl.',
      'es':
          'Mi reflejo en el espejo afecta mi estado de ánimo y mi autoestima.',
    },
    'ltw8dxc6': {
      'en': 'How much do you relate to the following statement?',
      'de':
          'Inwieweit kannst du dich mit der folgenden Aussage identifizieren?',
      'es': '¿En qué medida te identificas con la siguiente afirmación?',
    },
    'zcjftwlh': {
      'en': 'I tend to compare my hair to others\' and it makes me frustrated.',
      'de':
          'Ich neige dazu, meine Haare mit denen anderer zu vergleichen und das frustriert mich.',
      'es':
          'Tengo tendencia a comparar mi cabello con el de los demás y eso me frustra.',
    },
    'j1jzv4xz': {
      'en': 'How much do you relate to the following statement?',
      'de':
          'Inwieweit können Sie sich mit der folgenden Aussage identifizieren?',
      'es': '¿En qué medida te identificas con la siguiente afirmación?',
    },
    'hoc1sdcs': {
      'en': 'Did a professional refer you to us?',
      'de': 'Wurdest von Fachpersonal an uns verwiesen?',
      'es': '¿Algún profesional le recomendó contactarnos?',
    },
    '44639e0e': {
      'en': 'Creating your personalized haircare program',
      'de': 'Erstellen Sie Ihr persönliches Haarpflegeprogramm',
      'es': 'Creando tu programa de cuidado del cabello personalizado',
    },
    'v1fdv9fv': {
      'en': 'ewew',
      'de': 'igitt',
      'es': 'puercoespín',
    },
    'k5vkwbbc': {
      'en': 'test',
      'de': 'prüfen',
      'es': 'prueba',
    },
    'f1qq20i3': {
      'en': '🤓 🫧 🧖‍♀️ 🌿🤷‍♀️🙌😢😥🔒🔐😌☺️🤗',
      'de': '🤓 🫧 🧖‍♀️ 🌿🤷‍♀️🙌😢😥🔒🔐😌☺️🤗',
      'es': '🤓 🫧 🧖‍♀️ 🌿🤷‍♀️🙌😢😥🔒🔐😌☺️🤗',
    },
    'xx1chigz': {
      'en': 'Home',
      'de': 'Home',
      'es': 'Home',
    },
  },
  // RatingQuestion_Options
  {
    '09emjmhf': {
      'en': '1',
      'de': '1',
      'es': '1',
    },
    'jdaoyjnt': {
      'en': '2',
      'de': '2',
      'es': '2',
    },
    'n9815tnp': {
      'en': '3',
      'de': '3',
      'es': '3',
    },
    'bex1s1ta': {
      'en': '4',
      'de': '4',
      'es': '4',
    },
    '3n1wpdrn': {
      'en': '5',
      'de': '5',
      'es': '5',
    },
    'kfse574s': {
      'en': 'Not at all',
      'de': 'Gar nicht',
      'es': 'De nada',
    },
    '9qrzqazn': {
      'en': 'Totally',
      'de': 'Sehr',
      'es': 'Totalmente',
    },
  },
  // ImageBackground_QuesBodyV3
  {
    'y2h1wino': {
      'en': '4.8 out of 5',
      'de': '4,8 von 5',
      'es': '4,8 de 5',
    },
    '31eabgmc': {
      'en': '|',
      'de': '|',
      'es': '|',
    },
    'oy280vcm': {
      'en': 'Start by selecting your goal:',
      'de': 'Beginnen Sie mit der Auswahl Ihres Ziels:',
      'es': 'Comience seleccionando su objetivo:',
    },
    'tvid18z0': {
      'en': 'Skip the quiz',
      'de': 'Überspringen Sie das Quiz',
      'es': 'Saltar el cuestionario',
    },
  },
  // FloatingTimerDialogBox
  {
    'zrvb3vg4': {
      'en': ' 85% OFF valid for:',
      'de': '85 % Rabatt gültig für:',
      'es': '85% de descuento válido para:',
    },
    'so2q35wf': {
      'en': 'Start Now',
      'de': 'Jetzt starten',
      'es': 'Empieza ahora',
    },
  },
  // PitchBody_textImagesBodySimilar
  {
    '2uhvkbd6': {
      'en': 'Profile Summary',
      'de': 'Profilzusammenfassung',
      'es': 'Resumen del perfil',
    },
    'z41mds6x': {
      'en': 'Hair Potential',
      'de': 'Haarpotenzial',
      'es': 'Potencial del cabello',
    },
    'yhkzc0dh': {
      'en':
          'Based on your answers, your hair has HIGH improvement potential. Awesome! This means your hair can be improved significantly with the right routine. While spending less time and money than you currently are.',
      'de':
          'Basierend auf Ihren Antworten haben Ihre Haare ein hohes Verbesserungspotenzial. Fantastisch! Das bedeutet, dass Ihr Haar mit der richtigen Pflege deutlich verbessert werden kann. Und das bei geringerem Zeit- und Kostenaufwand als bisher.',
      'es':
          'Según tus respuestas, tu cabello tiene un gran potencial de mejora. ¡Genial! Esto significa que puedes mejorar significativamente con la rutina adecuada, invirtiendo menos tiempo y dinero que ahora.',
    },
  },
  // FloatingTimerCheckout
  {
    'mtbfmoax': {
      'en': ' 85% OFF valid for:',
      'de': '85 % Rabatt gültig für:',
      'es': '85% de descuento válido para:',
    },
  },
  // MultiChoiceQuestion_CheckBox
  {
    'lvb6hgxh': {
      'en': 'Select the damaging practices that you regularly do',
      'de':
          'Wählen Sie die schädlichen Praktiken aus, die Sie regelmäßig durchführen',
      'es': 'Selecciona las prácticas dañinas que realizas habitualmente',
    },
    'nbepcvyq': {
      'en': '(Select all that apply)',
      'de': '(Wählen Sie alle zutreffenden Antworten aus)',
      'es': '(Seleccione todas las que correspondan)',
    },
    'vzfmsa5z': {
      'en': 'None of the above',
      'de': 'Nichts des oben Genannten',
      'es': 'Ninguna de las anteriores',
    },
  },
  // StartLoadingComponent
  {
    '3t7mufqk': {
      'en': 'Find out if the Haircare Challenge is right for you',
      'de':
          'Finden Sie heraus, ob die Haircare Challenge das Richtige für Sie ist',
      'es':
          'Descubre si el Desafío del Cuidado del Cabello es adecuado para ti',
    },
    '52plp8h7': {
      'en': 'Personal space loading',
      'de': 'Persönlicher Bereich wird geladen',
      'es': 'Carga de espacio personal',
    },
  },
  // ImageBackground_QuesBody
  {
    'ixew8z9q': {
      'en': 'Start by selecting your goal:',
      'de': 'Wähle dein persönliches Ziel',
      'es': 'Comience seleccionando su objetivo:',
    },
    'r3fmpz9h': {
      'en': 'Skip the Quiz',
      'de': 'Überspringe das Quiz',
      'es': 'Saltar el cuestionario',
    },
  },
  // ManualCarusell
  {
    'kyv3grhb': {
      'en':
          'Fully recommend this routine to every woman out there! The knowledge you learn from this course sets you up to healthier and better hair! The community is with you every step of the way, the videos are full of information, and the workbook helps you put things into practice. I enjoyed my experience and the change I’ve noticed in my hair. Worth every penny!',
      'de':
          'Ich kann diese Routine jeder Frau nur wärmstens empfehlen! Das Wissen aus diesem Kurs verhilft dir zu gesünderem und schönerem Haar! Die Community begleitet dich bei jedem Schritt, die Videos sind voller Informationen und das Arbeitsbuch hilft dir, die Dinge in die Praxis umzusetzen. Ich habe meine Erfahrung und die Veränderung, die ich an meinem Haar bemerkt habe, sehr genossen. Jeden Cent wert!',
      'es':
          '¡Recomiendo totalmente esta rutina a todas las mujeres! ¡Los conocimientos que aprendes en este curso te ayudarán a tener un cabello más sano y saludable! La comunidad te acompaña en cada paso del proceso, los videos están llenos de información y el manual te ayuda a poner en práctica. Disfruté mucho de la experiencia y del cambio que he notado en mi cabello. ¡Vale cada centavo!',
    },
    '1dec8sii': {
      'en': 'Melissa Klinefelter',
      'de': 'Melissa Klinefelter',
      'es': 'Melissa Klinefelter',
    },
  },
  // LoginComponent
  {
    '1e5gv14v': {
      'en': 'Your results are ready!',
      'de': 'Deine Ergebnisse sind da!',
      'es': '¡Tus resultados están listos!',
    },
    'a2n3qu3n': {
      'en':
          'On the next screen, you’ll see if the Challenge can help you achieve your hair goal.',
      'de':
          'Auf der nächsten Seite wirst du sehen, ob die Challenge dir helfen kann, dein perönliches Haarziel zu erreichen.',
      'es':
          'En la siguiente pantalla, verás si el Desafío puede ayudarte a lograr tu objetivo capilar.',
    },
    '9kxb0hra': {
      'en': 'Enter your details \nto unlock your results 🔐',
      'de': 'Gib einfach deine Daten ein und sieh dir deine Ergebnisse an 🔐',
      'es': 'Introduce tus datos para desbloquear tus resultados 🔐',
    },
    'dhice1ou': {
      'en': 'Name',
      'de': 'Name',
      'es': 'Nombre',
    },
    '76eyp598': {
      'en': 'Email',
      'de': 'E-Mail',
      'es': 'Correo electrónico',
    },
    '0n6w92ng': {
      'en': 'Name is required',
      'de': 'Name ist erforderlich',
      'es': 'El nombre es obligatorio',
    },
    'lubgg509': {
      'en': 'Please choose an option from the dropdown',
      'de': 'Bitte wählen Sie eine Option aus der Dropdown-Liste',
      'es': 'Por favor, elija una opción del menú desplegable.',
    },
    'mzen7x7c': {
      'en': 'Email is required',
      'de': 'E-Mail ist erforderlich',
      'es': 'Se requiere correo electrónico',
    },
    't8czkzlo': {
      'en': 'Please enter valid email',
      'de': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      'es': 'Por favor ingrese un correo electrónico válido',
    },
    '4lyhh2ie': {
      'en': 'Please choose an option from the dropdown',
      'de': 'Bitte wählen Sie eine Option aus der Dropdown-Liste',
      'es': 'Por favor, elija una opción del menú desplegable.',
    },
    'glfaezfb': {
      'en': 'Your info is 100% secure and never shared with third parties. ',
      'de':
          'Deine Daten sind zu 100 % sicher und werden niemals an Dritte weitergegeben.',
      'es': 'Su información es 100% segura y nunca se comparte con terceros.',
    },
  },
  // Final_PitchCopy
  {
    'ectisdy6': {
      'en': 'Previous discount: ',
      'de': 'Vorheriger Rabatt:',
      'es': 'Descuento anterior:',
    },
    'xqojkbzp': {
      'en': 'Get your personal plan with up to ',
      'de': 'Sichern Sie sich Ihren persönlichen Plan mit bis zu',
      'es': 'Consigue tu plan personal con hasta',
    },
    '8ieqkqa5': {
      'en': ' discount',
      'de': 'Rabatt',
      'es': 'descuento',
    },
    'oj6tcmfd': {
      'en': 'Your ',
      'de': 'Dein',
      'es': 'Su',
    },
    'cf7zz2ef': {
      'en': 'Vagus Nerve Reset ',
      'de': 'Vagusnerv-Reset',
      'es': 'Restablecimiento del nervio vago',
    },
    'oycp2jqg': {
      'en': 'plan is ready!',
      'de': 'Plan ist fertig!',
      'es': '¡El plan está listo!',
    },
    'zm5fkvnr': {
      'en': 'Main trigger: ',
      'de': 'Hauptauslöser:',
      'es': 'Desencadenante principal:',
    },
    'vpdapk4a': {
      'en': 'Wrong routine',
      'de': 'Falsche Routine',
      'es': 'Rutina equivocada',
    },
    '8nm2ndrh': {
      'en': 'Plan focus:',
      'de': 'Planschwerpunkt:',
      'es': 'Enfoque del plan:',
    },
    'ncal8jc0': {
      'en': 'MOST POPULAR',
      'de': 'AM POPULÄRSTEN',
      'es': 'MÁS POPULAR',
    },
    '4xbu1770': {
      'en': '\$',
      'de': '\$',
      'es': '\$',
    },
    'lhtbg9hr': {
      'en': '0',
      'de': '0',
      'es': '0',
    },
    '91z902ra': {
      'en':
          'People using our plan for 12 weeks achieve twice as many results as for 4 weeks',
      'de':
          'Menschen, die unseren Plan 12 Wochen lang anwenden, erzielen doppelt so viele Ergebnisse wie Menschen, die ihn 4 Wochen lang anwenden.',
      'es':
          'Las personas que utilizan nuestro plan durante 12 semanas obtienen el doble de resultados que durante 4 semanas.',
    },
    '92uxjegs': {
      'en': 'GET MY PLAN',
      'de': 'MEINEN PLAN ERHALTEN',
      'es': 'OBTENGA MI PLAN',
    },
  },
  // skip_dialog
  {
    '0cja6uh2': {
      'en': '⚠️ Before you continue...',
      'de': '⚠️ Ganz kurz...',
      'es': '⚠️ Antes de continuar...',
    },
    'biuiym7a': {
      'en':
          'Only skip the quiz if you\'ve previously completed it, as it\'s required to create a personalized routine based on your hair condition, lifestyle, and other key factors.',
      'de':
          'Überspring das Quiz nur, wenn du es wirklich schon gemacht hast – es ist wichtig, um deine persönliche Routine passend zu deinem Haar, deinem Lifestyle und allem, was dazugehört, zu erstellen.',
      'es':
          'Omite el cuestionario solo si ya lo has completado previamente, ya que es necesario para crear una rutina personalizada en función de la condición de tu cabello, estilo de vida y otros factores clave.',
    },
    '6x7g4z0e': {
      'en': 'BACK TO QUIZ',
      'de': 'ZURÜCK',
      'es': 'VOLVER',
    },
    'jn6yshoa': {
      'en': 'SKIP QUIZ',
      'de': 'ÜBERSPRINGEN',
      'es': 'SALTAR LA PRUEBA',
    },
  },
  // LoadingScreen_beforeResult
  {
    'thdd4opu': {
      'en': 'The only haircare program you’ll ever need',
      'de': 'Das einzige Haarpflegeprogramm, das Sie jemals brauchen werden',
      'es': 'El único programa de cuidado del cabello que necesitarás',
    },
  },
  // pitch_plan_dialogCopy
  {
    'tdwe6nzm': {
      'en': 'Your Haircare Challenge Plan',
      'de': 'Ihr Haarpflege-Challenge-Plan',
      'es': 'Tu plan de desafío para el cuidado del cabello',
    },
    'dovft1qw': {
      'en': 'YOUR DISCOUNT',
      'de': 'IHR RABATT',
      'es': 'TU DESCUENTO',
    },
    'tb5ex1i2': {
      'en': ' RESERVED FOR',
      'de': 'RESERVIERT FÜR',
      'es': 'RESERVADO PARA',
    },
    '7ngdtn9t': {
      'en': '14 Day Plan',
      'de': '14-Tage-Plan',
      'es': 'Plan de 14 días',
    },
    'h0etcavm': {
      'en': 'Full Access',
      'de': 'Vollzugriff',
      'es': 'Acceso completo',
    },
    'oqk57yfn': {
      'en': 'Based on your profile, we\'ve added these modules to your plan ',
      'de':
          'Basierend auf Ihrem Profil haben wir diese Module zu Ihrem Plan hinzugefügt',
      'es': 'En función de tu perfil, hemos añadido estos módulos a tu plan',
    },
    'fw80v5mn': {
      'en': 'to ensure success:',
      'de': 'um den Erfolg sicherzustellen:',
      'es': 'Para garantizar el éxito:',
    },
    'jnsh4y8d': {
      'en': 'START NOW →',
      'de': 'JETZT STARTEN →',
      'es': 'COMIENZA AHORA →',
    },
  },
  // MultiChoiceWithImageQuestion_CheckBox
  {
    '7o5y8tc0': {
      'en': 'Select all that apply',
      'de': 'Wähle alle zutreffenden Antworten aus',
      'es': 'Seleccione todas las que correspondan',
    },
    '1var0gwm': {
      'en': 'None of the above',
      'de': 'Nichts des oben Genannten',
      'es': 'Ninguna de las anteriores',
    },
  },
  // MultiChoiceWithImageQuestion_CheckBoxPractices
  {
    '907jgrxi': {
      'en': '(Select all that apply)',
      'de': '(Wählen Sie alle zutreffenden Antworten aus)',
      'es': '(Seleccione todas las que correspondan)',
    },
    'ig7rz0ud': {
      'en': 'None of the above',
      'de': 'Nichts des oben Genannten',
      'es': 'Ninguna de las anteriores',
    },
  },
  // Dashboard
  {
    'qm88njuv': {
      'en': 'You are a perfect fit for the Haircare Challenge 😍',
      'de': 'Du bist perfekt für die Haircare Challenge 😍',
      'es': 'Eres perfecto para el reto del cuidado del cabello 😍',
    },
    '26c1jnac': {
      'en': 'Your matching score is',
      'de': 'Ihr Matching-Score ist',
      'es': 'Tu puntuación de coincidencia es',
    },
    '3iv5sy4c': {
      'en': 'That\'s an outstanding score!',
      'de': 'Das ist ein super Ergebnis!',
      'es': 'That\'s an outstanding score!',
    },
    'afncsqx6': {
      'en': 'My Goal: ',
      'de': 'Mein Ziel:',
      'es': 'Mi objetivo:',
    },
    'aq4pinvd': {
      'en': 'Your hair transformation timeline:',
      'de': 'Ihr Zeitplan für die Haartransformation:',
      'es': 'Cronología de tu transformación capilar:',
    },
    'zork7poj': {
      'en': ' No more frustration or disappointments!',
      'de': '',
      'es': ' No more frustration or disappointments!',
    },
    'unnguajk': {
      'en': '✅',
      'de': '✅',
      'es': '✅',
    },
    'gupt5mjs': {
      'en':
          'Target the root causes of your hair issues and stop them from coming back.',
      'de':
          'Geh die Ursachen deiner Haarprobleme an – und sorg dafür, dass sie nicht wiederkommen.',
      'es':
          'Aborde las causas fundamentales de sus problemas capilares y evite que regresen.',
    },
    '6gx8s01a': {
      'en': '✅',
      'de': '✅',
      'es': '✅',
    },
    'begqgauj': {
      'en':
          'Build a personalized, easy-to-follow haircare plan tailored to your unique needs.',
      'de':
          'Erstelle einen persönlichen, leicht umsetzbaren Haarpflege-Plan, der genau zu dir und deinen Bedürfnissen passt.',
      'es':
          'Cree un plan de cuidado del cabello personalizado y fácil de seguir adaptado a sus necesidades únicas.',
    },
    'mdb5vygy': {
      'en': '✅',
      'de': '✅',
      'es': '✅',
    },
    'qopcc4n9': {
      'en':
          'Create your own gentle, DIY shampoo & conditioner for lasting results',
      'de':
          'Mach dir dein eigenes mildes DIY-Shampoo und deine eigene Pflege – damit deine Haare langfristig schön bleiben.',
      'es':
          'Crea tu propio champú y acondicionador suave y casero para obtener resultados duraderos.',
    },
    'tvn54o9f': {
      'en': 'JOIN THE CHALLENGE',
      'de': 'NIMM AN DER CHALLENGE TEIL',
      'es': 'ÚNETE AL CHALLENGE',
    },
    '2cdo81nl': {
      'en': '91,000+ women ',
      'de': '91.000+ Frauen ',
      'es': 'más de 91.000 mujeres ',
    },
    'clhaelj4': {
      'en': 'have taken this challenge, and ',
      'de': 'haben diese Challenge angenommen und ',
      'es': 'han aceptado este desafío y ',
    },
    'fwse24sg': {
      'en': '92% of finishers said “It has changed their life”.',
      'de': '92% der Teilnehmerinnen sagten: „Es hat ihr Leben verändert.“',
      'es':
          'El 92% de los que finalizaron el curso afirmaron: “Les ha cambiado la vida”.',
    },
    'phsineyb': {
      'en': 'START MY CHALLENGE',
      'de': 'NIMM DIE HERAUSFORDERUNG AN',
      'es': 'COMIENZA MI RETO',
    },
    'x0h469el': {
      'en': 'Based on your answers, you just need ',
      'de': 'Basierend auf deinen Antworten brauchst du nur ',
      'es': 'En base a tus respuestas, solo necesitas ',
    },
    'u03zkhmn': {
      'en': '\n10 min a day, for 14 days\n',
      'de': '\n10 Minuten pro Tag, für 14 Tage\n',
      'es': '\n10 minutos al día, durante 14 días\n',
    },
    'lxtttebt': {
      'en':
          'to get beautiful and healthy hair that turns heads and boosts your confidence every single day.',
      'de':
          'um schönes, gesundes Haar zu bekommen, das alle Blicke auf sich zieht und dir jeden Tag neues Selbstvertrauen gibt.',
      'es':
          'para conseguir un cabello bello y saludable que llame la atención y aumente tu confianza todos los días.',
    },
    'rpb2l5tr': {
      'en': '100%\nResults',
      'de': '100 %\nErgebnisse',
      'es': '100%\nResultados',
    },
    '7qu4hw6f': {
      'en': '0%\nHassle',
      'de': '0 %\nÄrger',
      'es': '0%\nProblemas',
    },
    'on4egm7h': {
      'en': 'Science-based and ',
      'de': 'Wissenschaftlich fundierte und ',
      'es': 'Basado en la ciencia y ',
    },
    '5zr2seie': {
      'en': 'reviewed by haircare experts.',
      'de': 'von Haarpflegeexperten geprüft.',
      'es': 'Revisado por expertos en el cuidado del cabello.',
    },
    '7t1iikxr': {
      'en': 'Get a ',
      'de': 'Mit personalisiertem ',
      'es': 'Conseguir una ',
    },
    'hv2znn3j': {
      'en': 'nutrient-rich meal plan ',
      'de': 'nährstoffreicher Ernährungsplan ',
      'es': 'plan de alimentación rico en nutrientes ',
    },
    'q9istz0v': {
      'en': 'to minimise hair loss and enhance hair thickness.',
      'de': 'um Haarausfall zu minimieren und die Haardichte zu verbessern.',
      'es':
          'Para minimizar la caída del cabello y mejorar el grosor del cabello.',
    },
    'yqzvlhso': {
      'en': 'Save thousands ',
      'de': 'Verschwende kein Geld mehr ',
      'es': 'Ahorre miles ',
    },
    '16qkzkbg': {
      'en': 'on products and salon treatments you won\'t need anymore.',
      'de': 'für Produkte und Salonbehandlungen, die du nicht mehr brauchst.',
      'es': 'sobre productos y tratamientos de salón que ya no necesitarás.',
    },
    '8p79eqjq': {
      'en': 'START MY CHALLENGE',
      'de': 'MEINE HERAUSFORDERUNG STARTEN',
      'es': 'COMIENZA MI RETO',
    },
    '6kg20sml': {
      'en': '100% Refund guarantee | No Questions Asked',
      'de': '100% Geld-zurück-Garantie | Ohne wenn und aber',
      'es': 'Garantía de reembolso del 100 % | Sin preguntas',
    },
  },
  // Final_Pitch
  {
    '0r9t3oy8': {
      'en': 'We\'ve found the right \nHaircare Program for you 🎉',
      'de': 'Wir haben das richtige Haarpflegeprogramm für Sie gefunden 🎉',
      'es':
          'Hemos encontrado el programa de cuidado capilar perfecto para ti 🎉',
    },
    '817pt5y7': {
      'en': 'Personal plan for ',
      'de': 'Persönlicher Plan für',
      'es': 'Plan personal para',
    },
    'itcort7o': {
      'en': ' has been reserved.',
      'de': 'wurde reserviert.',
      'es': 'Ha sido reservado.',
    },
    '9wp0qw0h': {
      'en': 'Holistic Haircare Routine ',
      'de': 'Ganzheitliche Haarpflegeroutine',
      'es': 'Rutina holística de cuidado capilar',
    },
    'y3g6sgpk': {
      'en': 'plan is ready!',
      'de': 'Plan ist fertig!',
      'es': '¡El plan está listo!',
    },
    'nlz1clot': {
      'en': 'Start today and become unrecognizable in 14 days with ',
      'de': 'Starten Sie noch heute und werden Sie in 14 Tagen unkenntlich mit',
      'es': 'Empieza hoy y vuélvete irreconocible en 14 días con',
    },
    'ekwd1cyb': {
      'en': 'Main trigger: ',
      'de': 'Hauptauslöser:',
      'es': 'Desencadenante principal:',
    },
    '2fc0jc34': {
      'en': 'Wrong routine',
      'de': 'Falsche Routine',
      'es': 'Rutina equivocada',
    },
    '9vlngh5n': {
      'en': 'Plan focus:',
      'de': 'Planschwerpunkt:',
      'es': 'Enfoque del plan:',
    },
    're08tcmi': {
      'en': 'YOUR PERSONALIZED PLAN',
      'de': 'IHR PERSONALISIERTER PLAN',
      'es': 'TU PLAN PERSONALIZADO',
    },
    'bubj1rw2': {
      'en': '\$',
      'de': '\$',
      'es': '\$',
    },
    'g1p5u51r': {
      'en': 'People using this program see visible results in 14 days.',
      'de':
          'Personen, die dieses Programm verwenden, sehen innerhalb von 14 Tagen sichtbare Ergebnisse.',
      'es':
          'Las personas que utilizan este programa ven resultados visibles en 14 días.',
    },
    '99ghm8vs': {
      'en': 'GET MY PLAN',
      'de': 'MEINEN PLAN ERHALTEN',
      'es': 'OBTENGA MI PLAN',
    },
  },
  // pitch_plan_dialog
  {
    'hgyl4nrl': {
      'en': 'Your Haircare Challenge Plan',
      'de': 'Ihr Haarpflege-Challenge-Plan',
      'es': 'Tu plan de desafío para el cuidado del cabello',
    },
    'b1ck4ulz': {
      'en': 'YOUR DISCOUNT',
      'de': 'IHR RABATT',
      'es': 'TU DESCUENTO',
    },
    'vu8o4qzc': {
      'en': ' IS STILL RESERVED FOR:',
      'de': 'IST NOCH RESERVIERT FÜR:',
      'es': 'TODAVÍA ESTÁ RESERVADO PARA:',
    },
    '5ths0qr4': {
      'en': '14 Day Plan',
      'de': '14-Tage-Plan',
      'es': 'Plan de 14 días',
    },
    'iu28pmt3': {
      'en': 'Full Access',
      'de': 'Vollzugriff',
      'es': 'Acceso completo',
    },
    'ichnww2b': {
      'en': 'Based on your profile, we\'ve added these modules to your plan ',
      'de':
          'Basierend auf Ihrem Profil haben wir diese Module zu Ihrem Plan hinzugefügt',
      'es': 'En función de tu perfil, hemos añadido estos módulos a tu plan',
    },
    'h4mmue8a': {
      'en': 'to ensure success:',
      'de': 'um den Erfolg sicherzustellen:',
      'es': 'Para garantizar el éxito:',
    },
    '32vzsk0t': {
      'en': 'START NOW →',
      'de': 'JETZT STARTEN →',
      'es': 'COMIENZA AHORA →',
    },
  },
  // ImageBackground_QuesBodyV2
  {
    'rvqxeq7r': {
      'en': 'Start by selecting your goal:',
      'de': 'Beginnen Sie mit der Auswahl Ihres Ziels:',
      'es': 'Comience seleccionando su objetivo:',
    },
    'fi8xv3qb': {
      'en': 'I want BOTH',
      'de': 'Ich will BEIDES',
      'es': 'Quiero AMBOS',
    },
    '6laxeb4h': {
      'en': 'Skip',
      'de': 'Überspringen',
      'es': 'Saltar',
    },
  },
  // Miscellaneous
  {
    '1eqxhevg': {
      'en': '',
      'de': '',
      'es': '',
    },
    'ic8jhu9j': {
      'en': '',
      'de': '',
      'es': '',
    },
    'ec8rm8tk': {
      'en': '',
      'de': '',
      'es': '',
    },
    'xxhl0wn1': {
      'en': '',
      'de': '',
      'es': '',
    },
    'm8nqwxb1': {
      'en': '',
      'de': '',
      'es': '',
    },
    'revbq5qq': {
      'en': '',
      'de': '',
      'es': '',
    },
    '09ukt3c8': {
      'en': '',
      'de': '',
      'es': '',
    },
    '1gug1sgp': {
      'en': '',
      'de': '',
      'es': '',
    },
    'c6bnul88': {
      'en': '',
      'de': '',
      'es': '',
    },
    'hwh30sl9': {
      'en': '',
      'de': '',
      'es': '',
    },
    'z4ox7u3f': {
      'en': '',
      'de': '',
      'es': '',
    },
    'fhsi3i9h': {
      'en': '',
      'de': '',
      'es': '',
    },
    'mmvr2hkb': {
      'en': '',
      'de': '',
      'es': '',
    },
    'uiz5gk5w': {
      'en': '',
      'de': '',
      'es': '',
    },
    'ba5zeg7d': {
      'en': '',
      'de': '',
      'es': '',
    },
    'yazkokus': {
      'en': '',
      'de': '',
      'es': '',
    },
    '2ugi4962': {
      'en': '',
      'de': '',
      'es': '',
    },
    '8bsv7vn3': {
      'en': '',
      'de': '',
      'es': '',
    },
    'nelocmqn': {
      'en': '',
      'de': '',
      'es': '',
    },
    '5p3tyhke': {
      'en': '',
      'de': '',
      'es': '',
    },
    '703vur6b': {
      'en': '',
      'de': '',
      'es': '',
    },
    '7s69vfg6': {
      'en': '',
      'de': '',
      'es': '',
    },
    'qndl2sh5': {
      'en': '',
      'de': '',
      'es': '',
    },
    'g4s5q2ha': {
      'en': '',
      'de': '',
      'es': '',
    },
    '04n16m28': {
      'en': '',
      'de': '',
      'es': '',
    },
  },
].reduce((a, b) => a..addAll(b));
