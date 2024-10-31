import mongoose from "mongoose";
// import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    number: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    clients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    const user = this;
    
    if (user.isModified("password")) {
        // user.password = await bcrypt.hash(user.password, 8);
    }
    
    next();
    });

const User = mongoose.model("User", UserSchema);

export default User;
