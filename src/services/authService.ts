const BASE_API_URL = 'https://916e-2a09-bac1-6f20-00-2e5-72.ngrok-free.app';

// Define types for the auth responses
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  refresh_token?: string;
}

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          role: userData.role || 'ADMIN'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Token refresh failed');
      }

      const data = await response.json();
      
      // Update stored tokens
      localStorage.setItem('token', data.token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      this.logout();
      return null;
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset email');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(token: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  async verifyOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${BASE_API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'OTP verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${BASE_API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get profile');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refresh_token');
    // Trigger storage event for multi-tab logout
    window.dispatchEvent(new Event('storage'));
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const user = this.getUserInfo();
    return !!token && !!user;
  }

  getUserInfo(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if user has admin role
  isAdmin(): boolean {
    const user = this.getUserInfo();
    return user?.role === 'ADMIN' || user?.role === 'admin';
  }
}

export default new AuthService();
