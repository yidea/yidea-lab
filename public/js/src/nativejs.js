(function () {

  //@ DOM selector
  // $(".test")
  var testList1 = document.querySelectorAll(".test"); //general css xpath
  var testList2 = document.getElementsByClassName("test"); //faster
  // document.getElementById(idname); document.getElementsByTagName(tagname);
  
  // $(".test").get(0)
  var testLink1 = document.querySelector(".test"); //return first match

  //@ DOM manipulation
  // $(".zone1").append("<div id='div1'><img src='im.gif'/></div>")
  // testLink1.innerHTML = "<div id='div1'><img src='im.gif'/></div>" //jquery uses native innerHTML
  //DOM building tech
  var frag = document.createDocumentFragment();
  var div1 = document.createElement("div");
  div1.id = "div1";
  var img1 = document.createElement("img");
  img1.src = "im.gif";
  div1.appendChild(img1);
  frag.appendChild(div1);
  var zone1 = document.querySelector("#zone1");
  zone1.appendChild(frag); //insertBefore(), removeChild()

  //@ CSS class
  // $(".test").hasClass("test")
  if (testLink1.classList.contains("test")) {console.log(1)};
  
  // $(".test").addClass("test-link")
  testLink1.classList.add("test-link"); //only apply to node ,not nodeList

  // $(".test").removeClass("test-link")
  testLink1.classList.remove("test-link");

  //@ CSS style
  // $(".test").css({background: "#ccc"})
  testLink1.style.background = "#ccc";
  
})();
