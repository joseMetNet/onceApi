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
    const ipAddress = req.ip; // Obtener la dirección IP del cliente

    // Validar y activar la tarjeta
    const card = await CardRepository.validateAndActivateCard(number, code, registrationDate);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Verificar si el email ya existe
    const existingMember = await CardRepository.findMemberByEmail(memberData.email);
    if (existingMember) {
      return res.status(400).json({ message: 'The email address is already registered.' });
    }

    // Crear miembro
    const memberId = await CardRepository.createMember({
      ...memberData,
      activation_ip: ipAddress, // Establecer la dirección IP
      created_at: registrationDate,
      updated_at: registrationDate, 
    });

    if (!memberId) {
      return res.status(500).json({ message: 'Failed to create member' });
    }

    // Generar `public_id` automáticamente y convertir a formato binario
    const publicId = uuidv4();
    const publicIdBinary = Buffer.from(publicId.replace(/-/g, ''), 'hex'); // Convertir UUID a formato binario

    // Crear membresía
    const membership = await CardRepository.createMembership(
      memberId,
      card.id,
      publicIdBinary
    );

    res.status(201).json({ memberId, membership });
  } catch (error: any) {
    console.error('Error creating member and membership:', JSON.stringify(error));
    if (error.message === 'Card has expired') {
      res.status(400).json({ message: 'Card has expired' });
    } else if (error.message === 'Agreement ID does not exist') {
      res.status(400).json({ message: 'Agreement ID does not exist' });
    } else if (error instanceof UniqueConstraintError) {
      res.status(400).json({ message: 'The email address is already registered.' });
    } else {
      res.status(500).json({ message: JSON.stringify(error) });
    }
  }
};
