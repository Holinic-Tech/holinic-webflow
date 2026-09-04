// ============================================================================
// Hairqare "take the quiz" (MOF) — rebuilt tracking + webhook + personalized checkout
// ----------------------------------------------------------------------------
// This is the original hand-written vanilla quiz with three fixes and nothing else:
//   1. Emits the SAME GA/dataLayer events GTM relays for the React quizzes
//      (Quiz Viewed -> Quiz Started -> Question Answered -> Quiz Completed ->
//       Quiz Submitted -> Viewed Results Page -> the two-space "Go to  checkout").
//   2. POSTs to the live quiz-submissions worker (AC contact + Mixpanel profile +
//      Converge "Signed Up"), replacing the dead bysa.app webhook (was HTTP 500).
//   3. Attaches the concern-based order-bump coupon to the checkout URL.
// The step flow, loader, result copy, markup and CSS are unchanged (stays responsive).
// The webhook secret is sent ONLY on the live host, so staging QA never creates real leads
// (the worker rejects a secret-less POST) — same staging/prod split as the React quizzes.
// ============================================================================

// ---- config ----------------------------------------------------------------
var WEBHOOK_URL = 'https://quiz-submissions-worker.dndgroup.workers.dev/api/v1/quiz/submit';
// Fixed CLIENT-side value the worker expects (same for every quiz; NOT in 1Password).
var LIVE_WEBHOOK_SECRET = 'a6e3a73e9d1d60d438efad6b5512b5a75db65c3c1f78f90ed9aeccfde3ac6969';
var IS_STAGING = location.hostname.indexOf('staging') !== -1;
// staging -> '' so the worker rejects it (no real AC/Mixpanel lead from a test walk-through).
var WEBHOOK_SECRET = IS_STAGING ? '' : LIVE_WEBHOOK_SECRET;

var CHECKOUT_BASE = 'https://checkout.hairqare.co/buy/hairqare-challenge-save-90-25-18/';

// Concern radio value -> standard answerId (aligns with the React quizzes) + order-bump coupon.
// Split ends / mixed => no coupon (conditioner only), per spec.
var CONCERN_MAP = {
  Hair_loss:           { answerId: 'concern_hairloss',  coupon: 'c_hl' },
  Irritation_dandruff: { answerId: 'concern_scalp',     coupon: 'c_si' },
  Damage_dye:          { answerId: 'concern_damage',    coupon: 'c_dh' },
  Split_dryness:       { answerId: 'concern_splitends', coupon: '' },
  None:                { answerId: 'concern_mixed',     coupon: '' },
};

// Radio group name -> question meta (in step order). Only concern carries an AC field
// (field_8, the value the React quizzes use); the other questions have different answer
// buckets, so we send their labels to Mixpanel + rawAnswers only and leave shared AC
// dropdown fields untouched.
var QUESTIONS = [
  { group: 'options',  qid: 'hairConcern',     q: 'What best describes your hair problems?',       mp: 'Hair Concern Type', ac: '8' },
  { group: 'option1',  qid: 'age',             q: 'How old are you?',                               mp: 'Age Cohort' },
  { group: 'option2',  qid: 'currentRoutine',  q: 'What do you currently do for your hair?',        mp: 'Haircare Background' },
  { group: 'option3',  qid: 'shampooSpending', q: 'How much do you spend on a bottle of shampoo?',  mp: 'Spending' },
  { group: 'option4',  qid: 'diet',            q: 'What best describes your diet?',                 mp: 'Diet' },
  { group: 'option6',  qid: 'hairMyth',        q: 'Which of these hair care myths do you believe?', mp: 'hairMyth' },
  { group: 'option7',  qid: 'hairType',        q: 'Which hair type do you have?',                   mp: 'Hair Type' },
];
var GROUP_META = {};
QUESTIONS.forEach(function (q, i) { q.pos = i; GROUP_META[q.group] = q; });
var EMAIL_STEP = QUESTIONS.length + 1; // intro(0) + N questions + email

// ---- state -----------------------------------------------------------------
var answers = {}; // questionId -> { answerId, label }
var selectedEmail = '';
var selectedFirstname = '';
var selectedLastname = '';
var quizViewedFired = false;
var quizStartedFired = false;
var quizCompletedFired = false;

// ---- tracking (GA via window.dataLayer — the shape GTM relays to Mixpanel/Converge) ----
function trackGA(event, extra) {
  try {
    window.dataLayer = window.dataLayer || [];
    var payload = { event: event, event_category: 'Quiz', position: null, question_id: '', question: '', selected_answer: null };
    if (extra) { for (var k in extra) { if (Object.prototype.hasOwnProperty.call(extra, k)) payload[k] = extra[k]; } }
    window.dataLayer.push(payload);
  } catch (e) { /* never break the quiz over tracking */ }
}

function fireQuizViewed() {
  if (quizViewedFired) return; quizViewedFired = true;
  trackGA('Quiz Viewed', { position: 0 });
}
function fireQuizStarted() {
  if (quizStartedFired) return; quizStartedFired = true;
  var first = QUESTIONS[0];
  trackGA('Quiz Started', { position: 0, question_id: first.qid, question: first.q });
}
function fireQuizCompleted() {
  if (quizCompletedFired) return; quizCompletedFired = true;
  trackGA('Quiz Completed', { position: EMAIL_STEP, question: 'Contact Details Form' });
}

// ---- helpers ---------------------------------------------------------------
function labelFor(input) {
  if (!input) return '';
  var l = document.querySelector('label[for="' + input.id + '"]');
  return l ? l.textContent : '';
}
// Strip leading emoji/symbols so profile + event values are clean text.
function cleanLabel(s) { return (s || '').replace(/^[^A-Za-z0-9$]+/, '').trim(); }

function getCheckedInput(group) { return document.querySelector('input[name="' + group + '"]:checked'); }

// Helper to get the value of a cookie (jQuery-cookie sets a plain value, no decode needed).
function getCookieValue(cookieName) {
  var name = cookieName + '=';
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf(name) === 0) return cookie.substring(name.length, cookie.length);
  }
  return '';
}

// split name function
function splitName(fullName) {
  if (typeof fullName !== 'string') return null;
  var nameParts = fullName.trim().split(' ');
  if (nameParts.length < 1) return null;
  var firstName = nameParts[0];
  var lastName = nameParts.slice(1).join(' ');
  return [firstName, lastName];
}

// ---- answer capture + per-question event -----------------------------------
function captureAnswer(input) {
  var meta = GROUP_META[input.name];
  if (!meta) return;
  fireQuizStarted();
  var rawLabel = labelFor(input);
  var label = cleanLabel(rawLabel);
  var answerId = label;
  if (meta.qid === 'hairConcern') {
    var m = CONCERN_MAP[input.value] || {};
    answerId = m.answerId || label;
  }
  answers[meta.qid] = { answerId: answerId, label: label };
  trackGA('Question Answered', { position: meta.pos, question_id: meta.qid, question: meta.q, selected_answer: [answerId] });
}

function concernCoupon() {
  var c = answers.hairConcern;
  if (!c) return '';
  for (var k in CONCERN_MAP) {
    if (CONCERN_MAP[k].answerId === c.answerId) return CONCERN_MAP[k].coupon;
  }
  return '';
}

// ---- checkout URL (concern coupon + billing prefill + Converge ids) ---------
function buildCheckoutUrl(email, firstName, lastName) {
  var params = [];
  if (email) params.push('billing_email=' + encodeURIComponent(email));
  if (firstName) params.push('billing_first_name=' + encodeURIComponent(firstName));
  if (lastName) params.push('billing_last_name=' + encodeURIComponent(lastName));
  var coupon = concernCoupon();
  if (coupon) params.push('aero-coupons=' + coupon);
  var uid = getCookieValue('__cvg_uid');
  if (uid) params.push('__cvg_uid=' + encodeURIComponent(uid));
  var sid = getCookieValue('__cvg_sid');
  if (sid) params.push('__cvg_sid=' + encodeURIComponent(sid));
  return CHECKOUT_BASE + (params.length ? '?' + params.join('&') : '');
}

// ---- webhook payload for the quiz-submissions worker ------------------------
function buildWorkerPayload(firstName, lastName, email) {
  var name = (firstName + ' ' + lastName).trim();
  var rawAnswers = [];
  var mixpanel = { $name: name, $email: email };
  var activeCampaign = {};
  QUESTIONS.forEach(function (meta) {
    var a = answers[meta.qid];
    if (!a) return;
    rawAnswers.push({ questionId: meta.qid, answerIds: [a.answerId] });
    if (meta.mp) mixpanel[meta.mp] = a.answerId;
    if (meta.ac) activeCampaign['field_' + meta.ac] = a.answerId; // concern -> field_8 (standard answerId)
  });
  return {
    name: name, firstName: firstName, lastName: lastName, email: email,
    quizData: { rawAnswers: rawAnswers },
    activeCampaign: activeCampaign,
    mixpanel: mixpanel,
  };
}

function postWorker(payload) {
  try {
    return fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': WEBHOOK_SECRET },
      body: JSON.stringify(payload),
      keepalive: true,
    }).then(function (r) { return r.ok; }).catch(function () { return false; });
  } catch (e) { return Promise.resolve(false); }
}

// ---- client Converge "Completed Quiz" (same as React contract, fires on submit) ----
function cvgCompletedQuiz(email, name) {
  try {
    if (typeof window !== 'undefined' && window.cvg) {
      window.cvg({
        method: 'event',
        event: 'Completed Quiz',
        properties: { answers: answers, name: name, email: email },
        aliases: ['urn:email:' + email],
        profileProperties: { $email: email },
      });
    }
  } catch (e) { /* messaging must never break the quiz */ }
}

// ---- personalized result copy (UNCHANGED from the original) -----------------
function proocessResultLogic(content, first_name) {
  if (content === '😑 Split ends, frizz, and dryness') {
    return `

        Based on your answers, we’ve identified a <u>SIMPLE haircare routine</u> to repair your damaged hair and achieve silky ends... so you can go through the day with confidence every day!
        <br/><br/>

        <b>Don't worry, this ISN'T some ultra strict, long or complicated routine...</b>
        <br/><br/>

        ✅ It only takes 10 minutes a day to complete and you’ll get </u><b>VISIBLE results in the first few days.</b>

        <br/><br/>

        ✅ Less time in the bathroom, more time enjoying <b>soft and shiny hair.</b>

        <br/><br/>

        ✅ Watch the <b>lessons from anywhere</b> with online access.

        <br/><br/>
        ✅ 💰 Invest in your hair NOW and <b>save hundreds</b> on products and salon treatments that you won’t need.
        <br><br>
        ✅ This Haircare Challenge has already <b>helped over 200,000+ women</b> regain better hair.
        <br><br>

        Join now to get a life with dense, long, beautiful hair and feel confident every day. You deserve this ${first_name}
        `;
  } else if (content === '😣 Hair loss or hair thinning') {
    return `

        Based on your answers, we’ve identified a SIMPLE haircare routine to increase new hair growth and reduce your hair loss.
        <br/><br/>

        <b>It’s NOT an ultra strict, long or complicated routine...</b>
        <br/><br/>

        ✅ It only takes 10 minutes a day to complete and you’ll get </u>VISIBLE results in the first few days.

        <br/><br/>

        ✅  <b>You’ll stop worrying about going bald one day </b>or questioning if other people notice your thinning hair...</b>

        <br/><br/>

        ✅ Watch lessons crafted by hair loss experts from anywhere with online access.

        <br/><br/>
        ✅ Invest in your hair now and <b>save hundreds on products and salon treatments</b> that you won’t need.
        <br><br>
        ✅ This Haircare Challenge has already helped over 200,000+ women regain better hair.
        <br><br>

        Join now to get a life with dense, long and silky hair and feel confident every day.<br><br> You deserve this ${first_name}
        `;
  } else if (content === '😕 Damage from dye, heat, or chemical treatments') {
    return `
        Based on your answers, we've identified a SIMPLE haircare routine to bring back shine and softness to your damaged dry hair...
        <br/><br/>

        <b>Don't worry, this ISN'T some ultra strict, long or complicated routine...</b>
        <br/><br/>

        ✅ It only takes 10 minutes a day to complete and you’ll get <b>VISIBLE results in the first few days.</b>
        <br><br>
        ✅ <b>Stronger hair that will resist damage even with styling and coloring.</b>
        <br/><br/>

        ✅ Watch lessons crafted by hair loss experts from anywhere with online access.

        <br/><br/>
        ✅ Invest in your hair now and <b>save hundreds on products and salon treatments</b> that you won’t need.
        <br><br>
        ✅ This Haircare Challenge has already helped over 200,000+ women regain better hair.
        <br><br>

        Join now to get a life with vibrant, smooth and shiny hair styles that will make you feel fabulous and unique every day.<br><br> You deserve this ${first_name}

        `;
  } else if (content === '😫 Irritation or dandruff') {
    return `

        Based on your answers, we’ve identified a <u>SIMPLE haircare routine</u> to trade this ugly, embarrassing discomfort for a fresh and healthy scalp ... so you can go through the day with confidence every day!

        <br/><br/>

        <b>Don't worry, this ISN'T some ultra strict, long or complicated routine...</b>
        <br/><br/>

        ✅ It only takes 10 minutes a day to complete and you’ll get <b>VISIBLE results in the first few days.</b>
        <br><br>
        ✅ <b>Healthier, more comfortable scalp in a few washes only.</b>
        <br><br>
          ✅ Watch the <b>lessons from anywhere</b> with online access.
          <br><br>

         ✅ 💰 Invest in your hair NOW and <b>save hundreds</b> on products and salon treatments that you won’t need.
        <br><br>

        ✅ This Haircare Challenge has already <b>helped over 200,000+ women</b> regain better hair.
        <br><br>

        Join now to get a life with dense, long, beautiful hair and feel confident every day. You deserve this ${first_name}
        `;
  } else {
    return `

        Based on your answers, we’ve identified a <u>SIMPLE haircare routine</u> to bring back your hair’s shine and density from the old days... so you can go through the day with confidence every day!

        <br/><br/>

        <b>Don't worry, this ISN'T some ultra strict, long or complicated routine...</b>
        <br/><br/>

        ✅ It only takes 10 minutes a day to complete and you’ll get <b>VISIBLE results in the first few days.</b>
        <br><br>
        ✅ <b>Reduced hair loss, activated hair growth and better-looking hair.</b>
        <br><br>
          ✅ Watch the <b>lessons from anywhere</b> with online access.
          <br><br>

         ✅ 💰 Invest in your hair NOW and <b>save hundreds</b> on products and salon treatments that you won’t need.
        <br><br>

        ✅ This Haircare Challenge has already <b>helped over 200,000+ women</b> regain better hair.
        <br><br>

        Join now to get a life with dense, long, beautiful hair and feel confident every day. You deserve this ${first_name}

        `;
  }
}

// ---- jQuery-steps wiring (form flow — unchanged behavior, + Quiz Started/Completed) ----
(function ($) {
  var form = $('#signup-form');

  form.steps({
    headerTag: 'h3',
    bodyTag: 'fieldset',
    transitionEffect: 'fade',
    labels: { previous: 'Prev', next: 'Next', finish: 'Submit', current: '' },
    titleTemplate: '<h3 class="title">#title#</h3>',
    onStepChanging: function (event, currentIndex, newIndex) {
      if (currentIndex === 0) {
        form.find('.content .body .step-current-content').find('.step-inner').removeClass('.step-inner-0');
        form.find('.content .body .step-current-content').find('.step-inner').removeClass('.step-inner-1');
        form.find('.content .body .step-current-content').append('<span class="step-inner step-inner-' + currentIndex + '"></span>');
      }
      if (currentIndex === 1) {
        form.find('.content .body .step-current-content').find('.step-inner').removeClass('step-inner-0').addClass('step-inner-' + currentIndex + '');
      }
      // The contact-details step is the last one — fire GA "Quiz Completed" when it's viewed.
      if (newIndex === EMAIL_STEP) fireQuizCompleted();
      return true;
    },
    onFinished: function () {},
  });

  $('.radio-option').on('click', function () {
    form.steps('next');
  });

  $('.button-next').on('click', function () {
    fireQuizStarted();
    form.steps('next');
  });

  $('.lg-join-button').on('click', function () {
    // Process joining the Challenge (result screen CTA) -> personalized checkout.
    handleDataSubmission(selectedEmail, selectedFirstname, selectedLastname);
  });

  $('.button-prev').on('click', function () {
    form.steps('previous');
  });

  $('.toggle-password').on('click', function () {
    $(this).toggleClass('zmdi-eye zmdi-eye-off');
    var input = $($(this).attr('toggle'));
    input.attr('type', input.attr('type') === 'password' ? 'text' : 'password');
  });

  // Capture each answer (and fire "Question Answered") on selection — keyed by question,
  // replacing the original hand-indexed listeners (which skipped index 2).
  $(document).on('change', 'input.radio-option[type="radio"]', function () {
    if (this.checked) captureAnswer(this);
  });
})(jQuery);

// ---- submit (contact details) -> worker webhook + result screen -------------
function handleSubmit(event) {
  event.preventDefault();
  scrollToTop();

  var concernInput = getCheckedInput('options');
  var fnInput = document.querySelector('input[name="full_name"]');
  var emInput = document.querySelector('input[name="email"]');

  if (!fnInput || !emInput || !fnInput.value || !emInput.value) {
    console.log('Error Data');
    return;
  }

  var fullName = fnInput.value;
  var parts = splitName(fullName) || [fullName, ''];
  selectedFirstname = parts[0];
  selectedLastname = parts[1];
  selectedEmail = emInput.value;

  loaderShow();

  // GA "Quiz Submitted"
  trackGA('Quiz Submitted', { position: EMAIL_STEP, q_name: fullName, q_email: selectedEmail });

  // Persist for cross-page (parity with the original).
  try {
    $.cookie('quiz_data', JSON.stringify({ answers: answers, name: fullName, email: selectedEmail }), { expires: 90, path: '/', domain: '.hairqare.co' });
  } catch (e) { /* ignore */ }

  // Client Converge "Completed Quiz".
  cvgCompletedQuiz(selectedEmail, fullName);

  // POST to the worker -> AC contact + Mixpanel profile + Converge "Signed Up" (server-side).
  postWorker(buildWorkerPayload(selectedFirstname, selectedLastname, selectedEmail));

  // Personalized result copy (keyed on the RAW concern label, incl. emoji — unchanged logic).
  var resultEl = document.getElementById('result-text');
  if (resultEl) resultEl.innerHTML = proocessResultLogic(labelFor(concernInput), selectedFirstname);

  // Hide the quiz form; the loader reveals the result (#content1) on completion.
  var formContent = document.getElementById('content');
  if (formContent) formContent.style.display = 'none';

  // GA "Viewed Results Page".
  trackGA('Viewed Results Page', { position: 19, question: 'Result Page' });
}

// ---- result CTA -> checkout -------------------------------------------------
function handleDataSubmission(email, firstName, lastName) {
  trackGA('Go to  checkout', { position: 19 });
  scrollToTop();
  window.top.location.href = buildCheckoutUrl(email, firstName, lastName);
}

// ---- skip button (no answers -> conditioner-only checkout) ------------------
function handleSkipButton() {
  trackGA('Go to  checkout', { position: 0 });
  window.top.location.href = buildCheckoutUrl('', '', '');
}

// ---- loader (UNCHANGED from the original) -----------------------------------
function loaderShow() {
  var loader = document.getElementById('loader');
  var content2 = document.getElementById('content1');
  var progressValue = loader.querySelector('.loader-progress-value');
  var circularProgress = loader.querySelector('.loader-circular-progress');
  var loader_checkpoints = loader.querySelectorAll('.loader-checkpoint');

  if (!loader || !content2 || !progressValue || !circularProgress) {
    console.error('One or more elements not found');
    return;
  }

  loader.style.display = 'flex';
  content2.style.display = 'none';

  var progressStartValue = 0,
    progressEndValue = 100,
    speed = 30;

  var progress = setInterval(function () {
    progressStartValue++;
    progressValue.textContent = `${progressStartValue}%`;
    circularProgress.style.background = `conic-gradient(#17b26a ${progressStartValue * 3.6}deg, #ededed 0deg)`;

    loader_checkpoints.forEach(function (checkpoint) {
      if (progressStartValue >= checkpoint.getAttribute('data-value')) {
        checkpoint.style.opacity = 1;
        checkpoint.classList.add('completed');
      }
    });

    if (progressStartValue == progressEndValue) {
      clearInterval(progress);
      loader.style.display = 'none';
      content2.style.display = 'block';
    }
  }, speed);
}

function scrollToTop() {
  var myElement = document.getElementById('scroll-top');
  if (myElement) myElement.scrollTop = 0;
}

document.addEventListener('DOMContentLoaded', function () {
  var loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';

  var content = document.getElementById('content');
  if (content) content.style.display = 'block';

  // GA "Quiz Viewed" — once, on first paint (same as the React quizzes' first-screen view).
  fireQuizViewed();
});
