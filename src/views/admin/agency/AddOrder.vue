<template>
  <form @submit.prevent="submitOrder" class="popup-content">
    <div class="form-right-col container">
      <div class="row mb-3">
        <div class="form-col-service col-md-12">
          <label for="service">Service*</label>
          <select v-model="formData.service_Id" id="service" class="form-select">
            <option v-for="(service, index) in services" :key="index" :value="service.id">
              {{ service.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-row-body row">
        <div class="form-col col-md-4">
          <div class="row mb-3">
            <label for="name">Name*</label>
            <input type="text" v-model="formData.name" required id="name" placeholder="Full name"
              class="form-control" />
            <span class="title-notification">* Autofill if providing the passport photo</span>
          </div>
          <div class="row mb-3">
            <label for="passport_number">Passport Number*</label>
            <input type="text" v-model="formData.passport_number" id="passport_number" required class="form-control" />
            <span class="title-notification">* Autofill if providing the passport photo</span>
          </div>
          <div class="row mb-3">
            <label for="nationality">Nationality*</label>
            <input type="text" v-model="formData.nationality" id="nationality" required class="form-control" />
            <span class="title-notification">* Autofill if providing the passport photo</span>
          </div>
        </div>
        <div class="form-col col-md-4">
          <div class="row mb-3">
            <label for="departure_time">Service Time*</label>
            <VueDatePicker v-model="formData.service_time" :config="datePickerConfig" :min-date="minDate" required
              class="form-control">
            </VueDatePicker>
            <span class="title-notification" style="visibility: hidden">*</span>
          </div>
          <div class="row mb-3">
            <label for="flight_number">Flight Number*</label>
            <input type="text" v-model="formData.flight_number" @input="checkFormCompletion" required
              class="form-control" />
            <span class="title-notification" style="visibility: hidden">*</span>
          </div>
          <div class="row mb-3">
            <label for="airport">Airport*</label>
            <select id="airport" v-model="formData.airport" required class="form-select">
              <option value="" disabled selected hidden>Select Airport</option>
              <option value="Noi Bai">Noi Bai International Airport, Ha Noi</option>
              <option value="Da Nang">Da Nang International Airport, Da Nang</option>
              <option value="Cam Ranh">Cam Ranh International Airport, Khanh Hoa</option>
              <option value="Tan Son Nhat">Tan Son Nhat International Airport, HCMC</option>
              <option value="Phu Quoc">Phu Quoc International Airport, Kien Giang</option>
            </select>
            <span class="title-notification" style="visibility: hidden">*</span>
          </div>
        </div>
        <div class="form-col col-md-4">
          <div class="row mb-3">
            <label for="email">Email*</label>
            <input type="email" v-model="formData.email" required class="form-control" />
            <span class="title-notification" style="visibility: hidden">*</span>
          </div>
          <div class="row mb-3">
            <label for="phone">Phone Number*</label>
            <input type="text" v-model="formData.phone" required class="form-control" />
            <span class="title-notification" style="visibility: hidden">*</span>
          </div>
          <div class="row mb-3">
            <label for="note">Note</label>
            <textarea v-model="formData.note" id="note" class="form-control"></textarea>
          </div>
          <span class="title-notification" style="visibility: hidden">*</span>
        </div>
      </div>
    </div>
    <div class="form-col container" id="form-file">
      <span>Upload Documents:</span>
      <div class="form-file-container row">
        <div class="file-input col-md-4">
          <label :for="`passport ${numberKey}`" class="file-upload-label">
            <div class="body-file">
              <i class="pi pi-plus-circle" style="font-size: 1rem; color: #334155"></i>
              <span class="title-header">Upload passport at here*</span>
            </div>
            <img v-if="passportFile" :src="imagePreview" alt="Uploaded Image" class="uploaded-image" />
          </label>
          <input :id="`passport ${numberKey}`" type="file" @change="handlePassportUpload" />
        </div>
        <div class="file-input col-md-4">
          <label :for="`visa ${numberKey}`" class="file-upload-label">
            <div class="body-file">
              <i class="pi pi-plus-circle" style="font-size: 1rem; color: #334155"></i>
              <span class="title-header">Upload visa at here</span>
            </div>
            <img v-if="uploadedVisa" :src="imageVisaPreview" alt="Uploaded Image" class="uploaded-image" />
          </label>
          <input :id="`visa ${numberKey}`" type="file" @change="handleVisaUpload" />
        </div>
        <div class="file-input col-md-4">
          <label :for="`portrait ${numberKey}`" class="file-upload-label">
            <div class="body-file">
              <i class="pi pi-plus-circle" style="font-size: 1rem; color: #334155"></i>
              <span class="title-header">Upload portrait at here</span>
            </div>
            <img v-if="uploadedPortrait" :src="imagePortraitPreview" alt="Uploaded Image" class="uploaded-image" />
          </label>
          <input :id="`portrait ${numberKey}`" type="file" @change="handlePortraitUpload" />
        </div>
      </div>
    </div>
    <div class="footer-form">
      <span class="title-footer">(*) Marks field are mandatory to fill up</span>
      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
    <Loading :loading="isLoading" />
  </form>

</template>
<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Loading from '@/views/LoadingPage.vue';

export default {
  name: "DepartureForm",
  props: ["numberKey"],
  components: {
    VueDatePicker, Loading
  },
  data() {
    return {
      formData: {
        name: "",
        email: "",
        phone: "",
        airport: "",
        nationality: "",
        note: "",
        passport_number: "",
        flight_number: null,
        service_time: null,
        passport_file: "",
        visa_file: "",
        service_Id: null,
        createBy: null,
      },
      portrait_file: "",
      isLoading: false,
      passportFiles: [],
      visaFiles: [],
      portraitFiles: [],
      passportFile: null,
      uploadedVisa: null,
      uploadedPortrait: null,
      imagePreview: null,
      imageVisaPreview: null,
      imagePortraitPreview: null,
      selectedServices: [],
      services: [],
      datePickerConfig: {
        format: "yyyy-MM-dd HH:mm",
        showSeconds: false,
      },
    };
  },
  setup() {
    const success = () => {
      toast("Add orderr successfully !", {
        autoClose: 300,
        type: "success",
      });
    };
    return { success };
  },
  computed: {
    minDate() {
      return new Date();
    }
  },
  mounted() {
    this.fetchServices();
  },
  watch: {
    selectedServices: {
      handler: function () {
        this.getServiceId();
      },
      deep: true,
    },
  },
  methods: {
    async convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          let base64String = reader.result;
          base64String = base64String.replace(
            /^data:image\/[a-z]+;base64,/,
            ""
          );
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
      });
    },
    async getServiceId() {
      this.formData.service_Id = this.selectedServices
        .map((service) => {
          const selectedService = this.services.find(
            (s) => s.name === service.name
          );
          return selectedService ? selectedService.id : null;
        })
        .filter((id) => id !== null)
        .join(",");
    },

    async handlePassportUpload(event) {
      this.passportFile = event.target.files[0];
      this.imagePreview = URL.createObjectURL(this.passportFile);
      this.uploadAndScanImage();
      const base64String = await this.convertFileToBase64(this.passportFile); // Convert image to base64
      this.passportFiles.push(base64String);
      this.formData.passport_file = this.passportFiles.join(",");
    },

    async handleVisaUpload(event) {
      this.uploadedVisa = event.target.files[0];
      this.imageVisaPreview = URL.createObjectURL(this.uploadedVisa);
      const base64String = await this.convertFileToBase64(this.uploadedVisa);
      this.visaFiles.push(base64String);
      this.formData.visa_file = this.visaFiles.join(",");
    },

    async handlePortraitUpload(event) {
      this.uploadedPortrait = event.target.files[0];
      this.imagePortraitPreview = URL.createObjectURL(this.uploadedPortrait);
      const base64String = await this.convertFileToBase64(
        this.uploadedPortrait
      );
      this.portraitFiles.push(base64String);
      this.formData.portrait_file = this.portraitFiles.join(",");
    },

    async uploadAndScanImage() {
      try {
        this.isLoading = true;

        const formData = new FormData();
        formData.append("image", this.passportFile);
        const response = await axios.post(
          "https://way2go.hndedu.com/process_image_passport",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const responseData = response.data.data[0];
        if (responseData) {
          this.formData.name = responseData.name;
          this.formData.nationality = responseData.nationality;
          this.formData.passport_number = responseData.passport_number;
        }
      } catch (error) {
        console.error("Error uploading and scanning image:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async submitOrder() {
      try {
        this.isLoading = true;

        const order = {
          name: this.formData.name,
          email: this.formData.email,
          phone: this.formData.phone,
          passport_Number: this.formData.passport_number,
          nationality: this.formData.nationality,
          flight_Number: this.formData.flight_number,
          operator_Note: "",
          airPort: this.formData.airport,
          service_ID: this.formData.service_Id.toString(),
          note: this.formData.note,
          passport_File: this.formData.passport_file,
          visa_File: this.formData.visa_file || null,
          createBy: localStorage.getItem("user_id"),
          service_Time: new Date(this.formData.service_time),
        };

        // Đóng gói dữ liệu gửi đi
        const dataToSend = {
          Is_group_order: 0,
          orders: [order],
        };

        // Gửi yêu cầu POST đến server
        const apiUrl = process.env.VUE_APP_API_URL;
        const response = await axios.post(`${apiUrl}/order/create`, dataToSend);

        // Log phản hồi từ backend
        console.log("Phản hồi từ backend:", response.data);

        if (response.status === 200) {
          this.success();
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });

          // Phát ra sự kiện click trên document
          document.dispatchEvent(clickEvent);
          this.$emit("reloadPage");
        } else {
          // Phản hồi không thành công từ backend
          console.error("Error submitting order: Invalid response from server");
        }
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error submitting order:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchServices() {
      const apiUrl = process.env.VUE_APP_API_URL;
      await axios
        .get(`${apiUrl}/service`)
        .then((response) => {
          this.services = response.data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
  },
};
</script>

<style scoped>
@font-face {
  font-family: "Avenir Next Ultra Light";
  src: url("@/assets/font/Avenir Next.ttc") format("truetype");
}

.popup-content {
  z-index: 9999;
  color: #334155;
  font-family: "Avenir Next Meidum", sans-serif;
  margin: 0 auto;
  margin-bottom: 20px;
  height: fit-content;
  box-sizing: border-box;
  background: #fff;
  justify-content: space-evenly;
  align-items: center;
  width: fit-content;
  position: absolute;
  /* top: 50%; */
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.form-col {
  width: 100%;
  display: flex;
  gap: 20px;
  flex-direction: column;
}

.form-col-service {
  width: 100%;
  display: flex;
  flex-direction: column;
}

#form-file {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}

/* upload file */
.body-file {
  gap: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.uploaded-image {
  width: 310px;
  height: 145px;
  position: absolute;
  top: 4px;
  border-radius: 7px;
  padding: 5px;
  left: 5px;
  max-height: 100%;
}

.title-header {
  margin-bottom: 10px;
  color: #334155;
}

.form-file-container {
  display: flex;
  gap: 3%;
}

.form-row-body {
  display: flex;
  gap: 30px;
}

::placeholder {
  color: #334155;
}

input[type="text"] {
  border: none;
  margin-top: 5px;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
  border-radius: 5px;
  padding: 10px;
}

input[type="email"] {
  border: none;
  margin-top: 5px;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
  border-radius: 5px;
  padding: 10px;
}

textarea {
  margin-top: 5px;
  border: none;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  height: 38px;
}

select {
  border: none;
  margin-top: 5px;
  color: #334155;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
  border-radius: 5px;
  padding: 10px;
}

.title-notification {
  font-size: 10px;
  font-style: italic;
}

.title-footer {
  font-size: 11px;
}

.row {
  margin: 5px 0px;
  display: flex;
  gap: 5px;
  flex-direction: column;
}

/* Icon */
.icon {
  width: 24px;
  height: 24px;
  color: #222;
  margin-left: 12px;
}

/* File */

.file-input {
  width: 100%;
  position: relative;
  display: inline-block;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
  overflow: hidden;
  border-radius: 7px;
  margin-bottom: 20px;
}

.file-upload-label {
  display: block;
  padding: 50px 20px;
  color: #334155;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.file-upload-label:hover {
  background-color: #d3ecf0;
}

input[type="file"] {
  position: absolute;
  left: -9999px;
}

#name ::placeholder {
  font-size: 8px;
}

.footer-form {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-submit-primary {
  color: #334155;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  background: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
