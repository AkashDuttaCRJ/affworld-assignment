import { compare, hash } from "bcrypt";
import { Schema, model } from "mongoose";

interface IUser {
  name: {
    first: string;
    last: string;
  };
  username: string;
  email: string;
  password: string;
  profile: string | null;
  provider: "email" | "google" | "both" | null;
  googleProfileData: object | null;
}

interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>({
  name: {
    first: {
      type: String,
      required: true,
    },
    last: {
      type: String,
      required: true,
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  profile: {
    type: String,
    default: null,
  },
  provider: {
    type: String,
    enum: ["email", "google", "both"],
    default: null,
  },
  googleProfileData: {
    type: Object,
    default: null,
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.password && (this.isModified("password") || this.isNew)) {
    try {
      user.password = await hash(user.password, process.env.SALT_ROUNDS || 10);
    } catch (error) {
      return next(error as Error);
    }
  }
  return next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await compare(candidatePassword, this.password);
};

UserSchema.virtual("name.full").get(function () {
  if (this.name === undefined || this.name === null) {
    return "";
  }
  const first =
    this.name.first === undefined || this.name.first === null
      ? ""
      : this.name.first;
  const last =
    this.name.last === undefined || this.name.last === null
      ? ""
      : ` ${this.name.last}`;
  return `${first} ${last}`;
});

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });
UserSchema.set("timestamps", true);

export const User = model("User", UserSchema);
