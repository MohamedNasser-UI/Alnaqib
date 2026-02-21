import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';
import { routing } from '@/i18n/routing';

export const { Link: NavLink, redirect: navRedirect, usePathname: useNavPathname, useRouter: useNavRouter } =
  createLocalizedPathnamesNavigation(routing);
