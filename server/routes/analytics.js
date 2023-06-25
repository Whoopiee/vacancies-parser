import Express from "express";
import { getAnalytics } from "../controllers/analytic.js";

const router = Express.Router();

router.get("/cities", getAnalytics)


export default router