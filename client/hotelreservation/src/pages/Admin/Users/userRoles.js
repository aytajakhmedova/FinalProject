import { FiActivity, FiAward, FiBriefcase, FiKey, FiShield, FiStar, FiUser, FiUsers } from 'react-icons/fi';

export const roles = [
  { value: 'SuperAdmin', label: 'SuperAdmin', tone: 'um-gold', icon: FiAward },
  { value: 'Admin', label: 'Admin', tone: 'um-purple', icon: FiShield },
  { value: 'HotelManager', label: 'Hotel Manager', tone: 'um-blue', icon: FiBriefcase },
  { value: 'Receptionist', label: 'Receptionist', tone: 'um-rose', icon: FiKey },
  { value: 'Customer', label: 'Customer', tone: 'um-green', icon: FiUser },
  { value: 'Member', label: 'Member', tone: 'um-silver', icon: FiStar },
];

export const needsHotel = (role) => role === 'HotelManager' || role === 'Receptionist';
export const isAdmin = (role) => role === 'SuperAdmin' || role === 'Admin';
export const matchText = (text) => String(text ?? '').trim().toLocaleLowerCase('az').replaceAll('ı', 'i');

export function roleOf(user) {
  const value = roles.find((role) => user.roles?.includes(role.value))?.value || user.roles?.[0] || 'Customer';
  return roles.find((role) => role.value === value) || { value, label: value, tone: 'um-silver', icon: FiUsers };
}

export const allRoles = { value: '', label: 'Bütün rollar', icon: FiActivity };


