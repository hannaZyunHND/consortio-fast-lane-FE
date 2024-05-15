  <template>
    <div class="order">
      <div class="order-body">
        <div class="order-header">
          <span>Order List</span>
          <PopupWrapper>
            <template #header>
            </template>
            <template #content>
              <div class="popover-content">
                <AddOrder />
              </div>
            </template>
          </PopupWrapper>
        </div>
        <div class="space-line"></div>
        <div class="order-search">
          <div class="menu-search">
            <div class="search-filter">
              <select id="airport" class="form-select" v-model="airport" placeholder="Select Cities">
                <option selected>Airport</option>
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
                <option v-for="(status, index) in statuses" :key="index" :value="status.id">
                  {{ status.name }}
                </option>
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
                <th>OPS.STAT</th>
                <th>SLS.STAT</th>
                <th>Ser.Type</th>
                <th>Ser.Time</th>
                <th>Ref.</th>
                <th>Flight</th>
                <th>Passport</th>
                <th>Airport</th>
                <th>Employee</th>
                <th class="order-actions">Actions</th>
              </tr>
            </thead>
            <tbody class="order-info">
              <tr v-for="item in items" :key="item.id" class="order-information">
                <td>
                  <PopupWrapper>
                    <template #header>
                      <div class="popover">
                        <i class="pi pi-image" style="font-size: 1rem" @click="openEditSchedule(item.id)"></i>
                      </div>
                    </template>
                    <template #content>
                      <div class="popover-content">
                        <ImagePopup :orderId="selectedScheduleId" />
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
                  <span class="item" :data-id="item.id" id="status" :style="getStatusStyle(item.status_Operator)">
                    {{ item.status_Operator }}
                  </span>
                </td>
                <td>
                  <span class="item" :data-id="item.id" id="status" :style="getStatusStyle(item.status_Sales)">
                    {{ item.status_Sales }}
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
                  <div class="item" :data-id="item.employee">
                    {{ getEmployeeName(item.employee) }}
                  </div>
                </td>
                <td>
                  <div class="action-buttons">
                    <PopupWrapper>
                      <template #header>
                        <div class="popover">
                          <pencil-square-icon class="order-icon" @click="openEditSchedule(item.id)" />
                        </div>
                      </template>
                      <template #content>
                        <div class="popover-content">
                          <EditTask :orderId="selectedScheduleId" @reloadPage="fetchSchedule()" />
                        </div>
                      </template>
                    </PopupWrapper>
                  </div>
                </td>
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
  PencilSquareIcon,
  PhoneIcon,
  UserIcon,
  Bars2Icon,
  EnvelopeIcon,
} from "@heroicons/vue/24/solid";
import PopupWrapper from "@/components/PopupWrapper.vue";
import EditTask from "@/views/admin/task/EditTask.vue";
import Pagination from "@/components/PaginationPage.vue";
import ImagePopup from "@/views/admin/order/ImagePopup.vue";
export default {
  name: "TaskPage",
  components: {
    PencilSquareIcon,
    PopupWrapper,
    Pagination,
    PhoneIcon,
    Bars2Icon,
    UserIcon,
    EnvelopeIcon,
    EditTask,
    ImagePopup
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 4,
      totalItems: 0,
      items: [],
      services: [],
      selectedScheduleId: "",
      showModalStatus: false,
      employees: [],
    };
  },
  mounted() {
    this.fetchSchedule(1);
    this.fetchStatus();
    this.fetchEmployee()
  },
  methods: {
    async fetchSchedule() {
      const apiUrl = process.env.VUE_APP_API_URL;
      const user_id = localStorage.getItem("user_id")
      try {
        const response = await axios.get(
          `${apiUrl}/order?index=${this.currentPage}&pageSize=${this.pageSize}&user_id=${user_id}`,
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
        console.error("Error fetching data:", error);
      }
    },
    deleteItem(item) {
      const apiUrl = process.env.VUE_APP_API_URL;
      if (confirm("Are you sure to delete?")) {
        axios
          .delete(`${apiUrl}/order/delete/${item}`)
          .then(() => {
            this.success();
            this.$emit("deleted");
          })
          .catch((error) => {
            console.error(
              "There was a problem with the delete operation:",
              error
            );
          });
      }
    },
    async search() {
      try {
        const apiUrl = process.env.VUE_APP_API_URL;
        const requestData = {
          status: this.status,
          airport: document.getElementById("airport").value,
          toDate: this.toDate,
          fromDate: this.fromDate,
          keyword: this.searchTerm,
          index: this.currentPage,
          pageSize: this.pageSize,
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
      this.fetchSchedule();
    },
    async fetchEmployee() {
      const apiUrl = process.env.VUE_APP_API_URL;
      const user_id = parseInt(localStorage.getItem("user_id"));
      let isOperator = false;

      if (localStorage.getItem("roles") === "Operator") {
        isOperator = true;
      }
      const url = `${apiUrl}/employee?index=${this.currentPage}&pageSize=${this.pageSize}&user_id=${user_id}&isOperator=${isOperator}`;
      try {
        const response = await axios.get(url);
        this.employees = response.data.employees;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    getEmployeeName(employeeId) {
      const employeeIdInt = parseInt(employeeId);
      const employee = this.employees.find((s) => s.id === employeeIdInt);
      return employee && employee.name ? employee.name : "Unassigned";
    },

    async fetchStatus() {
      const apiUrl = process.env.VUE_APP_API_URL;
      try {
        const response = await axios.get(`${apiUrl}/status/role/2`);
        this.statuses = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
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
    openEditSchedule(orderId) {
      this.selectedScheduleId = orderId;
      console.log("order id", orderId);
    },

    nextPage() {
      if (this.currentPage < Math.ceil(this.totalItems / this.pageSize)) {
        this.currentPage++;
        this.fetchSchedule(1);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchSchedule(1);
      }
    },
    goToPage(page) {
      this.currentPage = page;
      this.fetchSchedule(1);
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

.space-line {
  border: 1px solid #e6eae9;
}

.order-search {
  gap: 10px;
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

#airport,
#status-filter {
  border-radius: 7px;
  padding: 10px;
  border: none;
  background: none;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
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
  background-color: #f2f2f2;
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

#search {
  border: none;
  width: 185px;
  padding: 10px;
  background: none;
  border-radius: 8px;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
}

#search:focus {
  outline: none;
  border: none;
  background: none;
}

.action-buttons {
  display: flex;
  justify-content: space-evenly;
}

.btn-delete-primary {
  border: none;
  background: none;
}
</style>
