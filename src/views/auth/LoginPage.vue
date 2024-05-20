<template>
  <div class="login">
    <div class="login-form">
      <div class="title-login">Welcome to Fast Lane</div>
      <span class="title-description">Sign in to your account below</span>
      <form @submit.prevent="login" enctype="multipart/form-data">
        <div class="form-row">
          <label for="email" style="text-align: left;font-size: 16px;">Email</label>
          <input type="email" v-model="formData.email" id="email" placeholder="Email" />
        </div>
        <div class="form-row">
          <label for="password" style="text-align: left; font-size: 16px">Password</label>
          <input type="password" v-model="formData.password" id="password" placeholder="Password" />
        </div>
        <button type="submit" class="btn-login-primary">Login</button>
      </form>
      <span class="title-direction">
        Don't you have an account?
        <router-link to="/register">Register Now</router-link>
      </span>
    </div>
    <div class="login-image"></div>
  </div>
</template>

<script>
import axios from "axios";
import "@/styles/auth/login.css";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import router from "@/router";
import { jwtDecode } from "jwt-decode";

export default {
  name: "LoginPage",
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
    };
  },
  setup() {
    const success = () => {
      toast("login account successfully !", {
        autoClose: 3000,
        type: "success",
      });
    };

    const error = () => {
      toast("Login account unsuccessfully !", {
        autoClose: 3000,
        type: "error",
      });
    };

    return { success, error };
  },

  methods: {
    async login() {
      try {
        const apiUrl = process.env.VUE_APP_API_URL;
        const response = await axios.post(`${apiUrl}/auth/login`, this.formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data.token) {
          const token = response.data.token;
          localStorage.setItem("token", token);
          localStorage.setItem("isLoggedIn", "true");
          this.success();

          // Giải mã token để trích xuất thông tin từ payload
          const decodedToken = jwtDecode(token);

          // Truy xuất thông tin về vai trò từ payload
          const roles =
            decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];

          localStorage.setItem("roles", roles);
          // Truy xuất thông tin về user từ payload
          const userId = decodedToken["UserId"];
          const userName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

          localStorage.setItem("user_name", userName)
          localStorage.setItem("user_id", userId);

          // Redirect người dùng đến trang tương ứng với vai trò của họ
          if (roles == "Admin") {
            router.push("/agency/dashboard");
          } else if (roles == "Sales") {
            router.push("/dashboard/order");
          } else if (roles == "Management") {
            router.push("/agency/dashboard");
          } else if (roles == "Sales Admin") {
            router.push("/agency/dashboard");
          } else if (roles == "Employee") {
            router.push("/dashboard/schedule");
          } else if (roles == "Agency") {
            router.push("/agency/dashboard");
          }
          else {
            router.push("/dashboard/Task");
          }
          console.log("Response from backend:", token);
        } else {
          console.error("No token found in response:", response.data);
        }
      } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
          router.push("/login");
          this.error();
        } else {
          this.error();
        }
      }

    },
  }
};
</script>

<style scoped>
body {
  background: rgb(255, 255, 255);
  padding: 100px 40px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login {
  box-shadow: -2px 1px 12px 4px rgba(0, 0, 0, 0.2);
  margin: 0 auto;
  margin-top: 10%;
  border-radius: 10px;
  background: white;
  display: flex;
  width: 800px;
  max-width: 1000px;
}

.login-image {
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  flex: 1;
  background-image: url("~@/assets/logo1.jpeg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

.login-form {
  flex: 1;
  padding: 20px;
}

.title-login {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  justify-content: center;
}

.title-description {
  font-size: 18px;
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  justify-content: center;
}

.title-direction {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 15px;
}

a {
  text-decoration: none;
  color: #321fdb;
}

.form-row {
  padding: 10px 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

input[type="email"],
input[type="password"] {
  margin-top: 5px;
  width: 100%;
  border: 2px solid #dfe4e9;
  padding: 10px;
  border-radius: 5px;
}

.btn-login-primary {
  background: #321fdb;
  border: none;
  color: white;
  font-size: 14px;
  border-radius: 5px;
  padding: 15px;
  margin-top: 10px;
  width: 100%;
  /* Đảm bảo nút login có kích thước 100% chiều rộng */
}

.btn-login-primary {
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  background: #3d66f6;
}
</style>
