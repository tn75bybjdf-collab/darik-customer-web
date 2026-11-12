/* Al Salam mobile: original Best Sellers mechanics on the approved visual theme.
   All products are live catalog products, grouped by category and ordered by
   actual sales units (with original catalog order as the fallback). */
(function () {
  "use strict";
  if (window.__darikAlSalamBestSellerRestore) return;
  window.__darikAlSalamBestSellerRestore = true;

  var grid = document.getElementById("featuredGrid");
  if (!grid || typeof data === "undefined") return;
  var salesUnits = {};
  var shelves = [];
  var style = document.createElement("style");
  style.id = "darik-alsalam-bestseller-style";
  style.textContent = [
    "#featuredGrid.alsalam-seller-shelves{display:block;padding:0 0 16px;}",
    ".alsalam-seller-shelf{padding:0 10px 17px;}",
    ".alsalam-seller-heading{border:0;background:none;color:#17171e;font-size:13px;font-weight:850;padding:4px 2px 11px;display:flex;justify-content:space-between;align-items:center;width:100%;text-align:left;}",
    ".alsalam-seller-heading span:last-child{color:#b10024;font-size:18px;padding-right:3px;}",
    ".alsalam-seller-shell{position:relative;}",
    ".alsalam-seller-track{display:flex;gap:11px;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;touch-action:auto;scrollbar-width:none;padding:0 4px 12px 1px;-webkit-overflow-scrolling:touch;}",
    ".alsalam-seller-track::-webkit-scrollbar{display:none;}",
    ".alsalam-seller-card{flex:0 0 45%;max-width:210px;min-width:0;scroll-snap-align:start;border-radius:14px;background:#fff;box-shadow:0 3px 11px #00000014;border:1px solid #efedf0;overflow:hidden;display:flex;flex-direction:column;}",
    ".alsalam-seller-image{height:133px;width:100%;background:linear-gradient(#fff,#faf8f8);display:flex;align-items:center;justify-content:center;overflow:hidden;}",
    ".alsalam-seller-image img{height:100%;width:100%;object-fit:contain;}",
    ".alsalam-seller-info{padding:9px 10px 10px;flex:1;display:flex;flex-direction:column;}",
    ".alsalam-seller-name{font-weight:850;font-size:12px;line-height:1.25;min-height:30px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}",
    ".alsalam-seller-ar{color:#676573;font-size:10px;min-height:15px;margin:4px 0 9px;direction:rtl;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
    ".alsalam-seller-bottom{display:flex;align-items:center;justify-content:space-between;margin-top:auto;gap:5px;}",
    ".alsalam-seller-price{font-size:13px;font-weight:900;white-space:nowrap;}",
    ".alsalam-seller-add{border:0;background:#b90029;color:#fff;width:31px;height:31px;min-width:31px;border-radius:9px;font-size:23px;display:grid;place-items:center;}",
    ".alsalam-seller-next{position:absolute;right:1px;top:37%;width:32px;height:44px;border-radius:12px 0 0 12px;border:1px solid #eee;background:#fffffff0;color:#ad0928;font-size:30px;box-shadow:0 2px 9px #0002;z-index:2;}",
    ".alsalam-seller-next[hidden]{display:none;}",
    "@media(min-width:501px){.alsalam-seller-card{flex-basis:30%;}.alsalam-seller-image{height:155px;}}",
    "@media(max-width:365px){.alsalam-seller-card{flex-basis:47%;}.alsalam-seller-price{font-size:11px;}}"
  ].join("");
  document.head.appendChild(style);
  grid.classList.add("alsalam-seller-shelves");
  // The artwork contains a fixed "1". Cover that print and display the real cart total.
  var badgeMast=document.querySelector(".mast");
  if(badgeMast) {
    var cover=document.createElement("span");
    cover.id="darik-cart-printed-badge-cover";
    cover.setAttribute("aria-hidden","true");
    badgeMast.appendChild(cover);
  }
  var countStyle=document.createElement("style");
  countStyle.textContent=[
    "#darik-cart-printed-badge-cover{position:absolute;right:1.2%;top:43%;width:5.1%;height:22%;border-radius:14px;background:linear-gradient(125deg,#900014,#780013);z-index:7;pointer-events:none;}",
    ".mast #topCounter{right:2.1%!important;top:44%!important;min-width:19px!important;height:19px!important;padding:2px 4px!important;border-radius:999px!important;background:white!important;color:#ac0628!important;font-size:11px!important;font-weight:950!important;z-index:12!important;line-height:1!important;pointer-events:none;}",
    ".mast .hotspot.cart{z-index:16!important;}"
  ].join("");
  document.head.appendChild(countStyle);
  function syncLiveCartCount(value) {
    var count=Math.max(0,Math.floor(Number(value)||0));
    var label=count>99?"99+":String(count);
    for(var key of ["topCounter","navCounter"]){
      var el=document.getElementById(key);
      if(!el)continue;
      el.textContent=label;
      el.style.display=count>0?(key==="topCounter"?"flex":"block"):"none";
    }
  }
  window.addEventListener("message",function(event){
    if(event.origin!==window.location.origin||event.data?.type!=="darik-alsalam-cart-count")return;
    syncLiveCartCount(event.data.count);
  });

  // The approved illustration included a mock iPhone status bar printed
  // inside its header artwork. Cover only those baked-in phone indicators.
  // All actual store branding, cart actions and navigation stay untouched.
  var deviceChromeCleanup = document.createElement("style");
  deviceChromeCleanup.id = "darik-alsalam-remove-faux-phone-status";
  deviceChromeCleanup.textContent = [
    ".mast::before,.mast::after{content:'';position:absolute;top:0;height:40%;z-index:5;pointer-events:none;}",
    ".mast::before{left:0;width:15.5%;background:linear-gradient(90deg,#73050d 0%,#76050e 42%,#830310 100%);}",
    ".mast::after{right:0;width:27%;background:linear-gradient(90deg,#920113 0%,#890210 30%,#7c0410 62%,#72050e 100%);}",
    ".home-indicator{display:none!important;}"
  ].join("");
  document.head.appendChild(deviceChromeCleanup);


  function safe(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char];
    });
  }
  function key(value) { return String(value || "").trim().toLowerCase(); }
  function unitCount(product) {
    return Number(salesUnits[product.liveId || product.id] || 0);
  }
  function artFor(product) {
    var originals = (typeof originalsLive !== "undefined" && Array.isArray(originalsLive.featured))
      ? originalsLive.featured : [];
    var match = originals.find(function (x) { return key(x.name) === key(product.name); });
    return (match && match.art) || product.img || product.fallback_img ||
      ((data.categories.find(function(c){return key(c.name)===key(product.category);}) || {}).image) || "";
  }
  function buildCard(product) {
    var id = Number(product.id);
    if (!Number.isInteger(id) || id < 0) return "";
    return '<article class="alsalam-seller-card">' +
      '<div class="alsalam-seller-image"><img loading="lazy" src="' + safe(artFor(product)) +
      '" alt="' + safe(product.name) + '"></div>' +
      '<div class="alsalam-seller-info"><div class="alsalam-seller-name">' + safe(product.name) + '</div>' +
      '<div class="alsalam-seller-ar">' + safe(product.ar) + '</div>' +
      '<div class="alsalam-seller-bottom"><strong class="alsalam-seller-price">' +
      (Number(product.price) || 0).toFixed(2) +
      ' JOD</strong><button class="alsalam-seller-add" type="button" aria-label="Add ' +
      safe(product.name) + '" onclick="add(' + id + ')">+</button></div></div></article>';
  }
  window.alsalamBestSellerOpenCategory = function (index) {
    if (shelves[index]) openCategory(shelves[index].category.name);
  };
  window.alsalamBestSellerScroll = function (index) {
    var el = document.getElementById("alsalam-seller-track-" + index);
    if (el) el.scrollBy({left:Math.max(180,el.clientWidth * .8),behavior:"smooth"});
  };
  function refreshArrows() {
    shelves.forEach(function(group,index){
      var el=document.getElementById("alsalam-seller-track-"+index);
      var arrow=document.getElementById("alsalam-seller-next-"+index);
      if (el && arrow) arrow.hidden = el.scrollWidth - el.clientWidth - el.scrollLeft < 8;
    });
  }
  function renderBestSellers() {
    var list = Array.isArray(data.products) ? data.products : [];
    var cats = Array.isArray(data.categories) ? data.categories : [];
    shelves = cats.map(function(category){
      var ranked=list.map(function(p,i){return {p:p,i:i};})
        .filter(function(row){return key(row.p.category)===key(category.name);})
        .sort(function(a,b){return unitCount(b.p)-unitCount(a.p)||a.i-b.i;})
        .map(function(row){return row.p;});
      return {category:category,products:ranked};
    }).filter(function(group){return group.products.length>0;});
    grid.innerHTML = shelves.map(function(group,index){
      var title="Best Sellers in "+group.category.name;
      return '<section class="alsalam-seller-shelf"><button class="alsalam-seller-heading" type="button" onclick="alsalamBestSellerOpenCategory('+
        index+')" aria-label="'+safe(title)+'"><span>'+safe(title)+'</span><span>→</span></button>'+
        '<div class="alsalam-seller-shell"><div class="alsalam-seller-track" id="alsalam-seller-track-'+index+
        '" onscroll="alsalamBestSellerRefreshArrows()">'+group.products.map(buildCard).join("")+'</div>'+
        '<button class="alsalam-seller-next" id="alsalam-seller-next-'+index+
        '" type="button" onclick="alsalamBestSellerScroll('+index+')" aria-label="See more '+
        safe(group.category.name)+' products">›</button></div></section>';
    }).join("");
    requestAnimationFrame(refreshArrows);
  }
  window.alsalamBestSellerRefreshArrows = refreshArrows;
  window.addEventListener("resize",refreshArrows);
  window.addEventListener("message",function(event){
    if(event.origin!==window.location.origin || event.data?.type!=="darik-alsalam-bestseller-sales")return;
    salesUnits=(event.data.units && typeof event.data.units==="object")?event.data.units:{};
    renderBestSellers();
  });
  window.renderFeatured=renderBestSellers;
  renderBestSellers();
})();