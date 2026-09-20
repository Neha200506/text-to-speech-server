
import { supabase } from "../config/supabaseClient.js";

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters.",
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(201).json({
      message: data.session
        ? "Account created successfully."
        : "Account created successfully. Please check your email to confirm your account.",
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
            fullName:
              data.user.user_metadata?.full_name || fullName.trim(),
          }
        : null,
      session: data.session || null,
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      return res.status(401).json({
        message: error.message,
      });
    }

    return res.status(200).json({
      message: "Login successful.",
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
            fullName:
              data.user.user_metadata?.full_name ||
              data.user.email?.split("@")[0] ||
              "User",
          }
        : null,
      session: data.session || null,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};