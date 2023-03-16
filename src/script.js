import "./index.html";
import "./styles/reset.css";
import "./styles/styles.sass";

const NOT_ENOUGH_CHARACTERS = "Слишком короткий запрос";
const NOT_FOUND = "Ничего не найдено";

let form = document.querySelector(".search");
form.addEventListener("submit", onSubmit);

function onSubmit(event) {
    event.preventDefault();
    let str = form.input.value;
    if (str.length < 2) {
        if (form.nextElementSibling.classList.contains("error")) {
            return;
        }
        let error = document.createElement("div");
        error.classList.add("error");
        error.innerHTML = NOT_ENOUGH_CHARACTERS;
        form.after(error);
        form.addEventListener("input", hideError);
        return;
    }
    getRepos(str).then((repos) => showResults(repos));
}

function hideError() {
    let error = form.nextElementSibling;
    error.remove();
    form.removeEventListener("input", hideError);
}

async function getRepos(str) {
    let url = new URL("https://api.github.com/search/repositories");
    url.searchParams.set("per_page", "10");
    url.searchParams.set("q", str);
    let response = await fetch(url);
    let result = await response.json();
    return result.items;
}

function showResults(repos) {
    let ul = document.querySelector(".results");
    let noRes = document.querySelector(".no-results");
    if (repos.length == 0) {
        noRes = document.createElement("div");
        noRes.classList.add("no-results");
        noRes.innerHTML = NOT_FOUND;
        ul.replaceWith(noRes);
        return;
    }
    if (!ul) {
        ul = document.createElement("ul");
        ul.classList.add("results");
        noRes.replaceWith(ul);
    }
    ul.innerHTML = "";
    for (let repo of repos) {
        let desc = repo.description || "";
        let li = `
        <li class="result">
            <div class="result__name">
                <a class="result__link" href="${
                    repo.svn_url
                }" target="_blank">${repo.name}</a>
            </div>
            <div class="result__desc"><i>Описание:</i> ${desc}</div>
            <div class="result__owner"><i>Владелец:</i> ${
                repo.owner.login
            }</div>
            <div class="result__date"><i>Дата обновления:</i> ${
                repo.updated_at.split("T")[0]
            }</div>
        </li>`;
        ul.insertAdjacentHTML("beforeend", li);
    }
}
