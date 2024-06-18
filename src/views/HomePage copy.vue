<template>
  <div class="home-container">
    <Header />
    <div class="title-info">
      <div class="home-content">
        <h2 class="home-slogan">"A different experience at the airport"</h2>
        <div class="home-input-number">
          <label>Enter number of guest</label>
          <input type="number" v-model="orderData.guest_number" id="guest_number" @input="validateGuestNumber"
            required />
        </div>
        <div v-if="orderData.guest_number >= 2" style="display: flex; margin-left: 15px; margin-top:7px">
          <input type="checkbox" v-mode="orderData.is_Group" id="is_Group" @change="checkGroupAndDataGroup"
            style="border: 0" />
          <label for="is_Group">Group</label>
        </div>
      </div>
    </div>

    <!-- form -->
    <form @submit.prevent="submitOrder">
      <div v-if="orderData.guest_number > 0">
        <div>
          <Form ref="departureForm" v-for="(i, index) in orderData.guest_number" :key="index" :guestNumber="index"
            :numberKey="i" :formData="orderData[i]" @formDataUpdated="handleFormDataUpdate" />
        </div>
      </div>
      <button v-if="orderData.guest_number >= 1" type="submit" class="btn-submit-primary">
        Submit
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";
import Form from "@/components/form/DepartureForm.vue";
import Header from "@/components/partials/HeaderPartial.vue";
import Swal from 'sweetalert2';

export default {
  components: {
    Form,
    Header,
  },
  data() {
    return {
      selectedFile: null,
      orderData: {
        guest_number: null,
      },
      is_Group: false,
      departureFormData: [],
    };
  },
  methods: {
    async reload() {
      window.location.reload();
    },
    async submitOrder() {
      try {
        this.$refs.departureForm.forEach((form) => {
          form.sendDataToParent();
        });

        const ordersToSend = [];
        this.departureFormData.forEach((formData) => {
          ordersToSend.push(this.createOrderObject(formData));
        });

        const dataToSend = {
          is_group_order: this.orderData.is_Group ? 1 : 0,
          orders: ordersToSend,
        };

        this.orderDataForm = ordersToSend;
        const apiUrl = process.env.VUE_APP_API_URL;
        const response = await axios.post(`${apiUrl}/order/create`, dataToSend);
        // this.success();
        // this.reload();
        console.log("Phản hồi từ backend:", response.data);
      } catch (error) {
        console.error("Error submitting order:", error);
      }
    },

    createOrderObject(formData) {
      return {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        airport: formData.airport,
        service_ID: formData.service_Id.toString(),
        nationality: formData.nationality,
        note: formData.note,
        passport_Number: formData.passport_number,
        flight_Number: formData.flight_number,
        service_Time: formData.service_time,
        passport_File: formData.passport_file,
        visa_File: formData.visa_file ?? null,
        createBy: formData.createBy ?? null,
      };
    },

    async handleFormDataUpdate(formData) {
      this.departureFormData.push(formData);
    },

    success() {
      toast("Add order successfully !", {
        autoClose: 400,
        type: "success",
      });
      this.resetForm();
    },

    resetForm() {
      this.orderData.guest_number = null;
      this.is_Group = false;
      this.departureFormData = [];
    },

    // Method checkGroupAndDataGroup
    checkGroupAndDataGroup() {
      this.orderData.is_Group = !this.orderData.is_Group;
      console.log(this.orderData.is_Group);
      if (this.orderData.is_Group) {
        this.populateForms();
      }
    },

    populateForms() {
      const firstForm = this.$refs.departureForm[0];
      console.log("day lag first form", firstForm);
      const formData = firstForm.formData;
      console.log("check populate");

      for (let i = 0; i < this.$refs.departureForm.length; i++) {
        this.$refs.departureForm[i].formData.flight_number =
          formData.flight_number;
        console.log("khó", this.$refs.departureForm[i].formData.flight_number);
        this.$refs.departureForm[i].formData.airport = formData.airport;
        this.$refs.departureForm[i].formData.service_Id = formData.service_Id;
        this.$refs.departureForm[i].formData.service_time =
          formData.service_time;
      }
    },

    validateGuestNumber() {
      if (this.orderData.guest_number <= 0 || isNaN(this.orderData.guest_number)) {
        this.orderData.guest_number = 0;
      }
    }
  },
};
</script>

<style scoped>
#main-body {
  margin-top: 20%;
  max-width: 1200px;
  margin: 160px auto;
  gap: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-image {
  width: 100%;
  height: 350px;
}

.title-info {
  background-image: url("@/assets/home.jpg");
  height: 100vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-repeat: no-repeat;
}

.home-content {
  color: #fff;
  /* width: 650px; */
  /* margin-left: 21%; */
}

.home-input-number {
  gap: 6px;
  display: flex;
  margin-left: 15px;
  flex-direction: column;
}

.row-content {
  display: flex;
  gap: 10px;
  flex-direction: column;
}

#guest_number {
  border-radius: 7px;
  display: flex;
  border: none;
  padding: 10px;
  width: 168px;
}

#guest_number :focus {
  outline: none;
  border: none;
}

h2 {
  font-size: 35px;
}

.btn-submit-primary {
  right: 10px;
  top: 92%;
  position: fixed;
  padding: 17px 90px;
  color: black;
  border: none;
  font-size: 17px;
  border-radius: 7px;
  background: #d3ecf0;
}
@media (max-width:768px){
  .btn-submit-primary{
    right: 0px;
    top: 95%;
    position: fixed;
    padding: 11px 42px !important;
    color: black;
    border: none;
    font-size: 12px !important;
    border-radius: 7px;
    background: #d3ecf0;
  }
}
</style>
