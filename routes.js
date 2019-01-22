var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
var moment = require('moment');
var yeast = require("yeast");
var Ordine = require("./models/ordine");
var Incasso = require("./models/incasso")
var Bevande = require("./models/bevande");
var Bar = require("./models/bar");

var returnToCassa = false;         //used to go back to /cassa if needed
var giorno = 0;
var ordini_completati = [];
var ordini_completati_bar = [];

router.use((req, res, next)=>{
	res.locals.currentUser = req.Ordine;
	res.locals.currentIncasso = req.incasso;
    res.locals.currentBevande = req.Bevande;
    res.locals.currentBar = req.Bar;
	res.locals.errors = req.flash("error");
	res.locals.infos = req.flash("info");
	next();
});

router.get("/", (req,res)=>{          
	res.render("homepage");
});


router.get("/cassa", (req,res)=>{
    Incasso.findOne({ id: giorno }, (err, incasso)=>{
        //se non è settato il giorno, rimanda alla schermata admin per la selezione
        if(giorno == 0){
            returnToCassa = true;
            res.render("admin", {incassos: incasso, giorno: giorno});
        }
        else{
            Bevande.findOne({id: giorno}, (err, bevande)=> {
                //cerco l'id dell'ultimo ordine eseguito
                Ordine.findOne({giorno: giorno})
                .sort({createdAt: "descending"})
                .exec((err, order)=>{ 
                    if(order){
                        res.render("cassa", {incasso: incasso, bevande: bevande, lastOrderID: order.id });
                    }
                    else
                        res.render("cassa", {incasso: incasso, bevande:bevande, lastOrderID: -1});
                });
            })
        }       

    });  
});

router.post("/cassa", (request, res, next)=>{
    var prezzo_panino=parseFloat(request.body.totalePanino);

    if(prezzo_panino != 0){
        //evito di conteggiare i panini per staff
        if(request.body.priorità == 'priorità' && request.body._id == 0){
            prezzo_panino = 0.0;
        }

        var newOrder = new Ordine({
            uid: yeast(),
            id: request.body._id,
            nome: request.body.nome,
            giorno: giorno,
            prezzo: prezzo_panino,
            priority: request.body.priorità,
            createdAt: moment(),
            carne: request.body.carne,
            double: request.body.double,
            verdura1: request.body.verdura1,
            verdura2: request.body.verdura2,
            verdura3: request.body.verdura3,
            verdura4: request.body.verdura4,
            verdura5: request.body.verdura5,
            verdura6: request.body.verdura6,
            verdura7: request.body.verdura7,
            salsa1: request.body.salsa1,
            salsa2: request.body.salsa2,
            salsa3: request.body.salsa3,
            salsa4: request.body.salsa4,
            visibility: true,
            asporto: request.body.asporto
        });
        newOrder.save();

        Incasso.findOne({ id: giorno }, (err, doc)=>{
            doc.parziale = +doc.parziale + +prezzo_panino;
            doc.save();
        });
    }

    if(parseFloat(request.body.totaleBevande) != 0){
        
        if(!(request.body._id == 0 && request.body.priorità)){
            Bevande.findOne({ id: giorno }, (err, doc)=>{
                doc.totale = +doc.totale + parseFloat(request.body.totaleBevande);
                if(request.body.bevanda1)
                    doc.BA += parseInt(request.body.bevanda1);
                if(request.body.bevanda2)
                    doc.BB += parseInt(request.body.bevanda2);
                if(request.body.bevanda3)
                    doc.BR += parseInt(request.body.bevanda3);
                if(request.body.bevanda4)
                    doc.CC += parseInt(request.body.bevanda4);
                if(request.body.bevanda5)
                    doc.AQ += parseInt(request.body.bevanda5);
                doc.save();
            });
        }

        var newBar = new Bar({
            uid: yeast(),
            id: request.body._id,
            nome: request.body.nome,
            giorno: giorno,
            prezzo: parseFloat(request.body.totaleBevande),
            priority: request.body.priorità,
            BA: request.body.bevanda1,
            BB: request.body.bevanda2,
            BR: request.body.bevanda3,
            CC: request.body.bevanda4,
            AQ: request.body.bevanda5,
            createdAt: moment(),
            visibility: true
        });
        newBar.save();    
    }



    setTimeout(()=>{res.redirect("/cassa");}, 1000); 
});

router.get("/orders", (req, res, next)=>{
    Ordine.find({giorno: giorno, visibility: true})
    .sort({ priority: "descending", createdAt: "ascending", id: "ascending" })
    .exec((err, ordini)=>{
        if(err){return next(err); }
        res.render("cucina", {ordini: ordini,  moment: moment});
    });
});

router.get("/orders/:uid/:giorno/remove", (req, res, next)=> {
    Ordine.findOne({ uid: req.params.uid, giorno: req.params.giorno }, (err, doc)=>{
    doc.visibility = false;
    doc.save();
    var order = doc;
    ordini_completati.push(order);
    res.redirect("/orders");
    //setTimeout(function() {res.redirect("/orders");}, 500); 
    }); 
});

router.get("/orders/undo", (req, res)=>{
    if(ordini_completati.length != 0){
        var undo = ordini_completati.pop();
        Ordine.findOne({ uid: undo.uid }, (err, doc)=>{
            doc.visibility = true;
            doc.save();
        })
    }
    //res.redirect("/orders");
    setTimeout(()=>{res.redirect("/orders");}, 400); 

})

//GESIONE BAR
router.get("/bar", (req, res, next)=>{
    Bar.find({giorno: giorno, visibility: true})
    .sort({ priority: "descending", createdAt: "ascending", id: "ascending" })
    .exec((err, bar)=>{
        if(err){return next(err); }
        res.render("bar", {ordini: bar,  moment: moment});
    });
});

router.get("/bar/:uid/:giorno/remove", (req, res, next)=> {
    Bar.findOne({ uid: req.params.uid, giorno: req.params.giorno }, (err, doc)=>{
    doc.visibility = false;
    doc.save();
    var bar = doc;
    ordini_completati_bar.push(bar);
    res.redirect("/bar");
    //setTimeout(function() {res.redirect("/orders");}, 500); 
    }); 
});

router.get("/bar/undo", (req, res)=>{
    if(ordini_completati_bar.length != 0){
        var undo = ordini_completati_bar.pop();
        Bar.findOne({ uid: undo.uid }, (err, doc)=>{
            doc.visibility = true;
            doc.save();
        })
    }
    //res.redirect("/orders");
    setTimeout(()=>{res.redirect("/bar");}, 400); 

})


router.get("/admin", (req, res, next)=>{
    Incasso.find({id: giorno })
    .exec((err, incassos)=>{
        if(err){return next(err); }
        res.render("admin", {incassos: incassos, giorno: giorno});
    });
});

router.get("/admin/giorno/:giorno", (req, res, next)=>{ //select the day
    if(giorno != req.params.giorno){ 
        giorno = req.params.giorno;
        ordini_completati = [];
    }

    Bevande.findOne({ id: giorno }, (err, doc)=>{
        if(!doc){
            for(var i = 1; i<=6; i+=1){
                var newBevande = new Bevande({
                id: i
                });
                newBevande.save();
            }
        }
    });  

    Incasso.findOne({ id: giorno }, (err, doc)=>{
        if(!doc){
            for(var i = 1; i<=6; i+=1){
                var newIncasso = new Incasso({
                id: i,
                parziale: 0
                });
                newIncasso.save();
            }
        }
        if(returnToCassa == true){
            returnToCassa = false;
            res.redirect("/cassa");
        }
        else
            res.redirect("/admin");
    });  


});

router.get("/admin/orders", (req, res, next)=>{ //mostra tutti gli ordini
    Ordine.find()
    .sort({ createdAt: "ascending", id: "ascending" })
    .exec((err, ordini)=>{
        if(err){return next(err); }
        res.render("admin_orders_all", {ordini: ordini, moment: moment});
    });
});



router.get("/admin/orders/:day", (req, res, next)=>{ //mostra solo una giornata
    Ordine.find( { giorno: req.params.day } )
    .sort({ createdAt: "descending", id: "descending" })
    .exec((err, ordini)=>{
        if(err){return next(err); }
        Incasso.find({ id: req.params.day }, (err, incassos)=>{
        res.render("admin_orders", { ordini: ordini, incassos: incassos, moment: moment});
        });  
    });
}); 
 
router.get("/admin/drinks/:day", (req, res, next)=>{ //mostra tutti gli ordini
    Bar.find( { giorno: req.params.day } )
    .sort({ createdAt: "descending", id: "descending" })
    .exec((err, ordini)=>{
        if(err){return next(err); }
        Bevande.find({ id: req.params.day }, (err, incassos)=>{
        res.render("admin_drinks", { ordini: ordini, incassos: incassos, moment: moment});
        });  
    });
});

router.get("/admin/report", (req, res, next)=>{
    if(giorno == 0)
        res.redirect('back');
    Incasso.find()
    .sort({ id: "ascending" })
    .exec((err, incassi)=>{
        if(err){return next(err); }
        Bevande.find().sort({id: "ascending"}).exec((err, bevande)=>{
            if(err){return next(err)}
            res.render("report", {incassi: incassi, bevande: bevande});
        })
    });
})

router.get("/admin/report/carne", (req, res, next)=>{   //ordini per tipo di carne
    if (giorno == 0) {res.redirect('back');}
    Incasso.find()
    .sort({ id: "ascending" })
    .exec((err, incassi)=>{
        if(err){return next(err); }
        Ordine.count({carne: 'Hamburger'}, (err, count_hamburger)=>{
            Ordine.count({carne: 'Salsiccia'}, (err, count_salsiccia)=>{
                Ordine.count({}, (err, count_tot)=>{
                    res.render("report_carne", { count_hamburger: count_hamburger, count_salsiccia: count_salsiccia, count_tot: count_tot });
                });
            });
        });
    });
})

router.get("/orders/:uid/delete", (req, res, next)=>{  //elimina l'ordine selezionato dal DB
    Ordine.findOne({ uid: req.params.uid }, (err, order)=>{ //forse req.params.giorno inutile?
        Incasso.findOne({ id: order.giorno }, (err, incasso)=>{
            incasso.parziale = +incasso.parziale - +order.prezzo;
            incasso.save();
        });
        order.remove((err,removed)=>{
        if(err){return next(err); }
        });
        res.redirect('back'); 
    }); 
});

router.get("/drinks/:uid/delete", (req, res, next)=>{  //elimina l'ordine selezionato dal DB
    Bar.findOne({ uid: req.params.uid }, (err, order)=>{ 
        Bevande.findOne({ id: order.giorno }, (err, incasso)=>{
            incasso.totale -= +order.prezzo;
            incasso.BA -= order.BA;
            incasso.BB -= order.BB;
            incasso.BR -= order.BR;
            incasso.CC -= order.CC;
            incasso.AQ -= order.AQ;
            incasso.save();
        });
        order.remove((err,removed)=>{
        if(err){return next(err); }
        });
        res.redirect('back'); 
    }); 
});

router.get("/orders/restore/:uid", (req, res, next)=>{  //segna nuovamente l'ordine come non completo
    Ordine.findOne({ uid: req.params.uid },  (err, doc)=>{
        doc.visibility = true;
        doc.save();
        setTimeout(()=>{res.redirect('back');}, 500); 
    }); 
});

router.get("/drinks/restore/:uid", (req, res, next)=>{  //segna nuovamente l'ordine come non completo
    Bar.findOne({ uid: req.params.uid }, (err, doc)=>{
        doc.visibility = true;
        doc.save();
        setTimeout(()=>{res.redirect('back');}, 500); 
    }); 
});

router.get("/orders/edit/:uid", (req, res, next)=>{  
    res.render("order_edit");
});

router.post("/orders/edit/:uid", (request, res, next)=>{  
    Ordine.findOne({ uid: request.params.uid }, (err, order)=>{        
        order.nome = request.body.nome,
        order.priority = request.body.priorità,
        order.carne = request.body.carne,
        order.double = request.body.double,
        order.verdura1 = request.body.verdura1,
        order.verdura2 = request.body.verdura2,
        order.verdura3 = request.body.verdura3,
        order.verdura4 = request.body.verdura4,
        order.verdura5 = request.body.verdura5,
        order.verdura6 = request.body.verdura6,
        order.verdura7 = request.body.verdura7,
        order.salsa1 = request.body.salsa1,
        order.salsa2 = request.body.salsa2,
        order.salsa3 = request.body.salsa3,
        order.salsa4 = request.body.salsa4
        var new_prezzo_panino;
        var old_prezzo_panino = order.prezzo;
        if(request.body.double == "Double")
            new_prezzo_panino = 9;
        else
            new_prezzo_panino = 7;
        if(!request.body.carne)
            new_prezzo_panino = 5;
        if(old_prezzo_panino != new_prezzo_panino){
            Incasso.findOne({ id: order.giorno }, (err, incasso)=>{
                incasso.parziale = +incasso.parziale - old_prezzo_panino;
                incasso.parziale = +incasso.parziale + new_prezzo_panino;
                incasso.save();
            });
        }
        order.prezzo = new_prezzo_panino;
        order.save();     
        res.redirect("/cassa");
    }); 
});

router.get("/admin/deleteall/:what", (req, res, next)=>{ //elimina tutti gli ordini dal DB
    
    if(req.params.what == "all" || req.params.what =="panini"){
        Ordine.remove((err,removed)=>{
        if(err){return next(err); }
        });
        
        Incasso.remove((err,removed)=>{
        if(err){return next(err); }
        });
    }
    
    if(req.params.what == "all" || req.params.what =="bevande"){
        Bevande.remove((err,removed)=>{
        if(err){return next(err); }
        });
        
        Bar.remove((err,removed)=>{
        if(err){return next(err); }
        });
    }
    
    giorno = 0;
    res.render("deletedeverything");
});

router.use((request, response)=>{
    response.status(404).render("404");
});

module.exports = router;
