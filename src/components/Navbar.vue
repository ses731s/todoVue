<template>
  <div id="nav">
    <b-container fluid class="p-0">
      <header>
        <b-navbar toggleable="lg" type="dark" variant="info">
          <b-navbar-brand href="#">Todo</b-navbar-brand>

          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
              <!-- <b-nav-item
                v-if="$store.state.token == '' || $store.state.token == null"
                to="/"
                right
              > -->
              <b-nav-item
                v-if="$store.state.token == '' || $store.state.token == null"
                @click="login()"
                right
              >
                Log in
                <i class="fas fa-sign-out-alt"></i>
              </b-nav-item>
              <b-nav-item
                v-if="$store.state.token == '' || $store.state.token == null"
                @click="guest()"
                right
              >
                Guest
                <i class="fas fa-sign-out-alt"></i>
              </b-nav-item>
              <b-nav-item
                v-if="$store.state.token != '' && $store.state.token != null"
                @click="logout()"
                right
              >
                Log Out
                <i class="fas fa-sign-out-alt"></i>
              </b-nav-item>
              <!-- <b-nav-item  v-else @click="signIn()" right>Log In</b-nav-item> -->
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </header>
    </b-container>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      this.$router.push("/");
    },
    logout() {
      localStorage.removeItem("user-token");
      localStorage.removeItem("user-id");
      localStorage.removeItem("user-type");
      localStorage.clear();
      this.$store.dispatch("assignToken", "");
      this.$store.dispatch("assignUser", "");
      this.$router.push("/");
    },

    guest() {
      const userType = "guest";
      localStorage.setItem("user-type", userType); // store the token in localstorage
      this.$store.dispatch("assignUser", userType);
      this.$router.push("/guest");
    }
  }
};
</script>
