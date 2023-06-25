import Express from "express";
import { getHome, getData } from "../controllers/homeC.js";

const router = Express.Router();

router.post("/jobs", getHome);
router.get("/jobs", getData);

export default router