<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Verdana, Geneva, sans-serif;
  font-size: 10pt;
  color: #828282;
  background-color: #f6f6ef;
}

a {
  color: #000;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

table {
  border-collapse: collapse;
}

input,
textarea,
button {
  font-family: Verdana, Geneva, sans-serif;
  font-size: 10pt;
}

.container {
  margin: 0 auto;
  max-width: 1200px;
  padding: 10px;
}

.header {
  background-color: #ff6600;
  padding: 2px;
}

.header table {
  width: 100%;
}

.header td {
  padding: 2px;
}

.title {
  font-weight: bold;
  font-size: 11pt;
  color: #000;
}

.spacer {
  height: 10px;
}

.login-form,
.admin-panel {
  background-color: #fff;
  padding: 20px;
  margin-top: 10px;
}

.form-row {
  margin-bottom: 10px;
}

.form-row label {
  display: inline-block;
  width: 100px;
}

.form-row input {
  padding: 4px;
  border: 1px solid #828282;
}

button {
  background-color: #f6f6ef;
  border: 1px solid #828282;
  padding: 4px 8px;
  cursor: pointer;
}

button:hover {
  background-color: #e6e6df;
}

.notification-item {
  padding: 8px;
  border-bottom: 1px solid #e6e6df;
}

.notification-item.unread {
  background-color: #ffffed;
  font-weight: bold;
}

.notification-bell {
  position: relative;
  cursor: pointer;
  font-size: 16pt;
  margin-left: 10px;
}

.notification-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ff6600;
  color: #fff;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 8pt;
  font-weight: bold;
}

.error {
  color: #ff0000;
  margin-top: 10px;
}

.success {
  color: #008000;
  margin-top: 10px;
}
</style>
