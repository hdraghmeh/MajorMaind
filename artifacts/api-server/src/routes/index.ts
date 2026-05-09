import { Router, type IRouter } from "express";
import healthRouter from "./health";
import interviewRouter from "./interview";
import authRouter from "./auth";
import interviewSessionsRouter from "./interviewSessions";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(interviewRouter);
router.use(interviewSessionsRouter);

export default router;
