
const themeBtn= document.getElementById("theme-btn");

if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-mode");
    themeBtn.classList.remove("fa-moon");
   themeBtn.classList.add("fa-sun");
}

themeBtn.addEventListener("click", function(){

    document.body.classList.toggle('dark-mode');

    if(document.body.classList.contains('dark-mode')){
        localStorage.setItem("theme","dark");
        themeBtn.classList.remove('fa-moon');
    themeBtn.classList.add('fa-sun');
  }else{
     localStorage.setItem("theme","light");
    themeBtn.classList.remove('fa-sun');
    themeBtn.classList.add('fa-moon');
  }
});

// Active Navigation Link
const sections = document.querySelectorAll("section,hero");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", function () {
  let current = "";

  sections.forEach(function(section)  {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(function(link)  {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});



const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector("nav");

menuBtn.addEventListener("click", function(){
   nav.classList.toggle("active");
});

document.querySelectorAll(".nav a")
navLinks.forEach(function(link) {
    link.addEventListener("click", function(){
        
            nav.classList.remove("active");
        });
    });


const scrollBtn = document.getElementById("scroll-top");

window.addEventListener("scroll", function(){
    if(window.scrollY > 300){
       scrollBtn.style.display = "flex";
    }
    else{
       scrollBtn.style.display = "none";
    }
});

scrollBtn.addEventListener("click",function(){
    window.scrollTo({
        top:0,
        behavior:"smooth"
    })
});
// Header scroll effect
const header = document.querySelector("header");

window.addEventListener("scroll", function(){
    if(window.scrollY > 40){
        header.classList.add("sticky");
    }else{
        header.classList.remove("sticky");
    }
});

// ========= Festival Popup + Countdown Timer =========
const festivalModal = document.getElementById("festivalModal");
const modalClose = document.getElementById("modalClose");
const popDays = document.getElementById("popDays");
const popHours = document.getElementById("popHours");
const popMinutes = document.getElementById("popMinutes");
const popSeconds = document.getElementById("popSeconds");
const popNote = document.getElementById("popNote");
const festivalTarget = new Date("August 30, 2026 09:00:00").getTime();
let festivalTimer;

function startFestivalTimer(){
    if(!popDays || !popHours || !popMinutes || !popSeconds || !popNote){
        clearInterval(festivalTimer);
        return;
    }
    festivalTimer = setInterval(function(){
        const now = new Date().getTime();
        const diff = festivalTarget - now;
        if(diff <= 0){
            clearInterval(festivalTimer);
            popDays.textContent="00";
            popHours.textContent="00";
            popMinutes.textContent="00";
            popSeconds.textContent="00";
            popNote.textContent="🎉 Festival is LIVE now!";
            return;
        }
        const d = Math.floor(diff / (1000*60*60*24));
        const h = Math.floor((diff % (1000*60*60*24))/(1000*60*60));
        const m = Math.floor((diff % (1000*60*60))/(1000*60));
        const s = Math.floor((diff % (1000*60)) /1000);

        popDays.textContent = String(d).padStart(2,"0");
        popHours.textContent = String(h).padStart(2,"0");
        popMinutes.textContent = String(m).padStart(2,"0");
        popSeconds.textContent = String(s).padStart(2,"0");
    },1000);
}

function closeFestivalModal(){
    if(festivalModal) festivalModal.classList.remove("show");
    clearInterval(festivalTimer);
}

if(festivalModal && modalClose){
    // show popup when page finishes loading
    window.addEventListener("load",function(){
        festivalModal.classList.add("show");
        startFestivalTimer();
    });
    // close button
    modalClose.addEventListener("click", closeFestivalModal);
    // click dark background to close
    festivalModal.addEventListener("click",function(e){
        if(e.target === festivalModal){
            closeFestivalModal();
        }
    });
}
// ========== Festival Registration Form ==========
const registerForm = document.getElementById("registerForm");
const regName = document.getElementById("regName");
const regEmail = document.getElementById("regEmail");
const regGuests = document.getElementById("regGuests");
const regPhone = document.getElementById("regPhone");
const regMessage = document.getElementById("regMessage");

// simple email validator helper
function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email.trim());
}

if(registerForm){
    registerForm.addEventListener("submit", function(e){
        e.preventDefault();
        // reset old message
        regMessage.textContent = "";
        regMessage.style.color = "";

        const nameVal = regName.value.trim();
        const emailVal = regEmail.value.trim();
        const guestsVal = Number(regGuests.value);
        const phoneVal = regPhone.value.trim();

        let isValid = true;

        // Validate Name
        if(nameVal.length < 3){
            regMessage.textContent = " Full Name must be at least 3 characters";
            regMessage.style.color="#e74c3c";
            isValid = false;
        }
        // Validate Email
        else if(!validateEmail(emailVal)){
            regMessage.textContent = " Please enter valid Email address";
            regMessage.style.color="#e74c3c";
            isValid = false;
        }
        // Validate Guests
        else if(isNaN(guestsVal) || guestsVal <1 || guestsVal>20){
            regMessage.textContent = " Guests number must be between 1‑20";
            regMessage.style.color="#e74c3c";
            isValid = false;
        }
        // Validate Phone
        else if(phoneVal.length <10){
            regMessage.textContent = " Phone number must be minimum 10 digits";
            regMessage.style.color="#e74c3c";
            isValid = false;
        }

        if(!isValid){
            return;
        }

        // All valid: build registration object
        const registrationData = {
            fullName: nameVal,
            email: emailVal,
            guests: guestsVal,
            phone: phoneVal,
            registeredAt: new Date().toLocaleString()
        };

        // save to localStorage (append new entry)
        let allRegistrations = JSON.parse(localStorage.getItem("festivalRegistrations")) || [];
        allRegistrations.push(registrationData);
        localStorage.setItem("festivalRegistrations", JSON.stringify(allRegistrations));

        // success feedback
        regMessage.textContent = " Registration Successful! We will contact you via email.";
        regMessage.style.color="#27ae60";

        // reset form
        registerForm.reset();
    });
}
