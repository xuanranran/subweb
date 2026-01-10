<template>
  <div class="navbar-brand app-brand demo d-flex py-0 py-lg-2 me-4">
    <!-- Mobile menu toggle: Start-->
    <button
      class="navbar-toggler border-0 px-0 me-2"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
      @click="$store.commit('MAIN_LAYOUT_MENU_EXPAND')"
    >
      <i class="ti ti-menu-2 ti-sm align-middle"></i>
    </button>
    <!-- Mobile menu toggle: End-->
    <router-link to="/" class="app-brand-link">
      <span class="app-brand-logo demo">
        <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
            fill="#7367F0"
          />
          <path
            opacity="0.06"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
            fill="#161616"
          />
          <path
            opacity="0.06"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
            fill="#161616"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
            fill="#7367F0"
          />
        </svg>
      </span>
      <span class="app-brand-text demo menu-text fw-bold ms-2 ps-1">{{ siteName }}</span>
    </router-link>
    
    <!-- Theme Switcher -->
    <button class="icon-btn theme-toggle-btn" id="theme-toggle" @click="toggleTheme" title="Switch Theme">
      <!-- Light Theme Icon -->
      <svg v-show="themeMode === 'light'" id="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <title>Light Theme</title>
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <!-- Dark Theme Icon -->
      <svg v-show="themeMode === 'dark'" id="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <title>Dark Theme</title>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <!-- Auto Theme Icon -->
      <svg v-show="themeMode === 'auto'" id="auto-icon" width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4">
          <title>Auto Theme</title>
          <path d="M24 44C29.9601 44 26.3359 35.136 30 31C33.1264 27.4709 44 29.0856 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"></path>
          <path d="M28 17C29.6569 17 31 15.6569 31 14C31 12.3431 29.6569 11 28 11C26.3431 11 25 12.3431 25 14C25 15.6569 26.3431 17 28 17Z"></path>
          <path d="M16 21C17.6569 21 19 19.6569 19 18C19 16.3431 17.6569 15 16 15C14.3431 15 13 16.3431 13 18C13 19.6569 14.3431 21 16 21Z"></path>
          <path d="M17 34C18.6569 34 20 32.6569 20 31C20 29.3431 18.6569 28 17 28C15.3431 28 14 29.3431 14 31C14 32.6569 15.3431 34 17 34Z"></path>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'AppBrand',
  data() {
    return {
      siteName: '',
      themeMode: 'auto', // auto, light, dark
    };
  },
  computed: {
    themeIcon() {
      if (this.themeMode === 'light') return 'ti-sun';
      if (this.themeMode === 'dark') return 'ti-moon';
      return 'ti-device-desktop'; // Auto icon
    }
  },
  created() {
    this.siteName = window.config.siteName;
    this.initTheme();
  },
  methods: {
    initTheme() {
      const savedTheme = localStorage.getItem('subweb-theme') || 'auto';
      this.themeMode = savedTheme;
      this.applyTheme(savedTheme);
      
      // Listen for system theme changes if in auto mode
      this.mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
      this.handleSystemThemeChange = (e) => {
        if (this.themeMode === 'auto') {
          const newTheme = e.matches ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', newTheme);
        }
      };
      this.mediaQueryList.addEventListener('change', this.handleSystemThemeChange);
    },
    toggleTheme() {
      const modes = ['light', 'dark', 'auto'];
      const nextIndex = (modes.indexOf(this.themeMode) + 1) % modes.length;
      this.themeMode = modes[nextIndex];
      this.applyTheme(this.themeMode);
    },
    applyTheme(mode) {
      localStorage.setItem('subweb-theme', mode);
      if (mode === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', mode);
      }
    }
  },
  beforeUnmount() {
    if (this.mediaQueryList) {
      this.mediaQueryList.removeEventListener('change', this.handleSystemThemeChange);
    }
  }
};
</script>
