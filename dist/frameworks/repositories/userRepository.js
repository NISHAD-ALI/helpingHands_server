"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../database/userModel"));
const donationModel_1 = __importDefault(require("../database/donationModel"));
class userRepository {
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData = yield userModel_1.default.findOne({ email: email });
                return userData ? userData.toObject() : null;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to fetch user data');
            }
        });
    }
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newUser = new userModel_1.default(user);
                yield newUser.save();
                return newUser ? newUser.toObject() : null;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to save user data');
            }
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userdata = yield userModel_1.default.findById(id);
                return userdata;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to find user");
            }
        });
    }
    changePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield userModel_1.default.updateOne({ email: email }, { $set: { password: password } });
                return user.acknowledged;
            }
            catch (error) {
                console.log(error);
                throw new Error("Failed to update password");
            }
        });
    }
    editUser(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newData = yield userModel_1.default.updateOne({ _id: id }, user, { new: true });
                return newData.acknowledged;
            }
            catch (error) {
                console.log(error);
                throw new Error("Failed to update user Details");
            }
        });
    }
    donation(amount, userId, donationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userUpdateResult = yield userModel_1.default.findByIdAndUpdate(userId, { $inc: { donationsFund: amount } }, { new: true });
            const donationUpdateResult = yield donationModel_1.default.findByIdAndUpdate(donationId, {
                $inc: { amountCollected: amount },
                $addToSet: { donatedUsers: userId }
            }, { new: true });
            if (!userUpdateResult) {
                throw new Error('User not found');
            }
            if (!donationUpdateResult) {
                throw new Error('Donation not found');
            }
            return true;
        });
    }
}
exports.default = userRepository;
