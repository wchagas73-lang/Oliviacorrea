const menuButton=document.querySelector(".menu-toggle");
const nav=document.querySelector(".topbar nav");

menuButton.addEventListener("click",()=>{
  const opened=nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded",String(opened));
});

nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded","false");
}));

document.getElementById("year").textContent=new Date().getFullYear();

/* Revela secoes e fotos conforme a pessoa percorre a pagina */
if("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  const revealItems=document.querySelectorAll(
    ".intro,.collection,.brand-story,.reviews,.faq,.visit,.gallery .product-card,.review-card"
  );
  revealItems.forEach((item,index)=>{
    item.classList.add("reveal-on-scroll");
    if(item.classList.contains("product-card") || item.classList.contains("review-card")){
      item.style.transitionDelay=(Math.min(index%6,5)*90)+"ms";
    }
  });
  const revealObserver=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:0.12,rootMargin:"0px 0px -35px 0px"});
  revealItems.forEach(item=>revealObserver.observe(item));
}


/* Evita deixar um quadrado vazio na colecao se uma imagem estiver indisponivel */
document.querySelectorAll("#colecao .gallery .product-card img").forEach(image=>{
  const hideEmptyCard=()=>{
    const card=image.closest(".product-card");
    if(card) card.hidden=true;
  };
  if(image.complete && image.naturalWidth===0) hideEmptyCard();
  image.addEventListener("error",hideEmptyCard);
});
