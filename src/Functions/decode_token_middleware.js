const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function Authorize(req, res, next) {
  const secret_key = process.env.SECRET_KEY;
  const BearerToken = req.headers.authorization;
  const token = BearerToken.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ Message: "Unauthorized user - Missing" });
  }

  jwt.verify(token, secret_key, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ Message: "Unauthorized - Invalid Token" });
    }

    req.user = decoded;
    next();
  });
}

async function Validate_token(token) {
  if (!token) {
    return { isValid: false };
  }

  const secret_key = process.env.SECRET_KEY;
  const header_token = token.replace("Bearer ", "");

  var isValid;
  var Room_ID;
  var Sender;

  jwt.verify(header_token, secret_key, async (err, decoded) => {
    if (err) {
      isValid = false;
    } else {
      isValid = true;
      Room_ID = decoded.Room_ID;
      Sender = decoded.User;
    }
  });
  return { isValid: isValid, Room_ID: Room_ID, Sender: Sender };
}

module.exports = { Authorize, Validate_token };
