<template>
  <nav class="navbar navbar-expand-lg navbar1">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <RouterLink to="/agency/dashboard">
          <img class="logo-header" src="https://cdn.save.moe/e/WPxHVs.png" />
        </RouterLink>
        <div class="navbar-nav">
          <!-- Home -->
          <div class="bao-haeder">
            <div class="dropdown">
              <a class="nav-link dropdown-toggle" href="#" style="color: white;" role="button" id="navbarDropdownHome"
                data-bs-toggle="dropdown" aria-expanded="false">
                Home
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdownHome">
                <li>
                  <router-link class="dropdown-item" to="/agency/dashboard">
                    <div class="item-content">
                      <squares-2X2-icon class="navbar-icon"></squares-2X2-icon>
                      <span>Dashboard</span>
                    </div>
                  </router-link>
                </li>
                <!-- Add other submenu items here if needed -->
              </ul>
            </div>

            <!-- Booking -->
            <div class="dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" id="navbarDropdownBooking"
                data-bs-toggle="dropdown" aria-expanded="false">
                Booking
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdownBooking">
                <li>
                  <router-link class="dropdown-item" to="/dashboard/order">
                    <div class="item-content">
                      <wallet-icon class="navbar-icon"></wallet-icon>
                      <span>Booking List</span>
                    </div>
                  </router-link>
                </li>
                <li v-if="roleChecker(['Admin', 'Sale', 'Sale_Admin', 'Agency'])">
                  <router-link class="dropdown-item" to="/agency/multiple">
                    <div class="item-content">
                      <square-2-stack-icon class="navbar-icon"></square-2-stack-icon>
                      <span>New Booking</span>
                    </div>
                  </router-link>
                </li>
                <!-- Add other submenu items here if needed -->
              </ul>
            </div>

            <!-- Report -->
            <div class="dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" id="navbarDropdownReport"
                data-bs-toggle="dropdown" aria-expanded="false">
                Report
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdownReport">
                <li v-if="roleChecker(['Admin', 'Sale', 'Sale_Admin'])">
                  <router-link class="dropdown-item" to="/dashboard/allOfAgency">
                    <div class="item-content">
                      <flag-icon class="navbar-icon"></flag-icon>
                      <span>Report</span>
                    </div>
                  </router-link>
                </li>
                <!-- Add other submenu items here if needed -->
              </ul>
            </div>
          </div>
          <!-- Change_Password -->
          <div class="drop-down">

            <PopupWrapper>
              <template #header>
                <div class="popover">
                  <span>pw</span>
                </div>
              </template>
              <template #content>
                <div class="popover-content">
                  <Change_Password />
                </div>
              </template>
            </PopupWrapper>

          </div>
          <!-- Account -->
          <div class="dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" id="navbarDropdownAccount"
              data-bs-toggle="dropdown" aria-expanded="false">
              Information
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownAccount">
              <li>
                <div class="item-content content-padding">
                  <user-icon class="navbar-icon"></user-icon>
                  <span id="account-information"></span>
                </div>
              </li>
              <!-- <li>
                <div class="item-content content-padding">
                  <user-icon class="navbar-icon"></user-icon>
                </div>
              </li> -->
              <li>
                <div class="nav-link" @click="logout">
                  <div class="item-content">
                    <power-icon class="navbar-icon"></power-icon>
                    <span>Logout</span>
                  </div>
                </div>
              </li>

            </ul>
          </div>
          <div class="dropdown" v-if="roleChecker(['Admin'])">
            <router-link class="nav-link" to="/dashboard/manage" style="color: white;">
              Account
            </router-link>

          </div>
        </div>
      </div>
    </div>
  </nav>

</template>

<script>
import router from "@/router";
import Change_Password from "@/views/admin/user/Change_Password.vue";
import PopupWrapper from "@/components/PopupWrapper.vue";

import {
  UserIcon,
  WalletIcon,
  // SquaresPlusIcon,
  Squares2X2Icon,
  PowerIcon,
  // EllipsisHorizontalCircleIcon,
  // RectangleStackIcon,
  // CalendarDaysIcon,
  // Bars3Icon, 
  FlagIcon,
  Square2StackIcon,
  PencilSquareIcon
} from "@heroicons/vue/24/solid";
// import axios from "axios";

export default {
  name: "AppSidebar",
  components: {
    UserIcon,
    FlagIcon,
    WalletIcon,
    Squares2X2Icon,
    PencilSquareIcon, PowerIcon,
    // EllipsisHorizontalCircleIcon,
    // RectangleStackIcon,
    // CalendarDaysIcon,
    // Bars3Icon,
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
      showAgencyMenu: false,
      showStatisticsAgencyMenu: false,
      showNewBookingMenuForSale: false,
      showNewBookingMenu: false,

    };
  },

  mounted() {
    const roles = localStorage.getItem("roles");

    //Authorize permission for each role
    this.showBookingsMenu =
      roles == "Admin" ||
      roles == "Sales Management" ||
      roles == "Sales Admin";

    this.showStatisticsAgencyMenu =
      roles == "Admin" ||
      roles == "Sales Management" ||
      roles == "Sales Admin";

    //Only operator each airport - admin
    this.showAssignMenu =
      roles == "Admin" ||
      // roles == "Sales Management" ||
      // roles == "Sales Admin" ||
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

    //Only agency-admin-sales
    this.showNewBookingMenu =
      roles == "Agency" ||
      roles == "Admin"

    this.showNewBookingMenuForSale =
      roles == "Admin" ||
      roles == "Sales Admin" ||
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
    //#region maintain
    roleChecker(accepedRoles) {
      let checker = false;

      let role = localStorage.getItem('roles');
      if (role == "Admin") {
        checker = true;
      }
      accepedRoles.forEach((element) => {
        if (element == role) {
          checker = true;
        }
      })
      return checker;
    },
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

        localStorage.removeItem("token");
        localStorage.removeItem('roles');
        localStorage.removeItem('user_id');
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
.popover-content {
  top: 200px;
}

@media (max-width:768px) {
  .navbar[data-v-7d025640] {
    background: #1f416c;
    z-index: 999;
    border-bottom: unset;
  }

  .navbar-collapse {
    padding: 5px 5px !important;

  }

  .bao-haeder {
    display: unset !important;
  }

  .logo-header {
    display: none;
  }

  .navbar-nav {
    gap: 0px !important;
  }
}

.navbar {
  background: #1f416c;
  color: white;
  z-index: 999;
  border-bottom: 1px solid #776f6f;

}

/* menu-page */
.menu-page {
  list-style-type: none;
  padding: 0;
}

.navbar-nav {
  gap: 100px;
}

.show {
  /* width: 175px; */
}

.menu-page li {
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  margin: 11px 0px;
  cursor: pointer;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.layout-menuitem-root-text {
  font-size: 0.857rem;
  text-transform: uppercase;
  font-weight: 700;
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

.nav-link {
  color: white !important;

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

.item-content span {
  font-size: 12px;
}

.item-content svg {
  /* color: white; */

}

.navbar-icon {
  width: 24px;
  height: 24px;
  color: #334155;
  margin-left: 12px;
}

.logo-header {
  width: 100px;
}

.navbar-collapse {
  justify-content: space-between;
  padding: 5px 70px;

}

.bao-haeder {
  display: flex;
  gap: 60px;
}

.content-padding {
  padding: 8px;
}
</style>
