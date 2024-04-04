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
})

function buildSelectOptions(repositories) {
    let optionsHTML = "<option selected>Choose a repository</option>";

    for (let repository of repositories) {
        optionsHTML += `<option value="${repository.name}">${repository.name}</option>`;
    }

    return optionsHTML;
}

function requestUserRepos(username) {
    return Promise.resolve(fetch(`https://api.github.com/users/${username}/repos`));
}
