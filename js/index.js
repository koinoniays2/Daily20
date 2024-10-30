window.addEventListener("load", function() {
    sessionStorage.removeItem("termsAgree");
    
    const joinBtn = document.querySelector(".join_btn > button");
    const loginBtn = document.querySelector(".login_btn > button");
    const id = document.querySelector("#id");
    const password = document.querySelector("#password");
    const menu = document.querySelector(".menu");
    const loginBox = document.querySelector(".login_box");
    const postitBox = document.querySelector(".postit_box");
    const image = document.querySelectorAll(".login_container > img");
    const loginWrapper = document.querySelector(".login_wrapper");
    const userWrapper = document.querySelector(".user_wrapper");
    const logoutBtn = document.querySelector(".logout_btn > button");

    joinBtn.addEventListener("click", function() {
        window.location.href = "./terms_page.html";
    });

    // sweetAlert
    function sweetAlert(icon, text) {
        Swal.fire({
            icon,
            text,
            confirmButtonColor: "#9FA9D8"
        });
    };

    const token = localStorage.getItem("token");
    menu.style.display = token ? "block" : "none";
    loginBox.style.display = token ? "none" : "block";
    loginWrapper.style.display = token ? "none" : "flex";
    userWrapper.style.display = token ? "flex" : "none";
    postitBox.style.display = token ? "none" : "flex";
    image.forEach((item) => {
        item.style.display = token ? "none" : "block";
    });

    loginBtn.addEventListener("click", async function() {
        if (!id.value.trim() || !password.value) {
            sweetAlert("error", "아이디와 비밀번호를 입력해주세요.");
            return;
        }
        try {
            const response = await fetch("https://server-rose-one.vercel.app/join/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    id : id.value.trim(), 
                    password : password.value })
            });
            if (!response.ok) {
                const data = await response.json();
                sweetAlert("error", "아이디 또는 비밀번호를 확인해 주세요.");
                throw new Error(data.message);
            };

            const data = await response.json();
            localStorage.setItem("token", data.token);
            location.reload();

        } catch (error) {
            console.error(error);
        }
    });

    logoutBtn.addEventListener("click", function() {
        localStorage.removeItem("token");
        location.reload();
    });
});