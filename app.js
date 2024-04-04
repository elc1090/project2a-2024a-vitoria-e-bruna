const gitHubForm = document.getElementById('gitHubForm');
let usernameInput = document.getElementById('username');

usernameInput.addEventListener('blur', () => {
    let username = usernameInput.value;

    requestUserRepos(username)
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById('repository')
            if (data.message === "Not Found") {
                //TODO: show error message
                select.innerHTML = buildSelectOptions([]);
                select.disabled = true;
            } else {
                select.innerHTML = buildSelectOptions(data);
                select.disabled = false;
            }
        })
})


gitHubForm.addEventListener('submit', (e) => {
    e.preventDefault();

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
        commitsHTML += `<li class="list-group-item">
            <p class="h6">${commitData.commit.message}</p>
            </li>`;
    }

    return commitsHTML;
}

function requestUserRepos(username) {
    return Promise.resolve(fetch(`https://api.github.com/users/${username}/repos`));
}

function requestCommitsFromRepos(username, repository) {
    return Promise.resolve(fetch(`https://api.github.com/repos/${username}/${repository}/commits`));
}