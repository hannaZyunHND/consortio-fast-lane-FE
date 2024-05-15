<template>
  <div class="role">
    <div class="role-body">
      <div class="role-header">
        <h3>Menu roles</h3>
        <PopupWrapper>
          <template #header>
            <span class="popover">Add new +</span>
          </template>
          <template #content>
            <div class="popover-content">
              <AddRole @reloadPage="fetchRole()" />
            </div>
          </template>
        </PopupWrapper>
      </div>
    </div>
    <div class="role-container">
      <div class="list-role">
        <table>
          <thead>
            <tr class="data-table-tilte">
              <th><bars-2-icon class="role-icon" /></th>
              <th>Name</th>
              <th>Created_at</th>
              <th>Updated_at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody class="role-info">
            <tr v-for="item in items" :key="item.id" class="role-information">
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
                        <pencil-square-icon class="role-icon" @click="openEditRole(item.id)" />
                      </div>
                    </template>
                    <template #content>
                      <div class="popover-content">
                        <EditRole :roleId="selectedRoleId" @reloadPage="fetchRole()" />
                      </div>
                    </template>
                  </PopupWrapper>
                  <button @click="deleteItem(item.id)" class="btn-delete-primary">
                    <trash-icon class="role-icon" />
                  </button>
                </data>
              </td>
            </tr>
          </tbody>
        </table>
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
import AddRole from "@/views/admin/role/AddRole.vue";
import EditRole from "@/views/admin/role/EditRole.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "rolePage",
  components: {
    PencilSquareIcon,
    PopupWrapper,
    Bars2Icon,
    TrashIcon,
    AddRole,
    EditRole,
  },
  data() {
    return {
      items: [],
      showModalStatus: false,
      selectedRoleId: "",
    };
  },
  setup() {
    const success = () => {
      toast("Add role successfully !", {
        autoClose: 1000,
        type: "success",
      });
    };

    const remove = () => {
      toast("Delete role successfully !", {
        autoClose: 1000,
        type: "success",
      });
    };

    const updateRoleData = () => {
      this.fetchRole();
    };

    return {
      success,
      remove,
      updateRoleData,
    };
  },

  mounted() {
    this.fetchRole(1);
  },
  methods: {
    fetchRole() {
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .get(`${apiUrl}/roles`)
        .then((response) => {
          this.items = response.data;
          console.log(this.items);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    deleteItem(item) {
      const apiUrl = process.env.VUE_APP_API_URL;
      if (confirm("Are you sure to delete?")) {
        axios
          .delete(`${apiUrl}/roles/delete/${item}`)
          .then(() => {
            this.remove();
            this.$emit("deleted");
            this.fetchRole();
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
    openEditRole(roleId) {
      this.selectedRoleId = roleId;
    },

    nextPage() {
      if (this.currentPage < Math.ceil(this.totalItems / this.pageSize)) {
        this.currentPage++;
        this.fetchRole();
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchRole();
      }
    },
    goToPage(page) {
      this.currentPage = page;
      this.fetchRole();
    },
  },
};
</script>

<style scoped>
.role-icon {
  width: 24px;
  height: 24px;
}

.role {
  gap: 30px;
  display: flex;
  flex-direction: column;
}

.role-body {
  padding: 0px 15px;
  display: flex;
  background: #fff;
  border-radius: 10px;
  border: 2px solid #e6eae9;
  flex-direction: column;
  justify-content: space-around;
}

.role-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.space-line {
  border: 1px solid #e6eae9;
}

.role-search {
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

/* role-container */
.role-container {
  padding: 15px;
  overflow-y: auto;
  border-radius: 10px;
  background: #fff;
}

.list-role table {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%;
}

.list-role th,
.list-role td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.list-role th {
  background-color: #f2f2f2;
  text-align: left;
}

.action-buttons {
  display: flex;
  justify-content: center;
}

.btn-delete-primary {
  border: none;
  background: none;
}
</style>
