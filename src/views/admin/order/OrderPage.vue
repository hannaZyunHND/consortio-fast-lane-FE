<template>
  <div class="order">
    <div class="order-body">
      <div class="order-header">
        <span>Order List</span>
        <PopupWrapper>
          <template #header>
            <!-- <div class="popover">Add new +</div> -->
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
            <select id="airport" class="form-select" placeholder="Select Cities" v-model="filter.airportId"
              v-if="roleChecker(['Admin', 'Sale', 'Sale_Admin', 'Agency'])">
              <option value="0" selected>ALL AIRPORT</option>
              <option v-for="a in maintainAirports" :key="a.id" :value="a.id">{{ a.name }}</option>
            </select>
          </div>
          <div class="search-filter">
            <select id="status-filter" v-model="filter.bookingStatusId"
              v-if="roleChecker(['Admin', 'Sale', 'Sale_Admin', 'Operator_Ref', 'Agency'])">
              <option value="0">ALL STATUS</option>
              <option v-for="(status, index) in maintainBookingStatus" :key="index" :value="status.Key">
                {{ $t(`cms.${status.Value}`) }}
              </option>
            </select>
          </div>
          <div class="search-filter">
            <select id="status-filter" v-model="filter.createdBy" v-if="roleChecker(['Admin', 'Sale_Admin', 'Agency'])">
              <option :value="defaultUserId">ALL USERS</option>
              <option v-for="(user, index) in users" :key="index" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>
          <div class="search-filter">
            <VueDatePicker v-model="filter.fromDate" :config="datePickerConfig" placeholder="From">
            </VueDatePicker>
          </div>
          <div class="search-filter">
            <VueDatePicker v-model="filter.toDate" :config="datePickerConfig" placeholder="To">
            </VueDatePicker>
          </div>
          <div class="search-filter">
            <select id="status-filter" v-model="filter.orderBy">
              <option value="service-time">Sort by Service-Time</option>
              <option value="booking-time">Sort by Booking-Time</option>
            </select>
          </div>
          <div class="search-filter">
            <input type="text" name="search" id="search" v-model="filter.keyword" placeholder="Search"
              @keyup.enter="search" />
          </div>
          <div class="search-filter">
            <button class="btn-search-primary">
              <i class="fa-solid fa-download" @click="exportOrder()"></i>
            </button>
          </div>

          <!-- <button class="btn-export-primary">
            <i class="pi pi-download" style="font-size: 1rem" @click="handleExport"></i>
          </button> -->
        </div>

      </div>
    </div>
    <div class="order-container" v-if="contentViewer == 'table'">
      <div class="list-order">
        <table>
          <thead>
            <tr class="data-table-tilte">
              <th v-if="roleChecker(['Operator_Ref', 'Operator'])"><bars-2-icon class="order-icon" /></th>
              <th>Customer</th>
              <th>BK.STAT</th>
              <th v-if="roleCheckerReverse(['Agency'])">SLS.STAT</th>
              <th v-if="roleCheckerReverse(['Agency'])">OPS.STAT</th>
              <th>Ser.Type</th>
              <th>Ser.Time</th>
              <th>Ref.</th>
              <th>Flight</th>
              <th>Passport</th>
              <th>Airport</th>
              <th>Note</th>
              <th v-if="roleCheckerReverse(['Agency'])">Remark</th>
              <th v-if="roleCheckerReverse(['Agency'])">Employee</th>
              <th v-if="roleChecker(['Admin'])">UpdatedBy</th>
              <th class="order-actions">Actions</th>
            </tr>
          </thead>
          <tbody class="order-info">
            <tr v-for="item in items" :key="item.id" class="order-information" :style="item.cssColor">
              <td v-if="roleChecker(['Operator_Ref', 'Operator'])">
                <!-- <input type="checkbox" name="" :id="'check-complete-status-' + item.id"
                  @change="maintainChangeBookingStatus(item.id)" v-if="(item.status == 'B_Pending')"> -->
                <div class=""
                  v-if="((item.status == 'B_Confirm' || roleChecker(['Admin']))) && item.listEmployees.length > 0">
                  <div class="">
                    <button class="btn btn-success" @click="maintainChangeBookingStatus(item.id)">Complete</button>
                  </div>
                  <br>
                  <div class="">
                    <button class="btn btn-danger"
                      @click="maintainChangeBookingStatusUncomplete(item.id)">Uncomplete</button>
                  </div>
                </div>

              </td>

              <td>
                <div class="customer-infomation">
                  <div class="item" :data-id="item.id">
                    <user-icon class="primary-icon" />
                    <span style="font-size: 14px">
                      {{ item.name }}
                    </span>
                  </div>
                  <div class="item" :data-id="item.id" v-if="roleCheckerReverse(['Operator'])">
                    <phone-icon class="primary-icon" />
                    {{ item.phone }}
                  </div>
                  <div class="item" :data-id="item.id" v-if="roleCheckerReverse(['Operator'])">
                    <envelope-icon class="primary-icon" />
                    {{ item.email }}
                  </div>
                  <div class="item" :data-id="item.id" v-if="roleCheckerReverse(['Operator'])">
                    <envelope-icon class="primary-icon" />
                    Created By: {{ item.createBy ? item.createBy : "INDIVIDUAL" }}
                  </div>
                  <div class="item">
                    <PopupWrapper>
                      <template #header>
                        <div class="popover">
                          <i class="pi pi-image" style="font-size: 1rem" @click="openEditOrder(item)"></i>
                        </div>
                      </template>
                      <template #content>
                        <div class="popover-content">
                          <ImagePopup :orderId="selectedOrderId" />
                        </div>
                      </template>
                    </PopupWrapper>
                  </div>
                </div>
              </td>
              <td>
                <span class="item" :data-id="item.id" id="status" :style="getStatusStyle(item.status)">
                  {{ $t(`cms.${item.status}`) }}
                </span>
              </td>
              <td v-if="roleCheckerReverse(['Agency'])">
                <span class="item" :data-id="item.id" id="status" :style="getStatusStyle(item.status_Sales)">
                  {{ $t(`cms.${item.status_Sales}`) }}
                </span>
              </td>
              <td v-if="roleCheckerReverse(['Agency'])">
                <span class="item" :data-id="item.id" id="status" :style="getStatusStyle(item.status_Operator)">
                  {{ $t(`cms.${item.status_Operator}`) }}
                </span>
              </td>
              <td>
                <div class="item" :data-id="item.id">
                  {{ $t(`services.${item.service}`) }}
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
                  <div class="item" :data-id="item.id"
                    style="overflow-wrap: break-word;width: 200px;text-align: justify;">
                    {{ item.nationality }}
                  </div>
                </div>
              </td>
              <td>
                <div class="item" :data-id="item.id">{{ item.airPort }}</div>
              </td>
              <td>
                <span class="item" :data-id="item.id" style="width: 200px;overflow-wrap:break-word">{{
                  item.note
                }}</span>
              </td>
              <td v-if="roleCheckerReverse(['Agency'])">
                <span class="item" :data-id="item.id">{{ item.operator_Note }}</span>
              </td>
              <td v-if="roleCheckerReverse(['Agency'])">
                <div v-if="item.listEmployees.length > 0">
                  <ul>
                    <li v-for="e in item.listEmployees">{{ e }}</li>
                  </ul>
                </div>
                <div v-else>
                  <ul>
                    <li>Un-assign</li>
                  </ul>
                </div>
              </td>
              <td v-if="roleChecker(['Admin'])">
                <span class="item" :data-id="item.id">{{ item.updatedBy }}</span>
              </td>
              <td>
                <div class="action-buttons">
                  <PopupWrapper v-if="roleChecker(['Sale_Admin']) || (item.moreThan12Hour && roleChecker(['Agency']))">
                    <template #header>
                      <div class="popover">
                        <pencil-square-icon class="order-icon" @click="openEditOrder(item)" />
                      </div>
                    </template>
                    <template #content>
                      <div class="popover-content">
                        <EditOrder :orderId="selectedOrderId" @reloadPage="maintainFetchOrders()" />
                      </div>
                    </template>
                  </PopupWrapper>
                  <PopupWrapper v-if="roleChecker(['Operator_Ref'])">
                    <template #header>
                      <div class="popover">
                        <chat-bubble-bottom-center-icon class="order-icon" @click="openEditTask(item.id)" />
                      </div>
                    </template>
                    <template #content>
                      <div class="popover-content">
                        <EditTask :orderId="selectedOrderTask" @reloadPage="maintainFetchOrders()" />
                      </div>
                    </template>
                  </PopupWrapper>
                  <button v-if="roleChecker(['Sale_Admin'])" @click="deleteItem(item.id)" class="btn-delete-primary">
                    <trash-icon class="order-icon" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination :currentPage="filter.pageIndex" :totalPages="totalPages" @nextPage="nextPage" @prevPage="prevPage"
          @goToPage="goToPage" />
      </div>
    </div>
    <div class="order-container order-calendar-viewer" v-if="contentViewer == 'calendar'">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
  <Loading :loading="isLoading" />

</template>

<script>
import axios from "axios";
import {
  PencilSquareIcon,
  PhoneIcon,
  UserIcon,
  Bars2Icon,
  EnvelopeIcon,
  TrashIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/vue/24/solid";
import PopupWrapper from "@/components/PopupWrapper.vue";
import AddOrder from "@/views/admin/order/AddOrder.vue";
import EditOrder from "@/views/admin/order/EditOrder.vue";
import Pagination from "@/components/PaginationPage.vue";
import ImagePopup from "@/views/admin/order/ImagePopup.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { saveAs } from 'file-saver';
import Loading from '@/views/LoadingPage.vue';
import EditTask from "../task/EditTask.vue";
import Swal from 'sweetalert2';


import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid';


export default {
  name: "OrderPage",
  components: {
    PencilSquareIcon,
    PopupWrapper,
    Pagination,
    TrashIcon,
    PhoneIcon,
    Bars2Icon,
    UserIcon,
    EnvelopeIcon,
    AddOrder,
    EditOrder,
    ImagePopup,
    VueDatePicker,
    Loading,
    EditTask,
    ChatBubbleBottomCenterIcon,
    FullCalendar
  },
  data() {
    return {
      isLoading: false,
      airport: "",
      status: "",
      Is_ServiceTime: "",
      toDate: null,
      fromDate: null,
      currentPage: 1,
      pageSize: 3,
      totalItems: 0,
      items: [],
      users: [],
      services: [],
      statuses: [],
      selectedOrderId: 0,
      isPopupVisible: false,
      datePickerConfig: {
        format: "yyyy-MM-dd HH:mm",
        showSeconds: false,
      },
      roles: "",
      maintainAirports: [],
      maintainBookingStatus: [],
      filter: {
        airportId: 0,
        bookingStatusId: 0,
        fromDate: null,
        toDate: null,
        keyword: "",
        orderBy: "booking-time",
        createdBy: 0,
        employeeId: 0,
        pageIndex: 1,
        pageSize: 10
      },
      filterUser: {
        airportId: 0,
        role: "",
        keyword: "",
        pageIndex: 1,
        pageSize: 1000000
      },
      selectedOrderTask: 0,
      defaultUserId: 0,
      contentViewer: 'table',
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'timeGridWeek,timeGridDay,dayGridMonth'
        },
        dateClick: this.handleDateClick,
        events: [
          { title: 'event 1', date: '2019-04-01' },
          { title: 'event 2', date: '2019-04-02' }
        ]
      }
    };
  },
  mounted() {
    // this.fetchOrder();
    // this.fetchStatus();
    let airportId = localStorage.getItem('airportId');
    if (airportId) {
      this.filter.airportId = airportId;
    }
    //Chi role agency nhin thay data cua no
    let roles = localStorage.getItem('roles');
    this.roles = localStorage.getItem('roles');
    let userId = localStorage.getItem('user_id');
    if (roles == "Agency") {
      this.filter.createdBy = userId
      this.defaultUserId = userId
    }
    if (roles == "Operator") {
      this.filter.employeeId = userId
    }

    //Chi role Operator chi nhin thay cac tour ma no duoc phan quyen
    // //Set ngày tìm kiếm mặc định
    // const today = new Date();

    // // Thiết lập thời gian 00:00 cho fromDate
    // const fromDate = new Date(today.setHours(0, 0, 0, 0));

    // // Thiết lập thời gian 23:59 cho toDate
    // const toDate = new Date(today.setHours(23, 59, 59, 999));

    // this.filter.fromDate = fromDate;
    // this.filter.toDate = toDate;


    this.maintainGetAllAirport();
    this.maintainGetAllStatus();
    this.maintainFetchUser();
    //Kiem tra cac dieu kien va set tim kiem mac dinh
    this.maintainFetchOrders();

  },
  methods: {
    //#region maintain
    roleCheckerReverse(decinedRoles) {
      let checker = true;
      let role = localStorage.getItem('roles');
      decinedRoles.forEach((element) => {
        if (element == role) {
          checker = false;
        }
      })
      return checker;
    },
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
    handleDateClick(info) {
      const calendarApi = info.view.calendar;
      calendarApi.changeView('timeGridDay', info.dateStr);
    },
    //region maintaine
    maintainFetchUser() {
      axios.post(`${process.env.VUE_APP_API_URL}/MaintainUsers/FilterUsers`, this.filterUser).then((response) => {
        console.log(response.data);

        this.users = response.data.users;
        let roles = localStorage.getItem('roles');
        let userId = localStorage.getItem('user_id');
        if(roles == "Agency"){
          this.users = this.users.filter(r => r.parentId == userId)  
        }else{
          this.users = this.users.filter(r => r.role == "Admin" || r.role == "Sale_Admin" || r.role == "Agency")
        }
        
        this.totalPage = response.data.totalPage;

      })

    },
    async maintainChangeBookingStatus(orderId) {
      const confirmResult = await Swal.fire({
        title: 'Complete Booking',
        text: 'Do you want to complete this booking?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      });
      if (confirmResult.isConfirmed) {
        axios.get(`${process.env.VUE_APP_API_URL}/MaintainOrderDetails/GetById/${orderId}`).then((response) => {
          let _detail = response.data;
          if (_detail) {
            _detail.status_Operator_ID = 3;
            this.isLoading = true;
            const user_Id = localStorage.getItem("user_id");
            const apiUrl = process.env.VUE_APP_API_URL;
            _detail.updatedBy = user_Id;

            axios.post(`${apiUrl}/MaintainOrderDetails/Update`, _detail)
              .then(() => {
                this.maintainFetchOrders();
              })
              .catch(error => {
                console.error('Error updating Order:', error);
              })
              .finally(() => {
                this.isLoading = false;
              });
          }

        })
      }
      else {
        this.scheduleData.status_Operator_ID = 8;
      }
    },
    async maintainChangeBookingStatusUncomplete(orderId) {
      const confirmResult = await Swal.fire({
        title: 'Un Complete Booking',
        text: 'Do you want to uncomplete this booking?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      });
      if (confirmResult.isConfirmed) {
        axios.get(`${process.env.VUE_APP_API_URL}/MaintainOrderDetails/GetById/${orderId}`).then((response) => {
          let _detail = response.data;
          if (_detail) {
            _detail.status_Operator_ID = 4;
            this.isLoading = true;
            const user_Id = localStorage.getItem("user_id");
            const apiUrl = process.env.VUE_APP_API_URL;
            _detail.updatedBy = user_Id;

            axios.post(`${apiUrl}/MaintainOrderDetails/Update`, _detail)
              .then(() => {
                this.maintainFetchOrders();
              })
              .catch(error => {
                console.error('Error updating Order:', error);
              })
              .finally(() => {
                this.isLoading = false;
              });
          }

        })
      }
      else {
        this.scheduleData.status_Operator_ID = 8;
      }
    },
    openEditTask(id) {
      this.selectedOrderTask = id;
    },
    maintainFetchOrders() {
      axios.post(`${process.env.VUE_APP_API_URL}/MaintainOrderDetails/FilterOrder`, this.filter).then((response) => {
        console.log(response.data);

        this.items = response.data.orders;
        this.totalItems = response.data.totalCount;
        this.totalPages = Math.ceil(this.totalItems / this.filter.pageSize);

        //Xu ly cho calendar o day
        //Mac dinh suu dung service time
        //Mac dinh khoang cach startDate cong them 30p
        this.calendarOptions.events = [];
        this.items.forEach((v) => {
          const serviceDate = new Date(v.service_Time);
          const currentDate = new Date();

          const differenceInMilliseconds = serviceDate - currentDate;
          const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

          if (differenceInHours >= 12) {
            v.moreThan12Hour = true
          } else {
            v.moreThan12Hour = false
          }
          //cssColor
          let roles = localStorage.getItem('roles');
          if (roles != "Agency") {
            if (v.listEmployees.length <= 0) {
              v.cssColor = {

                backgroundColor: '#eceaea'

              }
            }
            else {
              v.cssColor = {
                backgroundColor: 'unset'
              }
            }
          }

        })

        // Booking chua duoc assign


      })
    },

    maintainGetAllStatus() {
      axios.get(`${process.env.VUE_APP_API_URL}/MaintainCommons/StatusBookingType`).then((response) => {
        this.maintainBookingStatus = response.data;
      })
    },

    maintainGetAllAirport() {
      axios.get(`${process.env.VUE_APP_API_URL}/MaintainCommons/GetAirports`).then((response) => {
        this.maintainAirports = response.data;
      })
    },

    async exportOrder() {
      try {
        const uri = process.env.VUE_APP_API_URL;
        const response = await axios.post(`${uri}/MaintainOrderDetails/ExportOrder`, this.filter, {
          responseType: 'blob' // This is important to handle the binary response
        });

        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Orders-${new Date().toISOString().slice(0, 19).replace(/:/g, '')}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error exporting order:', error);
      }
    },
    //#endregion

    async fetchOrder() {
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
          .post(`${apiUrl}/MaintainOrderDetails/DeleteOrderDetail/${item}`)
          .then(() => {
            this.maintainFetchOrders();
            alert('DELETE SUCCESSFUL!')
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
      this.maintainFetchOrders();
    },

    refreshOrders() {
      this.resetFilters();
      this.fetchOrder();
    },

    async handleExport() {
      try {
        const apiUrl = process.env.VUE_APP_API_URL;
        const requestData = {
          toDate: this.toDate,
          fromDate: this.fromDate,
        };


        const response = await axios.post(
          `${apiUrl}/order/export`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            responseType: 'arraybuffer',
          }
        );
        console.log(response.data);

        // Kiểm tra kiểu dữ liệu của dữ liệu nhận được
        if (response.data instanceof ArrayBuffer) {
          // Nếu dữ liệu nhận được là ArrayBuffer, xử lý tải xuống
          const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          // Tạo tên file
          const fileName = 'Orders.xlsx';

          // Sử dụng file-saver để tải xuống Blob dưới dạng file
          saveAs(blob, fileName);
        } else {
          console.error('Received data is not an ArrayBuffer');
          // Xử lý lỗi hoặc thông báo người dùng tùy theo trường hợp
        }
      } catch (error) {
        console.error("There was a problem with the export operation:", error);
      }
    },

    resetFilters() {
      this.status = 0;
      this.toDate = null;
      this.fromDate = null;
      this.airport = 0;
      this.Is_ServiceTime = false;
      this.searchTerm = "";
      this.currentPage = 1;
      this.pageSize = 6;
    },

    fetchStatus() {
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .get(`${apiUrl}/status/`)
        .then((response) => {
          this.statuses = response.data;
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
    openEditOrder(orderItem) {
      this.selectedOrderId = orderItem.id;
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
      this.filter.pageIndex = page;

      this.maintainFetchOrders();
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
      if (status) {
        if (status.includes('Pending')) {
          return { backgroundColor: "#ADD8E6", color: "black" }; // blue
        } else if (status.includes('Confirm')) {
          return { backgroundColor: "#90EE90", color: "black" }; // green
        } else if (status.includes('Complete') && !status.includes('Un')) {
          return { backgroundColor: "#FFFFE0", color: "black" }; // yellow
        } else if (status.includes('UnComplete')) {
          return { backgroundColor: "#D3D3D3", color: "black" }; // gray
        } else if (status.includes('Cancel')) {
          return { backgroundColor: "#FFC0CB", color: "black" }; // red
        }
      }
    }

  },
  watch: {
    filter: {
      handler(newVal) {
        console.log('Filter object changed:', newVal);
        // Thực hiện hành động khi đối tượng filter thay đổi
        this.maintainFetchOrders();
      },
      deep: true
    }
  },
  // watch: {
  //   // whenever question changes, this function will run
  //   filter(newVal, oldVal) {
  //     console.log(newVal, oldVal)
  //     this.maintainFetchOrders();
  //   }
  // },


};
</script>

<style scoped>
.order {
  gap: 30px;
  height: 100%;
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
  border-radius: 8px;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
}

#search:focus {
  outline: none;
  border: none;
  background: none;
}

#airport,
#status-filter {
  border-radius: 5px;
  padding: 10px;
  border: none;
  background: none;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
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

.btn-export-primary,
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
  padding: 0px 15px 0 15px;
  overflow-y: auto;
  border-radius: 10px;
  height: 100%;
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

.order-information {
  border-bottom: 1px solid black;
}
</style>
