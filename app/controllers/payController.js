const stripe = require('stripe')('sk_test_51ITtjSFqylvRHC31xTBBQSddWy98PTypI3j0srpL361mMNuIfjvaZEdKBbHFgWd4xcitvubt1vrEdR1RSLBc9ECq00W9bWfSIX')
const payController = {
    payment: async (req, res) => {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.total * 100,
            currency: 'eur',
            // Verify your integration in this guide by including this parameter
            metadata: { integration_check: 'accept_a_payment' },
        });
        res.json({ "client_secret": paymentIntent['client_secret'] });
    }
};
module.exports = payController