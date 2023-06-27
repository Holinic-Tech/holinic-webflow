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
        return `Let's be honest here. Dealing with dry, brittle, and frizzy hair feels like a never-ending struggle. Each morning, you wake up hoping for a good hair day, only to end up with a frizzy mess that won’t cooperate, no matter how many products you apply.

        This ends TODAY.

        Based on your answers, we’ve identified a SIMPLE haircare routine to repair your damaged hair and achieve silky ends... so you can go through the day with confidence every day!

        Don't worry, this ISN'T some ultra strict, long or complicated routine... and you won’t need any fancy salon treatments or expensive products either.

        Instead, we have a simple and quick routine that you can do in a few minutes a day that will help you stop your split ends, tame frizz and achieve luscious and healthy locks in less than two weeks.

        In the 14-Day Haircare Challenge, world renown haircare instructor Sarah Tran will give you bite-sized daily videos with expert-quality advice which you can easily apply in the comfort of your own home.

        (These same tips have already helped thousands of women get the hair of their dreams.)

        The next 14 days are about finally getting your confidence back. It’s about waking up every day loving how you look and feel, so you can enjoy your days to the fullest.

        You deserve this, ${first_name}
        `;
    } else if (content === '😣 Hair loss or hair thinning') {
        return `
        Are you afraid to run your hand in your hair because every time you feel that it will make you balder? Is your shower constantly clogged with  your fallen hair and just looking at it makes you grieve? You keep losing more hair every day and you just don’t know any more where to turn to make it stop…

        This ends TODAY.

        Based on your answers, we're identified a SIMPLE solution to visibly reduce your hair loss and regain denser and voluminous hair… so you can go through the day with confidence every day!

        Don't worry, this ISN'T some ultra strict, long or complicated routine... and you won’t need any fancy salon treatments or expensive products either.

        Instead, we have a simple and quick routine that you can do in a few minutes a day that will help you revive your follicles and visibly reduce the number of hair you lose in less than two weeks.

        In the 14-Day Haircare Challenge, world renown haircare instructor Sarah Tran will give you bite-sized daily videos with expert-quality advice which you can easily apply in the comfort of your own home.

        (These same tips have already helped thousands of women solve their hair troubles.)

        The next 14 days are about finally getting your confidence back. It’s about waking up every day loving how you look and feel, so you can enjoy your days to the fullest.

        You deserve this, ${first_name}

        `;
    } else if (content === '😕 Damage from dye, heat, or chemical treatments') {
        return `
        Let's be honest here, you’ve gone a bit too far and now you’re worried it is too late. You LOVE styling, coloring and pumping your hair so you can look your most fabulous self. But as a result your hair is now breaking mid-way, your frizz gets uncontrollable and every day it requires more styling to get even a decent look.

        This ends TODAY.

        Based on your answers, we're identified a SIMPLE solution to stop your split ends, tame frizz and get you fabulous healthy hair… so you can go through the day with confidence every day!

        Don't worry, this ISN'T some ultra strict, long or complicated routine... and you won’t need any fancy salon treatments or expensive products either.

        Instead, we have a simple and quick routine that you can do in a few minutes a day that will help you stop the breakage, restore your hair and make it shine in less than two weeks.

        In the 14-Day Haircare Challenge, world renown haircare instructor Sarah Tran will give you bite-sized daily videos with expert-quality advice which you can easily apply in the comfort of your own home.

        (These same tips have already helped thousands of women get the hair of their dreams.)
        The next 14 days are about finally getting your confidence back. It’s about waking up every day loving how you look and feel, so you can enjoy your days to the fullest.

        You deserve this, ${first_name}

        `;
    } else if (content === '😫 Irritation or dandruff') {
        return `
        There it is again. That all-too-familiar urge to scratch your head. As you give in, you feel a momentary sense of relief, only to be quickly replaced by anxiety. You know what comes next - the burn and white flakes on your shoulders, standing out starkly against your dark clothing, revealing your struggle to the world.

        This ends TODAY.

        Based on your answers, we’ve identified a SIMPLE haircare routine to trade this ugly,  embarrassing discomfort for a fresh and healthy scalp ... so you can go through the day with confidence every day!

        Don't worry, this ISN'T some ultra strict, long or complicated routine... and you won’t need any fancy salon treatments or expensive products either.

        Instead, we have a simple and quick routine that you can do in a few minutes a day that will help you stop the flakes and itchiness to achieve clean and voluminous locks in less than two weeks.

        In the 14-Day Haircare Challenge, world renown haircare instructor Sarah Tran will give you bite-sized daily videos with expert-quality advice which you can easily apply in the comfort of your own home.

        (These same tips have already helped thousands of women get the hair of their dreams.)

        The next 14 days are about finally getting your confidence back. It’s about waking up every day loving how you look and feel, so you can enjoy your days to the fullest.

        You deserve this, ${first_name}

        `;
    } else {
        return `
        You’re not exactly sure why it’s happening but something with your hair is definitely off. It used to be so healthy, shiny without having to think so much about it. And now you’re contemplating your old pictures and you realize that you have no idea where these amazing hair went. And you’re not even sure how to start to take care of it…

        This ends TODAY.

        Based on your answers, we’ve identified a SIMPLE haircare routine to bring back your hair’s shine and density from the old days... so you can go through the day with confidence every day!

        Don't worry, this ISN'T some ultra strict, long or complicated routine... and you won’t need any fancy salon treatments or expensive products either.

        Instead, we have a simple and quick routine that you can do in a few minutes a day that will help you stop your split ends, tame frizz and achieve luscious and healthy locks in less than two weeks.

        In the 14-Day Haircare Challenge, world renown haircare instructor Sarah Tran will give you bite-sized daily videos with expert-quality advice which you can easily apply in the comfort of your own home.

        (These same tips have already helped thousands of women get the hair of their dreams.)

        The next 14 days are about finally getting your confidence back. It’s about waking up every day loving how you look and feel, so you can enjoy your days to the fullest.

        You deserve this, ${first_name}

        `;
    }
}

function handleSubmit(event) {
    event.preventDefault(); // Prevents the default form submission behavior
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


        // console.log("Selected value: " + questions_logic_payload.hair_problem.toString(), 'Profile: ', user_profile);
        const result_screen = proocessResultLogic(questions_logic_payload.hair_problem.toString(), firstName);
        resultScreenId.innerHTML = result_screen;

        console.log(result_screen)
        // Perform any further operations with the selected value

        // Display result and hide quiz
        result.style.display = "block";
        form_content.style.display = "none";
      } else {
        console.log("Error Data");
      }
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