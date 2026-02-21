import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Restaurant from "../models/Restaurant.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const MODEL_BY_ROLE = {
  user: User,
  restaurant: Restaurant,
  admin: Admin
};

const sanitizeUser = (doc) => {
  const { password, __v, ...safe } = doc.toObject();
  return safe;
};

const findAccountByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (user) return { account: user, role: "user" };

  const restaurant = await Restaurant.findOne({ email });
  if (restaurant) return { account: restaurant, role: "restaurant" };

  const admin = await Admin.findOne({ email });
  if (admin) return { account: admin, role: "admin" };

  return null;
};

/* =========================
   USER REGISTER
========================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const normalizedRole = role ? role.toLowerCase().trim() : "user";
    const allowedRoles = ["user", "restaurant", "admin"];
    const accountRole = allowedRoles.includes(normalizedRole)
      ? normalizedRole
      : "user";

    const existingAccount = await findAccountByEmail(email);
    if (existingAccount) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const Model = MODEL_BY_ROLE[accountRole] || User;
    const hashedPassword = await bcrypt.hash(password, 10);

    const account = await Model.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: accountRole
    });

    res.status(201).json({
      message: `Registered successfully as ${accountRole}`,
      user: sanitizeUser(account)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   USER LOGIN
========================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let accountInfo = null;
    if (role && MODEL_BY_ROLE[role]) {
      const account = await MODEL_BY_ROLE[role].findOne({ email });
      if (account) {
        accountInfo = { account, role };
      }
    } else {
      accountInfo = await findAccountByEmail(email);
    }

    if (!accountInfo) {
      return res.status(404).json({ message: "Account not found" });
    }

    const { account, role: accountRole } = accountInfo;

    if (accountRole === "restaurant" && account.approved === false) {
      return res.status(403).json({ message: "Restaurant not approved yet" });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: account._id, role: accountRole },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: sanitizeUser(account)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
