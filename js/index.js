window.addEventListener("load", function() {
    sessionStorage.removeItem("termsAgree");
    const joinBtn = document.querySelector(".join_btn > button");
    joinBtn.addEventListener("click", function() {
        window.location.href = "./terms_page.html";
    });
});