const mongoose = require("mongoose");
require("dotenv").config();

const Candidate = require("./models/Candidate");
const Project = require("./models/Project");
const { verifyRepo } = require("./services/githubVerifier");

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const candidate = await Candidate.findOne({ github_verified: true });

    if (!candidate) {
      throw new Error("No GitHub verified candidate found in DB");
    }

    console.log("Candidate found:", candidate.github_username);

    const project = new Project({
      candidate_id: candidate._id,
      title: "Test Project",
      description: "Testing GitHub verification",
      github_link: "https://github.com/Sanyukta1304/Air-Draw",
      tech_stack: ["JavaScript"],
    });

    console.log("Update github_link to one real repo of this user before testing.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exit(1);
  }
}

test();