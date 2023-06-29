// Create an array to store the selected answers  [Global Variable]
const selectedAnswers = [];
let selectedFirstname = '';
let selectedLastname = '';
let selectedEmail = '';

(function($) {

    var form = $("#signup-form");

    form.steps({
        headerTag: "h3",
        bodyTag: "fieldset",
        transitionEffect: "fade",
        labels: {
            previous: 'Prev',
            next: 'Next',
            finish: 'Submit',
            current: ''
        },
        titleTemplate: '<h3 class="title">#title#</h3>',
        onStepChanging: function (event, currentIndex, newIndex)
        {
            if(currentIndex === 0) {

                form.find('.content .body .step-current-content').find('.step-inner').removeClass('.step-inner-0');
                form.find('.content .body .step-current-content').find('.step-inner').removeClass('.step-inner-1');
                form.find('.content .body .step-current-content').append('<span class="step-inner step-inner-' + currentIndex + '"></span>');
            }
            if(currentIndex === 1) {
                form.find('.content .body .step-current-content').find('.step-inner').removeClass('step-inner-0').addClass('step-inner-'+ currentIndex + '');
            }
            return true;
        },
        onFinished: function(event, currentIndex) {
            console.log('Hello');
        }
    });

    $('.radio-option').on('click', function() {
        // Manually trigger the next step change
        form.steps('next');
      });

      $('.button-next').on('click', function() {
        // Manually trigger the next step change
        form.steps('next');
      });

      $('.lg-join-button').on('click', function() {
        // Process Joining the Challenge
        if (selectedFirstname != '') {
            handleDataSubmission(selectedEmail, selectedFirstname, selectedLastname, selectedAnswers);
        }
      });

      $('.button-prev').on('click', function() {
        // Manually trigger the next step change
        // console.log('back');
        form.steps('previous');
      });
    $(".toggle-password").on('click', function() {

        $(this).toggleClass("zmdi-eye zmdi-eye-off");
        var input = $($(this).attr("toggle"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

})(jQuery);

// split name function
function splitName(fullName) {
  // Check if fullName is a string
  if (typeof fullName !== 'string') {
    console.log("Invalid name format. Please enter a name.");
    return null;
  }

  // Split the full name into individual words
  const nameParts = fullName.split(' ');

  // Check if the name has at least one part
  if (nameParts.length < 1) {
    console.log("Invalid name format. Please enter a name.");
    return null;
  }

  // Extract the first name as the first word
  const firstName = nameParts[0];

  // Extract the last name by joining the remaining words
  const lastName = nameParts.slice(1).join(' ');

  return [firstName, lastName];
};

function proocessResultLogic(content, first_name) {
    if (content === '😑 Split ends, frizz, and dryness') {
        return `

        Based on your answers, we’ve identified a <u>SIMPLE haircare routine</u> to repair your damaged hair and achieve silky ends... so you can go through the day with confidence every day!
        <br/><br/>

        <b>Don't worry, this ISN'T some ultra strict, long or complicated routine... and you won’t need any fancy salon treatments or expensive products either.</b>
        <br/><br/>

        🏆 Instead, we have a simple and quick routine that you can do in <u>a few minutes a day</u> that will help you stop your split ends, tame frizz and achieve luscious and healthy locks in less than two weeks.

        <br/><br/>

        🥇 In the 14-Day Haircare Challenge, <b>world renown haircare instructor Sarah Tran</b> will give you bite-sized daily videos with expert-quality advice which you can easily apply in the comfort of your own home.

        <br/><br/>

        (These same tips have already helped <u>thousands of women</u> get the hair of their dreams.)

        <br/><br/>

        You deserve this, ${first_name}
        `;
    } else if (content === '😣 Hair loss or hair thinning') {
        return `
        Based on your answers, we've identified a <u>SIMPLE haircare routine</u> to visibly reduce your hair loss and regain denser and voluminous hair… so you can go through the day with confidence every day!

       <b>Don't worry, this ISN'T some ultra strict, long or complicated routine... and you won’t need any fancy salon treatments or expensive products either.</b>

        <br/><br/>

        🏆 Instead, we have a simple and quick routine that you can do in <u>a few minutes a day</u> that will help you revive your follicles and visibly reduce the number of hair you lose in less than two weeks.

        <br/><br/>

        🥇 In the 14-Day Haircare Challenge, <b>world renown haircare instructor Sarah Tran</b> will give you bite-sized daily videos with expert-quality advice which you can easily apply in the comfort of your own home.

        <br/><br/>

        (These same tips have already helped <u>thousands of women</u> solve their hair troubles.)

        <br/><br/>

        You deserve this, ${first_name}

        `;
    } else if (content === '😕 Damage from dye, heat, or chemical treatments') {
        return `
        Based on your answers, we're identified a <u>SIMPLE haircare routine</u> to stop your split ends, tame frizz and get you fabulous healthy hair… so you can go through the day with confidence every day!

        <br/><br/>

        <b>Don't worry, this ISN'T some ultra strict, long or complicated routine... and you won’t need any fancy salon treatments or expensive products either.</b>

        <br/><br/>

        🏆 Instead, we have a simple and quick routine that you can do in <u>a few minutes a day</u> that will help you stop the breakage, restore your hair and make it shine in less than two weeks.

        <br/><br/>

        🥇 In the 14-Day Haircare Challenge, <b>world renown haircare instructor Sarah Tran</b> will give you bite-sized daily videos with expert-quality advice which you can easily apply in the comfort of your own home.

        <br/><br/>

        (These same tips have already helped <u>thousands of women</u> get the hair of their dreams.)

        You deserve this, ${first_name}

        `;
    } else if (content === '😫 Irritation or dandruff') {
        return `

        Based on your answers, we’ve identified a <u>SIMPLE haircare routine</u> to trade this ugly,  embarrassing discomfort for a fresh and healthy scalp ... so you can go through the day with confidence every day!

        <br/><br/>

        <b>Don't worry, this ISN'T some ultra strict, long or complicated routine... and you won’t need any fancy salon treatments or expensive products either.</b>

        <br/><br/>

        🏆 Instead, we have a simple and quick routine that you can do in <u>a few minutes a day</u> that will help you stop the flakes and itchiness to achieve clean and voluminous locks in less than two weeks.

        <br/><br/>

        🥇 In the 14-Day Haircare Challenge, <b>world renown haircare instructor Sarah Tran</b> will give you bite-sized daily videos with expert-quality advice which you can easily apply in the comfort of your own home.

        <br/><br/>

        (These same tips have already helped <u>thousands of women</u> get the hair of their dreams.)

        <br/><br/>

        You deserve this, ${first_name}

        `;
    } else {
        return `

        Based on your answers, we’ve identified a <u>SIMPLE haircare routine</u> to bring back your hair’s shine and density from the old days... so you can go through the day with confidence every day!

        <br/><br/>

        <b>Don't worry, this ISN'T some ultra strict, long or complicated routine... and you won’t need any fancy salon treatments or expensive products either.</b>

        <br/><br/>

        🏆 Instead, we have a simple and quick routine that you can do in <u>a few minutes a day</u> that will help you stop your split ends, tame frizz and achieve luscious and healthy locks in less than two weeks.

        <br/><br/>

        🥇 In the 14-Day Haircare Challenge, <b>world renown haircare instructor Sarah Tran</b> will give you bite-sized daily videos with expert-quality advice which you can easily apply in the comfort of your own home.

        <br/><br/>

        (These same tips have already helped <u>thousands of women</u> get the hair of their dreams.)

        <br/><br/>

        You deserve this, ${first_name}

        `;
    }
}

 // Helper function to get the value of a cookie
 function getCookieValue(cookieName) {
    var name = cookieName + "=";
    // we dont need decodeURIComponent operation since it's not necessary when using the jQuery Cookie plugin.
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}



// Radio Button Change Listener Event.
// Get the radio button groups
const optionGroup = document.getElementsByName("options");
const option1Group = document.getElementsByName("option1");
const option2Group = document.getElementsByName("option2");
const option3Group = document.getElementsByName("option3");
const option4Group = document.getElementsByName("option4");
const option6Group = document.getElementsByName("option6");
const option7Group = document.getElementsByName("option7");


// Function to handle the radio button change event
function handleRadioChange(event) {
  const selectedOption = event.target;
  const selectedLabel = document.querySelector(`label[for="${selectedOption.id}"]`).textContent;
  selectedAnswers.push(selectedLabel);
}

// Add event listeners to radio button groups
optionGroup.forEach((radio) => {
    // console.log('listening');
  radio.addEventListener("change", handleRadioChange);
//   console.log('listened, ', selectedAnswers);

});

option1Group.forEach((radio) => {
  radio.addEventListener("change", handleRadioChange);
});

option2Group.forEach((radio) => {
  radio.addEventListener("change", handleRadioChange);
});

option3Group.forEach((radio) => {
    radio.addEventListener("change", handleRadioChange);
});

option4Group.forEach((radio) => {
    radio.addEventListener("change", handleRadioChange);
});

option6Group.forEach((radio) => {
    radio.addEventListener("change", handleRadioChange);
});

option7Group.forEach((radio) => {
    radio.addEventListener("change", handleRadioChange);
});

function handleDataSubmission (email, firstName, lastName, answers) {
    // Get the reference to the loader element
    const loader = document.getElementById("loader");
    const content2 = document.getElementById("content1");

    // Show the loader
    loader.style.display = "block";
    content2.style.display = "none";

    scrollToTop();

    // Run the loader for 2 seconds
    setTimeout(() => {
    // Hide the loader after 2 seconds
    loader.style.display = "none";
    content2.style.display = "block";
    }, 8000);

     // Save user's answers, name, and email to cookie with 90 day expiry
    var data = {
        answers: answers,
        name: `${firstName} ${lastName}`,
        email: email
    };

    $.cookie('quiz_data', JSON.stringify(data), { expires: 90, path: '/', domain: '.hairqare.co'});
    // $.cookie('quiz_data', JSON.stringify(data), { expires: 90, path: '/'});

    const cvgTrack = ({
        eventName,
        properties,
        eventId,
        profileProperties,
        aliases,
    }) => {
        if (typeof window !== "undefined" && window["cvg"]) {
            window["cvg"]({
                method: "event",
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
        eventName: "Completed Quiz",
        properties: {
            answers: answers,
            name: `${firstName} ${lastName}`,
            email: email
        },
        aliases: ["urn:email:" + email],
        profileProperties: {
            "$email": email
        }
    });

    // Prepare redirect URL
    var cvgUid = getCookieValue('__cvg_uid');
    // print(cvgUid, 'COOKIEEE TRACCKING');
    // https://checkout.hairqare.co/buy/hairqare-challenge-save-90/?__cvg_uid=1-2t1g9z33-lh76lqga&billing_email=test%40gmail.com&billing_first_name=Toby&billing_last_name=
    var redirectUrl = 'https://checkout.hairqare.co/buy/hairqare-challenge-save-90/?r__cvg_uid=' + cvgUid + '&billing_email=' + encodeURIComponent(email) + '&billing_first_name=' + encodeURIComponent(firstName) + '&billing_last_name=' + encodeURIComponent(lastName);

    // Redirect user to next page immediately
    window.top.location.href = redirectUrl;

    // Post user's answers, name, and email to webhook
    $.ajax({
        url: 'https://hook.us1.make.com/86fb3m8fp0kbqtjusi14r063yrdmnuug',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function () {

        },
        error: function () {
            // Failed webhook request; handle as needed
        }
    });

    scrollToTop();
}

function handleSubmit(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    scrollToTop();
    loaderShow();
    console.log(selectedAnswers, 'Global Variable')
    // Get all the data
    var form_content = document.getElementById("content");
    var result = document.getElementById("content1");
    var selectedOption = document.querySelector('input[name="options"]:checked');

    var selectedFn = document.querySelector('input[name="full_name"]');
    var selectedEm = document.querySelector('input[name="email"]');

    const resultScreenId = document.getElementById("result-text");


    // Check if a radio button is selected
    if (selectedOption && selectedFn && selectedEm) {
        var question1 = document.querySelector('label[for="' + selectedOption.id + '"]');
        const questions_logic_payload = {
            hair_problem: question1.textContent
        };

        const [firstName, lastName] = splitName(selectedFn.value);

        const user_profile = {
            firstname: firstName,
            lastname: lastName,
            email: selectedEm.value,
        }
        // wHAT Are YoU DoIng SaMUeL??
        selectedEmail = user_profile?.email;
        selectedFirstname = user_profile?.firstname;
        selectedLastname = user_profile?.lastname;

        // console.log("Selected value: " + questions_logic_payload.hair_problem.toString(), 'Profile: ', user_profile);
        const result_screen = proocessResultLogic(questions_logic_payload.hair_problem.toString(), firstName);
        resultScreenId.innerHTML = result_screen;

        // console.log(result_screen);
        // Perform any further operations with the selected value
        form_content.style.display = "none";
      } else {
        console.log("Error Data");
      }
  }

function loaderShow() {
    // Get the reference to the loader element
    const loader = document.getElementById("loader");
    const content2 = document.getElementById("content1");

    // Show the loader
    loader.style.display = "block";
    content2.style.display = "none";

    // Run the loader for 2 seconds
    setTimeout(() => {
    // Hide the loader after 2 seconds
    loader.style.display = "none";
    content2.style.display = "block";
    }, 2000);

}

function scrollToTop() {
    var myElement = document.getElementById('scroll-top');
    myElement.scrollTop = 0;
  }

document.addEventListener('DOMContentLoaded', function() {
    // Hide the loader
    var loader = document.getElementById('loader');
    loader.style.display = 'none';

    // Show the content
    var content = document.getElementById('content');
    content.style.display = 'block';

    // Perform your JavaScript action here
    // You can add your code below this comment
  });