import { IMemberKouponData } from '../interface/member_koupons';
import MemberKoupons from '../models/member_koupons.model';
import { format } from 'date-fns-tz';
import { dbConnection } from '../DB/config';

class MemberKouponsRepository {
  // Método para obtener el id de un miembro por UUID
  private async getMemberIdByUUID(uuid: string): Promise<number | null> {
    try {
      const [results]: any = await dbConnection.query(
        `SELECT id FROM yekoclub.member WHERE BIN_TO_UUID(member_id) = '${uuid}'`,
      );
      return results.length > 0 ? results[0].id : null;
    } catch (error: any) {
      throw new Error(`Error al obtener member_id: ${error.message}`);
    }
  }

  // Método para obtener el id de un koupon por UUID
  private async getKouponIdByUUID(uuid: string): Promise<number | null> {
    try {
      const [results]: any = await dbConnection.query(
        `SELECT id FROM yekoclub.koupon WHERE BIN_TO_UUID(public_id) =  '${uuid}'`,
      );
      return results.length > 0 ? results[0].id : null;
    } catch (error: any) {
      throw new Error(`Error al obtener koupon_id: ${error.message}`);
    }
  }

  // Método para crear un Member Koupon
  async createMemberKoupon(memberKouponData: IMemberKouponData): Promise<MemberKoupons> {
    try {
      // Verificar que los UUID no sean undefined antes de usarlos
      if (!memberKouponData.member_uuid) {
        throw new Error('El UUID del miembro no está definido.');
      }
      if (!memberKouponData.koupon_uuid) {
        throw new Error('El UUID del koupon no está definido.');
      }

      // Obtener member_id y koupon_id usando los UUIDs válidos
      const memberId = await this.getMemberIdByUUID(memberKouponData.member_uuid);
      const kouponId = await this.getKouponIdByUUID(memberKouponData.koupon_uuid);

      if (!memberId) {
        throw new Error('Member ID no encontrado para el UUID proporcionado.');
      }
      if (!kouponId) {
        throw new Error('Koupon ID no encontrado para el UUID proporcionado.');
      }

      const colombiaTimeZone = 'America/Bogota';
      const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss', { timeZone: colombiaTimeZone });

      const memberKouponAttributes: Partial<MemberKoupons> = {
        ...memberKouponData,
        member_id: memberId,
        koupon_id: kouponId,
        created_at: new Date(currentDate),
        updated_at: new Date(currentDate),
        external_reference_id: memberKouponData.external_reference_id || '',
      };

      const memberKoupon = await MemberKoupons.create(memberKouponAttributes);
      return memberKoupon;
    } catch (error: any) {
      throw new Error(`Error al crear el member koupon: ${error.message}`);
    }
  }
}

export default new MemberKouponsRepository();