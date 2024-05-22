<template>
  <div class="navbar">
    <ul class="menu-page">
      <!-- Home -->
      <li v-if="showHomeMenu">
        <div class="layout-menuitem-root-text">Home</div>
        <router-link class="nav-link" to="/agency/dashboard">
          <div class="item-content">
            <squares-2X2-icon class="navbar-icon" />
            <span>Dashboard</span>
          </div>
        </router-link>
      </li>

      <!-- Sales -->
      <li v-if="showBookingsMenu">
        <div class="layout-menuitem-root-text">Sales</div>
        <router-link class="nav-link" to="/dashboard/order">
          <div class="item-content">
            <wallet-icon class="navbar-icon" />
            <span>Booking</span>
          </div>
        </router-link>
      </li>

      <!-- Calendar -->
      <li v-if="showCalendarMenu">
        <router-link class="nav-link" to="/dashboard/calendar">
          <div class="item-content">
            <calendar-days-icon class="navbar-icon" />
            <span>Calendar</span>
          </div>
        </router-link>
      </li>

      <!-- Operation -->
      <li v-if="showScheduleMenu">
        <div class="layout-menuitem-root-text">Operation</div>
        <router-link class="nav-link" to="/dashboard/schedule">
          <div class="item-content">
            <rectangle-stack-icon class="navbar-icon" />
            <span>Schedule</span>
          </div>
        </router-link>
      </li>
      <!-- Task -->
      <li v-if="showAssignMenu">
        <router-link class="nav-link" to="/dashboard/task">
          <div class="item-content">
            <rectangle-stack-icon class="navbar-icon" />
            <span>Assignment</span>
          </div>
        </router-link>
      </li>
      <!--  -->

      <!-- Agency -->
      <li v-if="showAgencyMenu">
        <div class="layout-menuitem-root-text">Agency</div>
        <router-link class="nav-link" to="/agency/order">
          <div class="item-content">
            <square-2-stack-icon class="navbar-icon" />
            <span>Booking</span>
          </div>
        </router-link>
      </li>

      <!-- Settings -->
      <li v-if="showServicesMenu">
        <div class="layout-menuitem-root-text">Settings</div>
        <router-link class="nav-link" to="/dashboard/service">
          <div class="item-content">
            <square-2-stack-icon class="navbar-icon" />
            <span>Service</span>
          </div>
        </router-link>
      </li>

      <!-- Status -->
      <li v-if="showStatusMenu">
        <router-link class="nav-link" to="/dashboard/status">
          <div class="item-content">
            <bars-3-icon class="navbar-icon" />
            <span>Status</span>
          </div>
        </router-link>
      </li>

      <!-- Manage -->
      <li v-if="showRoleMenu">
        <div class="layout-menuitem-root-text">Manage</div>
        <router-link class="nav-link" to="/dashboard/role">
          <div class="item-content">
            <ellipsis-horizontal-circle-icon class="navbar-icon" />
            <span>Role</span>
          </div>
        </router-link>
      </li>

      <!-- Employee -->
      <li v-if="showEmployeeMenu">
        <router-link class="nav-link" to="/dashboard/employee">
          <div class="item-content">
            <squares-plus-icon class="navbar-icon" />
            <span>Employee</span>
          </div>
        </router-link>
      </li>

      <!-- Account -->
      <li v-if="showAccountMenu">
        <router-link class="nav-link" to="/dashboard/manage">
          <div class="item-content">
            <user-icon class="navbar-icon" />
            <span>Account</span>
          </div>
        </router-link>
      </li>

      <!-- personal -->
      <div>
        <li style="margin-top: 100px">
          <div class="layout-menuitem-root-text">Information</div>
          <div class="item-content">
            <user-icon class="navbar-icon" />
            <span id="account-information"></span>
          </div>
        </li>

        <!-- Logout -->
        <li>
          <div class="item-content">
            <user-icon class="navbar-icon" />
            <PopupWrapper>
              <template #header>
                <div class="popover">
                  <pencil-square-icon class="user-icon" />
                  <span>Change password</span>
                </div>
              </template>
              <template #content>
                <div class="popover-content">
                  <Change_Password />
                </div>
              </template>
            </PopupWrapper>
          </div>
        </li>
        <li>
          <div class="nav-link" @click="logout">
            <div class="item-content">
              <power-icon class="navbar-icon" />
              <span>Logout</span>
            </div>
          </div>
        </li>
      </div>
    </ul>
    <ul></ul>
  </div>
</template>

<script>
import router from "@/router";
import Change_Password from "@/views/admin/user/Change_Password.vue";
import PopupWrapper from "@/components/PopupWrapper.vue";

import {
  UserIcon,
  WalletIcon,
  SquaresPlusIcon,
  Squares2X2Icon,
  PowerIcon,
  EllipsisHorizontalCircleIcon,
  RectangleStackIcon,
  CalendarDaysIcon,
  Bars3Icon,
  Square2StackIcon,
} from "@heroicons/vue/24/solid";
import axios from "axios";

export default {
  name: "AppSidebar",
  components: {
    UserIcon,
    WalletIcon,
    Squares2X2Icon,
    SquaresPlusIcon,
    PowerIcon,
    EllipsisHorizontalCircleIcon,
    RectangleStackIcon,
    CalendarDaysIcon,
    Bars3Icon,
    Square2StackIcon,
    Change_Password,
    PopupWrapper
  },
  data() {
    return {
      isSubMenuOpen: {
        data: false,
      },
      item: [],
      showEmployeeMenu: false,
      showBookingsMenu: false,
      showTaskMenu: false,
      showScheduleMenu: false,
      showServicesMenu: false,
      showRoleMenu: false,
      showAccountMenu: false,
      showAgencyMenu: false
    };
  },

  mounted() {
    const roles = localStorage.getItem("roles");

    //Authorize permission for each role
    this.showBookingsMenu =
      roles == "Admin" ||
      roles == "Sales Management" ||
      roles == "Sales Admin";

    //Only operator each airport - admin
    this.showAssignMenu =
      roles == "Admin" ||
      roles == "Sales Management" ||
      roles == "Sales Admin" ||
      roles == "Chief Rep"

    this.showScheduleMenu =
      roles == "Admin" ||
      roles == "Employee" ||
      roles == "Chief Rep"

    //Only agency-admin-sales
    this.showAgencyMenu =
      roles == "Agency" ||
      roles == "Admin" ||
      roles == "Sales Management"


    //Only admin-sales-agency-operator
    this.showHomeMenu =
      roles == "Admin" ||
      roles == "Sales Admin" ||
      roles == "Agency" ||
      roles == "Sales Management" ||
      roles == "Chief Rep"

    //Only Admin
    this.showEmployeeMenu = roles == "Admin"
    this.showRoleMenu = roles == "Admin"
    this.showAccountMenu = roles == "Admin"
    this.showServicesMenu = roles == "Admin"
    this.showStatusMenu = roles == "Admin"

    this.showAccount();
  },
  methods: {
    showAccount() {
      const nameValue = document.getElementById('account-information');
      const userName = localStorage.getItem("user_name");
      nameValue.innerText = userName;
    },

    toggleSubMenu(subMenu) {
      this.isSubMenuOpen[subMenu] = !this.isSubMenuOpen[subMenu];
    },

    async logout() {
      try {
        const apiUrl = process.env.VUE_APP_API_URL;
        await axios.post(`${apiUrl}/auth/logout`);
        localStorage.removeItem("token");
        localStorage.setItem("isLoggedIn", "false");
        router.push("/login");
      } catch (error) {
        console.error("Đã xảy ra lỗi khi đăng xuất:", error);
      }
    },
  }
};
</script>

<style scoped>
.navbar {
  /* position: fixed; */
  width: 300px;
  height: 100%;
  /* z-index: 999; */
  overflow-y: auto;
  user-select: none;
  top: 7rem;
  left: 2rem;
  transition: transform 0.2s, left 0.2s;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 0.5rem 1.5rem;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
}

/* menu-page */
.menu-page {
  list-style-type: none;
  padding: 0;
}

.menu-page li {
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  margin: 20px 0px;
  cursor: pointer;
  color: white;
}

.layout-menuitem-root-text {
  font-size: 0.857rem;
  text-transform: uppercase;
  font-weight: 700;
  color: #0f172a;
  margin: 0.75rem 0;
}

.menu-page li a.active-route {
  font-weight: 700;
  color: #10b981;
}

.menu-page .nav-link {
  text-decoration: none;
  color: inherit;
}

span {
  font-size: 14px;
  font-family: "Inter var", sans-serif;
  color: #334155;
}

.item-content {
  gap: 10px;
  display: flex;
  align-items: center;
}

.navbar-icon {
  width: 24px;
  height: 24px;
  color: #334155;
  margin-left: 12px;
}
</style>
