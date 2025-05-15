import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface TokenPayload {
  id: string;
  role: string;
}

// ฟังก์ชันสำหรับสร้าง JWT
export function signToken(payload: TokenPayload, expiresIn: number = 7 * 24 * 60 * 60): string {
  // คำนวณเวลาหมดอายุในรูปแบบ timestamp (expiresIn เป็นจำนวนวินาที)
  const issuedAt = Math.floor(Date.now() / 1000); // แปลงเป็น timestamp
  const expirationTime = issuedAt + expiresIn; // กำหนดเวลาหมดอายุโดยการบวก expiresIn (เป็นวินาที)

  const tokenPayload = {
    ...payload,  // รวมข้อมูล payload
    iat: issuedAt,  // เวลาออก token
    exp: expirationTime,  // เวลาหมดอายุ
  };

  return jwt.sign(tokenPayload, JWT_SECRET);  // เซ็น token ด้วย JWT_SECRET
}

// ฟังก์ชันสำหรับตรวจสอบ JWT
export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Type Narrowing เพื่อตรวจสอบว่า decoded เป็น TokenPayload หรือไม่
    if (decoded && typeof decoded === 'object' && 'id' in decoded && 'role' in decoded) {
      return decoded as TokenPayload;  // ทำการ Cast เป็น TokenPayload
    }
    // ถ้าไม่ตรงกับเงื่อนไขที่คาดหวัง
    throw new Error('Invalid token payload');
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// ฟังก์ชันตรวจสอบว่า user เป็น admin หรือไม่
export function isAdmin(user: IUser | TokenPayload) {
  return user.role === 'admin';
}

// ฟังก์ชันตรวจสอบว่า user เป็น user หรือไม่
export function isUser(user: IUser | TokenPayload) {
  return user.role === 'user';
}

export function isOwner(user: IUser | TokenPayload) {
  return user.role === 'owner';
}