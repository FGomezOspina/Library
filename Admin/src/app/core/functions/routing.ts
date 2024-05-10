import { MenuItem } from '@models/layout/menu.model';
import { User } from '@models/account/user.model';
import { first } from 'lodash';
import { map } from 'lodash';

export function getRouteByRole(user: User): string {
  const roleNames = map(user.roles, r => r.name);
  if (roleNames.includes('ADMIN')) {
    return '/admin/users';
  }
  if (roleNames.includes('TENANT_ADMIN')) {
    const role = user.roles.find(x => x.name === 'TENANT_ADMIN');
    const tenant = first(user.tenants);
    if (role) {
      return user.emailConfirmedAt ? (tenant ? `/tenants/${role.tenantId}/panel` : `/account/profile/${user.id}/tenant-form`) : '/account/auth/email-verification';
    }
  }
  if (roleNames.includes('COMPANY_ADMIN')) {
    const role = user.roles.find(x => x.name === 'COMPANY_ADMIN');
    if (role) {
      return `/companies/${role.companyId}/panel`;
    }
  }
  if (
    roleNames.includes('BOT_CREATOR')
  ) {
    const role = user.roles.find(x => x.name === 'BOT_CREATOR');
    if (role) {
      return `/model-bots/${role.modelBotId}/uploads`;
    }
  }
  if (
    roleNames.includes('READ_USER')
  ) {
    const role = user.roles.find(x => x.name === 'READ_USER');
    if (role) {
      return `/companies/${role.companyId}/modules`;
    }
  }
  if (
    roleNames.includes('SINGLE_USER')
  ) {
    const role = user.roles.find(x => x.name === 'SINGLE_USER');
    if (role) {
      return user.emailConfirmedAt ? (user.modelBot ? `/model-bots/${role.modelBotId}/panel` : `/account/profile/${user.id}/model-bot-form`) : '/account/auth/email-verification';
    }
  }
  return '/';
}

export function getMenuByRole(user: User): MenuItem[] {
  const menu: MenuItem[] = [];
  const roleNames = map(user.roles, r => r.name);
  if (roleNames.includes('ADMIN')) {
    menu.push({
      id: 1,
      label: 'Admin Panel',
      link: '/admin/users',
      icon: 'bx bx-grid-alt',
    });
  }
  if (roleNames.includes('TENANT_ADMIN')) {
    const role = user.roles.find(x => x.name === 'TENANT_ADMIN');
    const tenant = first(user.tenants);
    if (role) {
      menu.push({
        id: 1,
        label: 'Tenant Admin Portal',
        link: user.emailConfirmedAt ? (tenant ? `/tenants/${role.tenantId}/panel` : `/account/profile/${user.id}/tenant-form`) : '/account/auth/email-verification',
        icon: 'bx bx-shield-alt-2',
      });
    }
  }
  if (roleNames.includes('COMPANY_ADMIN')) {
    const role = user.roles.find(x => x.name === 'COMPANY_ADMIN');
    if (role) {
      menu.push({
        id: 1,
        label: 'Company Admin Portal',
        link: `/companies/${role.companyId}/panel`,
        icon: 'bx bx-shield-alt-2',
      });
    }
  }
  if (
    roleNames.includes('BOT_CREATOR')
  ) {
    const role = user.roles.find(x => x.name === 'BOT_CREATOR');
    if (role) {
      menu.push({
        id: 1,
        label: 'Bot Creator Portal',
        link: `/model-bots/${role.modelBotId}/uploads`,
        icon: 'bx bx-buildings',
      });
    }
  }
  if (
    roleNames.includes('READ_USER')
  ) {
    const role = user.roles.find(x => x.name === 'READ_USER');
    if (role) {
      menu.push({
        id: 1,
        label: 'User Portal',
        link: `/companies/${role.companyId}/modules`,
        icon: 'bx bx-buildings',
      });
    }
  }
  if (
    roleNames.includes('SINGLE_USER')
  ) {
    const role = user.roles.find(x => x.name === 'SINGLE_USER');
    if (role) {
      menu.push({
        id: 1,
        label: 'Client Portal',
        link: user.emailConfirmedAt ? (user.modelBot ? `/model-bots/${role.modelBotId}/panel` : `/account/profile/${user.id}/model-bot-form`) : '/account/auth/email-verification',
        icon: 'bx bx-buildings',
      });
    }
  }

  return menu;
}
