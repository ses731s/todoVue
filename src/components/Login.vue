<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="col-xs-12 col-sm-10 offset-sm-1 col-md-6 offset-md-3">
          <h2>Log In</h2>
          <p>Log in to your account to get some great experiance.</p>
          <div class="alert alert-danger" v-if="error">
            <p>{{ error }}</p>
          </div>

          <div
            class="form-group"
            :class="{ 'form-group--error': $v.email.$error }"
          >
            <label class="form__label">Email</label>
            <input
              type="email"
              class="form-control"
              :class="status($v.email)"
              v-model="$v.email.$model"
              placeholder="Enter your email id"
            />
            <div
              class="errorLabel"
              v-if="!$v.email.required && $v.email.$dirty"
            >
              Email is required.
            </div>
            <div class="errorLabel" v-if="!$v.email.email && $v.email.$dirty">
              Valid Email is required
            </div>
          </div>

          <!-- <span>{{ $v }}</span> -->

          <div
            class="form-group"
            :class="{ 'form-group--error': $v.password.$error }"
          >
            <label class="form__label">Password</label>
            <input
              type="password"
              class="form-control"
              :class="status($v.password)"
              v-model="$v.password.$model"
              placeholder="Enter your password"
            />
            <div
              class="errorLabel"
              v-if="!$v.password.required && $v.password.$dirty"
            >
              Password is required.
            </div>
          </div>
          <button
            class="btn btn-primary mx-2"
            v-on:click="sendData()"
            :disabled="submitStatus === 'PENDING'"
          >
            Login
          </button>

          <button class="btn btn-info">
            <router-link to="/signup">Register</router-link>
          </button>
          <p class="typo__p" v-if="submitStatus === 'ERROR'">
            Please fill the form correctly.
          </p>
        </div>
        <p v-if="this.output != error" class="error1">
          Email id or password is invalid. Please enter valid email id and
          password.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
      output: "",
      submitStatus: null
    };
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    }
  },
  mounted() {},
  methods: {
    status(validation) {
      return {
        error: validation.$error,
        dirty: validation.$dirty
      };
    },
    sendData() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR";
      } else {
        var _this = this;
        let params = {
          emailID: this.email,
          password: this.password
        };
        if (!params) {
          return;
        } else {
          this.axios
            .post("http://180.149.241.208:3022/userLogin", params)
            .then(function(response) {
              const token = response.data.token;
              const userID = response.data.data._id;
              const userType = "regular";
              localStorage.setItem("user-id", userID); // store the token in localstorage
              localStorage.setItem("user-token", token); // store the token in localstorage
              localStorage.setItem("user-type", userType); // store the token in localstorage
              _this.$store.dispatch("assignToken", token);
              _this.$store.dispatch("assignUser", userType);
              localStorage.removeItem("todos");
              _this.$swal({
                position: "top-end",
                icon: "success",
                title: response.data.message,
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "popup-class",
                  title: "title-class"
                }
              });
              _this.$router.push({
                name: "Todo",
                params: {
                  id: response.data.data._id,
                  token: response.data.token
                }
              });
            })
            .catch(function(error) {
              localStorage.removeItem("user-token"); // if the request fails, remove any possible user token if possible
              localStorage.removeItem("user-id");
              _this.output = error;
              this.status(error);
            });
        }
      }
    }
  }
};
</script>

<style scoped>
a,
a:hover {
  color: #fff;
  text-decoration: none;
}
.form-group {
  margin: 30px 0;
}
.form-control {
  margin: 20px 0;
}
.form__label {
  float: left;
}
.errorLabel {
  float: left;
  margin-top: -15px;
  font-size: 12px;
  color: red;
}
.error1 {
  margin-top: 15px;
  font-size: 15px;
  color: red;
}

/* _---------------------------------- */
/* input {
  border: 1px solid silver;
  border-radius: 4px;
  background: white;
  padding: 5px 10px;
} */

.dirty {
  border-color: #5a5;
  background: #efe;
}

.dirty:focus {
  outline-color: #8e8;
}

.error {
  font-size: 12px;
  border-color: red;
  background: #fdd;
}

.error:focus {
  outline-color: #f99;
}
.swal2-popup {
  width: 30% !important;
  padding: 10px !important;
}
</style>
