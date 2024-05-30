import { createRouter, createWebHashHistory } from 'vue-router'
//Admin Page
import DashboardPage from '@/views/admin/DashboardPage.vue';
import ServicePage from '@/views/admin/service/ServicePage.vue'
import ManagePage from '@/views/admin/user/ManagePage.vue';
import OrderPage from '@/views/admin/order/OrderPage.vue';
import ReportPage from '@/views/admin/ReportPage.vue';
import Schedule from '@/views/admin/schedule/SchedulePage.vue';
import TaskPage from '@/views/admin/task/TaskPage.vue';
import EmployeePage from '@/views/admin/employee/EmployeePage.vue'
import RolePage from '@/views/admin/role/RolePage.vue';
import StatusPage from '@/views/admin/status/StatusPage.vue';
import CalendarPage from '@/views/CalendarPage.vue';

//Agency
import AgencyPage from '@/views/admin/agency/AgencyPage.vue';
import AgencyDashboard from '@/views/admin/AgencyDashboard.vue';
import AgencyReport from '@/views/admin/AgencyReport.vue';
import AddMultiplePage from '@/views/admin/agency/AddMultiplePage.vue';

//Authenicate Page
import LoginPage from '@/views/auth/LoginPage.vue';
import RegisterPage from '@/views/auth/RegisterPage.vue';

//Form Page
import HomePage from '@/views/HomePage.vue'
import DepartureForm from '@/components/form/DepartureForm.vue';

//Partialc
import HeaderPartial from '@/components/partials/HeaderPartial.vue';
const isAuthenticated = () => {
    return localStorage.getItem('isLoggedIn') === 'true';
};

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage
    },
    {
        path: '/header',
        name: 'HeaderPatial',
        component: HeaderPartial
    },
    {
        path: '/departure',
        name: 'DepartureForm',
        component: DepartureForm
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage,
        beforeEnter: (to, from, next) => {
            if (isAuthenticated()) {
                next('/agency/dashboard');
            } else {
                next();
            }
        }
    },
    {
        path: '/register',
        name: 'RegisterPage',
        component: RegisterPage,
        beforeEnter: (to, from, next) => {
            if (isAuthenticated()) {
                next('/agency/dashboard');
            } else {
                next();
            }
        }
    },
    {
        path: '/',
        redirect: () => {
            return isAuthenticated() ? '/dashboard' : '/login';
        }
    },
    {
        path: '/dashboard',
        component: DashboardPage,
        children: [
            {
                path: 'agency',
                name: 'ReportPage',
                component: ReportPage
            },
            {
                path: 'order',
                name: 'OrderPage',
                component: OrderPage
            },
            {
                path: 'service',
                name: 'ServicePage',
                component: ServicePage
            },
            {
                path: 'manage',
                name: 'ManagePage',
                component: ManagePage
            },
            {
                path: 'employee',
                name: 'EmployeePage',
                component: EmployeePage
            },
            {
                path: 'schedule',
                name: 'Schedule',
                component: Schedule
            },
            {
                path: 'task',
                name: 'TaskPage',
                component: TaskPage
            },
            {
                path: 'role',
                name: 'RolePage',
                component: RolePage
            },
            {
                path: 'status',
                name: 'StatusPage',
                component: StatusPage
            },
            {
                path: 'calendar',
                name: 'CalendarPage',
                component: CalendarPage
            },
        ]
    },
    {
        path: '/agency',
        component: AgencyDashboard,
        children: [
            {
                path: 'dashboard',
                name: 'AgencyReport',
                component: AgencyReport
            },
            {
                path: 'order',
                name: 'AgencyPage',
                component: AgencyPage,
            },
            {
                path:'multiple',
                name:'MultiplePage',
                component:AddMultiplePage,
            }
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
