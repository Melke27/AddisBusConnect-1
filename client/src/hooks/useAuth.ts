import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from './use-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'passenger' | 'admin';
  preferredLanguage: 'en' | 'am' | 'om';
  profileImageUrl?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get token from localStorage
  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  };

  // Get user from localStorage or API
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: async (): Promise<User | null> => {
      const token = getToken();
      if (!token) return null;

      try {
        const response = await fetch('/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Token is invalid, remove it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return null;
        }

        const userData = await response.json();
        return userData;
      } catch (error) {
        console.error('Auth error:', error);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.setQueryData(["auth", "user"], data.user);
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      window.location.href = '/';
    },
    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async (userData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      preferredLanguage: string;
    }): Promise<AuthResponse> => {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.setQueryData(["auth", "user"], data.user);
      toast({
        title: 'Account created successfully',
        description: 'Welcome to AddisBusConnect!',
      });
      window.location.href = '/';
    },
    onError: (error: Error) => {
      toast({
        title: 'Signup failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = getToken();
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    },
    onSuccess: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      queryClient.setQueryData(["auth", "user"], null);
      queryClient.clear();
      toast({
        title: 'Logged out successfully',
        description: 'Come back soon!',
      });
      window.location.href = '/';
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send reset email');
      }

      return response.json();
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: {
      firstName?: string;
      lastName?: string;
      preferredLanguage?: string;
      profileImageUrl?: string;
    }) => {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "user"], data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast({
        title: 'Profile updated successfully',
        description: 'Your changes have been saved.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Profile update failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (passwordData: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Password changed successfully',
        description: 'Your password has been updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Password change failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isUpdateProfileLoading: updateProfileMutation.isPending,
    isChangePasswordLoading: changePasswordMutation.isPending,
  };
}
