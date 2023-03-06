const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Adicione um nome"],
    },
    email: {
      type: String,
      required: [true, "Adicione um email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Por favor insira um e-mail válido",
      ],
    },
    password: {
      type: String,
      required: [true, "Adicione uma senha"],
      minLength: [6, "A senha deve ter até 6 caracteres"],
      //   maxLength: [23, "Password must not be more than 23 characters"],
    },
    photo: {
      type: String,
      required: [true, "Adicione uma Foto"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
    phone: {
      type: String,
      default: "+55",
    },
    bio: {
      type: String,
      maxLength: [350, "A biografia não deve ter mais de 350 caracteres"],
      default: "biografia",
    },
  },
  {
    timestamps: true,
  }
);

//   Encrypt password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
