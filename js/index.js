window.addEventListener("load", function() {
    sessionStorage.removeItem("termsAgree");
    
    const joinBtn = document.querySelector(".join_btn > button");
    const loginBtn = document.querySelector(".login_btn > button");
    const id = document.querySelector("#id");
    const password = document.querySelector("#password");
    const menu = document.querySelector(".menu");
    const logoutBtn = document.querySelector(".logout_btn > button");
    const userContainer = document.querySelector(".user_container");
    const loginContainer = document.querySelector(".login_container");
    const dateOrder = document.querySelector("#date_order");
    const dateOrderIcon = document.querySelector(".date_check > i");
    const textOrder = document.querySelector("#text_order");
    const textOrderIcon = document.querySelector(".text_check > i");
    const allCheck = document.querySelector("#all_check");
    const allCheckIcon = document.querySelector(".all_check_box i");

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

    // 로그인 시 화면
    const token = localStorage.getItem("token");
    userContainer.style.display = token ? "block" : "none";
    loginContainer.style.display = token ? "none" : "block";
    menu.style.display = token ? "block" : "none";

    // 로그인
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

    // 정렬
    const checkboxes = [
        { element: dateOrder, icon: dateOrderIcon, state: false },
        { element: textOrder, icon: textOrderIcon, state: false }
    ];
    function updateCheckState(checkedElement) {
        checkboxes.forEach((checkbox) => {
            const isChecked = checkbox.element === checkedElement ? checkedElement.checked : false;
            checkbox.state = isChecked;
            checkbox.element.checked = isChecked; // 체크 상태 업데이트
            checkbox.icon.style.color = isChecked ? "#E7852C" : "#C2C2C2";
        });
        /*
        // 체크된 요소에 따라 서버 요청
        const anyChecked = checkboxes.some(checkbox => checkbox.element.checked);
        if (checkedElement === dateOrder && checkedElement.checked) {
            fetchData("date");
        } else if (checkedElement === textOrder && checkedElement.checked) {
            fetchData("text");
        } else if (!anyChecked) {
        fetchData("date");
        };
        */
    };
    // 체크박스 상태변경 시 이벤트
    checkboxes.forEach((checkbox) => {
        checkbox.element.addEventListener("change", function() {
            updateCheckState(checkbox.element);
        });
    });

    // 전체선택
    allCheck.addEventListener("change", function() {
        allCheckIcon.style.color = allCheck.checked ? "#E7852C" : "#C2C2C2";
    });

    // 로그아웃
    logoutBtn.addEventListener("click", function() {
        localStorage.removeItem("token");
        location.reload();
    });
});