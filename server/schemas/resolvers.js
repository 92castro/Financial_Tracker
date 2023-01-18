const { AuthenticationError } = require("apollo-server-express");
const { User, TotalIncome, FinancialData } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    user: async () => {
      const user = await User.find();
      return user;
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      console.log(password);
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({
        username,
        email,
        password,
      });
      const token = signToken(user);

      return { token, user };
    },
    addIncome: async (parent, {salary, _id}) => {
      const income = await User.findOneAndUpdate(
        {_id},
        { $push: {income: salary} },
        { new: true }
      );
      return income
    }
  },
};

module.exports = resolvers;
