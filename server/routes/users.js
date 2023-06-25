import express from "express";
import { getUser , updateUser} from "../controllers/userC.js";

const router = express.Router()

router.get("/:userId", getUser);
router.post("/edit/:userId", updateUser);


export default router