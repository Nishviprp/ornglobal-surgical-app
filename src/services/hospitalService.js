import { supabase } from './supabaseClient';

// Get all hospitals
export const getAllHospitals = async () => {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Fetch hospitals error:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }

    return {
      success: true,
      data: data || [],
      error: null,
    };
  } catch (error) {
    console.error('Get hospitals error:', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};

// Get specific hospital by ID
export const getHospitalById = async (hospitalId) => {
  try {
    if (!hospitalId) {
      return {
        success: false,
        error: 'Hospital ID is required',
        data: null,
      };
    }

    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('id', hospitalId)
      .single();

    if (error) {
      console.error('Fetch hospital error:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    console.error('Get hospital error:', error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
};

// Create new hospital
export const createHospital = async (name, city, country) => {
  try {
    if (!name || !city || !country) {
      return {
        success: false,
        error: 'Missing required fields',
        data: null,
      };
    }

    const { data, error } = await supabase
      .from('hospitals')
      .insert([
        {
          name,
          city,
          country,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Create hospital error:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    console.error('Create hospital error:', error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
};

// Export service object for compatibility with import pattern
export const hospitalService = {
  getAllHospitals,
  getHospitalById,
  createHospital,
};
