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
    if (content === '👧 Under 18') {
        return `

        Starting early can make all the difference in the world! At your age, it's crucial to establish healthy hair habits. 
 
        <br/><br/>
        By addressing hair loss now, you can prevent long-term damage and enjoy beautiful, strong hair 
        as you grow.
        
        <br/><br/>
        Based on your answers, we've identified a SIMPLE routine to reverse your hair loss and revive your thinning hair...
        <br/><br/>

        <b>Don't worry, this ISN'T some ultra strict, long, or complicated routine…</b>
        <br/><br/>

        ✅ It only takes 10 minutes a day to complete and you’ll get </u>VISIBLE results in the first few days.

        <br/><br/>

        ✅  <b>Regrow stronger & denser hair that will resist damage even with styling and coloring.</b>

        <br/><br/>

        ✅ Watch the lessons from anywhere with online access. Complete in 14 days or at your own pace.

        <br/><br/>
        ✅ Invest in your hair now and <b>save hundreds on products and salon treatments</b> that you won’t need.
        <br><br>
        ✅ This Haircare Challenge has already helped over 73,000+ women regain better and fuller hair.
        <br><br>

        Join now to start your journey to dense, long and silky hair and feel confident every day.<br><br> You deserve this ${first_name}
        `;
    } else if (content === '🎓 18-24') {
        return `

        Early intervention can make a huge difference in your hair’s health! ✨
 
 
        <br/><br/>
        Your hair is still adapting to life cycle changes. By addressing hair loss now, you can ensure your hair stays strong and beautiful through these transformative years.
        
        <br/><br/>
        Based on your answers, we've identified a SIMPLE routine to reverse your hair loss and revive your thinning hair...
        <br/><br/>

        <b>Don't worry, this ISN'T some ultra strict, long, or complicated routine…</b>
        <br/><br/>

        ✅ It only takes 10 minutes a day to complete and you’ll get </u>VISIBLE results in the first few days.

        <br/><br/>

        ✅  <b>Regrow stronger & denser hair that will resist damage even with styling and coloring.</b>

        <br/><br/>

        ✅ Watch the lessons from anywhere with online access. Complete in 14 days or at your own pace.

        <br/><br/>
        ✅ Invest in your hair now and <b>save hundreds on products and salon treatments</b> that you won’t need.
        <br><br>
        ✅ This Haircare Challenge has already helped over 73,000+ women regain better and fuller hair.
        <br><br>

        Join now to start your journey to dense, long and silky hair and feel confident every day.<br><br> You deserve this ${first_name}
        `;
    } else if (content === '💼 25-34') {
        return `

        Taking action now can save you from future hair woes! 🌟

        <br/><br/>
        Balancing work, social life, and self-care can be challenging. 
        <br/><br/>
        Addressing hair loss now can help you maintain your confidence and manage stress more effectively.
        
        
        <br/><br/>
        Based on your answers, we've identified a SIMPLE routine to reverse your hair loss and revive your thinning hair...
        <br/><br/>

        <b>Don't worry, this ISN'T some ultra strict, long, or complicated routine…</b>
        <br/><br/>

        ✅ It only takes 10 minutes a day to complete and you’ll get </u>VISIBLE results in the first few days.

        <br/><br/>

        ✅  <b>Regrow stronger & denser hair that will resist damage even with styling and coloring.</b>

        <br/><br/>

        ✅ Watch the lessons from anywhere with online access. Complete in 14 days or at your own pace.

        <br/><br/>
        ✅ Invest in your hair now and <b>save hundreds on products and salon treatments</b> that you won’t need.
        <br><br>
        ✅ This Haircare Challenge has already helped over 73,000+ women regain better and fuller hair.
        <br><br>

        Join now to start your journey to dense, long and silky hair and feel confident every day.<br><br> You deserve this ${first_name}
        `;
    } else if (content === '👩‍💼 35-44') {
        return `

        It’s never too late to reclaim your hair’s health! ✨

        <br/><br/>
        Juggling a busy life, stress levels and diet changes may be responsible for the changes in your hair. Pair this with your hair growth cycle shortening naturally as you age and you have a recipe for rapidly thinning hair.
        <br/><br/>
        Addressing hair loss now can rejuvenate your look and boost your confidence again.
        <br/><br/>
        Based on your answers, we've identified a SIMPLE routine to reverse your hair loss and revive your thinning hair...
        <br/><br/>

        <b>Don't worry, this ISN'T some ultra strict, long, or complicated routine…</b>
        <br/><br/>

        ✅ It only takes 10 minutes a day to complete and you’ll get </u>VISIBLE results in the first few days.

        <br/><br/>

        ✅  <b>Regrow stronger & denser hair that will resist damage even with styling and coloring.</b>

        <br/><br/>

        ✅ Watch the lessons from anywhere with online access. Complete in 14 days or at your own pace.

        <br/><br/>
        ✅ Invest in your hair now and <b>save hundreds on products and salon treatments</b> that you won’t need.
        <br><br>
        ✅ This Haircare Challenge has already helped over 73,000+ women regain better and fuller hair.
        <br><br>

        Join now to start your journey to dense, long and silky hair and feel confident every day.<br><br> You deserve this ${first_name}
        `;
    } else {
        return `


        It’s never too late to achieve healthier hair! 🌟

        <br/><br/>
        As you age, your hair growth cyrcle shortens naturally leading to reduced hair density. That's why it becomes more important to adopt a personalized hair care routine to counteract those changes as you age. 
        <br/><br/>
        Addressing hair loss now can help you maintain your hair’s vitality and enjoy your beautiful locks for years to come.
        <br/><br/>
        Based on your answers, we've identified a SIMPLE routine to reverse your hair loss and revive your thinning hair...
        <br/><br/>

        <b>Don't worry, this ISN'T some ultra strict, long, or complicated routine…</b>
        <br/><br/>

        ✅ It only takes 10 minutes a day to complete and you’ll get </u>VISIBLE results in the first few days.

        <br/><br/>

        ✅  <b>Regrow stronger & denser hair that will resist damage even with styling and coloring.</b>

        <br/><br/>

        ✅ Watch the lessons from anywhere with online access. Complete in 14 days or at your own pace.

        <br/><br/>
        ✅ Invest in your hair now and <b>save hundreds on products and salon treatments</b> that you won’t need.
        <br><br>
        ✅ This Haircare Challenge has already helped over 73,000+ women regain better and fuller hair.
        <br><br>

        Join now to start your journey to dense, long and silky hair and feel confident every day.<br><br> You deserve this ${first_name}
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
const option8Group = document.getElementsByName("option8");


// Function to handle the radio button change event
function handleRadioChange(event, num) {
    const selectedOption = event.target;
    const selectedLabel = document.querySelector(`label[for="${selectedOption.id}"]`).textContent;
    selectedAnswers[num] = selectedLabel;
    console.log("Answer picked", selectedAnswers);
  //   console.log("Number", num);
  }
  
  // Add event listeners to radio button groups
  optionGroup.forEach((radio) => {
    // Add event listener to each radio button
    radio.addEventListener("change", (event) => {
      handleRadioChange(event, 0);
    });
  });

option1Group.forEach((radio) => {
    radio.addEventListener("change", (event) => {
        handleRadioChange(event, 1);
      });
});

option2Group.forEach((radio) => {
    radio.addEventListener("change", (event) => {
        handleRadioChange(event, 3);
      });
});

option3Group.forEach((radio) => {
    radio.addEventListener("change", (event) => {
        handleRadioChange(event, 4);
      });
});

option4Group.forEach((radio) => {
    radio.addEventListener("change", (event) => {
        handleRadioChange(event, 5);
      });
});

option6Group.forEach((radio) => {
    radio.addEventListener("change", (event) => {
        handleRadioChange(event, 6);
      });
});

option7Group.forEach((radio) => {
    radio.addEventListener("change", (event) => {
        handleRadioChange(event, 7);
      });
});

function handleDataSubmission (email, firstName, lastName, answers) {
    // Get the reference to the loader element
    const loader = document.getElementById("loader2");
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
        //commented out answers to not pollute MP and AC data while testing
     //   answers: answers, 
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
    // print(cvgUid, 'COOKIEEE TRACCKING'); - $39 checkout
    var redirectUrl = 'https://checkout.hairqare.co/buy/hairqare-challenge-save-85/?__cvg_uid=' + cvgUid + '&billing_email=' + encodeURIComponent(email) + '&billing_first_name=' + encodeURIComponent(firstName) + '&billing_last_name=' + encodeURIComponent(lastName);

    // Post user's answers, name, and email to webhook - retry twicce
    $.ajax({
        url: 'https://bysa.app/api/v1/onboarding/quiz_webhook/',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function () {
            return window.top.location.href = redirectUrl;
        },
        error: function () {
            // Failed webhook request; handle as needed
            $.ajax({
                url: 'https://bysa.app/api/v1/onboarding/quiz_webhook/',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function () {
                    return window.top.location.href = redirectUrl;
                },
                error: function () {
                    // Failed webhook request; handle as needed
                    return window.top.location.href = redirectUrl;
                }
            });
        }
    });

    scrollToTop();
}

function handleSkipButton() {
    var cvgUid = getCookieValue('__cvg_uid');
    // print(cvgUid, 'COOKIEEE TRACCKING'); - $39 checkout
    var redirectUrl = `https://checkout.hairqare.co/buy/hairqare-challenge-save-85?__cvg_uid=${cvgUid}`
    return window.top.location.href = redirectUrl;
};


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
            fullname: `${firstName} ${lastName}`,
        }

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
            email: selectedEm.value
        };
        // Post user's answers, name, and email to webhook
        $.ajax({
            url: 'https://bysa.app/api/v1/onboarding/quiz_webhook/',
            type: 'POST',
            data: JSON.stringify(data_upload),
            contentType: 'application/json',
            success: function () {
                console.log('sucessful webhook');
                // console.log("Selected value: " + questions_logic_payload.hair_problem.toString(), 'Profile: ', user_profile);
                const result_screen = proocessResultLogic(questions_logic_payload.hair_problem.toString(), firstName);
                return resultScreenId.innerHTML = result_screen;
            },
            error: function () {
                // Failed webhook request; handle as needed
                console.log('failed webhook');
                const result_screen = proocessResultLogic(questions_logic_payload.hair_problem.toString(), firstName);
                return resultScreenId.innerHTML = result_screen;
            }
        });

        // Perform any further operations with the selected value
        form_content.style.display = "none";
      } else {
        console.log("Error Data");
      }
  }

  function loaderShow() {
    const loader = document.getElementById("loader");
    const content2 = document.getElementById("content1");
    const progressValue = loader.querySelector(".loader-progress-value");
    const circularProgress = loader.querySelector(".loader-circular-progress");
    const loader_checkpoints = loader.querySelectorAll(".loader-checkpoint");

    if (!loader || !content2 || !progressValue || !circularProgress) {
        console.error("One or more elements not found");
        return;
    }

    loader.style.display = "flex"; // Show loader
    content2.style.display = "none"; // Hide content

    let progressStartValue = 0,
        progressEndValue = 100,
        speed = 30;

    let progress = setInterval(() => {
        progressStartValue++;
        progressValue.textContent = `${progressStartValue}%`;
        circularProgress.style.background = `conic-gradient(#17b26a ${progressStartValue * 3.6}deg, #ededed 0deg)`;

        loader_checkpoints.forEach(checkpoint => {
            if (progressStartValue >= checkpoint.getAttribute('data-value')) {
                checkpoint.style.opacity = 1;
                checkpoint.classList.add('completed');
            }
        });

        if (progressStartValue == progressEndValue) {
            clearInterval(progress);
            loader.style.display = "none"; // Hide loader
            content2.style.display = "block"; // Show content
        }
    }, speed);
}
function loaderShow2() {
    // Get the reference to the loader element
    const loader2 = document.getElementById("loader2");
    const content2 = document.getElementById("content1");

    // Show the loader
    loader2.style.display = "block";
    content2.style.display = "none";

    // Run the loader for 2 seconds
    setTimeout(() => {
    // Hide the loader after 2 seconds
    loader2.style.display = "none";
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
    var loader2 = document.getElementById('loader2');
    loader2.style.display = 'none';

    // Show the content
    var content = document.getElementById('content');
    content.style.display = 'block';

    // Perform your JavaScript action here
    // You can add your code below this comment
  });