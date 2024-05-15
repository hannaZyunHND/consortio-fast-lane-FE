<template>
  <div class="order">
    <div class="order-body">
      <div class="order-header">
        <span>Order List</span>
        <PopupWrapper>
          <template #header>
            <div class="popover">Add new +</div>
          </template>
          <template #content>
            <div class="popover-content">
              <AddOrder @reloadPage="fetchOrder()" />
            </div>
          </template>
        </PopupWrapper>
      </div>
      <div class="space-line"></div>
      <div class="order-search">
        <div class="menu-search">
          <div class="search-filter">
            <select id="airport" class="form-select" v-model="airport" placeholder="Select Cities">
              <option selected disabled>Airport</option>
              <option value="Da Nang">Da Nang</option>
              <option value="Tan Son Nhat">Tan Son Nhat</option>
              <option value="Noi Bai">Noi Bai</option>
              <option value="Phu Quoc">Phu Quoc</option>
              <option value="Cam Ranh">Cam Ranh</option>
            </select>
          </div>
          <div class="search-filter">
            <select id="status-filter" v-model="status">
              <option value="status" disabled selected hidden>Status</option>
              <option value="4">Pending</option>
              <option value="5">Confirmed</option>
              <option value="9">Completed</option>
              <option value="19">Canceled</option>
            </select>
          </div>
          <div class="search-filter">
            <VueDatePicker v-model="fromDate" :config="datePickerConfig" placeholder="From">
            </VueDatePicker>
          </div>
          <div class="search-filter">
            <VueDatePicker v-model="toDate" :config="datePickerConfig" placeholder="To">
            </VueDatePicker>
          </div>
          <div>
            <input type="text" name="search" id="search" v-model="searchTerm" placeholder="Search"
              @keyup.enter="search" />
          </div>
          <button class="btn-search-primary">
            <i class="pi pi-search" style="font-size: 1rem" @click="search"></i>
          </button>
        </div>
        <button @click="refreshOrders" class="btn-reset-primary">
          <i class="pi pi-refresh" style="font-size: 1rem"></i>
        </button>
      </div>
    </div>
    <div class="order-container">
      <div class="list-order">
        <table>
          <thead>
            <tr class="data-table-tilte">
              <th><bars-2-icon class="order-icon" /></th>
              <th>Customer</th>
              <th>BK.STAT</th>
              <th>Ser.Type</th>
              <th>Ser.Time</th>
              <th>Ref.</th>
              <th>Flight</th>
              <th>Passport</th>
              <th>Airport</th>
              <th>Note</th>
              <!-- <th class="order-actions">Actions</th> -->
            </tr>
          </thead>
          <tbody class="order-info">
            <tr v-for="item in items" :key="item.id" class="order-information">
              <td>
                <PopupWrapper>
                  <template #header>
                    <div class="popover">
                      <i class="pi pi-image" style="font-size: 1rem" @click="openEditOrder(item.id)"></i>
                    </div>
                  </template>
                  <template #content>
                    <div class="popover-content">
                      <ImagePopup :orderId="selectedOrderId" />
                    </div>
                  </template>
                </PopupWrapper>
              </td>
              <td>
                <div class="customer-infomation">
                  <div class="item" :data-id="item.id">
                    <user-icon class="primary-icon" />
                    <span style="font-size: 14px">
                      {{ item.name }}
                    </span>
                  </div>
                  <div class="item" :data-id="item.id">
                    <phone-icon class="primary-icon" />
                    {{ item.phone }}
                  </div>
                  <div class="item" :data-id="item.id">
                    <envelope-icon class="primary-icon" />
                    {{ item.email }}
                  </div>
                </div>
              </td>
              <td>
                <span class="item" :data-id="item.id" id="status" :style="getStatusStyle(item.status)">
                  {{ item.status }}
                </span>
              </td>
              <td>
                <div class="item" :data-id="item.id">
                  {{ DisplayServices(item.service) }}
                </div>
              </td>
              <td>
                <div class="order_time">
                  <div class="item" :data-id="item.id">
                    {{ formatTime(item.service_Time) }}
                  </div>
                  <div class="item" :data-id="item.id">
                    {{ formatDate(item.service_Time) }}
                  </div>
                </div>
              </td>
              <td>
                <div class="item" :data-id="item.id">
                  {{ item.groupReference }}
                </div>
              </td>
              <td>
                <div class="item" :data-id="item.id">
                  {{ item.flight_Number }}
                </div>
              </td>
              <td>
                <div class="customer-nation">
                  <div class="item" :data-id="item.id">
                    {{ item.passport_Number }}
                  </div>
                  <div class="item" :data-id="item.id">
                    {{ item.nationality }}
                  </div>
                </div>
              </td>
              <td>
                <div class="item" :data-id="item.id">{{ item.airPort }}</div>
              </td>
              <td>
                <span class="item" :data-id="item.id">{{ item.note }}</span>
              </td>
              <!-- <td>
                <div class="action-buttons">
                  <PopupWrapper>
                    <template #header>
                      <div class="popover">
                        <pencil-square-icon class="order-icon" @click="openEditOrder(item.id)" />
                      </div>
                    </template>
                    <template #content>
                      <div class="popover-content">
                        <EditOrder :orderId="selectedOrderId" @reloadPage="fetchOrder()" />
                      </div>
                    </template>
                  </PopupWrapper>
                </div>
              </td> -->
            </tr>
          </tbody>
        </table>
        <Pagination :currentPage="currentPage" :totalPages="totalPages" @nextPage="nextPage" @prevPage="prevPage"
          @goToPage="goToPage" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  // PencilSquareIcon,
  PhoneIcon,
  UserIcon,
  Bars2Icon,
  EnvelopeIcon,
} from "@heroicons/vue/24/solid";
import PopupWrapper from "@/components/PopupWrapper.vue";
import AddOrder from "@/views/admin/agency/AddOrder.vue";
// import EditOrder from "@/views/admin/agency/EditOrder.vue";
import Pagination from "@/components/PaginationPage.vue";
import ImagePopup from "@/views/admin/order/ImagePopup.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
export default {
  name: "AgencyPage",
  components: {
    // PencilSquareIcon,
    PopupWrapper,
    Pagination,
    PhoneIcon,
    Bars2Icon,
    UserIcon,
    EnvelopeIcon,
    AddOrder,
    // EditOrder,
    ImagePopup,
    VueDatePicker,
  },
  data() {
    return {
      status: null,
      date: null,
      currentPage: 1,
      pageSize: 6,
      totalItems: 0,
      items: [],
      services: [],
      statuses: [],
      selectedOrderId: "",
      totalYear: [],
      isPopupVisible: false,
      datePickerConfig: {
        format: "yyyy-MM-dd HH:mm",
        showSeconds: false,
      },
    };
  },
  mounted() {
    this.fetchOrder();
    this.fetchStatus();
    this.fetchTotalMonth();
  },
  methods: {
    async fetchOrder() {
      const apiUrl = process.env.VUE_APP_API_URL;
      const requestData = {
        agencyId: parseInt(localStorage.getItem("user_id")), // Convert agencyId to an integer
        index: this.currentPage,
        pageSize: this.pageSize,
      };
      try {
        const response = await axios.post(
          `${apiUrl}/order/agency`,
          requestData
        );
        console.log(response.data);
        if (response.data && response.data.order_By_Agencies) {
          this.items = response.data.order_By_Agencies; // Assign all orders to this.items
          this.totalItems = response.data.totalCount;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    async search() {
      try {
        const apiUrl = process.env.VUE_APP_API_URL;
        const user_id = localStorage.getItem("user_id");
        const requestData = {
          status: this.status,
          airport: document.getElementById("airport").value,
          date: this.date,
          keyword: this.searchTerm,
          index: this.currentPage,
          pageSize: this.pageSize,
          agency_Id: user_id,
        };

        const response = await axios.post(
          `${apiUrl}/order/search`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data) {
          this.items = response.data.orders;
          this.totalItems = response.data.totalCount;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        }
      } catch (error) {
        console.error("There was a problem with the delete operation:", error);
      }
    },

    refreshOrders() {
      this.resetFilters();
      this.fetchOrder();
    },
    resetFilters() {
      this.status = null;
      this.date = null;
      this.airport = "";
      this.searchTerm = "";
      this.currentPage = 1;
      this.pageSize = 6;
    },

    fetchStatus() {
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .get(`${apiUrl}/status`)
        .then((response) => {
          this.statuses = response.data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },

    fetchTotalMonth() {
      const apiUrl = process.env.VUE_APP_API_URL;
      const user_id = localStorage.getItem("user_id");
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      axios
        .get(`${apiUrl}/order/report/agency/month?agency_Id=${user_id}&year=${currentYear}`)
        .then((response) => {
          console.log(response.data);
          this.totalYear = response.data;

          let currentMonthData;
          for (let i = 0; i < this.totalYear.monthlyData.length; i++) {
            if (this.totalYear.monthlyData[i].month === currentMonth) {
              currentMonthData = this.totalYear.monthlyData[i];
              break;
            }
          }

          if (currentMonthData) {
            console.log('Data for current month:', currentMonthData);
          } else {
            console.log('No data found for current month');
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },


    formatTime(timeString) {
      const time = new Date(timeString);
      let hours = time.getHours();
      const minutes = String(time.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // Nếu giờ là 0 thì chuyển thành 12

      return `${hours}:${minutes} ${ampm}`;
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    },
    openEditOrder(orderId) {
      this.selectedOrderId = orderId;
    },

    nextPage() {
      if (this.currentPage < Math.ceil(this.totalItems / this.pageSize)) {
        this.currentPage++;
        if (this.hasSearchParams()) {
          this.search();
        } else {
          this.fetchOrder();
        }
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        if (this.hasSearchParams()) {
          this.search();
        } else {
          this.fetchOrder();
        }
      }
    },

    goToPage(page) {
      this.currentPage = page;
      if (this.hasSearchParams()) {
        this.search();
      } else {
        this.fetchOrder();
      }
    },

    hasSearchParams() {
      return (
        this.status ||
        document.getElementById("airport").value ||
        this.date ||
        this.searchTerm
      );
    },

    async fetchServices() {
      const apiUrl = process.env.VUE_APP_API_URL;
      try {
        const response = await axios.get(`${apiUrl}/service`);
        this.services = response.data;
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },

    DisplayServices(serviceID) {
      try {
        if (this.services.length === 0) {
          this.fetchServices();
        }

        const serviceIdInt = parseInt(serviceID);
        const service = this.services.find((s) => s.id === serviceIdInt);
        return service && service.name ? service.name : "Unknown";
      } catch (error) {
        console.error("Error fetching service name:", error);
        return "Error";
      }
    },
    getStatusStyle(status) {
      switch (status) {
        case "Pending":
          return { backgroundColor: "#FFFBE6", color: "#F9A001" };
        case "Completed":
          return { backgroundColor: "#C3EFD9", color: "#173F2D" };
        case "Canceled":
          return { backgroundColor: "#F8E3E2", color: "#7B110E" };
        case "O.Canceled":
          return { backgroundColor: "#F8E3E2", color: "#7B110E" };
        case "Confirmed":
          return { backgroundColor: "#D6E5FF", color: "#3C5289" };
        case "O.Confirmed":
          return { backgroundColor: "#D6E5FF", color: "#3C5289" };
        case "Uncompleted":
          return { backgroundColor: "#3770C3", color: "#FFFFFF" };
        default:
          return { backgroundColor: "#EEF4FE", color: "#9291FB" };
      }
    }
  },
};
</script>

<style scoped>
.order {
  gap: 30px;
  display: flex;
  flex-direction: column;
}

.order-body {
  padding: 0px 15px;
  display: flex;
  height: 140px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
  flex-direction: column;
  justify-content: space-around;
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* css for datePicker */
.dp__input_wrap.dp__pointer.dp__input_readonly.dp__input.dp__input_icon_pad.dp__input_reg {
  width: 200px !important;
  height: 32px !important;
  font-size: 14px !important;
  border: 2px solid #cbd5e1 !important;
  border-radius: 7px !important;
}

.menu-search select {
  border: 2px solid #cbd5e1;
  padding: 5px;
  border-radius: 7px;
}

.search-filter {
  gap: 5px;
  display: flex;
  align-items: center;
}

#search {
  border: none;
  width: 185px;
  padding: 10px;
  background: none;
  border-radius: 4px;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
}

#search:focus {
  outline: none;
  border: none;
  background: none;
}

#airport,
#status-filter {
  border-radius: 7px;
  padding: 10px;
  border: none;
  background: none;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
}

.space-line {
  border: 1px solid #e6eae9;
}

.order-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-search {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-filter {
  gap: 5px;
  display: flex;
  align-items: center;
}

select {
  border: 1px solid #e6eae9;
  margin: 10px 0px;
  border-radius: 5px;
  padding: 10px;
}

.btn-search-primary {
  border-radius: 7px;
  padding: 10px;
  border: none;
  background: none;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
}

.btn-reset-primary {
  height: 38px;
  border-radius: 7px;
  padding: 10px;
  border: none;
  background: none;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
}

/* report-statu */
.status-data {
  display: flex;
  padding: 5px 20px;
  border-radius: 5px;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
  align-items: center;
}

.data-report-month {
  gap: 30px;
  min-height: 30px;
  display: flex;
}

/* order-container */
.order-container {
  padding: 15px;
  overflow-y: auto;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
}

.list-order table {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%;
}

.list-order th,
.list-order td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.list-order th {
  text-align: left;
}

.data-table-tilte {
  text-transform: uppercase;
}

.item {
  display: flex;
  width: max-content;
  gap: 5px;
}

.primary-icon {
  width: 14px;
}

.order-icon {
  width: 24px;
  height: 24px;
  color: #222;
  margin-left: 12px;
}

.customer-infomation {
  gap: 10px;
  display: flex;
  flex-direction: column;
}

#status {
  background: #c6eee181;
  color: #0b825a;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.25rem 0.4rem;
  border-radius: 6px;
}

.action-buttons {
  display: flex;
  justify-content: space-evenly;
}

.btn-delete-primary {
  border: none;
  background: none;
}

/* toolip */
.passport-visa-tooltip {
  position: relative;
  display: inline-block;
}
</style>
