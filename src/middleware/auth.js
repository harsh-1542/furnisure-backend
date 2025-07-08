import { verifyToken } from "@clerk/backend";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // console.log("====================================tokennnnn");
  // console.log(token);
  // console.log("====================================");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }

  try {
    // Verify Clerk token
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    const user = await clerkClient.users.getUser(payload.sub);

    req.user = {
      id: user.id,
      email: user.emailAddresses?.[0]?.emailAddress,
      fullName: user.fullName,
      isAdmin: user.publicMetadata?.isAdmin === true,
      role: user.publicMetadata?.role || "user",
    };

    // console.log("====================================");
    // console.log(payload);
    // console.log("====================================");
    // Fetch full user info from Clerk using the user ID (sub)
    // const user = await users.getUser(payload.sub);

    // console.log("====================================print user");
    // console.log(user);
    // console.log("====================================");
    // req.user = user; // Attach full Clerk user info to req.user
    next();
  } catch (err) {
    console.log("====================================");
    console.log(err);
    console.log("error in ====================================");
    return res
      .status(403)
      .json({ message: "Not authorized to access this route" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user has required role or isadmin flag from Clerk metadata
    const userRole = req.user.role;

    console.log("====================================");
    console.log(userRole);
    console.log("====================================");
    const isAdmin = req.user.isadmin === true || req.user.isAdmin === true;
    if (!roles.includes(userRole) && !(roles.includes("admin") && isAdmin)) {
      return res.status(403).json({
        message: `User role ${userRole} is not authorized to access this route`,
      });
    }
    next();
  };
};

export const isAdmin = (req, res, next) => {
  const isAdmin = req.user?.isAdmin === true || req.user?.isadmin === true;
  if (!isAdmin) {
    return res.status(403).json({ message: "User is not authorized as admin" });
  }
  next();
};
