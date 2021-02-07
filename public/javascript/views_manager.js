$(() => {

  const $main = $('#main-content');

  window.views_manager = {};

  window.views_manager.show = function (item) {
    $logInForm.detach();
    $signUpForm.detach();
    $generalList.detach();
    $favoriteList.detach();
    $contributionList.detach();
    $createdList.detach();

    switch (item) {
      case 'logIn':
        $mainMap.detach();
        $logInForm.appendTo($main);
        break;
      case 'signUp':
        $mainMap.detach();
        $signUpForm.appendTo($main);
        break;
      case 'mainMap':
        //main map will have general list with the map
        $mainMap.appendTo($main);
        $generalList.appendTo($mainMap);
        break;
      case 'generalList':
        $generalList.appendTo($mainMap);
        break;
      case 'favorites':
        $favoriteList.appendTo($mainMap);
        break;
      case 'contributions':
        $contributionList.appendTo($mainMap);
        break;
      case 'createdList':
        $createdList.appendTo($mainMap);
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
