
import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  NavLink
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserPlus,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Search,
  RefreshCw,
  User,
  Lock,
  Save
} from "lucide-react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import api from "./services/api";
import "./App.css";

// ================= STORED USER =================

function getStoredUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

// ================= PROTECTED ROUTES =================

function ProtectedRoute({ allowedRole }) {
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/user"}
        replace
      />
    );
  }

  return <Outlet />;
}

// ================= LOGOUT =================

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      <LogOut size={18} />
      Logout
    </button>
  );
}

// ================= DASHBOARD LAYOUT =================

function DashboardLayout({ title, role, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getStoredUser();

  const navigation =
    role === "admin"
      ? [
          { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
          { name: "Users", path: "/admin/users", icon: Users },
          { name: "Add User", path: "/admin/add-user", icon: UserPlus },
          { name: "Settings", path: "/admin/settings", icon: Settings }
        ]
      : [
          { name: "Dashboard", path: "/user", icon: LayoutDashboard },
          { name: "My Profile", path: "/user/profile", icon: Users }
        ];

  return (
    <div className="app-layout">
      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className={menuOpen ? "sidebar-container open" : "sidebar-container"}>
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h2>GrowthTech</h2>
              <span>INDIA</span>
            </div>

            <button
              className="mobile-close"
              onClick={() => setMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="nav-label">MENU</div>

          <nav className="navigation">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin" || item.path === "/user"}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="sidebar-bottom">
            <div className="sidebar-footer">
              <span className="online-dot"></span>
              System operational
            </div>

            <LogoutButton />
          </div>
        </aside>
      </div>

      <main className="main-content">
        <header className="topbar">
          <div className="header-left">
            <button
              className="menu-button"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div>
              <div className="breadcrumb">
                Workspace / <strong>{title}</strong>
              </div>
              <h1>{title}</h1>
            </div>
          </div>

          <div className="profile">
            <div className="avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="profile-info">
              <strong>{user?.name}</strong>
              <span>
                {role === "admin" ? "Administrator" : "User"}
              </span>
            </div>
          </div>
        </header>

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}

// ================= ADMIN DASHBOARD =================

function AdminDashboard() {
  const user = getStoredUser();

  return (
    <DashboardLayout title="Admin Dashboard" role="admin">
      <div className="welcome-row">
        <div>
          <h2>Welcome back, {user?.name} 👋</h2>
          <p>You are logged in with administrator privileges.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <span>Account Role</span>
          </div>
          <div className="stat-value">Admin</div>
          <div className="stat-bottom">Full administrative access</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Authentication</span>
          </div>
          <div className="stat-value">JWT</div>
          <div className="stat-bottom">Token-based authentication</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Account Status</span>
          </div>
          <div className="stat-value">Active</div>
          <div className="stat-bottom">Your account is active</div>
        </div>
      </div>

      <div className="panel">
        <h3>Administrator Access</h3>
        <p>You can manage platform users and account settings.</p>
      </div>
    </DashboardLayout>
  );
}

// ================= ADMIN USERS =================

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users");

      const userList =
        response.data.users ??
        response.data.data ??
        [];

      if (!Array.isArray(userList)) {
        throw new Error("Unexpected users response from server.");
      }

      setUsers(userList);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText)
    );
  });

  return (
    <DashboardLayout title="User Management" role="admin">
      <div className="welcome-row">
        <div>
          <h2>All Users</h2>
          <p>Manage registered users on your platform.</p>
        </div>

        <button
          className="export-button"
          onClick={fetchUsers}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="panel users-panel">
        <div className="panel-heading">
          <div>
            <h3>Registered Users</h3>
            <p>{users.length} users found in the database</p>
          </div>
        </div>

        <div className="user-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <div className="users-message">
            Loading users from database...
          </div>
        ) : error ? (
          <div className="auth-error">
            {error}
            <button onClick={fetchUsers}>Try again</button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="users-message">
            {users.length === 0
              ? "No users found in the database."
              : "No matching users found."}
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>USER</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>JOINED DATE</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {user.name
                            ?.split(" ")
                            .map((part) => part[0])
                            .join("")
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="role-label">
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status ${
                          user.status === "active"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        <i></i>
                        {user.status}
                      </span>
                    </td>

                    <td className="date-cell">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ================= ADMIN ADD USER =================

function AdminAddUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    status: "active"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (formData.name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/users", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        status: formData.status
      });

      setSuccess(response.data.message || "User created successfully.");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
        status: "active"
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to create user. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #dfe3eb",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    marginTop: "7px"
  };

  const labelStyle = {
    display: "block",
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "18px"
  };

  return (
    <DashboardLayout title="Add User" role="admin">
      <div className="welcome-row">
        <div>
          <h2>Create New User</h2>
          <p>Add a new account to the platform.</p>
        </div>
        <button
          className="export-button"
          type="button"
          onClick={() => navigate("/admin/users")}
        >
          <Users size={16} />
          View Users
        </button>
      </div>

      <div className="panel" style={{ maxWidth: "850px" }}>
        <h3>User Information</h3>
        <p style={{ color: "#687386", fontSize: "13px" }}>
          Enter the details below to create a new account.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: "25px" }}>
          <label style={labelStyle}>
            Full Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={fieldStyle}
              placeholder="Enter full name"
              required
              minLength={2}
            />
          </label>

          <label style={labelStyle}>
            Email Address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={fieldStyle}
              placeholder="Enter email address"
              required
            />
          </label>

          <label style={labelStyle}>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={fieldStyle}
              placeholder="Enter password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>

          <label style={labelStyle}>
            Confirm Password
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={fieldStyle}
              placeholder="Confirm password"
              required
              autoComplete="new-password"
            />
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px"
            }}
          >
            <label style={labelStyle}>
              Account Role
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={fieldStyle}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label style={labelStyle}>
              Account Status
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={fieldStyle}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>

          {error && (
            <div className="auth-error" style={{ marginBottom: "15px" }}>
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: "#e9f8ef",
                color: "#187342",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "15px",
                fontSize: "14px"
              }}
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            className="export-button"
            disabled={loading}
          >
            <UserPlus size={17} />
            {loading ? "Creating User..." : "Create User"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

// ================= USER DASHBOARD =================

function UserDashboard() {
  const user = getStoredUser();

  return (
    <DashboardLayout title="User Dashboard" role="user">
      <div className="welcome-row">
        <div>
          <h2>Welcome, {user?.name} 👋</h2>
          <p>Welcome to your personal dashboard.</p>
        </div>
      </div>

      <div className="panel">
        <h3>My Account</h3>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
    </DashboardLayout>
  );
}

// ================= MY PROFILE =================

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch profile from database
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/me");
      const user = response.data.user;

      setProfile(user);
      setName(user.name || "");

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        })
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Save profile changes
  const handleUpdate = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    const passwordRequested =
      currentPassword || newPassword || confirmPassword;

    if (passwordRequested) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setError("Please fill all password fields.");
        return;
      }

      if (newPassword.length < 8) {
        setError("New password must be at least 8 characters.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("New password and confirm password do not match.");
        return;
      }
    }

    const payload = {
      name: name.trim()
    };

    if (passwordRequested) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    try {
      setSaving(true);

      const response = await api.patch(
        "/users/me/profile",
        payload
      );

      const updatedUser = response.data.user;

      setProfile(updatedUser);
      setName(updatedUser.name);

      const storedUser = getStoredUser();

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          status: updatedUser.status
        })
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="My Profile" role="user">
        <div className="panel">Loading your profile...</div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout title="My Profile" role="user">
        <div className="panel">
          <p className="auth-error">{error || "Profile not found."}</p>
          <button className="export-button" onClick={fetchProfile}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const fieldStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #dfe3eb",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    marginTop: "7px"
  };

  const labelStyle = {
    display: "block",
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "16px"
  };

  const detailStyle = {
    padding: "12px 14px",
    background: "#f6f8fb",
    borderRadius: "8px",
    marginTop: "7px",
    fontSize: "14px",
    overflowWrap: "anywhere"
  };

  return (
    <DashboardLayout title="My Profile" role="user">
      <div className="welcome-row">
        <div>
          <h2>My Profile</h2>
          <p>View and manage your personal account details.</p>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: "850px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" }}>
          <div className="user-avatar" style={{ width: "52px", height: "52px", fontSize: "20px" }}>
            <User size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>{profile.name}</h3>
            <p style={{ margin: "5px 0 0", color: "#687386" }}>
              {profile.role}
            </p>
          </div>
        </div>

        <h3>Account Information</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px 20px", marginTop: "18px" }}>
          <div>
            <span style={{ color: "#687386", fontSize: "13px" }}>Full Name</span>
            <div style={detailStyle}>{profile.name}</div>
          </div>

          <div>
            <span style={{ color: "#687386", fontSize: "13px" }}>Email Address</span>
            <div style={detailStyle}>{profile.email}</div>
          </div>

          <div>
            <span style={{ color: "#687386", fontSize: "13px" }}>User ID</span>
            <div style={detailStyle}>{profile._id}</div>
          </div>

          <div>
            <span style={{ color: "#687386", fontSize: "13px" }}>Account Role</span>
            <div style={detailStyle}>{profile.role}</div>
          </div>

          <div>
            <span style={{ color: "#687386", fontSize: "13px" }}>Account Status</span>
            <div style={detailStyle}>{profile.status}</div>
          </div>

          <div>
            <span style={{ color: "#687386", fontSize: "13px" }}>Registration Date</span>
            <div style={detailStyle}>
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-IN")
                : "—"}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #e8ebf0", margin: "28px 0" }} />

        <h3>
          <User size={19} style={{ verticalAlign: "middle", marginRight: "8px" }} />
          Update Profile
        </h3>

        <form onSubmit={handleUpdate} style={{ marginTop: "20px" }}>
          <label style={labelStyle}>
            Full Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              style={fieldStyle}
              placeholder="Enter your name"
              required
              minLength={2}
            />
          </label>

          <div style={{ borderTop: "1px solid #e8ebf0", margin: "25px 0" }} />

          <h3>
            <Lock size={19} style={{ verticalAlign: "middle", marginRight: "8px" }} />
            Change Password
          </h3>

          <p style={{ color: "#687386", fontSize: "13px", marginBottom: "18px" }}>
            Leave all password fields empty if you do not want to change your password.
          </p>

          <label style={labelStyle}>
            Current Password
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              style={fieldStyle}
              placeholder="Enter current password"
              autoComplete="current-password"
            />
          </label>

          <label style={labelStyle}>
            New Password
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              style={fieldStyle}
              placeholder="Enter new password"
              autoComplete="new-password"
              minLength={8}
            />
          </label>

          <label style={labelStyle}>
            Confirm New Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              style={fieldStyle}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </label>

          {error && (
            <div className="auth-error" style={{ marginBottom: "15px" }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: "#e9f8ef",
              color: "#187342",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "15px",
              fontSize: "14px"
            }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            className="export-button"
            disabled={saving}
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

// ================= SESSION CHECK =================

function SessionCheck() {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setChecking(false);
      return;
    }

    api.get("/auth/me")
      .then((response) => {
        const user = response.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        setValid(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setValid(false);
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  if (checking) {
    return <div className="auth-page">Checking your session...</div>;
  }

  if (valid) {
    const user = getStoredUser();

    return (
      <Navigate
        to={user?.role === "admin" ? "/admin" : "/user"}
        replace
      />
    );
  }

  return <Login />;
}

// ================= MAIN APP =================

function App() {
  return (
    <Routes>
      <Route path="/" element={<SessionCheck />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/add-user" element={<AdminAddUser />} />
      </Route>

      <Route element={<ProtectedRoute allowedRole="user" />}>
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/profile" element={<MyProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
