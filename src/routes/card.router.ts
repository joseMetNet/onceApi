import { Router } from 'express';
import { createMemberAndMembership } from '../controllers/card.controller';

const cardRouter = Router();

/**
 * @swagger
 * /create-member-and-membership:
 *   post:
 *     summary: Create a member and membership
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: string
 *                 example: "123456789"
 *               code:
 *                 type: string
 *                 example: "ABC123"
 *               memberData:
 *                 type: object
 *                 properties:
 *                   fullname:
 *                     type: string
 *                     example: "name"
 *                   email:
 *                     type: string
 *                     example: "mail@mail.com"
 *                   password:
 *                     type: string
 *                     example: "123456"
 *                   phone:
 *                     type: string
 *                     example: "0123456789"
 *                   gender:
 *                     type: string
 *                     example: "M"
 *                   identification:
 *                     type: string
 *                     example: "identification"
 *                   birthdate:
 *                     type: string
 *                     format: date
 *                     example: "yyyy-mm-dd"
 *     responses:
 *       201:
 *         description: Member and membership created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 memberId:
 *                   type: number
 *                   example: 1
 *                 membership:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     public_id:
 *                       type: string
 *                       example: "12345"
 *                     member_id:
 *                       type: number
 *                       example: 1
 *                     card_id:
 *                       type: number
 *                       example: 1
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
cardRouter.post('/create-member-and-membership', createMemberAndMembership);

export default cardRouter;
