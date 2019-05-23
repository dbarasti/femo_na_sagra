let express = require("express");
let router = express.Router();
let moment = require('moment');
let fs = require('fs');
let yeast = require("yeast");
let BurgerOrder = require("./models/burger_order");
let BurgerStats = require("./models/burger_stats");
let BeveragesStats = require("./models/beverages_stats");
let BeveragesOrder = require("./models/beverages_order");
let Calculator = require("./modules/Calculator");

let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
let returnToCassa = false;
let currentDay = 0;
let ordiniCompletatiPanini = [];
let ordiniCompletatiBevande = [];

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
    if(currentDay === 0){
        returnToCassa = true;
        res.render("admin", {day: currentDay});
    }
    else{
        BurgerOrder.find({day: currentDay})
            .sort({ createdAt: "descending" })
            .exec((err, burgerOrders)=>{
                if(burgerOrders.length > 0){
                    //console.log(burgerOrders[0]);
                    res.render("cassa", { lastOrderID: burgerOrders[0].actualOrder.id, config: config });
                }
                else{
                    //console.log(currentDay);
                    res.render("cassa", { lastOrderID: -1, config: config });
                }
            });
    }
});

router.post("/cassa", (req, res)=>{
    let requestBody = req.body;
    //console.log(requestBody);
    let isStaffOrder = Calculator.isStaffOrder(requestBody);
    let isPriorityOrder = Calculator.isPriorityOrder(requestBody);
    let burgerPrice = Calculator.calculateBurgerPrice(requestBody);
    let beveragesPrice = Calculator.calculateBeveragesPrice(requestBody);
    //console.log(`Prezzo panino: ${burgerPrice}`);
    //console.log(`Prezzo bevande: ${beveragesPrice}`);

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
    }

    res.redirect("/cassa");
});

router.get("/orders", (req, res, next)=>{
    BurgerOrder.find({day: currentDay, visibility: true})
    .sort({ priority: "descending", createdAt: "ascending" })
    .exec((err, burgerOrders)=>{
        if(err){return next(err); }
        res.render("cucina", {orders: burgerOrders,  moment: moment});
    });
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
    res.redirect("/orders");
    //setTimeout(()=>{res.redirect("/orders");}, 400);
});

//GESIONE BAR
router.get("/bar", (req, res, next)=>{
    BeveragesOrder.find({day: currentDay, visibility: true})
    .sort({ priority: "descending", createdAt: "ascending" })
    .exec((err, barOrders)=>{
        if(err){return next(err); }
        res.render("bar", {orders: barOrders,  moment: moment});
    });
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
    res.redirect("/orders");
    //setTimeout(()=>{res.redirect("/bar");}, 400);
});


router.get("/admin", (req, res, next)=>{
    BurgerStats.findOne({day: currentDay }, (err, burgerStats)=>{
        if(err){return next(err); }
        res.render("admin", {burgerStats: burgerStats, day: currentDay});
    });
});

router.get("/admin/giorno/:giorno", (req, res)=> {
    if (currentDay !== req.params.giorno) {
        currentDay = req.params.giorno;
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
    if(returnToCassa === true){
        returnToCassa = false;
        res.redirect("/cassa");
    }
    else {
        setTimeout(()=>{res.redirect("/admin");}, 400);
        //res.redirect("/admin");
    }
});

router.get("/admin/orders", (req, res, next)=>{
    BurgerOrder.find()
    .sort({ createdAt: "ascending" })
    .exec((err, burgerOrders)=>{
        if(err){return next(err); }
        res.render("admin_orders_all", {orders: burgerOrders, moment: moment});
    });
});

router.get("/admin/orders/:day", (req, res, next)=>{
    BurgerOrder.find( { day: req.params.day } )
    .sort({ createdAt: "descending" })
    .exec((err, burgerOrders)=>{
        if(err){return next(err); }
        BurgerStats.find({ day: req.params.day }, (err, burgerStats)=>{
        res.render("admin_orders", { orders: burgerOrders, stats: burgerStats, moment: moment});
        });
    });
});

router.get("/admin/drinks/:day", (req, res, next)=>{
    BeveragesOrder.find( { day: req.params.day } )
    .sort({ createdAt: "descending" })
    .exec((err, beveragesOrders)=>{
        if(err){return next(err); }
        BeveragesStats.find({ day: req.params.day }, (err, beveragesStats)=>{
        res.render("admin_drinks", { orders: beveragesOrders, stats: beveragesStats, moment: moment});
        });
    });
});

router.get("/admin/report", (req, res, next)=>{
    if(currentDay === 0)
        res.redirect('back');
    BurgerStats.find()
    .sort({ day: "ascending" })
    .exec((err, burgerStats)=>{
        if(err){return next(err); }
        BeveragesStats.find().sort({day: "ascending"}).exec((err, bevande)=>{
            if(err){return next(err)}
            res.render("report", {burgerStats: burgerStats, beveragesStats: bevande});
        })
    });
});

router.get("/admin/report/carne", (req, res)=>{
    if (currentDay === 0) {res.redirect('back');}
    BurgerOrder.count({carne: 'Hamburger'}, (err, count_hamburger)=>{
        BurgerOrder.count({carne: 'Salsiccia'}, (err, count_salsiccia)=>{
            BurgerOrder.count({}, (err, count_tot)=>{
                res.render("report_carne", { count_hamburger: count_hamburger, count_salsiccia: count_salsiccia, count_tot: count_tot });
            });
        });
    });
});

router.get("/orders/:uid/delete", (req, res, next)=>{
    BurgerOrder.findOne({ uid: req.params.uid }, (err, burgerOrder)=>{
        BurgerStats.findOne({ day: burgerOrder.day }, (err, burgerStats)=>{
            burgerStats.total = +burgerStats.total - +burgerOrder.prezzo;
            burgerStats.save();
        });
        burgerOrder.remove((err)=>{
        if(err){return next(err); }
        });
        res.redirect('back');
    });
});

router.get("/drinks/:uid/delete", (req, res, next)=>{
    BeveragesOrder.findOne({ uid: req.params.uid }, (err, beveragesOrder)=>{
        BeveragesStats.findOne({ day: beveragesOrder.day }, (err, beveragesStats)=>{
            beveragesStats.totale -= +beveragesOrder.prezzo;
            beveragesStats.BAB -= beveragesOrder.BAB;
            beveragesStats.BB -= beveragesOrder.BB;
            beveragesStats.BAR -= beveragesOrder.BAR;
            beveragesStats.CC -= beveragesOrder.CC;
            beveragesStats.AQ -= beveragesOrder.AQ;
            beveragesStats.save();
        });
        beveragesOrder.remove((err)=>{
        if(err){return next(err); }
        });
        res.redirect('back');
    });
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
    }

    if(req.params.what === "all" || req.params.what ==="beveragesStats"){
        BeveragesStats.remove((err)=>{
        if(err){return next(err); }
        });

        BeveragesOrder.remove((err)=>{
        if(err){return next(err); }
        });
    }

    currentDay = 0;
    res.render("deletedeverything");
});

router.use((request, response)=>{
    response.status(404).render("404");
});

module.exports = router;