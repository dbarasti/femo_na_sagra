let express = require("express");
let router = express.Router();
let moment = require("moment");
let fs = require("fs");
let yeast = require("yeast");
let BurgerOrder = require("./models/burger_order");
let BurgerStats = require("./models/burger_stats");
let BeveragesStats = require("./models/beverages_stats");
let BeveragesOrder = require("./models/beverages_order");
let ExtraOrder = require("./models/extra_order");
let ExtrasStats = require("./models/extras_stats");
let Ingredient = require("./models/ingredient");

let Calculator = require("./modules/Calculator");

let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
loadConfiguration();
let currentDay = undefined;
let deliveredBurgerOrders = [];
let deliveredBeverageOrder = [];
let completedBurgerOrders = [];
let completedExtraOrders = [];

const authentication = process.env.PASSWORD;

function isAuth(req, res, next) {
  const auth = req.cookies.password;
  if (!authentication || auth === authentication) {
    next();
  } else {
    res.status(401);
    res.render("login");
  }
}

router.use((req, res, next) => {
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

router.post("/login", (req, res) => {
  if (req.body.password === authentication) {
    res.redirect("back");
  } else {
    req.flash("error", "Wrong password");
    res.render("login");
  }
});

router.get("/", isAuth, (req, res) => {
  res.render("homepage");
});

router.get("/cassa", isAuth, async (req, res) => {
  if (!currentDay) {
    return res.render("admin", { day: currentDay, config: config });
  }
  stats = await computeCurrentDaysTotals();

  const burgerOrders = await BurgerOrder.findOne({ day: currentDay }).sort({
    createdAt: "descending",
  });
  const beveragesOrders = await BeveragesOrder.findOne({
    day: currentDay,
  }).sort({ createdAt: "descending" });
  const extraOrders = await ExtraOrder.findOne({ day: currentDay }).sort({
    createdAt: "descending",
  });

  const lockedIngredients = await Ingredient.find({ available: false }, "id");
  const lockedIngredientsIDs = lockedIngredients.map(
    (ingredient) => ingredient.id
  );
  const lastID = Math.max(
    burgerOrders ? burgerOrders.actualOrder.id : 0,
    beveragesOrders ? beveragesOrders.actualOrder.id : 0,
    extraOrders ? extraOrders.actualOrder.id : 0
  );
  res.render("cassa", {
    currentDay: currentDay,
    stats: stats,
    lastOrderID: lastID,
    config: config,
    lockedIngredientsIDs: lockedIngredientsIDs,
  });
});

router.post("/cassa", isAuth, async (req, res) => {
  if (!currentDay) {
    res.render("admin", { day: currentDay, config: config });
    return;
  }
  let requestBody = req.body;
  let isStaffOrder = Calculator.isStaffOrder(requestBody);
  let isPriorityOrder = Calculator.isPriorityOrder(requestBody);
  let burgerPrice = Calculator.calculateBurgerPrice(requestBody);
  let beveragesPrice = Calculator.calculateBeveragesPrice(requestBody);
  let extrasPrice = Calculator.calculateExtrasPrice(requestBody);
  let paymentMethod = requestBody.paymentMethod;

  requestBody.id = requestBody.id.trim();

  if (burgerPrice != 0) {
    let newBurgerOrder = new BurgerOrder({
      uid: yeast(),
      day: currentDay,
      prezzo: burgerPrice,
      actualOrder: requestBody,
      priority: isPriorityOrder,
      staff: isStaffOrder,
      paymentMethod: paymentMethod,
    });
    await newBurgerOrder.save();
    updateBurgersStats(newBurgerOrder);
  }

  if (beveragesPrice != 0) {
    let newBeveragesOrder = new BeveragesOrder({
      uid: yeast(),
      day: currentDay,
      prezzo: beveragesPrice,
      actualOrder: requestBody,
      priority: isPriorityOrder,
      staff: isStaffOrder,
      paymentMethod: paymentMethod,
    });
    await newBeveragesOrder.save();
    updateBeveragesStats(newBeveragesOrder);
  }

  if (extrasPrice != 0) {
    let newExtrasOrder = new ExtraOrder({
      uid: yeast(),
      day: currentDay,
      prezzo: extrasPrice,
      actualOrder: requestBody,
      priority: isPriorityOrder,
      staff: isStaffOrder,
      paymentMethod: paymentMethod,
    });
    await newExtrasOrder.save();
    updateExtrasStats(newExtrasOrder);
  }

  res.redirect("/cassa");
});

router.get("/orders", (req, res, next) => {
  if (!currentDay) {
    res.render("admin", { day: currentDay, config: config });
  } else {
    BurgerOrder.find({ day: currentDay, visibility: true, completed: false })
      .sort({ priority: "descending", createdAt: "ascending" })
      .exec((err, burgerOrders) => {
        if (err) {
          return next(err);
        }
        res.render("cucina", {
          orders: burgerOrders,
          moment: moment,
        });
      });
  }
});

router.get("/deliveries", (req, res, next) => {
  if (!currentDay) {
    res.render("admin", { day: currentDay, config: config });
  } else {
    BurgerOrder.find({ day: currentDay, visibility: true, completed: true })
      .sort({ priority: "descending", createdAt: "ascending" })
      .exec((err, burgerOrders) => {
        if (err) {
          return next(err);
        }
        res.render("deliveries", { orders: burgerOrders, moment: moment });
      });
  }
});

router.get("/orders/:uid/completed", isAuth, async (req, res, next) => {
  const completedAt = new moment();

  try {
    const burgerOrder = await BurgerOrder.findOne({ uid: req.params.uid });
    burgerOrder.completed = true;
    burgerOrder.completedAt = completedAt;
    await burgerOrder.save();
    completedBurgerOrders.push(burgerOrder.uid);
  } catch (err) {
    console.log(err);
    return next(err);
  }
  res.redirect("/orders");
});

router.get("/orders/:uid/remove", isAuth, async (req, res, next) => {
  try {
    const burgerOrder = await BurgerOrder.findOne({ uid: req.params.uid });
    if (!burgerOrder) {
      console.log(`order ${req.params.uid} not found while removing`);
      return res.redirect("/orders");
    }
    burgerOrder.visibility = false;
    await burgerOrder.save();
    deliveredBurgerOrders.push(burgerOrder.uid);
    completedBurgerOrders = completedBurgerOrders.filter(
      (order) => order != burgerOrder.uid
    );
  } catch (err) {
    console.log(err);
    return next(err);
  }
  res.redirect("/deliveries");
});

router.get("/orders/undo", isAuth, async (req, res, next) => {
  if (completedBurgerOrders.length == 0) return res.redirect("/orders");
  try {
    let uidOfOrderToUndo = completedBurgerOrders.pop();
    const burgerOrder = await BurgerOrder.findOne({ uid: uidOfOrderToUndo });
    if (!burgerOrder) {
      console.log(`order ${uidOfOrderToUndo} not found while undoing`);
      return res.redirect("/orders");
    }
    burgerOrder.completed = false;
    await burgerOrder.save();
    res.redirect("/orders");
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.get("/deliveries/undo", isAuth, async (req, res, next) => {
  if (deliveredBurgerOrders.length == 0) return res.redirect("/deliveries");
  try {
    let uidOfOrderToUndo = deliveredBurgerOrders.pop();
    const burgerOrder = await BurgerOrder.findOne({ uid: uidOfOrderToUndo });
    if (!burgerOrder) {
      console.log(`order ${uidOfOrderToUndo} not found while undoing`);
      return res.redirect("/deliveries");
    }
    burgerOrder.visibility = true;
    await burgerOrder.save();
    res.redirect("/deliveries");
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.get("/ingredients", (req, res) => {
  Ingredient.find()
    .sort({ name: "ascending" })
    .exec((err, ingredients) => {
      res.render("lock_ingredients", { ingredients: ingredients });
    });
});

router.get("/ingredient/:id/lock", isAuth, async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findOne({ id: req.params.id });
    ingredient.available = false;
    await ingredient.save();
    res.redirect("/ingredients");
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.get("/ingredient/:id/unlock", isAuth, async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findOne({ id: req.params.id });
    ingredient.available = true;
    await ingredient.save();
    res.redirect("/ingredients");
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

// gestione status page
router.get("/status", (_, res, next) => {
  if (!currentDay) {
    res.render("admin", { day: currentDay, config: config });
  } else {
    BurgerOrder.find({ day: currentDay, visibility: true, completed: true })
      .sort({ priority: "descending", createdAt: "ascending" })
      .exec((err, burgerOrders) => {
        if (err) {
          return next(err);
        }
        ExtraOrder.find({ day: currentDay, visibility: true, completed: true })
          .sort({ priority: "descending", createdAt: "ascending" })
          .exec((err, extraOrders) => {
            if (err) {
              return next(err);
            }
            res.render("status_page", {
              burgers: burgerOrders,
              extras: extraOrders,
              moment: moment,
            });
          });
      });
  }
});

//GESIONE BAR
router.get("/bar", (req, res, next) => {
  if (!currentDay) {
    res.render("admin", { day: currentDay, config: config });
  } else {
    BeveragesOrder.find({ day: currentDay, visibility: true })
      .sort({ priority: "descending", createdAt: "ascending" })
      .exec((err, barOrders) => {
        if (err) {
          return next(err);
        }
        res.render("bar", { orders: barOrders, moment: moment });
      });
  }
});

router.get("/bar/:uid/remove", isAuth, async (req, res) => {
  const beveragesOrder = await BeveragesOrder.findOne({ uid: req.params.uid });
  if (!beveragesOrder) {
    console.log(`bar order ${req.params.uid} not found while removing`);
    return res.redirect("/bar");
  }
  beveragesOrder.visibility = false;
  beveragesOrder.completedAt = moment();
  await beveragesOrder.save();
  deliveredBeverageOrder.push(beveragesOrder.uid);
  res.redirect("/bar");
});

router.get("/bar/undo", isAuth, async (req, res, next) => {
  try {
    if (deliveredBeverageOrder.length == 0) return res.redirect("/bar");
    const uidOfOrderToUndo = deliveredBeverageOrder.pop();
    const beveragesOrder = await BeveragesOrder.findOne({
      uid: uidOfOrderToUndo,
    });
    if (!beveragesOrder) {
      console.log(
        `bar order ${uidOfOrderToUndo} not found while trying to undo`
      );
      return res.redirect("/bar");
    }
    beveragesOrder.visibility = true;
    await beveragesOrder.save();
    res.redirect("/bar");
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

//gestione fritti
router.get("/extra", (req, res, next) => {
  if (!currentDay) {
    res.render("admin", { day: currentDay, config: config });
  } else {
    ExtraOrder.find({ day: currentDay, visibility: true })
      .sort({ priority: "descending", createdAt: "ascending" })
      .exec(async (err, extraOrders) => {
        if (err) {
          return next(err);
        }
        let nRings = await numberOfOnionRingsInNextNOrders(
          config.options.finestraAnelliExtra
        );
        res.render("extra", {
          orders: extraOrders,
          moment: moment,
          nRings: nRings,
          nOrders: config.options.finestraAnelliExtra,
        });
      });
  }
});

router.get("/extra/:uid/completed", isAuth, async (req, res, next) => {
  try {
    const extraOrder = await ExtraOrder.findOne({ uid: req.params.uid });
    extraOrder.completed = true;
    extraOrder.visibility = false;
    extraOrder.completedAt = moment();
    await extraOrder.save();
    completedExtraOrders.push(extraOrder.uid);
    res.redirect("/extra");
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.get("/extra/undo", isAuth, async (req, res, next) => {
  if (completedExtraOrders.length == 0) return res.redirect("/extra");
  try {
    let uidOfOrderToUndo = completedExtraOrders.pop();
    const extraOrder = await ExtraOrder.findOne({ uid: uidOfOrderToUndo });
    if (!extraOrder) {
      console.log(
        `extra order ${uidOfOrderToUndo} not found while trying to undo`
      );
      return res.redirect("/extra");
    }
    extraOrder.completed = false;
    extraOrder.visibility = true;
    await extraOrder.save();
    res.redirect("/extra");
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.get("/admin", (req, res, next) => {
  BurgerStats.findOne({ day: currentDay }, (err, burgerStats) => {
    if (err) {
      return next(err);
    }
    res.render("admin", {
      burgerStats: burgerStats,
      day: currentDay,
      config: config,
    });
  });
});

router.get("/admin/giorno/:giorno", isAuth, async (req, res) => {
  if (currentDay != req.params.giorno) {
    currentDay = new Date(req.params.giorno).toISOString();
    deliveredBurgerOrders = [];
    deliveredBeverageOrder = [];
    completedExtraOrders = [];
    completedBurgerOrders = [];
  }

  BeveragesStats.findOne({ day: currentDay }, (err, doc) => {
    if (!doc) {
      let newBeveragesStats = new BeveragesStats({
        day: currentDay,
      });
      newBeveragesStats.save();
    }
  });

  BurgerStats.findOne({ day: currentDay }, (err, doc) => {
    if (!doc) {
      let newBurgerStats = new BurgerStats({
        day: currentDay,
      });
      newBurgerStats.save();
    }
  });

  ExtrasStats.findOne({ day: currentDay }, (err, doc) => {
    if (!doc) {
      let newExtrasStats = new ExtrasStats({
        day: currentDay,
      });
      newExtrasStats.save();
    }
  });

  setTimeout(() => {
    res.redirect("back");
  }, 400);
});

router.get("/admin/orders", (req, res, next) => {
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

router.get("/admin/orders/:day", (req, res, next) => {
  BurgerOrder.find({ day: req.params.day })
    .sort({ createdAt: "descending" })
    .exec((err, burgerOrders) => {
      if (err) {
        return next(err);
      }
      res.render("admin_orders", {
        day: req.params.day,
        orders: burgerOrders,
        /*stats: burgerStats,*/ moment: moment,
      });
    });
});

router.get("/admin/drinks/:day", (req, res, next) => {
  BeveragesOrder.find({ day: req.params.day })
    .sort({ createdAt: "descending" })
    .exec((err, beveragesOrders) => {
      if (err) {
        return next(err);
      }
      res.render("admin_drinks", {
        day: req.params.day,
        orders: beveragesOrders,
        moment: moment,
      });
    });
});

router.get("/admin/extras/:day", (req, res, next) => {
  ExtraOrder.find({ day: req.params.day })
    .sort({ createdAt: "descending" })
    .exec((err, extrasOrders) => {
      if (err) {
        return next(err);
      }
      res.render("admin_extras", {
        day: req.params.day,
        orders: extrasOrders,
        moment: moment,
      });
    });
});

router.get("/admin/report", (req, res, next) => {
  BurgerStats.find()
    .sort({ day: "ascending" })
    .exec((err, burgerStats) => {
      if (err) {
        return next(err);
      }
      BeveragesStats.find()
        .sort({ day: "ascending" })
        .exec((err, beveragesStats) => {
          if (err) {
            return next(err);
          }
          ExtrasStats.find()
            .sort({ day: "ascending" })
            .exec((err, extrasStats) => {
              if (err) {
                return next(err);
              }
              res.render("report", {
                burgerStats: burgerStats,
                beveragesStats: beveragesStats,
                extrasStats: extrasStats,
              });
            });
        });
    });
});

router.get("/admin/report/panini/json", async (req, res, next) => {
  let report = await burgerStatsJson();
  res.json(report);
});

router.get("/admin/report/panini", async (req, res) => {
  let totals = await burgerStatsJson();
  res.render("report_panini", { totals: totals, moment: moment });
});

router.get("/admin/report/beverages", async (req, res, next) => {
  let report = await beveragesStatsJson();
  res.render("report_beverages", { totals: report, moment: moment });
});

router.get("/admin/report/beverages/json", async (req, res, next) => {
  let report = await beveragesStatsJson();
  res.json(report);
});

async function burgerStatsJson() {
  let burgerOrder = await BurgerOrder.find({ staff: false });
  if (!burgerOrder) {
    return {};
  }
  totals = {};
  burgerOrder.forEach((order) => {
    if (!(order.day in totals)) totals[order.day] = {};
    let key = order.actualOrder.Principale || "no_principale";
    if (key in totals[order.day]) {
      totals[order.day][key] += order.actualOrder.double ? 2 : 1;
    } else {
      totals[order.day][key] = {};
      totals[order.day][key] = order.actualOrder.double ? 2 : 1;
    }

    // TODO fix to count different kinds of double burgers
    if (order.actualOrder.double) {
      if ("double" in totals[order.day]) {
        totals[order.day]["double"] += 1;
      } else {
        totals[order.day]["double"] = 1;
      }
    }

    if (order.actualOrder.Farcitura) {
      if (Array.isArray(order.actualOrder.Farcitura)) {
        order.actualOrder.Farcitura.forEach((farcitura) => {
          if (farcitura in totals[order.day]) {
            totals[order.day][farcitura] += 1;
          } else {
            totals[order.day][farcitura] = 1;
          }
        });
      } else {
        if (order.actualOrder.Farcitura in totals[order.day]) {
          totals[order.day][order.actualOrder.Farcitura] += 1;
        } else {
          totals[order.day][order.actualOrder.Farcitura] = 1;
        }
      }
    }

    if (order.actualOrder.Salsa) {
      if (Array.isArray(order.actualOrder.Salsa)) {
        order.actualOrder.Salsa.forEach((salsa) => {
          if (salsa in totals[order.day]) {
            totals[order.day][salsa] += 1;
          } else {
            totals[order.day][salsa] = 1;
          }
        });
      } else {
        if (order.actualOrder.Salsa in totals[order.day]) {
          totals[order.day][order.actualOrder.Salsa] += 1;
        } else {
          totals[order.day][order.actualOrder.Salsa] = 1;
        }
      }
    }
  });
  return totals;
}

async function beveragesStatsJson() {
  let barOrders = await BeveragesOrder.find({ staff: false });
  if (!barOrders) {
    return {};
  }
  totals = {};
  barOrders.forEach((order) => {
    if (!(order.day in totals)) totals[order.day] = {};
    totals[order.day] = accumulateBeverages(
      totals[order.day],
      countBeverages(order.actualOrder)
    );
  });
  return totals;
}

function accumulateBeverages(total, order) {
  Object.entries(order).forEach((order) => {
    order[0] in total
      ? (total[order[0]] += parseInt(order[1]))
      : (total[order[0]] = parseInt(order[1]));
  });
  return total;
}

function countBeverages(order) {
  let total = {};
  let beveragesIndex = 0;
  order.beveragesQuantities.forEach((quantity) => {
    if (quantity != "") {
      if (Array.isArray(order.beverages)) {
        total[JSON.parse(order.beverages[beveragesIndex]).name] =
          parseInt(quantity);
        beveragesIndex++;
      } else {
        total[JSON.parse(order.beverages).name] = quantity;
      }
    }
  });
  return total;
}

router.get("/admin/report/extras", (req, res) => {
  ExtraOrder.find({ staff: true }).exec((err, extraOrder) => {
    if (err) {
      return next(err);
    }
    totals = [];
    extraOrder.forEach((order) => {
      totals.push(countExtras(order.actualOrder));
    });
    report = {};
    totals.forEach((total) => {
      Object.entries(total).forEach((total) => {
        total[0] in report
          ? (report[total[0]] += parseInt(total[1]))
          : (report[total[0]] = parseInt(total[1]));
      });
    });
    res.send(report);
  });
});

function countExtras(order) {
  let total = {};
  let extrasIndex = 0;
  order.extrasQuantities.forEach((quantity) => {
    if (quantity != "") {
      if (Array.isArray(order.extras)) {
        total[JSON.parse(order.extras[extrasIndex]).name] = parseInt(quantity);
        extrasIndex++;
      } else {
        total[JSON.parse(order.extras).name] = quantity;
      }
    }
  });
  return total;
}

router.get("/orders/:uid/delete", isAuth, (req, res, next) => {
  BurgerOrder.findOne({ uid: req.params.uid }, (err, burgerOrder) => {
    burgerOrder.remove((err) => {
      if (err) {
        console.log(err);
        return next(err);
      }
    });
    updateBurgersStatsAfterRemove(burgerOrder);
  });
  setTimeout(() => {
    res.redirect("back");
  }, 400);
});

router.get("/drinks/:uid/delete", isAuth, (req, res, next) => {
  BeveragesOrder.findOne({ uid: req.params.uid }, (err, beveragesOrder) => {
    beveragesOrder.remove((err) => {
      if (err) {
        console.log(err);
        return next(err);
      }
    });
    updateBeveragesStatsAfterRemove(beveragesOrder);
  });
  setTimeout(() => {
    res.redirect("back");
  }, 400);
});

router.get("/extras/:uid/delete", isAuth, (req, res, next) => {
  ExtraOrder.findOne({ uid: req.params.uid }, (err, extrasOrder) => {
    extrasOrder.remove((err) => {
      if (err) {
        console.log(err);
        return next(err);
      }
    });
    updateExtrasStatsAfterRemove(extrasOrder);
  });
  setTimeout(() => {
    res.redirect("back");
  }, 400);
});

router.get("/orders/restore/:uid", isAuth, async (req, res) => {
  try {
    const burgerOrder = await BurgerOrder.findOne({ uid: req.params.uid });
    burgerOrder.visibility = true;
    burgerOrder.completed = false;
    await burgerOrder.save();
    res.redirect("back");
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.get("/drinks/restore/:uid", isAuth, async (req, res) => {
  try {
    const beveragesOrder = await BeveragesOrder.findOne({
      uid: req.params.uid,
    });
    beveragesOrder.visibility = true;
    await beveragesOrder.save();
    res.redirect("back");
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.get("/extras/restore/:uid", isAuth, async (req, res) => {
  try {
    const extrasOrder = await ExtraOrder.findOne({ uid: req.params.uid });
    extrasOrder.visibility = true;
    await extrasOrder.save();
    res.redirect("back");
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.get("/admin/deleteall/:what", isAuth, (req, res, next) => {
  if (req.params.what === "all" || req.params.what === "panini") {
    BurgerOrder.deleteMany({}, (err) => {
      if (err) {
        return next(err);
      }
    });

    BurgerStats.deleteMany({}, (err) => {
      if (err) {
        return next(err);
      }
    });
    deliveredBurgerOrders = [];
  }

  if (req.params.what === "all" || req.params.what === "bevande") {
    BeveragesStats.deleteMany({}, (err) => {
      if (err) {
        return next(err);
      }
    });

    BeveragesOrder.deleteMany({}, (err) => {
      if (err) {
        return next(err);
      }
    });
    deliveredBeverageOrder = [];
  }

  if (req.params.what === "all" || req.params.what === "extra") {
    ExtrasStats.deleteMany({}, (err) => {
      if (err) {
        return next(err);
      }
    });
    ExtraOrder.deleteMany({}, (err) => {
      if (err) {
        return next(err);
      }
    });
    completedExtraOrders = [];
  }
  res.render("deletedeverything");
});

router.get("/averageWaitingTime", async (req, res, next) => {
  let averageWaitingTime = await computeAverageWaitTimeForCurrentDay();
  res.send({
    avgWaitTime: moment(Math.round(averageWaitingTime))
      .utc()
      .format("HH:mm:ss"),
  });
});

router.use((request, response) => {
  response.status(404).render("404");
});

async function numberOfOnionRingsInNextNOrders(n) {
  let lastNOrders = await BurgerOrder.find({
    day: currentDay,
    completed: false,
  })
    .sort({ createdAt: "ascending" })
    .limit(n);
  let anelli = lastNOrders
    .map((order) => {
      order = order.actualOrder;
      if (Array.isArray(order.Farcitura)) {
        return order.Farcitura.filter((el) => el == "Anelli di cipolla").length;
      } else {
        return order.Farcitura == "Anelli di cipolla" ? 1 : 0;
      }
    })
    .reduce((a, b) => a + b, 0);
  return anelli;
}
  

router.post("/orders/:uid/payment", isAuth, async (req, res) => {
  const paymentMethod = req.body.paymentMethod;
  const order = await BurgerOrder.findOne({ uid: req.params.uid });
  if (order) {
    order.paymentMethod = paymentMethod;
    await order.save();
  }
  order = await BeveragesOrder.findOne({ uid: req.params.uid });
  if (order) {
    order.paymentMethod = paymentMethod;
    await order.save();
  }
  res.redirect("back");
}); 

async function computeCurrentDaysTotals() {
  let totals = {"burgersTotals": {}, "beveragesTotals": {}, "extrasTotals": {}}; 
  // convert currentDay to Date object
  day = new Date(currentDay);
  let burgersTotals = await BurgerOrder.aggregate([
    {
      $match: { day: day },
    },
    {
      $group: {
        _id: { paymentMethod: "$paymentMethod" },
        total: { $sum: "$prezzo" },
      },
    },
    {
      $sort: { "_id.paymentMethod": 1 },
    },
  ]);
  burgersTotals.forEach((total) => {
    totals["burgersTotals"][total._id.paymentMethod] = total.total;
  });
  let beveragesTotals = await BeveragesOrder.aggregate([
    {
      $match: { day: day },
    },
    {
      $group: {
        _id: { paymentMethod: "$paymentMethod" },
        total: { $sum: "$prezzo" },
      },
    },
    {
      $sort: { "_id.paymentMethod": 1 },
    },
  ]);
  beveragesTotals.forEach((total) => {
    totals["beveragesTotals"][total._id.paymentMethod] = total.total;
  });
  let extrasTotals = await ExtraOrder.aggregate([
    {
      $match: { day: day },
    },
    {
      $group: {
        _id: { paymentMethod: "$paymentMethod" },
        total: { $sum: "$prezzo" },
      },
    },
    {
      $sort: { "_id.paymentMethod": 1 },
    },
  ]);
  extrasTotals.forEach((total) => {
    totals["extrasTotals"][total._id.paymentMethod] = total.total;
  }
  );
  return totals;
}



function updateBurgersStats(order) {
  if (!order.staff) {
    BurgerStats.findOne({ day: order.day }).then((stats) => {
      if (!stats) {
        let newBurgerStats = new BurgerStats({
          day: currentDay,
          total: order.prezzo,
        });
        newBurgerStats.save();
      } else {
        stats.total += order.prezzo;
        stats.save();
      }
    });
  }
}

function updateBurgersStatsAfterRemove(order) {
  if (!order.staff) {
    BurgerStats.findOne({ day: order.day }).then((stats) => {
      stats.total -= order.prezzo;
      stats.save();
    });
  }
}

function updateBeveragesStats(order) {
  if (!order.staff) {
    BeveragesStats.findOne({ day: order.day }).then((stats) => {
      if (!stats) {
        let newBeveragesStats = new BeveragesStats({
          day: currentDay,
          total: order.prezzo,
        });
        newBeveragesStats.save();
      } else {
        stats.total += order.prezzo;
        stats.save();
      }
    });
  }
}

function updateBeveragesStatsAfterRemove(order) {
  if (!order.staff) {
    BeveragesStats.findOne({ day: order.day }).then((stats) => {
      stats.total -= order.prezzo;
      stats.save();
    });
  }
}

function updateExtrasStats(order) {
  if (!order.staff) {
    ExtrasStats.findOne({ day: order.day }).then((stats) => {
      if (!stats) {
        let newExtrasStats = new ExtrasStats({
          day: currentDay,
          total: order.prezzo,
        });
        newExtrasStats.save();
      } else {
        stats.total += order.prezzo;
        stats.save();
      }
    });
  }
}

function updateExtrasStatsAfterRemove(order) {
  if (!order.staff) {
    ExtrasStats.findOne({ day: order.day }).then((stats) => {
      stats.total -= order.prezzo;
      stats.save();
    });
  }
}

function loadConfiguration() {
  loadIngredientsToDB();
}

function loadIngredientsToDB() {
  config.ingredients.forEach((ingredientType) => {
    ingredientType.list.forEach((ingredient) => {
      Ingredient.findOneAndUpdate(
        { id: ingredient.id },
        {
          type: ingredientType.type,
          name: ingredient.name,
          price: ingredient.price,
        },
        { upsert: true },
        (err, doc) => {
          if (err) console.log(err);
          return;
        }
      );
    });
  });
}

async function computeAverageWaitTimeForCurrentDay() {
  if (!currentDay) return 0;
  let totalWaitTime = 0;
  let totalOrders = 0;
  try {
    const orders = await BurgerOrder.find({ day: currentDay, completed: true });
    orders.forEach((order) => {
      totalWaitTime += order.completedAt - order.createdAt;
      totalOrders++;
    });
    if (totalOrders === 0) return 0;
    return totalWaitTime / totalOrders;
  } catch (error) {
    return 0;
  }
}

module.exports = router;
