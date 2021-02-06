$(() => {
  window.header = {};

  const $pageHeader = $(".page-header");
  let currentUser = null;
  function updateHeader(user) {
    currentUser = user;
    $pageHeader.find("#page-header__user-links").remove();
    let userLinks;

    if (!user) {
      userLinks = `
      <nav class="navbar navbar-expand-lg navbar-light p-3">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Home</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse d-flex flex-row-reverse" id="navbarColor03">
          <button id="login-btn"class="btn btn-outline-dark mx-2 my-2 my-sm-0" type="submit">Sign in</button>
          <button id="register-btn"class="btn btn-light my-2 my-sm-0 text-dark" type="submit">Register</button>
        </div>
      </div>
    </nav>
      `;
    } else {
      userLinks = `
      <nav class="navbar navbar-expand-lg navbar-light py-3">
      <div class="container-fluid">
        <a class="navbar-brand" href="#"></a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor03"
          aria-controls="navbarColor03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse d-flex justify-content-between" id="navbarColor03">
          <div class="dropdown">
            <button
              class="btn btn-outline-dark dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Profile
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li><a class="dropdown-item" href="#">My Favorites</a></li>
              <li><a class="dropdown-item" href="#">My Contributions</a></li>
              <li><a class="dropdown-item" href="#">My Maps</a></li>
            </ul>
          </div>
          <button id="logout-btn" class="btn btn-outline-dark mx-2 my-2 my-sm-0">
            Logout
          </button>
        </div>
      </div>
    </nav>
      `;
    }

    $pageHeader.append(userLinks);
  }

  window.header.update = updateHeader;
  updateHeader({ name: "Bruce" });
});
