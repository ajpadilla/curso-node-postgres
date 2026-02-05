const express = require('express');

class ViewRouter {
  constructor({ authMiddleware }) {
    this.router = express.Router();
    this.authMiddleware = authMiddleware;

    this.init();
  }

  init() {
    this.router.get('/login', this.loginView.bind(this));

    this.router.get('/dashboard', this.authMiddleware, this.dashboardView.bind(this));
  }

  loginView(req, res) {
    res.render('auth/login', {
      title: 'Login',
      // No sidebar for login
    });
  }

  dashboardView(req, res) {
    res.render('dashboard', {
      title: 'Dashboard',
      user: req.user,

      // Sidebar HTML
      sidebar: `
        <nav class="sidebar-nav">

          <h2 class="sidebar-title">
            Admin Panel
          </h2>

          <a href="/api/v1/dashboard">Dashboard</a>
          <a href="/api/v1/users">Users</a>
          <a href="/api/v1/orders">Orders</a>
          <a href="/api/v1/logs">Logs</a>

          <hr />

          <a href="/api/v1/auth/logout" class="logout-link">
            Logout
          </a>

        </nav>
      `,
    });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ViewRouter;
