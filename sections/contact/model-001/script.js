const form=document.querySelector("#contactForm");
const message=document.querySelector("#message");
const count=document.querySelector(".char-count");
const status=document.querySelector("#formStatus");

message.addEventListener("input",()=>{
  if(message.value.length>500)message.value=message.value.slice(0,500);
  count.textContent=`${message.value.length} / 500`;
});

function validateField(el){
  const field=el.closest(".field");
  if(!field)return true;

  let valid=el.value.trim()!=="";

  if(el.type==="email")
    valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);

  field.classList.toggle("invalid",!valid);
  return valid;
}

form.querySelectorAll("input[required],select[required],textarea[required]").forEach(el=>{
  el.addEventListener("blur",()=>validateField(el));
  el.addEventListener("input",()=>validateField(el));
  el.addEventListener("change",()=>validateField(el));
});

form.addEventListener("submit",e=>{
  e.preventDefault();

  const required=[...form.querySelectorAll("input[required],select[required],textarea[required]")];
  const valid=required.every(validateField);
  const consent=form.querySelector(".consent input");

  if(!valid||!consent.checked)return;

  const btn=form.querySelector(".submit");

  btn.disabled=true;
  btn.querySelector("span").textContent="Sending...";

  setTimeout(()=>{
    btn.disabled=false;
    btn.querySelector("span").textContent="Send project inquiry";
    status.classList.add("show");
    form.reset();
    count.textContent="0 / 500";
  },900);
});