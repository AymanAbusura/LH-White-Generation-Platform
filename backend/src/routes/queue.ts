import { Router, Request, Response } from 'express';
import whiteGenQueue from '../queue/queue';

const router = Router();

router.get('/stats', async (_req: Request, res: Response) => {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    whiteGenQueue.getWaitingCount(),
    whiteGenQueue.getActiveCount(),
    whiteGenQueue.getCompletedCount(),
    whiteGenQueue.getFailedCount(),
    whiteGenQueue.getDelayedCount(),
  ]);

  res.json({
    success: true,
    data: { waiting, active, completed, failed, delayed },
  });
});

export default router;