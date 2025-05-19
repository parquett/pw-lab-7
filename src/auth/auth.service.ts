import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(role: string) {
    const payload = {
      role,
      permissions: this.getPermissionsForRole(role),
    };

    return {
      token: this.jwtService.sign(payload),
      expiresIn: 600, // 1- minute
    };
  }

  private getPermissionsForRole(role: string): string[] {
    switch (role) {
      case 'ADMIN':
        return ['READ', 'WRITE', 'DELETE', 'UPDATE'];
      case 'WRITER':
        return ['READ', 'WRITE', 'UPDATE'];
      case 'VISITOR':
        return ['READ'];
      default:
        return [];
    }
  }
}