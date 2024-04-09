const gitHubForm = document.getElementById('gitHubForm');
let usernameInput = document.getElementById('username');
let repositoryInput = document.getElementById('repository');
const loader = document.getElementById('loader');
const change = document.getElementById('change');
const found = document.getElementById('found');
const foundText = document.getElementById('found-text');
const error = document.getElementById('error');
const errorText = document.getElementById('error-text');

usernameInput.addEventListener('blur', () => {
  let username = usernameInput.value;
  loader.style.display = 'block';
  requestUserRepos(username)
      .then(response => response.json())
      .then(data => {
        let select = document.getElementById('repository')
        if (data.message === "Not Found") {
          select.innerHTML = buildSelectOptions([]);
          select.disabled = true;
          error.style.display = 'block';
          errorText.textContent = data.message;
        } else {
          select.innerHTML = buildSelectOptions(data);
          select.disabled = false;
          found.style.display = 'block';
          foundText.textContent = `Foram encontrados ${data.length} repositórios para ${username}`;
        }
      }).then(() => loader.style.display = 'none');
})

usernameInput.addEventListener('change', () => change.style.display = 'block');
repositoryInput.addEventListener('change', () => change.style.display = 'block');

gitHubForm.addEventListener('submit', (e) => {
  e.preventDefault();
  change.style.display = 'none';
  found.style.display = 'none';

  let username = usernameInput.value;
  let repository = document.getElementById('repository').value

  requestCommitsFromRepos(username, repository)
      .then(response => response.json())
      .then(data => {
        let list = document.getElementById('commits')
        list.innerHTML = buildCommits(data);
      })
})

function buildSelectOptions(repositories) {
  let optionsHTML = "<option selected>Choose a repository</option>";

  for (let repository of repositories) {
    optionsHTML += `<option value="${repository.name}">${repository.name}</option>`;
  }

  return optionsHTML;
}

function buildCommits(commits) {
  let commitsHTML = '';
  for (let commitData of commits) {
    let msg = commitData.commit;
    let date = formatDate(msg.committer.date)

    commitsHTML += `<li class="list-group-item">`
                      + `<div class="row">`
                        + `<div class="col-1 h6 text-center">`
                            + `<i class="fa-solid fa-code-commit"></i>`
                        + ` </div>`
                        + `<div class="col">`
                          + `<div class="row">`
                            + `<div class="col h6">`
                              + msg.message
                            + ` </div>`
                          + `</div>`
                          + `<div class="row justify-content-between">`
                            + `<div class="col-3">`
                              + `<small class="text-body-secondary">${msg.committer.name}</small>`
                            + `</div>`
                            + `<div class="col-2 text-end">`
                              + `<small class="text-body-secondary">${date}</small>`
                            + `</div>`
                          + `</div>`
                        + `</div>`
                      + `</div>`
                    + ` </li>`;
  }

  return commitsHTML;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function requestUserRepos(username) {
  return Promise.resolve(fetch(`https://api.github.com/users/${username}/repos`));
}

function requestCommitsFromRepos(username, repository) {
  return Promise.resolve(fetch(`https://api.github.com/repos/${username}/${repository}/commits`));
}