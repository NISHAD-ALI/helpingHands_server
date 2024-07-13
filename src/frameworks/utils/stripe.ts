import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

class StripePayment {
    async createCheckoutSession(amount: number) {
        try {
            const session = await stripe.checkout.sessions.create({
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
                success_url: 'https://helpinghandsindia.vercel.app/donate/success',
                cancel_url: 'https://helpinghandsindia.vercel.app/donate/failure',
            });
            return session.id;
        } catch (error) {
            console.error('Error while creating checkout session', error);
            throw error;
        }
    }
}

export default StripePayment;