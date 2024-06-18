<template>
  <header class="header-container">
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-md-6">
          <router-link to="/"><img src="@/assets/logo.png" alt="logo" class="header-logo-image img-fluid logo12" /></router-link>
        </div>
        <div class="col-md-6">
          <div class="header-info d-flex justify-content-end align-items-center">
            <div class="contact-in me-3"> Support: <a class="tel" href="tel:+84902227529">+84 90 222 7529</a> </div>
            <select class="form-select ngonngu" @change="changeLanguage">
              <option value="en">English</option>
              <option value="vi">VietNamese</option>
              <option value="zh">Chinese /中文</option>
              <option value="ko">Korean /한국</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderPartial",
  methods: {
    changeLanguage(event) {
      this.$emit('language-change', event.target.value);
    }
  }
};
</script>

<style scoped>
@font-face {
  font-family: "Avenir Next Ultra Light";
  src: url("@/assets/font/Avenir Next.ttc") format("truetype");
}

.header-container {
  background-color: #ffffff;
  color: #000066;
  padding: 20px 0;
}

.header-logo-image {
  height: auto;
  max-height: 65px;
}

.contact-in {
  display: flex;
  gap: 5px;
}

.tel {
  text-decoration: none;
  color: #000066;
  width: 140px;
}
.ngonngu{
  width: 120px;
}
.logo12{
  padding-bottom: 10px;
}
.form-select {
  padding: 3px 5px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  background-color: #fff;
  color: #000066;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.form-select:hover {
  border-color: #999;
}

.form-select:focus {
  border-color: #fff;
  box-shadow: 0 0 0 1px #fff;
  outline: none;
}
</style>
