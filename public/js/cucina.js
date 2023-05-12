function printOrder(id){
   let orderId = id;
   // get text of internal div with class ora_ordinazione
   let time = document.getElementsByClassName('ora_ordinazione')[0].innerText;
   let print = window.open('../html/print_order.html', "Stampa Ordine", "popup=1,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top="+(screen.height-400)+",left="+(screen.width-840));
   let ingredients = document.getElementById(id).getElementsByClassName('ingredient');
   console.log(ingredients);
   print.document.writeln(`<h1>Ordine ${orderId}</h1>`);
   print.document.writeln(`<h3>${time}</h3>`);
   print.document.writeln(`<div style="line-height:4px; margin-left:30px">`);
   print.document.writeln(`<h3>Ingredienti</h3>`);
   for (let ingredient of ingredients){
      print.document.writeln(`<p>${ingredient.innerText}</p>`);
   }
   print.document.writeln(`</div>`);
   print.window.print();
   print.window.close();
 }