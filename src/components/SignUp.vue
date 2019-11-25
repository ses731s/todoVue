<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class>
          <h2>Sign Up</h2>
          <p>Sign up for a free account to get some great experiance.</p>
          <div class="alert alert-danger" v-if="error">
            <p>{{ error }}</p>
          </div>
          <div
            class="form-group"
            :class="{ 'form-group--error': $v.name.$error }"
          >
            <label class="form__label">Name</label>
            <input
              type="text"
              class="form-control"
              :class="status($v.name)"
              placeholder="Enter your name"
              v-model.trim="$v.name.$model"
            />
            <div class="errorLabel" v-if="!$v.name.required && $v.name.$dirty">
              *Name is required
            </div>
          </div>

          <div
            class="form-group"
            :class="{ 'form-group--error': $v.dob.$error }"
          >
            <label class="form__label">DOB</label>
            <input
              type="date"
              class="form-control"
              :class="status($v.dob)"
              name="bday" 
              min="<?= date('Y-m-d'); ?>"
              placeholder="Enter your DOB"
              v-model.trim="$v.dob.$model"
            />
            <div class="errorLabel" v-if="!$v.dob.required && $v.dob.$dirty">
              *DOB is required
            </div>
          </div>

          <div
            class="form-group"
            :class="{ 'form-group--error': $v.emailID.$error }"
          >
            <label class="form__label">Email</label>
            <input
              type="email"
              class="form-control"
              :class="status($v.emailID)"
              placeholder="Enter your email id"
              v-model.trim="$v.emailID.$model"
            />
            <div
              class="errorLabel"
              v-if="!$v.emailID.required && $v.emailID.$dirty"
            >
              *Email is required
            </div>
            <div
              class="errorLabel"
              v-if="!$v.emailID.email && $v.emailID.$dirty"
            >
              Enter valid email address.
            </div>
            <div
              class="errorLabel"
              v-if="!$v.emailID.isUnique && $v.emailID.$dirty"
            >
              Email is already registered.
            </div>
          </div>

          <div
            class="form-group"
            :class="{ 'form-group--error': $v.password.$error }"
          >
            <label class="form__label">Password</label>
            <input
              type="password"
              class="form-control"
              :class="status($v.password)"
              placeholder="Enter password"
              v-model.trim="$v.password.$model"
            />
            <div
              class="errorLabel"
              v-if="!$v.password.required && $v.password.$dirty"
            >
              *Password is required.
            </div>
            <div
              class="errorLabel"
              v-if="!$v.password.minLength && $v.password.$dirty"
            >
              *Password must have at least
              {{ $v.password.$params.minLength.min }} letters.
            </div>
          </div>

          <div
            class="form-group"
            :class="{ 'form-group--error': $v.confirmPassword.$error }"
          >
            <label class="form__label">Re-enter Password</label>
            <input
              type="password"
              class="form-control"
              :class="status($v.confirmPassword)"
              placeholder="Re-enter Password"
              v-model.trim="$v.confirmPassword.$model"
            />
            <div
              class="errorLabel"
              v-if="
                !$v.confirmPassword.sameAsPassword && $v.confirmPassword.$dirty
              "
            >
              Passwords must be identical.
            </div>
          </div>

          <button class="btn btn-primary mx-2" v-on:click="sendUserData()">
            Register
          </button>
          <button class="btn btn-info">
            <router-link to="/">Login</router-link>
          </button>
          <p class="typo__p" v-if="submitStatus === 'ERROR'">
            Please fill the form correctly.
          </p>
          <p v-if="this.error">
            {{ this.APIerror }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  required,
  sameAs,
  minLength,
  maxLength,
  email
} from "vuelidate/lib/validators";

export default {
  data() {
    return {
      name: "",
      dob: "",
      emailID: "",
      password: "",
      confirmPassword: "",
      error: "",
      APIerror: "",
      date: "",
      submitStatus: null
    };
  },
  validations: {
    name: {
      required
    },
    dob: {
      required
    },
    emailID: {
      required,
      email,
      isUnique (value) {
        if (value === "") return true
        //eslint-disable-next-line
        var emailRe = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

        return (emailRe.test(value))
        // return new Promise((resolve) => {
        //   setTimeout(() => {
        //     resolve(emailRe.test(value))
        //   }, 350 + Math.random() * 300)
        // })
      }
    },
    password: {
      required,
      minLength: minLength(6),
      maxLength: maxLength(8)
    },
    confirmPassword: {
      sameAsPassword: sameAs("password")
    }
  },

  methods: {
    registrationAlert() {
      this.$swal({
        position: "top-end",
        icon: "success",
        title: "Registration successfully.",
        showConfirmButton: false,
        timer: 1500
      });
    },
    status(validation) {
      return {
        error: validation.$error,
        dirty: validation.$dirty
      };
    },
    sendUserData() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR";
      } else {
        var _this = this;
        let userData = {
          name: this.name,
          dob: this.dob,
          emailID: this.emailID,
          password: this.password,
          confirmPassword: this.confirmPassword
        };
        this.axios
          .post("http://180.149.241.208:3022/userRegistration", userData)
          .then(function() {
            _this.registrationAlert();
            _this.$router.push({ name: "login" });
          })
          .catch(function(error) {
            console.log(error);
            this.APIerror = error.response.data.error_message.errmsg;
          });
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
