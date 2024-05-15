<template>
  <header class="header-container">
    <div id="header">
      <img src="@/assets/logo.png" alt="logo" class="header-logo-image" />
      <div class="header-info">
        <span class="contact-in"> Support: +84 90 222 7529 </span>
        <select class="form-select" @change="changeLanguage">
          <option value="en">English</option>
          <option value="vi">VietNamese</option>
          <option value="zh">Chinese /中文</option>
          <option value="ko">Korea /한국</option>
        </select>
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

#header {
  color: #000066;
  gap: 60%;
  display: flex;
  font-family: "Avenir Next Medium", sans-serif;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
}

.header-container #header .header-logo-image {
  height: 65px;
}

.form-select {
  padding: 3px 5px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  background-color: #fff;
  width: 120px;
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
