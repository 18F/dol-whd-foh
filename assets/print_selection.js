document.addEventListener("DOMContentLoaded", function() {

  var printLinks = document.getElementsByClassName("print_section");

  var printDiv = function() {
    var divToPrint = this.getAttribute("data-section");
    var printContents = document.getElementById(divToPrint).innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };
  
  for(var i=0; i<printLinks.length; i++){
    printLinks[i].addEventListener('click', printDiv, false);
  }
});