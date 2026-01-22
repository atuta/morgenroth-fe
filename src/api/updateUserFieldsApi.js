// File: updateUserFieldsApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const updateUserFieldsApi = async ({
  user_id,
  first_name, // ✅ NEW
  last_name, // ✅ NEW
  hourly_rate,
  nssf,
  sha,
  kra_pin, // ✅ NEW
  nssf_amount,
  lunch_start,
  lunch_end,
  email,
  phone_number,
  id_number,
  user_role,
}) => {
  try {
    if (!user_id) {
      throw new Error("user_id is required for updating user fields");
    }

    const payload = { user_id };

    // Helper to add field to payload if it has a valid value
    const addToPayload = (key, value) => {
      // We allow empty strings for names if needed, or strictly check for non-empty
      if (value !== undefined && value !== null && value !== "") {
        payload[key] = value;
      }
    };

    // --- Names ---
    addToPayload("first_name", first_name); // ✅ NEW
    addToPayload("last_name", last_name); // ✅ NEW

    // --- Financial & Statutory ---
    if (hourly_rate !== undefined && hourly_rate !== null && hourly_rate !== "") {
      const rate = Number(hourly_rate);
      if (!isNaN(rate)) {
        payload.hourly_rate = rate;
      }
    }

    addToPayload("nssf", nssf);
    addToPayload("sha", sha);
    addToPayload("kra_pin", kra_pin); // ✅ NEW
    addToPayload("nssf_amount", nssf_amount);
    addToPayload("lunch_start", lunch_start);
    addToPayload("lunch_end", lunch_end);

    // --- Contact & Identity ---
    addToPayload("email", email);
    addToPayload("phone_number", phone_number);
    addToPayload("id_number", id_number);
    addToPayload("user_role", user_role);

    console.log("Payload before API call:", payload);

    const response = await axiosInstance.post(Configs.apiUpdateUserFieldsEp, payload);

    return response.data;
  } catch (error) {
    console.error("updateUserFieldsApi error:", error);
    throw error;
  }
};

export default updateUserFieldsApi;
