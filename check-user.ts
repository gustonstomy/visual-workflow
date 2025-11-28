import { prisma } from "./lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("AUTH_SECRET is:", process.env.AUTH_SECRET ? "Set" : "Not Set");
  const email = "gustomstomy@gmail.com";
  const password = "123456";

  console.log(`Checking for user: ${email}`);

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found in database.");

      console.log("Creating user...");
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: "Test User",
        },
      });
      console.log("User created.");
    } else {
      console.log("User found.");
      console.log("Stored hash:", user.password);

      const match = await bcrypt.compare(password, user.password);
      console.log(`Password match for '${password}': ${match}`);

      if (!match) {
        console.log("Password mismatch. Updating password...");
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { email },
          data: { password: hashedPassword },
        });
        console.log("Password updated.");
      }
    }
  } catch (error) {
    console.error("Error accessing database:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // await prisma.$disconnect(); // lib/db manages connection, but good practice to close if standalone?
    // Actually lib/db singleton might keep it open, but for a script it should exit.
  });
