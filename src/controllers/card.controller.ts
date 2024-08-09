import { Request, Response } from 'express';
import CardRepository from '../repository/card.repository';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';
import { UniqueConstraintError } from 'sequelize';

export const createMemberAndMembership = async (req: Request, res: Response) => {
  try {
    const { number, code, memberData } = req.body;
    const registrationDate = moment().tz('America/Bogota').toDate();
    const ipAddress = req.ip;

    const card = await CardRepository.validateAndActivateCard(number, code, registrationDate);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const existingMember = await CardRepository.findMemberByEmail(memberData.email);
    if (existingMember) {
      return res.status(400).json({ message: 'The email address is already registered.' });
    }

    const memberIdNum = await CardRepository.createMember({
      ...memberData,
      agreement_id: memberData.agreement_id,
      activation_ip: ipAddress,
      created_at: registrationDate,
      updated_at: registrationDate,
    });

    if (!memberIdNum) {
      return res.status(500).json({ message: 'Failed to create member' });
    }

    const publicId = uuidv4();
    const publicIdBinary = Buffer.from(publicId.replace(/-/g, ''), 'hex');

    const membership = await CardRepository.createMembership(
      memberIdNum, 
      card.id,
      publicIdBinary
    );

    res.status(201).json({ memberId: memberIdNum, membership });
  } catch (error: any) {
    if (error instanceof UniqueConstraintError) {
      res.status(400).json({ message: 'The email address is already registered.' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};