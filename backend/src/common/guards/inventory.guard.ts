import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class InventoryGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles) {
      throw new ForbiddenException('Access denied');
    }

    // Allow ROLE_ADMIN or ROLE_INVENTORY
    const hasAccess = user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_INVENTORY');

    if (!hasAccess) {
      throw new ForbiddenException('Inventory access required');
    }

    return true;
  }
}
