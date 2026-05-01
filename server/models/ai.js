const mongoose = require("mongoose");
const autoIncrement = require("../utils/mongoose-auto-increment");

const aiSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ["deepseek", "openai", "claude", "gemini", "custom"],
    default: "deepseek",
  },
  apiKey: {
    type: String,
  },
  model: {
    type: String,
    default: "deepseek-v4-flash",
  },
  temperature: {
    type: Number,
    default: 0.7,
  },
  maxTokens: {
    type: Number,
    default: 1000,
  },
  baseURL: {
    type: String,
    default: "https://api.deepseek.com",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

aiSchema.plugin(autoIncrement.plugin, {
  model: "ai",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

aiSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// 添加模型方法
aiSchema.statics.getList = function () {
  return this.find({}).exec();
};

aiSchema.statics.save = function (params) {
  const ai = new this(params);
  return ai.save();
};

aiSchema.statics.update = function (params) {
  const { id, ...updateData } = params;
  return this.findByIdAndUpdate(id, updateData, { new: true }).exec();
};

aiSchema.statics.remove = function (id) {
  return this.findByIdAndRemove(id).exec();
};

const aiModel = mongoose.model("ai", aiSchema);

module.exports = aiModel;
