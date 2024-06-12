<template>
  <div class="user">
    <div class="user-body">
      <div class="user-header">
        <h3>Team Member</h3>
        <PopupWrapper>
          <template #header>
            <span class="popover" @click="onAddNew()">Add new +</span>
          </template>
          <template #content>
            <div class="popover-content">
              <EditUser :userId="selectedUserId" @reloadPage="maintainFetchUser()" />
            </div>
          </template>
        </PopupWrapper>
      </div>
      <div class="space-line"></div>
      <div class="user-search">
        <div class="menu-search">
          <div class="search-filter">
            <select id="airport" v-model="filter.airportId">
              <option value="0">ALL Airport</option>
              <option v-for="a in maintainAirports" :value="a.id" :key="a.id">{{ a.name }}</option>
            </select>
          </div>
          <div class="search-filter">
            <select required v-model="filter.role">
              <option value="">ALL Roles</option>
              <option v-for="r in maintainRoles" :key="r.Key" :value="r.Value">{{ r.Value }}</option>
            </select>
          </div>
          <div>
            <input type="text" name="search" id="search" v-model="filter.keyword" placeholder="Search Keyword"
              @keyup.enter="search" />
          </div>
        </div>
        <button class="btn-search-primary">
          <i class="pi pi-search" style="font-size: 1rem" @click="maintainFetchUser()"></i>
        </button>
      </div>
    </div>
    <div class="user-container">
      <div class="list-user">
        <table>
          <thead>
            <tr class="data-table-tilte">
              <th><bars-2-icon class="user-icon" /></th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created_at</th>
              <th>Updated_at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody class="user-info">
            <tr v-for="item in users" :key="item.id" class="user-information">
              <td><input type="checkbox" /></td>
              <td>
                <div class="item" data-id="{{item.id}}">{{ item.name }}</div>
              </td>
              <td>
                <div class="item" data-id="{{item.id}}">{{ item.email }}</div>
              </td>
              <td>
                <div class="item" data-id="{{item.id}}">{{ $t(`role.`+item.role) }}</div>
              </td>
              <td>
                <div class="item" data-id="{{item.id}}">
                  {{ formatDate(item.created_at) }}
                </div>
              </td>
              <td>
                <div class="item" data-id="{{item.id}}">
                  {{ getUserAirport(item) }}
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <PopupWrapper>
                    <template #header>
                      <div class="popover">
                        <pencil-square-icon class="user-icon" @click="openEditUser(item.id)" />
                      </div>
                    </template>
                    <template #content>
                      <div class="popover-content">
                        <EditUser :userId="selectedUserId" @reloadPage="maintainFetchUser()" />
                      </div>
                    </template>
                  </PopupWrapper>
                  <button @click="maintainDeleteUser(item.id)" class="btn-delete-primary">
                    <trash-icon class="user-icon" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination :currentPage="filter.pageIndex" :totalPages="totalPage" @nextPage="nextPage" @prevPage="prevPage"
          @goToPage="goToPage" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  TrashIcon,
  PencilSquareIcon,
  Bars2Icon,
} from "@heroicons/vue/24/solid";
import PopupWrapper from "@/components/PopupWrapper.vue";
// import AddUser from "@/views/admin/user/AddUser.vue";
import EditUser from "@/views/admin/user/EditUser.vue";
import Pagination from "@/components/PaginationPage.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Swal from 'sweetalert2';

export default {
  name: "userPage",
  components: {
    PencilSquareIcon,
    PopupWrapper,
    Bars2Icon,
    TrashIcon,
    // AddUser,
    EditUser,
    Pagination,
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 6,
      totalPage: 0,
      users: [],
      showModalStatus: false,
      selectedUserId: "",
      selectedUser: null,
      maintainAirports: [],
      maintainRoles: [],
      newUser: null,
      filter: {
        airportId: 0,
        role: "",
        keyword: "",
        pageIndex: 1,
        pageSize: 10
      }

    };
  },
  setup() {
    const success = () => {
      toast("Delete user successfully !", {
        autoClose: 300,
        type: "success",
      });
    };
    return { success };
  },
  mounted() {
    this.maintainFetchUser();
    this.maintainGetAllAirport();
    this.maintainGetAllRole();
  },
  methods: {
    async maintainDeleteUser(id) {
      const confirmResult = await Swal.fire({
        title: 'Delete User',
        text: 'Do you want to delete this user?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      });
      if (confirmResult.isConfirmed) {
        axios.get(`${process.env.VUE_APP_API_URL}/MaintainUsers/Delete/${id}`).then(() => {
          this.success();
          this.maintainFetchUser();
        })
      }

    },
    onAddNew() {
      this.selectedUserId = 0;
    },
    //region maintaine
    maintainFetchUser() {
      axios.post(`${process.env.VUE_APP_API_URL}/MaintainUsers/FilterUsers`, this.filter).then((response) => {
        console.log(response.data);
        this.users = response.data.users;
        this.totalPage = response.data.totalPage;

      })

    },

    maintainGetAllAirport() {
      axios.get(`${process.env.VUE_APP_API_URL}/MaintainCommons/GetAirports`).then((response) => {
        this.maintainAirports = response.data;
        console.log(response.data)
      })
    },

    maintainGetAllRole() {
      axios.get(`${process.env.VUE_APP_API_URL}/MaintainCommons/RoleType`).then((response) => {
        this.maintainRoles = response.data;
        console.log(response.data)
      })
    },

    getUserAirport(user) {
      if (user.airportId == 0) {
        return "OFFICE";
      } else {
        var ap = ""
        this.maintainAirports.forEach((element) => {
          if (element.id == user.airportId) {
            ap = element.name
          }
        })
        return ap
      }
    },

    //endregion

    fetchUser() {
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .get(
          `${apiUrl}/user/index?pageNumber=${this.currentPage}&pageSize=${this.pageSize}`
        )
        .then((response) => {
          this.items = response.data.users;
          console.log(this.items);
          this.totalItems = response.data.totalCount;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    deleteItem(item) {
      const apiUrl = process.env.VUE_APP_API_URL;
      if (confirm("Are you sure to delete?")) {
        axios
          .delete(`${apiUrl}/user/delete/${item}`)
          .then(() => {
            this.success();
            this.fetchUser();
          })
          .catch((error) => {
            console.error(
              "There was a problem with the delete operation:",
              error
            );
          });
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();

      return `${month}/${day}/${year}`;
    },
    formatDay(dateTimeString) {
      const date = new Date(dateTimeString);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const formattedDay = `${day}-${month}-${year}`;
      return formattedDay;
    },
    formatHour(dateTimeString) {
      const date = new Date(dateTimeString);
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      return formattedTime;
    },

    openEditUser(id) {
      this.selectedUserId = id;

    },

    nextPage() {
      this.filter.pageIndex++;
      this.maintainFetchUser();
    },
    prevPage() {
      this.filter.pageIndex--
      this.maintainFetchUser();
    },
    goToPage(page) {
      this.filter.pageIndex = page;
      this.maintainFetchUser();
    },
  },
};
</script>

<style scoped>
.user-icon {
  width: 24px;
  height: 24px;
}

.user {
  gap: 30px;
  display: flex;
  flex-direction: column;
}

.user-body {
  border: 2px solid #e6eae9;
  padding: 0px 15px;
  display: flex;
  height: 140px;
  background: #fff;
  border-radius: 10px;
  flex-direction: column;
  justify-content: space-around;
}

.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.space-line {
  border: 1px solid #e6eae9;
}

select {
  border: 1px solid #e6eae9;
  margin: 10px 0px;
  border-radius: 5px;
  padding: 10px;
}

.user-search {
  display: flex;
  justify-content: space-between;
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

.btn-search-primary {
  border: none;
  background: none;
}

/* user-container */
.user-container {
  padding: 15px;
  border-radius: 10px;
  background: #fff;
}

.list-user table {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%;
}

.list-user th,
.list-user td {
  padding: 10px;
  border-bottom: 2px solid #ddd;
}

.list-user th {
  background-color: #f2f2f2;
  text-align: left;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
}

.btn-delete-primary {
  border: none;
  background: none;
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
</style>
