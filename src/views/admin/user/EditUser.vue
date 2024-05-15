<template>
  <div class="popup-content">
    <h2>Edit service</h2>
    <form enctype="multipart/form-data" @submit.prevent="submitForm" id="edit-service-form">
      <div class="row">
        <label for="name">Name</label>
        <input type="text" v-model="formData.name" placeholder="Your name" />
      </div>
      <div class="row">
        <label for="email">Email</label>
        <input type="text" v-model="formData.email" placeholder="Your email" />
      </div>
      <div class="row">
        <label for="password">Password</label>
        <input type="text" v-model="formData.password" placeholder="Your password" />
      </div>
      <div class="row">
        <label for="role">Role:</label>
        <select v-model="formData.role_ID" id="service">
          <option v-for="(role, index) in roles" :key="index" :value="role.id">
            {{ role.name }}
          </option>
        </select>
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
    },
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
    this.fetchUser(this.userId);
    this.fetchRoles();
  },
  methods: {
    submitForm() {
      const apiUrl = process.env.VUE_APP_API_URL;
      axios
        .put(`${apiUrl}/user/update/${this.userId}`, this.formData)
        .then(() => {
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
        .catch((error) => {
          console.error("Error updating service:", error);
        });
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
  width: 350px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
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
