const search    = document.querySelector("input[name=search]"),
      camps     = document.querySelectorAll(".card");

search.addEventListener("keyup", (event) => {
    const regex = new RegExp(search.value, "gi");
    camps.forEach(camp => {
        if (camp.children[1].children[0].innerHTML.match(regex))
            camp.parentElement.classList.remove("d-none");
        else
            camp.parentElement.classList.add("d-none");
    });
});