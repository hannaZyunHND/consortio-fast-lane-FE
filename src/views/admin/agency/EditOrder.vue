<template>
<div class="popup-content container">
  <span class="title-header">Update Booking</span>
  <form enctype="multipart/form-data" @submit.prevent="submitOrder" id="edit-order-form">
    <div class="form-col" id="form-file">
      <div class="file-input mb-3">
        <label :for="`passport ${numberKey}`" class="file-upload-label">
          <div class="body-file">
            <i class="pi pi-plus-circle" style="font-size: 1rem; color: #000066"></i>
            <span class="title-header">Upload passport at here*</span>
          </div>
          <img :src="orderData.passport_Image" alt="Uploaded Image" class="uploaded-image" />
        </label>
        <input :id="`passport ${numberKey}`" type="file" @change="handlePassportUpload" />
      </div>
      <div class="file-input mb-3">
        <label :for="`visa ${numberKey}`" class="file-upload-label">
          <div class="body-file">
            <i class="pi pi-plus-circle" style="font-size: 1rem; color: #000066"></i>
            <span class="title-header">Upload visa at here</span>
          </div>
          <img :src="orderData.visa_Image" alt="Uploaded Image" class="uploaded-image" />
        </label>
        <input :id="`visa ${numberKey}`" type="file" @change="handleVisaUpload" />
      </div>
      <div class="file-input mb-3">
        <label :for="`portrait ${numberKey}`" class="file-upload-label">
          <div class="body-file">
            <i class="pi pi-plus-circle" style="font-size: 1rem; color: #000066"></i>
            <span class="title-header">Upload portrait at here</span>
          </div>
          <img :src="orderData.portrait_Image" alt="Uploaded Image" class="uploaded-image" />
        </label>
        <input :id="`portrait ${numberKey}`" type="file" @change="handlePortraitUpload($event)" />
      </div>
    </div>
    <div class="form-info row">
      <div class="form-col col-md-4">
        <div class="row mb-3">
          <label for="name">Name</label>
          <input type="text" v-model="orderData.name" required placeholder="Your name" class="form-control">
        </div>
        <div class="row mb-3">
          <label for="email">Email</label>
          <input type="email" v-model="orderData.email" placeholder="you@gmail.com" required class="form-control">
        </div>
        <div class="row mb-3">
          <label for="phone">Phone Number</label>
          <input type="text" v-model="orderData.phone" placeholder="phone" required class="form-control">
        </div>
        <div class="row mb-3">
          <label for="passport_number">Passport Number</label>
          <input type="text" v-model="orderData.passport_Number" required placeholder="your passport" class="form-control">
        </div>
      </div>
      <div class="form-col col-md-4">
        <div class="row mb-3">
          <label for="nationality">Nationality</label>
          <input type="text" v-model="orderData.nationality" placeholder="nationality" required class="form-control">
        </div>
        <div class="row mb-3">
          <label for="flight_number">Flight Number</label>
          <input type="text" v-model="orderData.flight_Number" required class="form-control">
        </div>
        <div class="row mb-3">
          <label for="airPort">Airport</label>
          <select id="airPort" v-model="orderData.airPort" required class="form-select">
            <option value="" disabled selected hidden>Select Airport</option>
            <option value="Noi Bai">Noi Bai International Airport, Ha Noi</option>
            <option value="Da Nang">Da Nang International Airport, Da Nang</option>
            <option value="Cam Ranh">Cam Ranh International Airport, Khanh Hoa</option>
            <option value="Tan Son Nhat">Tan Son Nhat International Airport, HCMC</option>
            <option value="Phu Quoc">Phu Quoc International Airport, Kien Giang</option>
          </select>
        </div>
        <div class="row mb-3">
          <label for="departure_time">Order Time</label>
          <input type="text" v-model="orderData.service_Time" required class="form-control">
        </div>
      </div>
      <div class="form-col col-md-4">
        <div class="row mb-3">
          <label>Service</label>
          <select v-model="orderData.service_ID" id="service" class="form-select">
            <option value="" disabled selected hidden>Select Service</option>
            <option v-for="(service, index) in services" :key="index" :value="service.id">{{ service.name }}</option>
          </select>
        </div>
        <div class="row mb-3">
          <label for="note">Note</label>
          <textarea v-model="orderData.note" class="form-control"></textarea>
        </div>
      </div>
    </div>
    <button type="submit" class="btn btn-primary"><i class="pi pi-span pi-slack" style="color: white"></i> Save</button>
  </form>
  <Loading :loading="isLoading" />
</div>

</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import Loading from '@/views/LoadingPage.vue';

export default {
  name: 'EditOrder',
  components: {
    Loading
  },
  props: {
    orderId: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      orderData: {
        name: '',
        email: '',
        phone: '',
        airPort: '',
        service_ID: '',
        status_ID: '',
        nationality: '',
        employee_Id: null,
        status_Sales_Id: '',
        status_Operator_ID: '',
        note: '',
        passport_Number: '',
        flight_Number: '',
        service_Time: '',
        passport_File: '',
        portrait_File: '',
        visa_File: null,
        operator_Note: null,
      },
      selectedStatus_Operator: [],
      passportFiles: [],
      visaFiles: [],
      portraitFiles: [],

      passportFile: null,
      uploadedVisa: null,
      uploadedPortrait: null,

      passport_File: null,
      visa_File: null,
      portrait_File: null,

      selectedServices: [],
      selectedStatus: [],
      services: [],
      statuses: [],
      isLoading: false,
    };
  },
  setup() {
    const success = () => {
      toast("Update order successfully !", {
        autoClose: 3000,
        type: "success"
      });
    }
    return { success };
  },
  mounted() {
    this.fetchOrder(this.orderId);
    this.fetchService();
    this.fetchStatus();
  },

  methods: {
    async convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          let base64String = reader.result;
          base64String = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
          resolve(base64String);
        };
        reader.onerror = error => reject(error);
      });
    },

    trimFilePath(filePath) {
      const baseUrl = process.env.VUE_APP_API_URL;
      if (filePath && filePath.startsWith(baseUrl)) {
        return filePath.slice(baseUrl.length);
      }

      // Nếu không, trả về nguyên gốc
      return filePath;
    },

    submitOrder() {
      this.isLoading = true;

      const user_Id = localStorage.getItem("user_id");
      const apiUrl = process.env.VUE_APP_API_URL;

      this.orderData.passport_File = this.trimFilePath(this.orderData.passport_File);
      this.orderData.visa_File = this.trimFilePath(this.orderData.visa_File);
      this.orderData.portrait_File = this.trimFilePath(this.orderData.portrait_File);

      this.orderData.service_ID = this.orderData.service_ID.toString();
      this.orderData.updatedBy = user_Id;

      axios.post(`${apiUrl}/order/update/${this.orderId}`, this.orderData)
        .then(() => {
          this.success();
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          // Phát ra sự kiện click trên document
          document.dispatchEvent(clickEvent);
          this.$emit("reloadPage");
        })
        .catch(error => {
          console.error('Error updating Order:', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    fetchOrder(item) {
      const apiUrl = process.env.VUE_APP_API_URL;
      axios.get(`${apiUrl}/order/${item}`)
        .then(response => {
          const responseData = response.data;
          console.log(response.data);
          if (responseData) {
            this.orderData.name = responseData.name;
            this.orderData.phone = responseData.phone;
            this.orderData.email = responseData.email;
            this.orderData.passport_Number = responseData.passport_Number;
            this.orderData.nationality = responseData.nationality;
            this.orderData.airPort = responseData.airPort;
            this.orderData.flight_Number = responseData.flight_Number;
            this.orderData.guest_Number = responseData.guest_Number;
            this.orderData.service_ID = responseData.service;
            this.orderData.status_ID = responseData.status;
            this.orderData.operator_Note = responseData.operator_note;
            this.orderData.service_Time = responseData.service_Time;
            this.orderData.note = responseData.note;
            this.orderData.groupReference = responseData.groupReference;
            this.orderData.status_Sales_Id = responseData.status_Sales;

            if (responseData.passport_File) {
              this.orderData.passport_Image = `${apiUrl}/${responseData.passport_File}`; //Assign url to 'passport_Image' display image when call api
              this.orderData.passport_File = responseData.passport_File; //Assign url to passport_File in case without upload image (cuz data included passportport_File)
            }

            if (responseData.visa_File) {
              this.orderData.visa_Image = `${apiUrl}/${responseData.visa_File}`;
              this.orderData.visa_File = responseData.visa_File;
            }

            if (responseData.portrait_File) {
              this.orderData.portrait_Image = `${apiUrl}/${responseData.portrait_File}`;
              this.orderData.passport_File = responseData.portrait_File;
            }
            if (responseData.status_Opeartor) {
              this.orderData.status_Operator_ID = responseData.status_Opeartor;
            }
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    },

    async handlePassportUpload(event) {
      this.passportFile = event.target.files[0];
      this.orderData.passport_Image = URL.createObjectURL(this.passportFile);

      //Scan passport to get all data from this
      this.uploadAndScanImage();

      //Assign image's base64 to passport_File
      const base64String = await this.convertFileToBase64(this.passportFile);
      if (base64String) {
        this.orderData.passport_File = base64String;
      }
    },

    async handleVisaUpload(event) {
      this.uploadedVisa = event.target.files[0];
      this.orderData.visa_Image = URL.createObjectURL(this.uploadedVisa);

      //convert image to base64
      const base64String = await this.convertFileToBase64(this.uploadedVisa);
      if (base64String) {
        this.orderData.visa_File = base64String;
      }
    },

    async handlePortraitUpload(event) {
      const uploadedPortrait = event.target.files[0];
      this.orderData.portrait_Image = await URL.createObjectURL(uploadedPortrait);

      //assign value to portrait_File in order to send to server
      const base64String = await this.convertFileToBase64(uploadedPortrait);
      if (base64String) {
        this.orderData.portrait_File = base64String;
      }
    },

    async uploadAndScanImage() {
      try {
        const formData = new FormData();
        formData.append('image', this.passportFile);
        const response = await axios.post('https://way2go.hndedu.com/process_image_passport', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const responseData = response.data.data[0];
        if (responseData) {
          this.orderData.name = responseData.name;
          this.orderData.nationality = responseData.nationality;
          this.orderData.passport_number = responseData.passport_number;
        }
      } catch (error) {
        console.error('Error uploading and scanning image:', error);
      }
    },

    async fetchService() {
      const apiUrl = process.env.VUE_APP_API_URL;
      try {
        const response = await axios.get(`${apiUrl}/service`);
        this.services = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    async fetchStatus() {
      const apiUrl = process.env.VUE_APP_API_URL;
      try {
        const response = await axios.get(`${apiUrl}/status/role/1`);
        this.statuses = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  }
}
</script>
<style scoped>
.popup-content {
  z-index: 9999;
  width: fit-content;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.title-header {
  text-transform: uppercase;
  font-weight: 700;
  margin: 20px 0px;
}

#edit-order-form {
  display: flex;
  gap: 15px;
  flex-direction: column;
}

.space-line {
  border: 1px solid #e6eae9;
}

#form-file {
  display: flex;
  gap: 30px;
}

.form-info {
  gap: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-body {
  padding: 0px 15px;
  display: flex;
  height: 140px;
  background: #fff;
  border-radius: 10px;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  justify-content: space-around;
}

.form-col {
  width: 100%;
}

.row {
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.file-input {
  position: relative;
  display: inline-block;
  overflow: hidden;
  margin-bottom: 10px;
}

.file-upload-label {
  border: 2px dashed #dfe4e9;
  display: block;
  padding: 50px;
  color: black;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.file-upload-label:hover {
  background-color: #D3ECF0;
}

input[type="file"] {
  position: absolute;
  left: -9999px;
}

input[type="text"],
input[type="email"] {
  border: 1px solid #e6eae9;
  margin-top: 5px;
  border-radius: 5px;
  padding: 10px;
}

select {
  border: 1px solid #e6eae9;
  margin-top: 5px;
  border-radius: 5px;
  padding: 9px;
}

textarea {
  border: 1px solid #e6eae9;
  margin-top: 5px;
  border-radius: 5px;
}

.order-icon {
  width: 24px;
  height: 24px;
  color: #222;
  margin-left: 12px;
}

.btn-update-primary {
  display: flex;
  margin: 0 auto;
  width: fit-content;
  background: black;
  gap: 10px;
  border: none;
  color: white;
  font-size: 14px;
  border-radius: 5px;
  padding: 10px 30px;
  align-items: center;
}

.body-file {
  gap: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.uploaded-image {
  width: 95%;
  height: 95%;
  position: absolute;
  top: 50%;
  border-radius: 10px;
  padding: 5px;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  max-height: 100%;
}
</style>
