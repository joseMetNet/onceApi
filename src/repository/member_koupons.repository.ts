import { IMemberKouponData } from '../interface/member_koupons';
import MemberKoupons from '../models/member_koupons.model';
import { format } from 'date-fns-tz';

class MemberKouponsRepository {
  async createMemberKoupon(memberKouponData: IMemberKouponData): Promise<MemberKoupons> {
    try {
      const colombiaTimeZone = 'America/Bogota';
      const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss', { timeZone: colombiaTimeZone });

      const memberKouponAttributes: Partial<MemberKoupons> = {
        ...memberKouponData,
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

export default new MemberKouponsRepository;
