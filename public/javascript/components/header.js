$(() => {
  window.header = {};

  const $pageHeader = $(".page-header");
  let currentUser = null;
  function updateHeader(user) {
    currentUser = user;
    $pageHeader.find("#page-header__user-links").remove();
    let userLinks = `
    <nav id="page-header__user-links" class="navbar navbar-expand-lg navbar-light bg-light py-3 px-1">
    <div class="container-fluid">
      <a class="navbar-brand" href="#"><img id="home-btn" src="images/home-icon-silhouette.png" alt=""></a>
  `;
    if (!user) {
      userLinks += `
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      </ul>
      <form class="d-flex">
        <button id="login-btn" class="btn btn-outline-dark me-2" type="submit">Login</button>
        <button id="register-btn"class="btn btn-dark" type="submit">Register</button>
      </form>
    </div>
  </div>
</nav>
      `;
    } else {
      userLinks += `
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#myNavbar" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="myNavbar">
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            My Profile
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a id="favorites-li" class="dropdown-item" href="#">My Favorites</a></li>
            <li><a id="contributions-li"class="dropdown-item" href="#">My Contributions</a></li>
            <li><a id="maps-li"class="dropdown-item" href="#">My Maps</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a id="create-maps-li"class="dropdown-item" href="#">Create Map</a></li>
          </ul>
          <li class="nav-item">
            <a class="nav-link" href="#">Hello ${user.name}</a>
          </li>
        </li>
      </ul>
      <form class="d-flex">
        <button id="logout-btn" class="btn btn-outline-danger type="submit">Logout</button>
      </form>
    </div>
  </div>
</nav>
      `;
    }

    $pageHeader.append(userLinks);
  }

  window.header.update = updateHeader;

  getMyDetails().then((json) => updateHeader(json.user));

  $($pageHeader).click(function (evt) {
    evt.preventDefault();
    switch ($(evt.target).attr("id")) {
      case "login-btn":
        views_manager.show("logIn");
        break;
      case "register-btn":
        views_manager.show("signUp");
        break;
      case "logout-btn":
        logOut().then(() => header.update(null));
        break;
      case "create-maps-li":
        views_manager.show("mapForm");
        break;
      case "favorites-li":
        getMaps(`favUser_id=${currentUser.id}`).then((maps) => mapLists.appendMaps(maps))
        ;
        views_manager.show('mapList');
        break;
      case "contributions-li":
        getMaps(`contributor_id=${currentUser.id}`).then((maps) =>
        mapLists.appendMaps(maps)
        );
        break;
      case "maps-li":
        getMaps(`owner_id=${currentUser.id}`).then((maps) => mapLists.appendMaps(maps));
        break;
      case "home-btn":
        views_manager.show("mainMap");
        break;
      default:
        break;
    }
  });
});
