const mongoose = require("mongoose");

const casalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Por favor, adicione um nome"],
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      default: "SKU",
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Adicione um cargo"],
      trim: true,
    },
    quantity: {
      type: String,
      required: [true, "Adicione uma quantidade"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Adicione um valor"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Por favor, adicione uma descrição"],
      trim: true,
    },
  
  date: {
    type: String,
    required: [true, "Por favor, adicione a data"],
    trim: true,
  },
    image: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Casal = mongoose.model("Casal", casalSchema);
module.exports = Casal;
