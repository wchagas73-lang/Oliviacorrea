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


/* Visualizacao ampliada acessivel para fotos do site */
(()=>{
  const images=[...document.querySelectorAll(".hero-photo img, #colecao .gallery .product-card img, .story-product img, .story-photo img")];
  if(!images.length) return;
  const viewer=document.createElement("dialog");
  viewer.className="photo-viewer";
  viewer.setAttribute("aria-label","Foto ampliada");
  viewer.innerHTML='<button class="photo-viewer-close" type="button" aria-label="Fechar foto ampliada">×</button><img class="photo-viewer-image" alt=""><p class="photo-viewer-hint">Toque fora da foto ou no X para fechar</p>';
  document.body.appendChild(viewer);
  const enlarged=viewer.querySelector(".photo-viewer-image");
  const closeButton=viewer.querySelector(".photo-viewer-close");
  const closeViewer=()=>{if(viewer.open)viewer.close();};
  images.forEach(image=>{
    image.classList.add("photo-zoomable");
    image.setAttribute("tabindex","0");
    image.setAttribute("role","button");
    image.setAttribute("aria-label",(image.alt||"Foto")+". Pressione Enter para ampliar.");
    const openViewer=()=>{
      enlarged.src=image.currentSrc||image.src;
      enlarged.alt=image.alt||"Foto ampliada";
      if(typeof viewer.showModal==="function") viewer.showModal();
      else viewer.setAttribute("open","");
      closeButton.focus();
    };
    image.addEventListener("click",openViewer);
    image.addEventListener("keydown",event=>{
      if(event.key==="Enter"||event.key===" "){event.preventDefault();openViewer();}
    });
  });
  closeButton.addEventListener("click",closeViewer);
  viewer.addEventListener("click",event=>{if(event.target===viewer)closeViewer();});
  viewer.addEventListener("close",()=>enlarged.removeAttribute("src"));
})();
