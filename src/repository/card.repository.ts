import Card from '../models/card.model';
import Member from '../models/member.model';
import Membership from '../models/membership.model';
import Agreement from '../models/agreement.model';

class CardRepository {
  async validateAndActivateCard(number: string, code: string, registrationDate: Date): Promise<Card | null> {
    const card: any = await Card.findOne({ where: { number, code } });

    if (card) {
      if (registrationDate > card.expires_at) {
        throw new Error('Card has expired');
      }
      card.status = 'active';
      await card.save();
      return card;
    }
    return null;
  }

  async getAgreementIdById(id: number): Promise<Buffer | null> {
    const agreement = await Agreement.findOne({
      attributes: ['agreement_id'],
      where: { id },
    });

    if (agreement) {
      return agreement.agreement_id as unknown as Buffer;
    }
    return null;
  }

  async createMember(memberData: any): Promise<number> {
    const agreementId = await this.getAgreementIdById(5); // Cambiar el ID según tu lógica
    if (!agreementId) {
      throw new Error('Agreement ID does not exist');
    }

    memberData.agreement_id = agreementId;

    const member = await Member.create(memberData);
    return member.id; // Devuelve el ID numérico del miembro
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
