import bcrypt from "bcrypt";
import mongoose, { Model } from "mongoose";
import validator from "validator";
import paginate from "mongoose-paginate-v2";

interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
  isEmailVerified: boolean;
  isPasswordMatch(password: string): Promise<boolean>; // Instance method
}

interface IUserModel extends Model<UserDocument> {
  isPasswordMatch(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      private: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {});
userSchema.plugin(paginate);

userSchema.methods.isPasswordMatch = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model<UserDocument, IUserModel>("User", userSchema);

export default User;
