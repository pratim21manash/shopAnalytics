import { Router } from "express";
import { createSale, getSales, getSalesByDateRange, getTodaySales } from "../controllers/sale.controller.js";

const router = Router()

router.get("/", getSales)
router.get("/range", getSalesByDateRange)
router.get("/today", getTodaySales)
router.post("/", createSale)

export default router;