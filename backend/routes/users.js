const router = require("express").Router();
const {
  User,
  signupValidation,
  loginValidation,
  updateValidation,
  emailValidation,
  usernameValidation,
  passwordValidation,
  tokenValidation,
  singlePasswordValidation,
} = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../helpers/generateToken");
const isAuth = require("../middleware/isAuthenticated");
const formidable = require("formidable");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })
);

let tokenCheck = "";

// LOGIN
router.post("/login", async (req, res) => {
  //! INPUT VALIDATION
  const { error } = loginValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //! CHECK IF THE USER IS  REGISTERED
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      //! CHECK IF THE PASSWORD IS CORRECT
      bcrypt
        .compare(req.body.password, user.password)
        .then((match) => {
          if (match) {
            // LOGIN THE USER
            const token = generateToken(user._id);
            tokenCheck = token;
            res.status(200).json({ token: token });
          } else {
            return res
              .status(400)
              .json({ message: "Invalid email or password" });
          }
        })
        .catch((err) => {
          res.status(400).json({ message: err.message });
        });
    } else {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  //! INPUT VALIDATION
  const { error } = signupValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //! CHECK IF THE USER IS ALREADY REGISTERED
  try {
    let userByEmail = await User.findOne({ email: req.body.email });
    let userByName = await User.findOne({ username: req.body.username });

    if (userByEmail || userByName)
      return res.status(400).json({ message: "User already registered" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

  //! REGISTER THE USER
  try {
    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 12),
    });
    user = await user.save();
    if (!user) {
      return res.status(400).json({ message: "Failed to register the user" });
    } else {
      res.status(201).json({ message: "Registered Sucessfully" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },

  filename: function (req, file, cb) {
    const extension = FILE_TYPE_MAP[file.mimetype];
    return cb(null, `${Date.now() + req.user.userId}.${extension}`);
  },
});

const imageValidation = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});
const upload = imageValidation.single("profilePicture");

// UPDATE PROFILE
router.post("/update-profilepicture", isAuth, async function (req, res) {
  try {
    upload(req, res, async function (err) {
      if (req.file !== undefined) {
        if (err) {
          return res.status(400).json({ message: err.message });
        } else {
          let id = req.user.userId;
          let user = await User.findByIdAndUpdate(id, {
            profilePicture: req.file.filename,
          });
          if (!user) {
            return res.status(400).json({ message: "Failed to update" });
          } else {
            res.status(200).json({ message: "Updated Sucessfully" });
          }
        }
      } else {
        res.status(400).json({ message: "No valid images found" });
      }
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

// CHANGE PASSWORD
router.post("/change-password", isAuth, async (req, res) => {
  const { error } = singlePasswordValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    let user = await User.findOne({
      _id: req.user.userId,
    });
    if (user) {
      User.findByIdAndUpdate(
        req.user.userId,
        { password: bcrypt.hashSync(req.body.password, 12) },
        function (err, docs) {
          if (err) {
            res.status(400).json({ message: err });
          } else {
            res.status(200).json({ message: "Updated Sucessfully" });
          }
        }
      );
    } else {
      return res.status(400).json({ message: "Invalid  password" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

// CHANGE EMAIL
router.post("/change-email", isAuth, async (req, res) => {
  const { error } = emailValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    let currentPassword = req.body.currentPassword;

    let emailCheck = await User.findOne({
      email: req.body.email,
    });

    let user = await User.findOne({
      _id: req.user.userId,
    });

    if (emailCheck) {
      return res.status(400).json({ message: "Email already taken..." });
    } else {
      User.findByIdAndUpdate(
        req.user.userId,
        { email: req.body.email },
        function (err, docs) {
          if (err) {
            res.status(400).json({ message: "Something went wrong.." });
          } else {
            res.status(200).json({ message: "Updated Sucessfully" });
          }
        }
      );
    }
  } catch (error) {
    res.status(400).json({ message: "Something went wrong.." });
  }
});

// CHANGE USERNAME
router.post("/change-username", isAuth, async (req, res) => {
  const { error } = usernameValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    let usernameCheck = await User.findOne({
      username: req.body.username,
    });

    let user = await User.findOne({
      _id: req.user.userId,
    });

    if (usernameCheck) {
      return res.status(400).json({ message: "Username already taken..." });
    } else {
      User.findByIdAndUpdate(
        req.user.userId,
        { username: req.body.username },
        function (err, docs) {
          if (err) {
            res.status(400).json({ message: "Something went wrong.." });
          } else {
            res.status(200).json({ message: "Updated Sucessfully" });
          }
        }
      );
    }
  } catch (error) {
    res.status(400).json({ message: "Something went wrong.." });
  }
});

// FORGET PASSWORD
router.post("/forgot-password", (req, res) => {
  const { error } = emailValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      const token = buffer.toString("hex");
      let user = new User({
        email: req.body.email,
      });
      user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res
          .status(400)
          .json({ message: "No Account with that email found" });
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;

      return user
        .save()
        .then((result) => {
          transporter.sendMail({
            to: req.body.email,
            from: "internetpractice274@gmail.com",
            subject: "Password reset",
            html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:3000/api/reset/${token}">link</a> to set a new password.</p>
            `,
          });
        })
        .then(() => {
          res
            .status(200)
            .json({ message: "Check your email for password link.." });
        })
        .catch((err) => {
          res.status(400).json({ message: "Something went wrong" });
        });
    });
  } catch (error) {
    res.status(400).json({ message: "Something Went Wrong..." });
  }
});

// RENDER PAGE FOR FORGOT PASSWORD
router.get("/reset/:token", async (req, res) => {
  try {
    let token = req.params.token;
    let user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (user) {
      res.render("auth/new-password", {
        path: "/new-password",
        token: req.params.token,
      });
    } else {
      res.status(400).json({ message: "Invalid Token" });
    }
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

// SET NEW PASSWORD
router.post("/reset/:token", async (req, res) => {
  const { error } = singlePasswordValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    let token = req.params.token;
    let user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (user) {
      User.findByIdAndUpdate(
        user._id,
        { password: bcrypt.hashSync(req.body.password, 12) },
        function (err, docs) {
          if (err) {
            res.status(400).json({ message: err.message });
          } else {
            user.resetToken = null;
            user.resetTokenExpiration = null;
            user.save();
            res.status(200).json({ message: "Password Updated" });
          }
        }
      );
    } else {
      res.status(400).json({ message: "Invalid Token" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// VERIFY LOGIN
router.post("/isLoggedIn", (req, res) => {
  const { error } = tokenValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  if (req.body.token === tokenCheck) {
    res.status(200).json({ token: tokenCheck });
  } else {
    res.status(403).json({ message: "User Unauthorized" });
  }
});

// USER DETAILS
router.get("/profile", isAuth, async (req, res) => {
  try {
    let user = await User.findById(req.user.userId);

    if (user) {
      res.status(200).send(user);
    } else {
      res.status(400).json({ message: "Something went wrong..." });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
