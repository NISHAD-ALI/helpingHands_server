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
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET);
class StripePayment {
    createCheckoutSession(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [
                        {
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: 'Donation',
                                },
                                unit_amount: amount,
                            },
                            quantity: 1,
                        },
                    ],
                    mode: 'payment',
                    success_url: 'http://localhost:5173/donate/success',
                    cancel_url: 'http://localhost:5173/donate/failure',
                });
                return session.id;
            }
            catch (error) {
                console.error('Error while creating checkout session', error);
                throw error;
            }
        });
    }
}
exports.default = StripePayment;
