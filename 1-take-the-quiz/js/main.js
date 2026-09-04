// Create an array to store the selected answers  [Global Variable]
const selectedAnswers = [];
let selectedFirstname = '';
let selectedLastname = '';
let selectedEmail = '';

(function ($) {
  var form = $('#signup-form');

  form.steps({
    headerTag: 'h3',
    bodyTag: 'fieldset',
    transitionEffect: 'fade',
    labels: {
      previous: 'Prev',
      next: 'Next',
      finish: 'Submit',
      current: '',
    },
    titleTemplate: '<h3 class="title">#title#</h3>',
    onStepChanging: function (event, currentIndex, newIndex) {
      if (currentIndex === 0) {
        form
          .find('.content .body .step-current-content')
          .find('.step-inner')
          .removeClass('.step-inner-0');
        form
          .find('.content .body .step-current-content')
          .find('.step-inner')
          .removeClass('.step-inner-1');
        form
          .find('.content .body .step-current-content')
          .append(
            '<span class="step-inner step-inner-' + currentIndex + '"></span>'
          );
      }
      if (currentIndex === 1) {
        form
          .find('.content .body .step-current-content')
          .find('.step-inner')
          .removeClass('step-inner-0')
          .addClass('step-inner-' + currentIndex + '');
      }
      return true;
    },
    onFinished: function (event, currentIndex) {
      console.log('Hello');
    },
  });

  $('.radio-option').on('click', function () {
    // Manually trigger the next step change
    form.steps('next');
  });

  $('.button-next').on('click', function () {
    // Manually trigger the next step change
    form.steps('next');
  });

  $('.lg-join-button').on('click', function () {
    // Process Joining the Challenge
    if (selectedFirstname != '') {
      handleDataSubmission(
        selectedEmail,
        selectedFirstname,
        selectedLastname,
        selectedAnswers
      );
    }
  });

  $('.button-prev').on('click', function () {
    // Manually trigger the next step change
    // console.log('back');
    form.steps('previous');
  });
  $('.toggle-password').on('click', function () {
    $(this).toggleClass('zmdi-eye zmdi-eye-off');
    var input = $($(this).attr('toggle'));
    if (input.attr('type') == 'password') {
      input.attr('type', 'text');
    } else {
      input.attr('type', 'password');
    }
  });
})(jQuery);

// split name function
function splitName(fullName) {
  // Check if fullName is a string
  if (typeof fullName !== 'string') {
    console.log('Invalid name format. Please enter a name.');
    return null;
  }

  // Split the full name into individual words
  const nameParts = fullName.split(' ');

  // Check if the name has at least one part
  if (nameParts.length < 1) {
    console.log('Invalid name format. Please enter a name.');
    return null;
  }

  // Extract the first name as the first word
  const firstName = nameParts[0];

  // Extract the last name by joining the remaining words
  const lastName = nameParts.slice(1).join(' ');

  return [firstName, lastName];
}

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
        Based on your answers, we're identified a SIMPLE haircare routine to bring back shine and softness to your damaged dry hair...
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

        Join now to get a life with vibrant, smooth and shiny hair styles that will make feel fabulous and unique every day.<br><br> You deserve this ${first_name}

        `;
  } else if (content === '😫 Irritation or dandruff') {
    return `

        Based on your answers, we’ve identified a <u>SIMPLE haircare routine</u> to trade this ugly,  embarrassing discomfort for a fresh and healthy scalp ... so you can go through the day with confidence every day!

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

// Helper function to get the value of a cookie
function getCookieValue(cookieName) {
  var name = cookieName + '=';
  // we dont need decodeURIComponent operation since it's not necessary when using the jQuery Cookie plugin.
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return '';
}

// Radio Button Change Listener Event.
// Get the radio button groups
const optionGroup = document.getElementsByName('options');
const option1Group = document.getElementsByName('option1');
const option2Group = document.getElementsByName('option2');
const option3Group = document.getElementsByName('option3');
const option4Group = document.getElementsByName('option4');
const option6Group = document.getElementsByName('option6');
const option7Group = document.getElementsByName('option7');

// Function to handle the radio button change event
function handleRadioChange(event, num) {
  const selectedOption = event.target;
  const selectedLabel = document.querySelector(
    `label[for="${selectedOption.id}"]`
  ).textContent;
  selectedAnswers[num] = selectedLabel;
  console.log('Answer picked', selectedAnswers);
  //   console.log("Number", num);
}

// Add event listeners to radio button groups
optionGroup.forEach((radio) => {
  // Add event listener to each radio button
  radio.addEventListener('change', (event) => {
    handleRadioChange(event, 0);
  });
});

option1Group.forEach((radio) => {
  radio.addEventListener('change', (event) => {
    handleRadioChange(event, 1);
  });
});

option2Group.forEach((radio) => {
  radio.addEventListener('change', (event) => {
    handleRadioChange(event, 3);
  });
});

option3Group.forEach((radio) => {
  radio.addEventListener('change', (event) => {
    handleRadioChange(event, 4);
  });
});

option4Group.forEach((radio) => {
  radio.addEventListener('change', (event) => {
    handleRadioChange(event, 5);
  });
});

option6Group.forEach((radio) => {
  radio.addEventListener('change', (event) => {
    handleRadioChange(event, 6);
  });
});

option7Group.forEach((radio) => {
  radio.addEventListener('change', (event) => {
    handleRadioChange(event, 7);
  });
});

// ---- Lead webhook fix: bysa.app is dead (HTTP 500); send leads to the live
// quiz-submissions worker instead (AC contact + Mixpanel profile + Converge "Signed Up").
// This ONLY changes where leads are sent — the quiz flow, events, tags and checkout are
// untouched. The worker upserts by email, so sending on both submit + join is harmless. ----
var HQ_WORKER_URL = 'https://quiz-submissions-worker.dndgroup.workers.dev/api/v1/quiz/submit';
var HQ_WORKER_SECRET = 'a6e3a73e9d1d60d438efad6b5512b5a75db65c3c1f78f90ed9aeccfde3ac6969';
var HQ_CONCERN_MAP = {
  Hair_loss: 'concern_hairloss', Irritation_dandruff: 'concern_scalp',
  Damage_dye: 'concern_damage', Split_dryness: 'concern_splitends', None: 'concern_mixed',
};
var HQ_QMAP = {
  options: { qid: 'hairConcern', mp: 'Hair Concern Type', ac: '8' },
  option1: { qid: 'age', mp: 'Age Cohort' },
  option2: { qid: 'currentRoutine', mp: 'Haircare Background' },
  option3: { qid: 'shampooSpending', mp: 'Spending' },
  option4: { qid: 'diet', mp: 'Diet' },
  option6: { qid: 'hairMyth', mp: 'hairMyth' },
  option7: { qid: 'hairType', mp: 'Hair Type' },
};
function hqCleanLabel(s) { return (s || '').replace(/^[^A-Za-z0-9$]+/, '').trim(); }
function hqLabelFor(input) { if (!input) return ''; var l = document.querySelector('label[for="' + input.id + '"]'); return l ? l.textContent : ''; }
function hqSendLead(firstName, lastName, email) {
  try {
    if (!email) return;
    var name = ((firstName || '') + ' ' + (lastName || '')).trim();
    var rawAnswers = [], mp = { $name: name, $email: email }, ac = {};
    Object.keys(HQ_QMAP).forEach(function (group) {
      var input = document.querySelector('input[name="' + group + '"]:checked');
      if (!input) return;
      var meta = HQ_QMAP[group], val = hqCleanLabel(hqLabelFor(input));
      if (meta.qid === 'hairConcern') { val = HQ_CONCERN_MAP[input.value] || val; }
      rawAnswers.push({ questionId: meta.qid, answerIds: [val] });
      if (meta.mp) mp[meta.mp] = val;
      if (meta.ac) ac['field_' + meta.ac] = val;
    });
    fetch(HQ_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': HQ_WORKER_SECRET },
      body: JSON.stringify({ name: name, firstName: firstName, lastName: lastName, email: email, quizData: { rawAnswers: rawAnswers }, activeCampaign: ac, mixpanel: mp }),
      keepalive: true,
    }).catch(function () {});
  } catch (e) { /* never break the quiz */ }
}

function handleDataSubmission(email, firstName, lastName, answers) {
  // Get the reference to the loader element
  const loader = document.getElementById('loader');
  const content2 = document.getElementById('content1');

  // Show the loader
  loader.style.display = 'block';
  content2.style.display = 'none';

  scrollToTop();

  // Run the loader for 2 seconds
  setTimeout(() => {
    // Hide the loader after 2 seconds
    loader.style.display = 'none';
    content2.style.display = 'block';
  }, 8000);

  // Save user's answers, name, and email to cookie with 90 day expiry
  var data = {
    answers: answers,
    name: `${firstName} ${lastName}`,
    email: email,
  };

  $.cookie('quiz_data', JSON.stringify(data), {
    expires: 90,
    path: '/',
    domain: '.hairqare.co',
  });
  // $.cookie('quiz_data', JSON.stringify(data), { expires: 90, path: '/'});

  const cvgTrack = ({
    eventName,
    properties,
    eventId,
    profileProperties,
    aliases,
  }) => {
    if (typeof window !== 'undefined' && window['cvg']) {
      window['cvg']({
        method: 'event',
        event: eventName,
        properties,
        eventId,
        profileProperties,
        aliases,
      });
    }
  };
  // Track a 'Completed Quiz' event
  cvgTrack({
    eventName: 'Completed Quiz',
    properties: {
      answers: answers,
      name: `${firstName} ${lastName}`,
      email: email,
    },
    aliases: ['urn:email:' + email],
    profileProperties: {
      $email: email,
    },
  });

  // Prepare redirect URL
  var cvgUid = getCookieValue('__cvg_uid');
  // print(cvgUid, 'COOKIEEE TRACCKING'); - $39 checkout
  var redirectUrl =
    'https://checkout.hairqare.co/buy/hairqare-challenge-save-90/?__cvg_uid=' +
    cvgUid +
    '&billing_email=' +
    encodeURIComponent(email) +
    '&billing_first_name=' +
    encodeURIComponent(firstName) +
    '&billing_last_name=' +
    encodeURIComponent(lastName);

  // Send the lead to the live worker (bysa.app is dead), then continue to checkout.
  hqSendLead(firstName, lastName, email);
  window.top.location.href = redirectUrl;

  scrollToTop();
}

function handleSkipButton() {
  var cvgUid = getCookieValue('__cvg_uid');
  // print(cvgUid, 'COOKIEEE TRACCKING'); - $39 checkout
  var redirectUrl = `https://checkout.hairqare.co/buy/hairqare-challenge-save-90/?__cvg_uid=${cvgUid}`;
  return (window.top.location.href = redirectUrl);
}

function handleSubmit(event) {
  event.preventDefault(); // Prevents the default form submission behavior

  scrollToTop();
  loaderShow();
  console.log(selectedAnswers, 'Global Variable');
  // Get all the data
  var form_content = document.getElementById('content');
  var result = document.getElementById('content1');
  var selectedOption = document.querySelector('input[name="options"]:checked');

  var selectedFn = document.querySelector('input[name="full_name"]');
  var selectedEm = document.querySelector('input[name="email"]');

  const resultScreenId = document.getElementById('result-text');

  // Check if a radio button is selected
  if (selectedOption && selectedFn && selectedEm) {
    var question1 = document.querySelector(
      'label[for="' + selectedOption.id + '"]'
    );
    const questions_logic_payload = {
      hair_problem: question1.textContent,
    };

    const [firstName, lastName] = splitName(selectedFn.value);

    const user_profile = {
      firstname: firstName,
      lastname: lastName,
      email: selectedEm.value,
      fullname: `${firstName} ${lastName}`,
    };

    // Store the object in localStorage
    localStorage.setItem('user_profile', JSON.stringify(user_profile));

    // Retrieve the localStorage data
    const storedData = localStorage.getItem('user_profile');

    // Check if data exists in localStorage
    if (storedData) {
      // Parse the stored data from a string to an object
      const user = JSON.parse(storedData);

      // Print the localStorage data
      console.log(user);
    } else {
      console.log('No data found in localStorage.');
    }

    // wHAT Are YoU DoIng SaMUeL??
    selectedEmail = user_profile?.email;
    selectedFirstname = user_profile?.firstname;
    selectedLastname = user_profile?.lastname;

    // console.log(result_screen);
    var data_upload = {
      answers: selectedAnswers,
      name: `${firstName} ${lastName}`,
      email: selectedEm.value,
    };
    // Send the lead to the live worker (bysa.app is dead), then render the result.
    hqSendLead(firstName, lastName, selectedEm.value);
    const result_screen = proocessResultLogic(
      questions_logic_payload.hair_problem.toString(),
      firstName
    );
    resultScreenId.innerHTML = result_screen;

    // Perform any further operations with the selected value
    form_content.style.display = 'none';
  } else {
    console.log('Error Data');
  }
}

function loaderShow() {
  const loader = document.getElementById('loader');
  const content2 = document.getElementById('content1');
  const progressValue = loader.querySelector('.loader-progress-value');
  const circularProgress = loader.querySelector('.loader-circular-progress');
  const loader_checkpoints = loader.querySelectorAll('.loader-checkpoint');

  if (!loader || !content2 || !progressValue || !circularProgress) {
    console.error('One or more elements not found');
    return;
  }

  loader.style.display = 'flex'; // Show loader
  content2.style.display = 'none'; // Hide content

  let progressStartValue = 0,
    progressEndValue = 100,
    speed = 30;

  let progress = setInterval(() => {
    progressStartValue++;
    progressValue.textContent = `${progressStartValue}%`;
    circularProgress.style.background = `conic-gradient(#17b26a ${
      progressStartValue * 3.6
    }deg, #ededed 0deg)`;

    loader_checkpoints.forEach((checkpoint) => {
      if (progressStartValue >= checkpoint.getAttribute('data-value')) {
        checkpoint.style.opacity = 1;
        checkpoint.classList.add('completed');
      }
    });

    if (progressStartValue == progressEndValue) {
      clearInterval(progress);
      loader.style.display = 'none'; // Hide loader
      content2.style.display = 'block'; // Show content
    }
  }, speed);
}

function scrollToTop() {
  var myElement = document.getElementById('scroll-top');
  myElement.scrollTop = 0;
}

document.addEventListener('DOMContentLoaded', function () {
  // Hide the loader
  var loader = document.getElementById('loader');
  loader.style.display = 'none';

  // Show the content
  var content = document.getElementById('content');
  content.style.display = 'block';

  // Perform your JavaScript action here
  // You can add your code below this comment
});
