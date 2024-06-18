  <template>
    <div class="home-container">
      <Header @language-change="updateLanguage" />
      <div class=" title-info">
        <div class="home-content">
          <h2 class="home-slogan">{{ $t('home.slogan') }}</h2>
          <div class="home-input-number">
            <label>{{ $t('home.enter_guests') }}</label>
            <input type="number" v-model="orderData.guest_number" id="guest_number" @input="updateFormCount()"
              required />
          </div>
          <div v-if="orderData.guest_number >= 2" style="display: flex; margin-left: 15px; margin-top:7px">
            <input type="checkbox" v-model="orderData.is_Group" id="is_Group" style="border: 0"
              @click="updateGroupSelection" />
            <span>{{ $t('home.group') }}</span>
          </div>
        </div>
      </div>
      <form @submit.prevent="submitOrder" v-if="orderData.guest_number > 0">
        <div v-for="(formData, index) in orderData.formData" :key="index" class="container">
          <div class="form-right-col">
            <div class="row" style="margin-bottom: 30px">
              <div class="form-col-service">
                <label for="service">{{ $t('home.service') }}*</label>
                <select v-model="formData.service_ID" id="service"
                  @change="updateService(orderData.formData[0].service_ID)">
                  <option v-for="(service, index) in services" :key="index" :value="service.id.toString()">
                    {{ $t(`services.${service.name}`) }}
                  </option>
                </select>
              </div>
            </div>
            <div class="form-row-body">
              <div class="form-col">
                <div class="row">
                  <label for="name">{{ $t('home.name') }}*</label>
                  <input type="text" v-model="formData.name" required id="name" :placeholder="$t('home.full_name')" />
                  <span class="title-notification">* {{ $t('home.autofill_passport_photo') }}</span>
                </div>
                <div class="row">
                  <label for="passport_number">{{ $t('home.passport_number') }}*</label>
                  <input type="text" v-model="formData.passport_Number" id="passport_number" required />
                  <span class="title-notification">* {{ $t('home.autofill_passport_photo') }}</span>
                </div>
                <div class="row">
                  <label for="nationality">{{ $t('home.nationality') }}*</label>
                  <input type="text" v-model="formData.nationality" id="nationality" required />
                  <span class="title-notification">* {{ $t('home.autofill_passport_photo') }}</span>
                </div>
              </div>
              <div class="form-col">
                <div class="row">
                  <label for="departure_time">{{ $t('home.service_time') }}*</label>
                  <VueDatePicker v-model="formData.service_Time" :config="datePickerConfig" :min-date="minDate"
                    @date-update="dateSelected" required utc>
                  </VueDatePicker>
                  <span class="title-notification" style="visibility: hidden">*</span>
                </div>
                <div class="row">
                  <label>{{ $t('home.flight_number') }}</label>
                  <input type="text" v-model="formData.flight_Number"
                    @input="updateFlightNumber(orderData.formData[0].flight_Number)" required />
                  <span class="title-notification" style="visibility: hidden">*</span>
                </div>
                <div class="row">
                  <label for="airport">{{ $t('home.airport') }}*</label>
                  <select id="airport" v-model="formData.airport" @change="updateAirport(orderData.formData[0].airport)"
                    required>
                    <option v-for="a in maintainAirports" :key="a.id" :value="a.id">{{ a.name }}</option>

                    <!-- <option value="" disabled selected hidden>{{ $t('home.select_airport') }}</option>
                    <option value="Noi Bai">Noi Bai {{ $t('home.international_airport') }}, Ha Noi</option>
                    <option value="Da Nang">Da Nang {{ $t('home.international_airport') }}, Da Nang</option>
                    <option value="Cam Ranh">Cam Ranh {{ $t('home.international_airport') }}, Khanh Hoa</option>
                    <option value="Tan Son Nhat">Tan Son Nhat {{ $t('home.international_airport') }}, HCMC</option>
                    <option value="Phu Quoc">Phu Quoc {{ $t('home.international_airport') }}, Kien Giang</option> -->
                  </select>
                  <span class="title-notification" style="visibility: hidden">* {{ $t('home.service_here') }}</span>
                </div>
              </div>
              <div class="form-col">
                <div class="row">
                  <label for="email">{{ $t('home.email') }}*</label>
                  <input type="email" v-model="formData.email" @input="updateEmail(orderData.formData[0].email)"
                    required />
                  <span class="title-notification" style="visibility: hidden">*</span>
                </div>
                <div class="row">
                  <label for="phone">{{ $t('home.phone_number') }}*</label>
                  <input type="text" v-model="formData.phone" @input="updatePhone(orderData.formData[0].phone)"
                    required />
                  <span class="title-notification" style="visibility: hidden">*</span>
                </div>
                <div class="row">
                  <label for="note">{{ $t('home.note') }}</label>
                  <textarea type="text" v-model="formData.note" id="note"></textarea>
                </div>
                <span class="title-notification" style="visibility: hidden">*</span>
              </div>
            </div>
          </div>
          <div class="option-note-input">
            <div class="input-option">
              <input type="checkbox" v-model="formData.isChecked[0]" @change="handleCheckboxChange(0, formData)">
              <span class="input-option-content" id="0">{{ $t('options.change_visa') }}</span>
            </div>
            <div class="input-option">
              <input type="checkbox" v-model="formData.isChecked[1]" @change="handleCheckboxChange(1, formData)">
              <span class="input-option-content" id="1">{{ $t('options.exchange_currency') }}</span>
            </div>
            <div class="input-option">
              <input type="checkbox" v-model="formData.isChecked[2]" @change="handleCheckboxChange(2, formData)">
              <span class="input-option-content" id="2">{{ $t('options.buy_sim_card') }}</span>
            </div>
            <div class="input-option">
              <input type="checkbox" v-model="formData.isChecked[3]" @change="handleCheckboxChange(3, formData)">
              <span class="input-option-content" id="3">{{ $t('options.wheelchair_service') }}</span>
            </div>
            <div class="input-option">
              <input type="checkbox" v-model="formData.isChecked[4]" @change="handleCheckboxChange(4, formData)">
              <span class="input-option-content" id="4">{{ $t('options.poor_health_support') }}</span>
            </div>
            <div class="input-option">
              <input type="checkbox" v-model="formData.isChecked[5]" @change="handleCheckboxChange(5, formData)">
              <span class="input-option-content" id="5">{{ $t('options.customs_declaration_support') }}</span>
            </div>
            <div class="input-option">
              <input type="checkbox" v-model="formData.isChecked[6]" @change="handleCheckboxChange(6, formData)">
              <span class="input-option-content" id="6">{{ $t('options.luggage_assistance') }}</span>
            </div>
            <div class="input-option">
              <input type="checkbox" v-model="formData.isChecked[7]" @change="handleCheckboxChange(7, formData)">
              <span class="input-option-content" id="7">{{ $t('options.see_off_choose_staff') }}</span>
            </div>
          </div>
          <div class="form-col" id="form-file">
            <span>{{ $t('home.upload_documents') }}:</span>
            <div class="form-file-container">
              <div class="file-input">
                <label :for="`passport-${index}`" class="file-upload-label">
                  <div class="body-file">
                    <i class="pi pi-plus-circle" style="font-size: 1rem; color: #000066"></i>
                    <span class="title-header">{{ $t('home.upload_passport_here') }}*</span>
                    <div v-if="!formData.validated">
                      <small style="background-color: red">{{ $t("home.ERROR_PASSPORT_MISSING") }}</small>
                    </div>
                  </div>

                  <img v-if="formData.passport_File" :src="formData.imagePreview" class="uploaded-image" />
                </label>
                <input :id="`passport-${index}`" type="file"
                  @change="handlePassportUpload($event, index, formData)" />
              </div>
              <div class="file-input">
                <label :for="`visa-${index}`" class="file-upload-label">
                  <div class="body-file">
                    <i class="pi pi-plus-circle" style="font-size: 1rem; color: #000066"></i>
                    <span class="title-header">{{ $t('home.upload_visa_here') }}</span>
                  </div>
                  <img v-if="formData.visa_File" :src="formData.imageVisaPreview" class="uploaded-image" />
                </label>
                <input :id="`visa-${index}`" type="file" @change="handleVisaUpload($event, index, formData)" />
              </div>
              <div class="file-input">
                <label :for="`portrait-${index}`" class="file-upload-label">
                  <div class="body-file">
                    <i class="pi pi-plus-circle" style="font-size: 1rem; color: #000066"></i>
                    <span class="title-header">{{ $t('home.upload_portrait_here') }}</span>
                  </div>
                  <img v-if="formData.portrait_File" :src="formData.imagePortraitPreview" class="uploaded-image" />
                </label>
                <input :id="`portrait-${index}`" type="file" @change="handlePortraitUpload($event, index, formData)" />
              </div>
            </div>
          </div>
          <span class="title-footer">(*) {{ $t('home.mandatory_marks') }}</span>
        </div>
        <button v-if="orderData.guest_number >= 1" type="submit" class="btn-submit-primary">
          {{ $t('home.button') }}
        </button>
        <Loading :loading="isLoading" />
      </form>
    </div>
  </template>
<script>
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";
import Header from "@/components/partials/HeaderPartial.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import axios from "axios";
import Loading from './LoadingPage.vue';
import moment from "moment";
// import i18n from "@/i18n";
import Swal from 'sweetalert2';

export default {
  components: {
    Header, Loading, VueDatePicker
  },
  data() {
    return {
      orderData: {
        guest_number: null,
        is_Group: false,
        formData: [],
      },
      formData: {
        passport_File: '',
        visa_File: '',
        portrait_File: '',
        service_Time: '',
        note: [],
      },
      portrait_file: "",
      passportFiles: [],
      visaFiles: [],
      portraitFiles: [],
      passportFile: "",
      uploadedVisa: null,
      uploadedPortrait: null,
      imagePreview: null,
      imageVisaPreview: null,
      imagePortraitPreview: null,
      selectedServices: [],
      services: [],
      dateTime: moment.utc(),
      datePickerConfig: {
        format: "YYYY-MM-DD HH:mm:ss",
        formatter: (date) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
        parser: (dateString) => moment.utc(dateString, "YYYY-MM-DD HH:mm:ss").toDate(),
      },
      previousServiceTime: '',
      previousAirport: '',
      previousFlightNumber: '',
      formIndexCounter: 0,
      isLoading: false,
      isChecked: [false, false, false, false, false, false, false, false],
      maintainAirports: [],
    };
  },
  mounted() {

  },
  computed: {
    minDate() {
      return new Date();
    },
  },

  methods: {
    maintainGetAllAirport() {
      axios.get(`${process.env.VUE_APP_API_URL}/MaintainCommons/GetAirports`).then((response) => {
        this.maintainAirports = response.data;
      })
    },
    handleCheckboxChange(index, fd) {
      const value = document.getElementById(index).innerHTML;
      if (fd.isChecked[index]) {
        if (!fd.note) {
          fd.note = value + ', ';
        } else {
          if (!fd.note.includes(value)) {
            fd.note += value + ', ';
          }
        }
      } else {
        if (fd.note) {
          if (fd.note.includes(value)) {
            fd.note = fd.note.replace(value + ', ', '');
          }
        }
      }
    },


    updateLanguage(language) {
      console.log(language);
      this.$i18n.locale = language;
    },

    startLoading() {
      this.isLoading = true;
    },
    stopLoading() {
      this.isLoading = false;
    },

    async uploadAndScanImage(fd, passportItem) {
      try {
        this.isLoading = true;
        const formData = new FormData();
        formData.append("image", passportItem);
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
          if (responseData.name && responseData.nationality && responseData.passport_number) {
            fd.name = responseData.name;
            fd.nationality = responseData.nationality;
            fd.passport_Number = responseData.passport_number;
          } else {
            this.showAlert("Passport information is insufficient to autofill. Please try again or fill manually.");
          }
        } else {
          this.showAlert("Could not scan passport information. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading and scanning image:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async handlePassportUpload(event, index, fd) {
      if (event.target.files != null) {

        //display image
        this.passportFile = event.target.files[0];
        fd.imagePreview = URL.createObjectURL(this.passportFile);

        //convert image to base64 in order to send server
        var passportItem = event.target.files[0];
        this.uploadAndScanImage(fd, passportItem);
        const base64String = await this.convertFileToBase64(passportItem);
        this.passportFiles.push(base64String);
        fd.passport_File = base64String
      }
    },

    showAlert(message) {
      toast(message, {
        autoClose: 1000,
        type: "error",
      });
    },

    success() {
      toast("Add order successfully!", {
        autoClose: 800,
        type: "success",
      });
      this.resetForm();
    },

    resetForm() {
      this.orderData.guest_number = null;
      this.orderData.is_Group = false;
      this.orderData.formData = [];
    },

    dateSelected(date) {
      var is_Group = this.checkGroupAndDataGroup();
      if (is_Group) {
        this.orderData.formData.forEach((data) => {
          data.service_Time = date;
        });
      }
    },

    updateAirport(airport) {
      var is_Group = this.checkGroupAndDataGroup();
      if (is_Group) {
        this.orderData.formData.forEach((data) => {
          data.airport = airport;
        });
      }
    },
    updateService(service) {
      if (this.checkGroupAndDataGroup()) {
        this.orderData.formData.forEach((data) => {
          data.service_ID = service;
        });
      }
    },

    updateFlightNumber(number) {
      if (this.checkGroupAndDataGroup()) {
        this.orderData.formData.forEach((data) => {
          data.flight_Number = number;
        });
      }
    },

    updateEmail(email) {
      if (this.checkGroupAndDataGroup()) {
        this.orderData.formData.forEach((data) => {
          data.email = email;
        });
      }
    },

    updatePhone(phone) {
      if (this.checkGroupAndDataGroup()) {
        this.orderData.formData.forEach((data) => {
          data.phone = phone;
        });
      }
    },

    checkGroupAndDataGroup() {
      return this.orderData.is_Group;
    },




    updateFormCount() {
      var guestCount = parseInt(this.orderData.guest_number);
      if (this.orderData.guest_number <= 0 || isNaN(this.orderData.guest_number)) {
        this.orderData.guest_number = 0;
      }
      if (guestCount >= 1) {
        this.orderData.formData = Array.from({ length: guestCount }, () => ({
          service_Time: "",
          flight_Number: "",
          airport: "",
          name: "",
          email: "",
          phone: "",
          nationality: "",
          note: "",
          passport_Number: "",
          passport_File: "",
          visa_File: "",
          portrait_File: "",
          service_ID: null,
          createBy: null,
          isChecked: [false, false, false, false, false, false, false, false],
          validated: true
        }));
      }
    },

    async submitOrder() {
      try {
        

        const ordersToSend = [];
        for (let i = 0; i < this.orderData.guest_number; i++) {
          ordersToSend.push(this.orderData.formData[i]);
        }

        var is_Group = this.checkGroupAndDataGroup();
        if (is_Group) {
          var serviceTimeFirst = this.orderData.formData[0].service_Time;
          ordersToSend.forEach(v => {
            v.service_Time = serviceTimeFirst
          })
        }

        const dataToSend = {
          is_group_order: this.orderData.is_Group ? 1 : 0,
          orders: ordersToSend,
        };

        //validated
        let checker = true;
        dataToSend.orders.forEach(v => {
          console.log(v)
          if (!v.passport_File) {
            v.validated = false
            checker = false;
            return;
          }
        });
        if (checker) {
          this.isLoading = true;
          const apiUrl = process.env.VUE_APP_API_URL;
          const response = await axios.post(`${apiUrl}/MaintainOrderDetails`, dataToSend);

          // this.success();
          if (response.status === 200) {
            this.isLoading = false;

            // Hiển thị swal modal
            await Swal.fire({
              icon: 'success',
              title: 'Booking Successful!',
              // text: 'Vui lòng chờ xác nhận.'
            });
          }
        }
      } catch (error) {
        console.error("Error submitting order:", error);
        this.isLoading = false;
      }

      // finally {
      //   this.isLoading = false;
      // }
    },

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


    async handleVisaUpload(event, index, fd) {
      this.uploadedVisa = event.target.files[0];
      fd.imageVisaPreview = URL.createObjectURL(this.uploadedVisa);

      //convert image to base 64
      var _uploadedVisa = event.target.files[0];
      const base64String = await this.convertFileToBase64(_uploadedVisa);
      fd.visa_File = base64String;
    },

    async handlePortraitUpload(event, index, fd) {
      //Display image when use upload
      this.uploadedPortrait = event.target.files[0];
      fd.imagePortraitPreview = URL.createObjectURL(this.uploadedPortrait);

      //Convert image to base64
      var _uploadedPortrait = event.target.files[0];
      const base64String = await this.convertFileToBase64(
        _uploadedPortrait
      );
      fd.portrait_File = base64String;
    },

    async fetchServices() {
      const apiUrl = process.env.VUE_APP_API_URL;
      await axios
        .get(`${apiUrl}/MaintainCommons/GetServices`)
        .then((response) => {
          this.services = response.data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
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


  },
  created() {
    this.maintainGetAllAirport();
    this.fetchServices();
  }
}
</script>
<style scoped>
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
@font-face {
  font-family: "Avenir Next Ultra Light";
  src: url("@/assets/font/Avenir Next.ttc") format("truetype");
}

/* Main-Header */
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
  text-align: center;
    margin: auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
}
.home-input-number {
  gap: 6px;
  display: flex;
  flex-direction: column;
  margin:auto;
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

/* Main-Body */
.container {
  color: #000066;
  font-family: "Avenir Next Meidum", sans-serif;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 20px;
  height: 100%;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  padding: 30px 45px;
  background: #fff;
  justify-content: space-evenly;
  align-items: center;
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
  width: 100%;
  height: 100%;
  position: absolute;
  top: 4px;
  border-radius: 7px;
  padding: 5px;
  left: 5px;
  max-height: 100%;
}

.title-header {
  margin-bottom: 10px;
  color: #000066;
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
  color: #000066;
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
  height: 36px;
}

select {
  border: none;
  margin-top: 5px;
  color: #000066;
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
  color: black;
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

span.input-option-content {
  font-size: 15px;
}

.option-note-input {
  display: flex;
  flex-wrap: wrap;
}

.input-option {
  flex: 0 0 calc(33.333% - 10px);
  /* 33.333% để hiển thị 3 cột, -10px để tạo khoảng cách giữa các cột */
  margin-right: 10px;
  /* Khoảng cách giữa các cột */
  margin-bottom: 10px;
  /* Khoảng cách giữa các hàng */
  display: flex;
  align-items: center;
  /* Căn chỉnh nội dung theo chiều dọc */
}

.input-option input[type="checkbox"] {
  margin-right: 5px;
  /* Khoảng cách giữa checkbox và nội dung */
}

.input-option-content {
  flex: 1;
  /* Nội dung sẽ chiếm phần còn lại của cột */
}

@media (max-width: 768px) {
  .form-row-body {
    display: flex;
    gap: 30px;
    flex-direction: column;
  }

  .form-file-container {
    display: flex;
    gap: 3%;
    flex-direction: column;
  }
}
</style>
