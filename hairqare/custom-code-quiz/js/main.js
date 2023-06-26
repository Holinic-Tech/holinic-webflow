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
                // if ($('.radio-option:checked').length === 0) {
                // No radio button is selected, prevent moving to the next step
                    console.log('Radio button check');
                    console.log($('.radio-option:checked').length);
                // }
            }
            return true;
        },
        onFinished: function(event, currentIndex) {
            alert('Sumited');
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
        console.log('back');
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