import { Inngest } from "inngest";
import connectDB from "./db";
import User from "../models/user";

// Create Inngest client
export const inngest = new Inngest({ id: "klyro-next" });


// -------------------- CREATE --------------------
export const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        _id: id,
        name: `${first_name} ${last_name}`,
        email: email_addresses[0].email_address,
        imageUrl: image_url
      };

      await connectDB();
      await User.create(userData);
      console.log("✅ User created:", userData);

    } catch (error) {
      console.error("❌ Error in syncUserCreation:", error);
      throw error;
    }
  }
);


// -------------------- UPDATE --------------------
export const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        name: `${first_name} ${last_name}`,
        email: email_addresses[0].email_address,
        imageUrl: image_url
      };

      await connectDB();
      const updated = await User.findByIdAndUpdate(id, userData, { new: true });

      if (!updated) {
        console.warn("⚠️ User not found to update:", id);
      } else {
        console.log("✅ User updated:", updated);
      }

    } catch (error) {
      console.error("❌ Error in syncUserUpdation:", error);
      throw error;
    }
  }
);


// -------------------- DELETE --------------------
export const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      const { id } = event.data;
      await connectDB();

      const deleted = await User.findByIdAndDelete(id);

      if (!deleted) {
        console.warn("⚠️ User not found to delete:", id);
      } else {
        console.log("✅ User deleted:", deleted);
      }

    } catch (error) {
      console.error("❌ Error in syncUserDeletion:", error);
      throw error;
    }
  }
);
