$(() => {

  const $main = $('#main-content');

  window.views_manager = {};

  window.views_manager.show = function(item) {
    $logInForm.detach();
    $signUpForm.detach();


    switch (item) {
      case 'logIn':
        $mainMap.detach();
        $logInForm.appendTo($main);
        break;
      case 'signUp':
        $mainMap.detach();
        $signUpForm.appendTo($main);
        break;
      case 'error': {
        const $error = $(`<p>${arguments[1]}</p>`);
        $error.appendTo('body');
        setTimeout(() => {
          $error.remove();
          views_manager.show('listings');
        }, 2000);
        break;
      }
    }
  }
});
