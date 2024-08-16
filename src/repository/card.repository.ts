import Card from '../models/card.model';
import Member from '../models/member.model';
import Membership from '../models/membership.model';
import Agreement from '../models/agreement.model';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

class CardRepository {
  // Método para validar y activar la tarjeta
  async validateAndActivateCard(number: string, code: string, registrationDate: Date): Promise<Card | null> {
    const card: any = await Card.findOne({ where: { number, code } });

    if (!card) {
      throw new Error('Card not found'); 
    }

    if (card.status === 'active') {
      throw new Error('Card is already active');
    }

    if (registrationDate > card.expires_at) {
      throw new Error('Card has expired');
    }

    card.status = 'active';
    await card.save();
    return card;
  }

  async getAgreementIdById(id: number): Promise<string | null> {
    const agreement = await Agreement.findOne({
      attributes: ['agreement_id'],
      where: { id },
    });

    if (agreement) {
      return (agreement.agreement_id as unknown as Buffer).toString('hex');
    }
    return null;
  }

  async createMember(memberData: any): Promise<number> {
    const agreementId = await this.getAgreementIdById(5);
    if (!agreementId) {
      throw new Error('Agreement ID does not exist');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(memberData.password, saltRounds);

    const memberId = uuidv4();
    const memberIdBinary = Buffer.from(memberId.replace(/-/g, ''), 'hex');

    memberData.password = hashedPassword;
    memberData.agreement_id = Buffer.from(agreementId.replace(/-/g, ''), 'hex');
    memberData.member_id = memberIdBinary;
    memberData.preferred_department_id = Buffer.from(memberData.preferred_department_id.replace(/-/g, ''), 'hex');

    const member = await Member.create(memberData);
    return member.id;
  }

  async createMembership(memberId: number, cardId: number, publicId: Buffer): Promise<Membership> {
    const membershipData = {
      public_id: publicId,
      member_id: memberId,
      card_id: cardId,
    };

    const membership = await Membership.create(membershipData);
    return membership;
  }

  async findMemberByEmail(email: string) {
    return await Member.findOne({ where: { email } });
  }
}

export default new CardRepository();