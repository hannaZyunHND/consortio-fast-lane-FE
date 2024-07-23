<template>
  <div class="popup-content" v-if="userItem">
    <h2>Edit service</h2>
    <form enctype="multipart/form-data" @submit.prevent="submitForm" id="edit-service-form">
      <div class="row">
        <label for="name">Name</label>
        <input type="text" v-model="userItem.name" placeholder="Your name" />
      </div>
      <div class="row">
        <label for="email">Email</label>
        <input type="text" v-model="userItem.email" placeholder="Your email" />
      </div>
      <div class="row">
        <label for="password">Password</label>
        <input type="text" v-model="userItem.password" placeholder="Your password" />
      </div>
      <div class="row">
        <label for="role">Role:</label>
        <select v-model="userItem.role" id="service">
          <option v-for="(role, index) in maintainRoles" :key="index" :value="role.Value">
            {{ $t(`role.` + role.Value) }}
          </option>
        </select>
      </div>
      <div class="row">
        <label for="role">Airport :</label>
        <select v-model="userItem.airportId" id="service">
          <option value="0">OFFICE</option>
          <option v-for="(role, index) in maintainAirports" :key="index" :value="role.id">
            {{ role.name }}
          </option>
        </select>
      </div>
      <div class="row">
        <label for="role">Parent:</label>
        <Select2 v-model="userItem.parentId" :options="users"
          :settings="{ width: '100%', multiple: false, placeholder: 'Select Employee', allowClear: true }" />
      </div>

      <button type="submit" class="btn-add-primary">Save</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "EditUser",
  props: {
    userId: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      formData: {
        name: "",
        email: "",
        password: "",
        role_ID: null,
      },
      roles: [],
      maintainAirports: [],
      maintainRoles: [],
      users: [],
      userItem: null,
      filter: {
        airportId: 0,
        role: "",
        keyword: "",
        pageIndex: 1,
        pageSize: 10000
      }
    };
  },
  setup() {
    const success = () => {
      toast("Update user successfully !", {
        autoClose: 300,
        type: "success",
      });
    };
    return { success };
  },
  mounted() {
    this.maintainGetAllAirport();
    this.maintainGetAllRole();
    this.maintainGetUserById();
    this.maintainGetAllUsers();
  },
  methods: {
    maintainGetUserById() {
      axios.get(`${process.env.VUE_APP_API_URL}/MaintainUsers/GetById/${this.userId}`).then((response) => {
        this.userItem = response.data;
      })

    },
    maintainGetAllUsers() {
      axios.post(`${process.env.VUE_APP_API_URL}/MaintainUsers/FilterUsers`, this.filter).then((response) => {
        console.log(response.data);
        this.users = response.data.users;
        this.users.forEach(e => {
          e.text = e.name
        })


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
    submitForm() {
      if(this.userItem.parentId){
        this.userItem.parentId = parseInt(this.userItem.parentId)
      }
      
      axios.post(`${process.env.VUE_APP_API_URL}/MaintainUsers/Update`, this.userItem).then((response) => {
        console.log(response)
        this.success();
        //-----------
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });

        // Phát ra sự kiện click trên document
        document.dispatchEvent(clickEvent);
        this.$emit("reloadPage");
      })
    },

    fetchUser(item) {
      console.log("heheh: " + item);
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .get(`${apiUrl}/user/${item}`)
        .then((response) => {
          const responseData = response.data;
          if (responseData) {
            this.formData.name = responseData.name;
            this.formData.email = responseData.email;
            this.formData.role_ID = responseData.role_ID;
          }
        })
        .catch((error) => {
          console.error("Error fetching service data:", error);
        });
    },

    async fetchRoles() {
      const apiUrl = process.env.VUE_APP_API_URL;
      try {
        const response = await axios.get(`${apiUrl}/roles`);
        if (response.data) {
          this.roles = response.data;
        } else {
          console.error("API response data is undefined");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },
};
</script>
<style scoped>
.popup-content {
  width: 50%;
  position: fixed;
  top: 50%;
  z-index: 999;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
@media (max-width:768px){
  .popup-content {
  width: 90% !important;
 
}
}
#edit-service-form {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  margin-bottom: 10px;
  flex-direction: column;
}

input[type="text"] {
  border: 1px solid #e6eae9;
  margin: 10px 0px;
  border-radius: 5px;
  padding: 10px;
}

select {
  border: 1px solid #e6eae9;
  margin: 10px 0px;
  border-radius: 5px;
  padding: 10px;
}

.btn-add-primary {
  background: black;
  border: none;
  color: white;
  font-size: 14px;
  border-radius: 5px;
  padding: 15px;
}
</style>
