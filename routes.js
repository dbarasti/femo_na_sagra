let express = require("express");
let router = express.Router();
let moment = require('moment');
let fs = require('fs');
let yeast = require("yeast");
let BurgerOrder = require("./models/burger_order");
let BurgerStats = require("./models/burger_stats");
let BeveragesStats = require("./models/beverages_stats");
let BeveragesOrder = require("./models/beverages_order");
let ExtraOrder = require("./models/extra_order");


let Calculator = require("./modules/Calculator");

let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
let redirect = false;
let currentDay = undefined;
let ordiniCompletatiPanini = [];
let ordiniCompletatiBevande = [];
let ordiniCompletatiExtra = [];


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
    if(!currentDay){
        redirect = true;
        res.render("admin", {day: currentDay, config: config});
    }
    else{
        BurgerOrder.find({day: currentDay})
            .sort({ createdAt: "descending" })
            .exec((err, burgerOrders)=>{
                BurgerStats.findOne({day: currentDay})
                    .then(burgerStats=>{
                        BeveragesStats.findOne({day: currentDay})
                            .then(beveragesStats=>{
                                if(burgerOrders.length > 0){
                                    res.render("cassa", { burgerStats: burgerStats, beveragesStats: beveragesStats, lastOrderID: burgerOrders[0].actualOrder.id, config: config });
                                }
                                else{
                                    res.render("cassa", { burgerStats: burgerStats, beveragesStats: beveragesStats, lastOrderID: -1, config: config });
                                }
                            })
                    });
            });
    }
});

router.post("/cassa", (req, res)=>{
    let requestBody = req.body;
    let isStaffOrder = Calculator.isStaffOrder(requestBody);
    let isPriorityOrder = Calculator.isPriorityOrder(requestBody);
    let burgerPrice = Calculator.calculateBurgerPrice(requestBody);
    let beveragesPrice = Calculator.calculateBeveragesPrice(requestBody);
    let extrasPrice = Calculator.calculateExtrasPrice(requestBody);

    if (burgerPrice != 0){
        let newBurgerOrder = new BurgerOrder({
            uid: yeast(),
            day: currentDay,
            prezzo: burgerPrice,
            createdAt: moment(),
            visibility: true,
            actualOrder: requestBody,
            priority: isPriorityOrder,
            staff: isStaffOrder
        });
        newBurgerOrder.save();
        updateBurgersStats(newBurgerOrder);
    }

    if (beveragesPrice != 0){
        let newBeveragesOrder = new BeveragesOrder({
            uid: yeast(),
            day: currentDay,
            prezzo: beveragesPrice,
            createdAt: moment(),
            visibility: true,
            actualOrder: requestBody,
            priority: isPriorityOrder,
            staff: isStaffOrder
        });
        newBeveragesOrder.save();
        updateBeveragesStats(newBeveragesOrder);
    }

    if (extrasPrice != 0){
        let newExtrasOrder = new ExtraOrder({
            uid: yeast(),
            day: currentDay,
            prezzo: extrasPrice,
            createdAt: moment(),
            visibility: true,
            actualOrder: requestBody,
            priority: isPriorityOrder,
            staff: isStaffOrder
        });
        newExtrasOrder.save();
    }

    res.redirect("/cassa");
});

router.get("/orders", (req, res, next)=>{
    if(!currentDay){
        redirect = true;
        res.render("admin", {day: currentDay, config: config});
    } else{
        BurgerOrder.find({day: currentDay, visibility: true})
        .sort({ priority: "descending", createdAt: "ascending" })
        .exec((err, burgerOrders)=>{
            if(err){return next(err); }
            res.render("cucina", {orders: burgerOrders,  moment: moment});
        });
    }
});

router.get("/orders/:uid/remove", (req, res)=> {
    BurgerOrder.findOne({ uid: req.params.uid }, (err, burgerOrder)=>{
    burgerOrder.visibility = false;
    burgerOrder.save();
    ordiniCompletatiPanini.push(burgerOrder.uid);
    res.redirect("/orders");
    }); 
});

router.get("/orders/undo", (req, res)=>{
    if(ordiniCompletatiPanini.length !== 0){
        let uidOfOrderToUndo = ordiniCompletatiPanini.pop();
        BurgerOrder.findOne({ uid: uidOfOrderToUndo }, (err, burgerOrder)=>{
            burgerOrder.visibility = true;
            burgerOrder.save();
        })
    }
    setTimeout(()=>{res.redirect("/orders");}, 300);
});

//GESIONE BAR
router.get("/bar", (req, res, next)=>{
    if(!currentDay){
        redirect = true;
        res.render("admin", {day: currentDay, config: config});
    } else {
        BeveragesOrder.find({day: currentDay, visibility: true})
        .sort({ priority: "descending", createdAt: "ascending" })
        .exec((err, barOrders)=>{
            if(err){return next(err); }
            res.render("bar", {orders: barOrders,  moment: moment});
        });
    }
});

router.get("/bar/:uid/remove", (req, res)=> {
    BeveragesOrder.findOne({ uid: req.params.uid }, (err, beveragesOrder)=>{
    beveragesOrder.visibility = false;
    beveragesOrder.save();
    ordiniCompletatiBevande.push(beveragesOrder.uid);
    res.redirect("/bar");
    }); 
});

router.get("/bar/undo", (req, res)=>{
    if(ordiniCompletatiBevande.length !== 0){
        let uidOfOrderToUndo = ordiniCompletatiBevande.pop();
        BeveragesOrder.findOne({ uid: uidOfOrderToUndo }, (err, beveragesOrder)=>{
            beveragesOrder.visibility = true;
            beveragesOrder.save();
        })
    }
    setTimeout(()=>{res.redirect("/bar");}, 300);
});


//gestione patatine
router.get("/extra", (req, res, next)=>{
    if(!currentDay){
        redirect = true;
        res.render("admin", {day: currentDay, config: config});
    } else {
        ExtraOrder.find({day: currentDay, visibility: true})
            .sort({ priority: "descending", createdAt: "ascending" })
            .exec((err, extraOrders)=>{
                if(err){return next(err); }
                res.render("extra", {orders: extraOrders,  moment: moment});
            });
    }
});

router.get("/extra/:uid/remove", (req, res)=> {
    ExtraOrder.findOne({ uid: req.params.uid }, (err, extraOrder)=>{
        extraOrder.visibility = false;
        extraOrder.save();
        ordiniCompletatiExtra.push(extraOrder.uid);
        res.redirect("/extra");
    });
});

router.get("/extra/undo", (req, res)=>{
    if(ordiniCompletatiExtra.length !== 0){
        let uidOfOrderToUndo = ordiniCompletatiExtra.pop();
        ExtraOrder.findOne({ uid: uidOfOrderToUndo }, (err, extrasOrder)=>{
            extrasOrder.visibility = true;
            extrasOrder.save();
        })
    }
    setTimeout(()=>{res.redirect("/extra");}, 300);
});


router.get("/admin", (req, res, next)=>{
    BurgerStats.findOne({day: currentDay }, (err, burgerStats)=>{
        if(err){return next(err); }
        res.render("admin", {burgerStats: burgerStats, day: currentDay, config: config});
    });
});

router.get("/admin/giorno/:giorno", (req, res)=> {
    if (currentDay != req.params.giorno) {
        currentDay = new Date(req.params.giorno).toISOString();
        ordiniCompletatiPanini = [];
        ordiniCompletatiBevande = [];
    }

    BeveragesStats.findOne({day: currentDay}, (err, doc) => {
        if (!doc) {
            let newBeveragesStats = new BeveragesStats({
                day: currentDay
            });
            newBeveragesStats.save();
        }
    });

    BurgerStats.findOne({day: currentDay}, (err, doc) => {
        if (!doc) {
            let newBurgerStats = new BurgerStats({
                day: currentDay
            });
            newBurgerStats.save();
        }

    });
    if(redirect === true){
        redirect = false;
        setTimeout(()=>{res.redirect("back");}, 400);
    }
    else {
        setTimeout(()=>{res.redirect("/admin");}, 400);
    }
});


router.get("/admin/orders", (req, res, next)=>{
    res.redirect("/admin");
    /*
    BurgerOrder.find()
    .sort({ createdAt: "ascending" })
    .exec((err, burgerOrders)=>{
        if(err){return next(err); }
        res.render("admin_orders_all", {orders: burgerOrders, moment: moment});
    });
     */
});

router.get("/admin/orders/:day", (req, res, next)=>{
    BurgerOrder.find( { day: req.params.day } )
    .sort({ createdAt: "descending" })
    .exec((err, burgerOrders)=>{
        if(err){return next(err); }
        res.render("admin_orders", { day: req.params.day, orders: burgerOrders, /*stats: burgerStats,*/ moment: moment});
    });
});

router.get("/admin/drinks/:day", (req, res, next)=>{
    BeveragesOrder.find( { day: req.params.day } )
    .sort({ createdAt: "descending" })
    .exec((err, beveragesOrders)=>{
        if(err){return next(err); }
        res.render("admin_drinks", { day: req.params.day, orders: beveragesOrders, moment: moment});
    });
});

router.get("/admin/report", (req, res, next)=>{
    BurgerStats.find()
            .sort({ id: "ascending" })
            .exec((err, burgerStats)=>{
                if(err){return next(err); }
                BeveragesStats.find()
                    .sort({id: "ascending"})
                    .exec((err, beveragesStats)=>{
                        if(err){return next(err)}
                        res.render("report", {burgerStats: burgerStats, beveragesStats: beveragesStats});
                    })
            });
});

router.get("/admin/report/carne", (req, res)=>{
    /*
    BurgerOrder.count({carne: 'Hamburger'}, (err, count_hamburger)=>{
        BurgerOrder.count({carne: 'Salsiccia'}, (err, count_salsiccia)=>{
            BurgerOrder.count({}, (err, count_tot)=>{
                res.render("report_carne", { count_hamburger: count_hamburger, count_salsiccia: count_salsiccia, count_tot: count_tot });
            });
        });
    });
    */
    res.status(404).render("404");

});

router.get("/orders/:uid/delete", (req, res, next)=>{
    BurgerOrder.findOne({ uid: req.params.uid }, (err, burgerOrder)=>{
        burgerOrder.remove((err)=>{
        if(err){return next(err); }
        });
        updateBurgersStatsAfterRemove(burgerOrder);
    });
    setTimeout(()=>{res.redirect('back');}, 400);
});

router.get("/drinks/:uid/delete", (req, res, next)=>{
    BeveragesOrder.findOne({ uid: req.params.uid }, (err, beveragesOrder)=>{
        beveragesOrder.remove((err)=>{
        if(err){return next(err); }
        });
        updateBeveragesStatsAfterRemove(beveragesOrder);
    });
    setTimeout(()=>{res.redirect('back');}, 400);
});

router.get("/orders/restore/:uid", (req, res)=>{
    BurgerOrder.findOne({ uid: req.params.uid },  (err, doc)=>{
        doc.visibility = true;
        doc.save();
        setTimeout(()=>{res.redirect('back');}, 500);
    });
});

router.get("/drinks/restore/:uid", (req, res)=>{
    BeveragesOrder.findOne({ uid: req.params.uid }, (err, doc)=>{
        doc.visibility = true;
        doc.save();
        setTimeout(()=>{res.redirect('back');}, 500);
    });
});

router.get("/admin/deleteall/:what", (req, res, next)=>{

    if(req.params.what === "all" || req.params.what ==="panini"){
        BurgerOrder.remove((err)=>{
        if(err){return next(err); }
        });

        BurgerStats.remove((err)=>{
        if(err){return next(err); }
        });
        ordiniCompletatiPanini = [];


        /*eliminazione extra*/ //TODO sistemare in sezione a parte
        ExtraOrder.remove((err)=>{
            if(err){return next(err)}
        })
        ordiniCompletatiExtra = [];

    }

    if(req.params.what === "all" || req.params.what ==="beveragesStats"){
        BeveragesStats.remove((err)=>{
        if(err){return next(err); }
        });

        BeveragesOrder.remove((err)=>{
        if(err){return next(err); }
        });
        ordiniCompletatiBevande = [];

    }
    currentDay = 0;
    res.render("deletedeverything");
});

router.use((request, response)=>{
    response.status(404).render("404");
});


function updateBurgersStats(order){
    if(!order.staff) {
        BurgerStats.findOne({day: order.day})
            .then(stats => {
                stats.total += order.prezzo;
                stats.save();
            })
    }
}

function updateBurgersStatsAfterRemove(order){
    if(!order.staff) {
        BurgerStats.findOne({day: order.day})
            .then(stats => {
                stats.total -= order.prezzo;
                stats.save();
            })
    }
}

function updateBeveragesStats(order){
    if(!order.staff){
        BeveragesStats.findOne({day: order.day})
            .then(stats=>{
                stats.total += order.prezzo;
                stats.save();
            })
    }
}

function updateBeveragesStatsAfterRemove(order){
    if(!order.staff) {
        BeveragesStats.findOne({day: order.day})
            .then(stats => {
                stats.total -= order.prezzo;
                stats.save();
            })
    }
}

module.exports = router;