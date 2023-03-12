// 로그인 여부 확인
var isLoggedIn = getCookie("user");

// 드롭다운 메뉴 항목 생성
var loginMenu = document.getElementById("loginMenu");
if (isLoggedIn) {
var profileLink = document.createElement("li");
var profileLinkA = document.createElement("a");
profileLinkA.textContent = "Profile";
profileLinkA.classList.add("dropdown-item");
profileLinkA.href = "#";
profileLink.appendChild(profileLinkA);
loginMenu.appendChild(profileLink);

var settingsLink = document.createElement("li");
var settingsLinkA = document.createElement("a");
settingsLinkA.textContent = "Settings";
settingsLinkA.classList.add("dropdown-item");
settingsLinkA.href = "#";
settingsLink.appendChild(settingsLinkA);
loginMenu.appendChild(settingsLink);

var divider = document.createElement("li");
divider.innerHTML = '<hr class="dropdown-divider">';
loginMenu.appendChild(divider);

var logoutLink = document.createElement("li");
var logoutLinkA = document.createElement("a");
logoutLinkA.textContent = "Logout";
logoutLinkA.classList.add("dropdown-item");
logoutLinkA.href = "#";
logoutLink.appendChild(logoutLinkA);
loginMenu.appendChild(logoutLink);

// 로그아웃 버튼 클릭 시 쿠키 삭제
logoutLinkA.addEventListener("click", function() {
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    location.reload();
});
} else {
var signInLink = document.createElement("li");
var signInLinkA = document.createElement("a");
signInLinkA.textContent = "Sign Up";
signInLinkA.classList.add("dropdown-item");
signInLinkA.href = "../register.html";
signInLink.appendChild(signInLinkA);
loginMenu.appendChild(signInLink);

var signUpLink = document.createElement("li");
var signUpLinkA = document.createElement("a");
signUpLinkA.textContent = "Sign In";
signUpLinkA.classList.add("dropdown-item");
signUpLinkA.href = "../login.html";
signUpLink.appendChild(signUpLinkA);
loginMenu.appendChild(signUpLink);
}

// 쿠키 가져오기
function getCookie(user) {
const value = `; ${document.cookie}`;
const parts = value.split(`; ${user}=`);
if (parts.length === 2) {
    return parts.pop().split(';').shift();
}
}