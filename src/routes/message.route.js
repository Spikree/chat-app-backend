import express from "express"
import { ProtectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar,getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", ProtectRoute, getUsersForSidebar);
router.get("/:id",ProtectRoute,getMessages)

export default router;