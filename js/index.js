window.addEventListener("load", async function() {
    sessionStorage.removeItem("termsAgree");
    
    // const menu = document.querySelector(".menu");
    const id = document.querySelector("#id");
    const password = document.querySelector("#password");
    const loginBtn = document.querySelector(".login_btn_box > button");
    const joinBtn = document.querySelector(".join_box > button");
    const logoutBtn = document.querySelector(".logout_btn_box > button");
    const userContainer = document.querySelector(".user_container");
    const loginContainer = document.querySelector(".login_container");
    const dateOrder = document.querySelector("#date_order");
    const dateOrderIcon = document.querySelector(".date_check > i");
    const textOrder = document.querySelector("#text_order");
    const textOrderIcon = document.querySelector(".text_check > i");
    const allCheck = document.querySelector("#all_check");
    const allCheckIcon = document.querySelector(".all_check_box i");
    const write = document.querySelector(".write_search > i:first-child");
    const modal = document.querySelector("#modal");
    const xMark = document.querySelector(".x_mark_btn");
    const writeBtn = document.querySelector(".register_btn");

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
            // 실패시
            const data = await response.json();
            if (!response.ok) {
                if (response.status === 400 || response.status === 401 || response.status === 500) {
                    sweetAlert("error", data.message);
                } else {
                    throw new Error("예상하지 못한 오류가 발생했습니다. 상태 코드: " + response.status);
                }
                return;
            };

            localStorage.setItem("token", data.token);
            location.reload();

        } catch (error) {
            console.error(error);
            sweetAlert("error", "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        }
    });

    
    // 로그인 시 화면
    const token = localStorage.getItem("token");
    userContainer.style.display = token ? "block" : "none";
    loginContainer.style.display = token ? "none" : "block";
    // menu.style.display = token ? "block" : "none";

    // 데이터 불러오기
    let isAscDes = false; // 기본 정렬 내림차순
    let sortType = "date";   // 기본 정렬 기준 날짜
    let memoData = []; // 데이터 불러오기 후 저장된 메모 리스트

    if (token) {
        try {
            const response = await fetch("https://server-rose-one.vercel.app/memo/list", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`  // 토큰 포함
                }
            });
    
            const data = await response.json(); 
            if (!response.ok) {
                if (response.status === 401 || response.status === 500) {
                    sweetAlert("error", data.message);
                } else if (response.status === 403) {
                    localStorage.removeItem("token");
                    Swal.fire({
                        icon: "error",
                        text: "세션이 만료되었습니다. 다시 로그인해 주세요.",
                        confirmButtonColor: "#9FA9D8"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "index.html";
                        };
                    });
                } else {
                    throw new Error("예상하지 못한 오류가 발생했습니다. 상태 코드: " + response.status);
                };
                return;
            }
            // console.log(data);
            memoData = data.memos;  // 메모 데이터 저장 (정렬을 위해)
            renderMemos();
        } catch (error) {
            console.error(error);
            sweetAlert("error", "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        };
    };
    // 메모 렌더링 함수
    function renderMemos() {
        const memoWrapper = document.querySelector(".memo_wrapper");
        memoWrapper.innerHTML = ""; // 기존 메모 초기화

        const sortedMemos = [...memoData].sort((a, b) => {
            if (sortType === "date") { // 날짜 기준 정렬
                if (isAscDes) {
                    return new Date(a.createdAt) - new Date(b.createdAt); // 오름차순
                } else {
                    return new Date(b.createdAt) - new Date(a.createdAt); // 내림차순
                }
            } else if (sortType === "text") { // 문자 기준 정렬
                if (isAscDes) {
                    return a.language.localeCompare(b.language); // 오름차순 (문자순)
                } else {
                    return b.language.localeCompare(a.language); // 내림차순 (문자순)
                }
            }
        });
        
        if(sortedMemos.length > 0) {
            sortedMemos.forEach((item, index) => {
                const memoBox = document.createElement("div");
                memoBox.className = `memo_box box_${index}`;

                // 체크박스
                const checkDiv = document.createElement("div");
                const checkInput = document.createElement("input");
                const checkInputLabel = document.createElement("label");
                const checkIcon = checkInputLabel.querySelector("i");
                checkInput.type = "checkbox";
                checkInput.id = `memo_${index}`;
                checkDiv.classList.add("memo_check_box");
                checkInput.classList.add("memo_check");
                checkInputLabel.htmlFor = `memo_${index}`;
                checkInputLabel.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
                // 개별 체크박스 선택 시 아이콘 색상 변경
                checkInput.addEventListener("change", () => {
                    checkIcon.style.color = checkInput.checked ? "#E7852C" : "#C2C2C2";
                });
                checkDiv.appendChild(checkInput);
                checkDiv.appendChild(checkInputLabel);
                memoBox.appendChild(checkDiv);

                // 컨텐츠
                const fields = [
                    { label: "원어", value: item.language },
                    { label: "뜻", value: item.mean },
                    { label: "발음", value: item.pronunciation },
                    { label: "참고", value: item.reference }
                ];
                fields.forEach((field) => {
                    const div = document.createElement("div");
                    const span = document.createElement("span");
                    const p = document.createElement("p");
            
                    span.textContent = field.label;
                    p.textContent = field.value;
            
                    div.appendChild(span);
                    div.appendChild(p);
                    memoBox.appendChild(div);
                });
                // 수정버튼, 날짜
                const updateDateDiv = document.createElement("div");
                const updateBtn = document.createElement("button");
                const date = document.createElement("p");
                const formattedDate = new Date(item.createdAt).toISOString().split("T")[0];
                updateDateDiv.classList.add("update_btn_date_box");
                updateBtn.classList.add("update_btn");
                updateBtn.type = "button";
                updateBtn.textContent = "수정";
                date.textContent = formattedDate;
                updateDateDiv.appendChild(updateBtn);
                updateDateDiv.appendChild(date);
                memoBox.appendChild(updateDateDiv);
                // 최종 추가
                memoWrapper.appendChild(memoBox);
            });
            // 전체 체크박스 기능
            allCheck.addEventListener("change", () => {
                const checkboxes = document.querySelectorAll(".memo_check");
                checkboxes.forEach((checkbox) => {
                    checkbox.checked = allCheck.checked; // 전체 체크 상태에 따라 개별 체크박스 선택/해제

                    // 각 체크박스의 아이콘 색상 변경
                    const icon = document.querySelector(`label[for="${checkbox.id}"] i`);
                    icon.style.color = checkbox.checked ? "#E7852C" : "#C2C2C2";
                });
                
            });
        } else {
            const div = document.createElement("div");
            div.classList.add("empty_memo");
            div.textContent = data.message;
            memoWrapper.appendChild(div);
        };
    };

    // 정렬 체크박스들
    const checkboxes = [
        { element: dateOrder, icon: dateOrderIcon, state: false, type: "date" },
        { element: textOrder, icon: textOrderIcon, state: false, type: "text"}
    ];
    // 체크박스 상태변경 시 함수
    function updateCheckState(checkedElement) {
        checkboxes.forEach((checkbox) => {
            const isChecked = checkbox.element === checkedElement ? checkedElement.checked : false;
            checkbox.state = isChecked;
            checkbox.element.checked = isChecked; // 체크 상태 업데이트
            checkbox.icon.style.color = isChecked ? "#E7852C" : "#C2C2C2";

            if (isChecked) sortType = checkbox.type; // 선택된 체크박스에 따라 정렬 기준 설정
        });
        isAscDes = checkboxes.find(checkbox => checkbox.element === checkedElement).state; // 체크박스 상태에 따라 정렬 순서 결정
        renderMemos();
    };
    // 체크박스 각각에 상태변경 감지 이벤트리스너
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
        localStorage.removeItem("id");
        location.reload();
    });

    // 모달창 오픈
    write.addEventListener("click", function() {
        modal.style.display = "flex";
    });
    xMark.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // 메모 등록
    writeBtn.addEventListener("click", async function() {
        const language = document.querySelector("#language").value;
        const mean = document.querySelector("#mean").value;
        const pronunciation = document.querySelector("#pronunciation").value;
        const reference = document.querySelector("#reference").value;
        try {
            const response = await fetch("https://server-rose-one.vercel.app/memo/write", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    language,
                    mean,
                    pronunciation,
                    reference
                })
            });

            const data = await response.json();
            if(!response.ok) {
                if (response.status === 500 || response.status === 401) {
                    sweetAlert("error", data.message);
                } else {
                    throw new Error("예상하지 못한 오류가 발생했습니다. 상태 코드: " + response.status);
                }
                return;
            };
            
            modal.style.display = "none";
            window.location.reload(); 
        } catch (error) {
            console.error(error);
            sweetAlert("error", "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        };
    });
});