const Setting = require("../models/Setting");

async function getOrCreateSettings() {
  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create({});
  return settings;
}

// GET /api/settings (public — used to display store info)
async function getSettings(_req, res) {
  const settings = await getOrCreateSettings();
  res.json(settings);
}

// PUT /api/settings (admin)
async function updateSettings(req, res) {
  const settings = await getOrCreateSettings();
  const { storeName, whatsapp, email, city, shippingFee, freeShippingOver } = req.body;
  if (storeName !== undefined) settings.storeName = storeName;
  if (whatsapp !== undefined) settings.whatsapp = whatsapp;
  if (email !== undefined) settings.email = email;
  if (city !== undefined) settings.city = city;
  if (shippingFee !== undefined) settings.shippingFee = Number(shippingFee);
  if (freeShippingOver !== undefined) settings.freeShippingOver = Number(freeShippingOver);
  await settings.save();
  res.json(settings);
}

module.exports = { getSettings, updateSettings };
