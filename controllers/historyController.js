
/**
 * Speech history controller
 * Handles speech history and favorites using Supabase.
 */

// Get all speech history for the logged-in user
export const getHistory = async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from("speech_history")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch speech history.",
    });
  }
};

// Save a new speech history item
export const saveHistory = async (req, res) => {
  try {
    const {
      text,
      language,
      voice,
      audio,
      date,
      isFavorite,
    } = req.body;

    if (!text || !language || !voice) {
      return res.status(400).json({
        success: false,
        message: "Text, language, and voice are required.",
      });
    }

    const { data, error } = await req.supabase
      .from("speech_history")
      .insert([
        {
          user_id: req.user.id,
          text,
          language,
          voice,
          audio: audio || null,
          date: date || new Date().toLocaleString(),
          is_favorite: !!isFavorite,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({
      success: true,
      message: "Speech history saved successfully.",
      data,
    });
  } catch (error) {
    console.error("Save history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save speech history.",
    });
  }
};

// Toggle favorite status
export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: existingItem, error: fetchError } =
      await req.supabase
        .from("speech_history")
        .select("is_favorite")
        .eq("id", id)
        .eq("user_id", req.user.id)
        .single();

    if (fetchError || !existingItem) {
      return res.status(404).json({
        success: false,
        message: "Speech history item not found.",
      });
    }

    const newFavoriteStatus = !existingItem.is_favorite;

    const { data, error } = await req.supabase
      .from("speech_history")
      .update({
        is_favorite: newFavoriteStatus,
      })
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: "Favorite status updated successfully.",
      data,
    });
  } catch (error) {
    console.error("Toggle favorite error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update favorite status.",
    });
  }
};

// Delete speech history item
export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await req.supabase
      .from("speech_history")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: "Speech history deleted successfully.",
    });
  } catch (error) {
    console.error("Delete history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete speech history.",
    });
  }
};