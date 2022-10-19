// component
import Iconify from '../../components/Iconify';
import {getRole} from "../../utils/common";
import routes from "../../routes";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22}/>;

let sidebarConfig = [
    {
        title: 'Dashboard',
        path: '/dashboard/app',
        icon: getIcon('eva:pie-chart-2-fill')
    },
    {
        title: 'Users',
        path: '/dashboard/user',
        icon: getIcon('eva:people-fill')
    },
    {
        title: 'Profile',
        path: '/dashboard/profile',
        icon: getIcon('healthicons:ui-user-profile-outline')
    },
    {
        title: 'Logs',
        path: '/dashboard/Logs',
        icon: getIcon('carbon:flow-logs-vpc')
    },
    {
        title: 'BiometricReports',
        path: '/dashboard/BiometricReports',
        icon: getIcon('iconoir:reports')
    },
    {
        title: 'LateInAndEarlyOut',
        path: '/dashboard/LateInAndEarlyOut',
        icon: getIcon('iconoir:reports')
    },
    {
        title: 'Settings',
        path: '/dashboard/Settings',
        icon: getIcon('bytesize:settings')
    },
    /*{
        title: 'OddItems',
        path: '/dashboard/OddItems',
        icon: getIcon('fa-solid:project-diagram')
    },*/

    /*{
        title: 'DisplayProjects',
        path: '/dashboard/DisplayProjects',
        icon: getIcon('icon-park-twotone:data-display')
    },*/

    /*{
        title: 'Bill',
        path: '/dashboard/Bill',
        icon: getIcon('eva:shopping-bag-fill')
    },*/
    /*{
        title: 'Home',
        path: '/home',
        icon: getIcon('eva:shopping-bag-fill')
    },*/

    /*{
      title: 'blog',
      path: '/dashboard/blog',
      icon: getIcon('eva:file-text-fill')
    },*/
    /*{
      title: 'login',
      path: '/login',
      icon: getIcon('eva:lock-fill')
    },
    {
      title: 'Register',
      path: '/register',
      icon: getIcon('eva:person-add-fill')
    },*/
    /*{
      title: 'Not found',
      path: '/404',
      icon: getIcon('eva:alert-triangle-fill')
    }*/
];


export default sidebarConfig;
