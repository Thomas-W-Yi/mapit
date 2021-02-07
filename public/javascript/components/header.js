$(() => {
  window.header = {};

  const $pageHeader = $(".page-header");
  let currentUser = null;
  function updateHeader(user) {
    currentUser = user;
    $pageHeader.find("#page-header__user-links").remove();
    let userLinks = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light py-3 px-5">
    <div class="container-fluid">
      <a class="navbar-brand" href="#"><img src="images/home-icon-silhouette.png" alt=""></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>`;

    if (!user) {
      userLinks += `
        <div class="collapse navbar-collapse" id="navbarColor03">
          <button id="login-btn"class="btn btn-outline-dark mx-2 my-2 my-sm-0" type="submit">Sign in</button>
          <button id="register-btn"class="btn btn-light my-2 my-sm-0 text-dark" type="submit">Register</button>
        </div>
      </div>
    </nav>
      `;
    } else {
      userLinks += `
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            My Profile
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="#">My Favorites</a></li>
            <li><a class="dropdown-item" href="#">My Contributions</a></li>
            <li><a class="dropdown-item" href="#">My Maps</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Create Map</a></li>
          </ul>
          <li class="nav-item">
            <a class="nav-link" href="#">Hello ${user.name}</a>
          </li>
        </li>
      </ul>
      <form class="d-flex">
        <button class="btn btn-outline-danger type="submit">Logout</button>
      </form>
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
