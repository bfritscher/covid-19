<template>
  <div id="app">
    <b-navbar type="dark" variant="primary">
      <b-navbar-brand>covid-19</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item to="/">Playground</b-nav-item>
        <b-nav-item to="/links">Other Visualisation Links</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <b-container fluid>
      <router-view />
    </b-container>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
