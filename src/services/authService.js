import { supabase } from './supabaseClient';

// Generate random 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register user with email, password, and details
export const registerUser = async (
  email,
  password,
  firstName,
  lastName,
  hospitalId
) => {
  try {
    // Validate inputs
    if (!email || !password || !firstName || !lastName || !hospitalId) {
      return {
        success: false,
        error: 'Missing required fields',
        message: 'Please fill in all required fields',
      };
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in database with 10 minute expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const { error: otpError } = await supabase.from('otp_tokens').insert([
      {
        email,
        otp,
        expires_at: expiresAt.toISOString(),
      },
    ]);

    if (otpError) {
      console.error('OTP storage error:', otpError);
      return {
        success: false,
        error: otpError.message,
        message: 'Failed to generate OTP. Please try again.',
      };
    }

    // Log OTP in development mode
    console.log(`[DEV] OTP for ${email}: ${otp}`);

    // Store registration data temporarily
    sessionStorage.setItem(
      'registrationData',
      JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        hospitalId,
      })
    );

    return {
      success: true,
      data: { email, otp },
      message: 'Registration initiated. Please verify with OTP.',
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message,
      message: 'An unexpected error occurred during registration',
    };
  }
};

// Verify OTP and complete registration
export const verifyOTP = async (email, otp) => {
  try {
    if (!email || !otp) {
      return {
        success: false,
        error: 'Missing email or OTP',
        message: 'Please enter both email and OTP',
      };
    }

    // Check if OTP is valid
    const { data: otpData, error: otpError } = await supabase
      .from('otp_tokens')
      .select('*')
      .eq('email', email)
      .eq('otp', otp)
      .single();

    if (otpError || !otpData) {
      return {
        success: false,
        error: 'Invalid OTP',
        message: 'The OTP you entered is incorrect or has expired',
      };
    }

    // Check if OTP has expired
    if (new Date(otpData.expires_at) < new Date()) {
      return {
        success: false,
        error: 'OTP expired',
        message: 'The OTP has expired. Please register again.',
      };
    }

    // Get registration data from session
    const registrationData = JSON.parse(
      sessionStorage.getItem('registrationData')
    );

    if (!registrationData) {
      return {
        success: false,
        error: 'Registration data not found',
        message: 'Please register again',
      };
    }

    // Sign up user with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp(
      {
        email: registrationData.email,
        password: registrationData.password,
      }
    );

    if (signUpError) {
      console.error('Sign up error:', signUpError);
      return {
        success: false,
        error: signUpError.message,
        message: 'Failed to create account. Please try again.',
      };
    }

    // Create user profile
    const { error: profileError } = await supabase.from('users').insert([
      {
        id: authData.user.id,
        email: registrationData.email,
        first_name: registrationData.firstName,
        last_name: registrationData.lastName,
        hospital_id: registrationData.hospitalId,
        verified: true,
        role: 'nurse',
      },
    ]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return {
        success: false,
        error: profileError.message,
        message: 'Failed to create user profile',
      };
    }

    // Delete OTP token
    await supabase.from('otp_tokens').delete().eq('email', email);

    // Clear session storage
    sessionStorage.removeItem('registrationData');

    return {
      success: true,
      data: authData.user,
      message: 'Account created successfully. Please log in.',
    };
  } catch (error) {
    console.error('OTP verification error:', error);
    return {
      success: false,
      error: error.message,
      message: 'An unexpected error occurred during verification',
    };
  }
};

// Login user
export const loginUser = async (email, password, rememberMe = false) => {
  try {
    if (!email || !password) {
      return {
        success: false,
        error: 'Missing credentials',
        message: 'Please enter both email and password',
      };
    }

    // Sign in with Supabase
    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      console.error('Sign in error:', signInError);
      return {
        success: false,
        error: signInError.message,
        message: 'Invalid email or password',
      };
    }

    // Fetch user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      console.error('User fetch error:', userError);
      return {
        success: false,
        error: userError.message,
        message: 'Failed to fetch user profile',
      };
    }

    // Check if email is verified
    if (!userData.verified) {
      return {
        success: false,
        error: 'Email not verified',
        message: 'Please verify your email before logging in',
      };
    }

    // Save remember me preference
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    }

    return {
      success: true,
      data: {
        user: authData.user,
        session: authData.session,
        profile: userData,
      },
      message: 'Login successful',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message,
      message: 'An unexpected error occurred during login',
    };
  }
};

// Get current authenticated user
export const getCurrentUser = async () => {
  try {
    const { data: session, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !session.session) {
      return {
        success: false,
        error: 'No active session',
        message: 'User is not authenticated',
      };
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.session.user.id)
      .single();

    if (userError) {
      console.error('User fetch error:', userError);
      return {
        success: false,
        error: userError.message,
        message: 'Failed to fetch user profile',
      };
    }

    return {
      success: true,
      data: userData,
      message: 'User fetched successfully',
    };
  } catch (error) {
    console.error('Get user error:', error);
    return {
      success: false,
      error: error.message,
      message: 'An unexpected error occurred',
    };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to logout',
      };
    }

    // Clear remember me
    localStorage.removeItem('rememberMe');

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error.message,
      message: 'An unexpected error occurred during logout',
    };
  }
};

// Forgot password (placeholder for Phase 2)
export const forgotPassword = async (email) => {
  try {
    if (!email) {
      return {
        success: false,
        error: 'Email is required',
        message: 'Please enter your email address',
      };
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send password reset email',
      };
    }

    return {
      success: true,
      data,
      message: 'Password reset email sent. Check your inbox.',
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return {
      success: false,
      error: error.message,
      message: 'An unexpected error occurred',
    };
  }
};

// Reset password (placeholder for Phase 2)
export const resetPassword = async (newPassword) => {
  try {
    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        error: 'Invalid password',
        message: 'Password must be at least 6 characters',
      };
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Password update error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to update password',
      };
    }

    return {
      success: true,
      data,
      message: 'Password updated successfully',
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      error: error.message,
      message: 'An unexpected error occurred',
    };
  }
};

// Export service object for compatibility with import pattern
export const authService = {
  generateOTP,
  registerUser,
  verifyOTP,
  loginUser,
  getCurrentUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};
