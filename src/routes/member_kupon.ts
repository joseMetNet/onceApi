import { Router } from 'express';
import { createMemberKoupon } from '../controllers/member_kupon';

const meberKuponRouter = Router();

/**
 * @swagger
 * /create-member-koupon:
 *   post:
 *     summary: Create a member koupon
 *     tags: [MemberKoupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               member_id:
 *                 type: number
 *                 example: 1
 *               koupon_id:
 *                 type: number
 *                 example: 101
 *               koupon_value_id:
 *                 type: number
 *                 example: 202
 *               external_reference_id:
 *                 type: string
 *                 example: "optional-ref-123"
 *     responses:
 *       201:
 *         description: Member koupon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 member_id:
 *                   type: number
 *                   example: 1
 *                 koupon_id:
 *                   type: number
 *                   example: 101
 *                 koupon_value_id:
 *                   type: number
 *                   example: 202
 *                 external_reference_id:
 *                   type: string
 *                   example: "optional-ref-123"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-08-28T10:00:00Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-08-28T10:00:00Z"
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
meberKuponRouter.post('/create-member-koupon', createMemberKoupon);
export default meberKuponRouter;