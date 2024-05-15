<template>
  <div class="service">
    <div class="service-body">
      <div class="service-header">
        <h3>Menu of services</h3>
        <PopupWrapper>
          <template #header>
            <span class="popover">Add new +</span>
          </template>
          <template #content>
            <div class="popover-content">
              <AddService @reloadPage="fetchService()" />
            </div>
          </template>
        </PopupWrapper>
      </div>
      <!-- <div class="space-line"></div> -->
      <!-- <div class="service-search">
        <div class="menu-search">
          <div class="search-filter">
            <i class="pi pi-filter" style="font-size: 1rem"></i>
            <span>Filter</span>
          </div>
          <div class="search-filter">
            <i class="pi pi-sort-alt" style="font-size: 1rem"></i>
            <span>Sort</span>
          </div>
        </div>
        <button class="btn-search-primary">
          <i class="pi pi-search" style="font-size: 1rem"></i>
        </button>
      </div> -->
    </div>
    <div class="service-container">
      <div class="list-Service">
        <table>
          <thead>
            <tr class="data-table-tilte">
              <th><bars-2-icon class="service-icon" /></th>
              <th>Name</th>
              <th>Created_at</th>
              <th>Updated_at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody class="service-info">
            <tr v-for="item in items" :key="item.id" class="Service-information">
              <td><input type="checkbox" /></td>
              <td>
                <div class="item" data-id="{{item.id}}">{{ item.name }}</div>
              </td>
              <td>
                <div class="item" data-id="{{item.id}}">
                  {{ formatDate(item.created_at) }}
                </div>
              </td>
              <td>
                <div class="item" data-id="{{item.id}}">
                  {{ formatDate(item.updated_at) }}
                </div>
              </td>
              <td>
                <data class="action-buttons">
                  <PopupWrapper>
                    <template #header>
                      <div class="popover">
                        <pencil-square-icon class="service-icon" @click="openEditService(item.id)" />
                      </div>
                    </template>
                    <template #content>
                      <div class="popover-content">
                        <EditService :serviceId="selectedServiceId" @reloadPage="fetchService()" />
                      </div>
                    </template>
                  </PopupWrapper>
                  <button @click="deleteItem(item.id)" class="btn-delete-primary">
                    <trash-icon class="service-icon" />
                  </button>
                </data>
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
import "primeicons/primeicons.css";
import {
  TrashIcon,
  PencilSquareIcon,
  Bars2Icon,
} from "@heroicons/vue/24/solid";
import PopupWrapper from "@/components/PopupWrapper.vue";
import AddService from "./AddService.vue";
import EditService from "./EditService.vue";
import Pagination from "@/components/PaginationPage.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "ServicePage",
  components: {
    PencilSquareIcon,
    PopupWrapper,
    Bars2Icon,
    TrashIcon,
    AddService,
    EditService,
    Pagination,
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 7,
      totalItems: 0,
      items: [],
      showModalStatus: false,
      selectedServiceId: "",
    };
  },
  setup() {
    const success = () => {
      toast("Add service successfully !", {
        autoClose: 300,
        type: "success",
      });
    };

    const remove = () => {
      toast("Delete service successfully !", {
        autoClose: 1000,
        type: "success",
      });
    };

    const updateServiceData = () => {
      this.fetchService();
    };

    return {
      success,
      remove,
      updateServiceData,
    };
  },

  mounted() {
    this.fetchService(1);
  },
  methods: {
    fetchService() {
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .get(`${apiUrl}/service`)
        // axios.get(`${apiUrl}/service?page=${this.currentPage}&pageSize=${this.pageSize}`)
        .then((response) => {
          this.items = response.data;
          console.log(this.items);
          this.totalItems = response.data.pagination.totalCount;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    deleteItem(item) {
      console.log("item", item);
      if (confirm("Are you sure to delete?")) {
        const apiUrl = process.env.VUE_APP_API_URL;
        axios
          .delete(`${apiUrl}/service/delete/${item}`)
          .then(() => {
            this.remove();
            this.fetchService();
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
      const day = ("0" + date.getDate()).slice(-2); // Ensure two-digit day with leading zero
      const month = ("0" + (date.getMonth() + 1)).slice(-2); // Ensure two-digit month with leading zero
      const year = date.getFullYear();

      return `${month}/${day}/${year}`;
    },
    openEditService(serviceId) {
      this.selectedServiceId = serviceId;
      console.log("dây là id: " + this.selectedServiceId);
    },

    nextPage() {
      if (this.currentPage < Math.ceil(this.totalItems / this.pageSize)) {
        this.currentPage++;
        this.fetchService();
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchService();
      }
    },
    goToPage(page) {
      this.currentPage = page;
      this.fetchService();
    },
  },
};
</script>

<style scoped>
.service-icon {
  width: 24px;
  height: 24px;
}

.service {
  gap: 30px;
  display: flex;
  flex-direction: column;
}

.service-body {
  padding: 0px 15px;
  display: flex;
  height: 140px;
  background: #fff;
  border-radius: 10px;
  border: 2px solid #e6eae9;
  flex-direction: column;
  justify-content: space-around;
}

.service-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.space-line {
  border: 1px solid #e6eae9;
}

.service-search {
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

/* service-container */
.service-container {
  padding: 15px;
  overflow-y: auto;
  border-radius: 10px;
  background: #fff;
}

.list-Service table {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%;
}

.list-Service th,
.list-Service td {
  padding: 10px;
  border-bottom: 2px solid #ddd;
}

.list-Service th {
  text-align: left;
}

.action-buttons {
  display: flex;
}

.btn-delete-primary {
  border: none;
  background: none;
}
</style>