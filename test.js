const express = require('express');
const paypal = require('paypal-rest-sdk');
const fs = require('fs');
const exphdbs = require('express-handlebars');
var path = require('path');
const app = express();


app.set('views', path.join(__dirname, "views"));
app.engine('handlebars', exphdbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AXMeJ1HaMiTJqoZAXDezOC_NQtXZjYGH55WmJVTvqtrZgkva2xN1NkPQzR8eFyrUWR6TiK9y3YzWLpws',
    'client_secret': 'EDtLfGhK53kOEEbVhTb0kzwcLCwfmRBsgYzTvJ9q3HZ9SgWXL6fGlMWs33hCbKe7RQENxXkGpabYDmok'
});


var items = JSON.parse(fs.readFileSync('items.json'));
var total = 0;
for (i = 0; i < items.length; i++) {
    total += parseFloat(items[i].price) * items[i].quantity;
}

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/pay', function (req, res) {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": items
            },
            "amount": {
                "currency": "USD",
                "total": total.toString()
            },
            "description": "Hat for the best team ever"
        }]
    };
    console.log(object);
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            res.render('cancle');
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });

});
app.get('/cancle', function (req, res) {
    res.json('cancle');
});
app.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    let total = 76
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": total.toString()
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            res.json('cancle');
        } else {
            console.log(JSON.stringify(payment));
            res.json('success');
        }
    });
});

app.get('/cancel', (req, res) => res.send('Cancelled'));

app.listen(3000, function () {
    console.log(total);
});



// const paypalPost = asyncHandler(async (req, res) => {
//     const { address, orders, user_id } = req.body;
//     let total = (orders.reduce((a, b) => {
//         return a + (b.quantity * (b.cart.price / 23000));
//     }, 0));
//     let items = orders.map((item, i) => {
//         return {
//             "name": item.cart.name,
//             "sku": "sku" + i,
//             "price": (item.quantity * (item.cart.price / 23000).toFixed(2)).toString(),
//             "currency": "USD",
//             "quantity": 1
//         }
//     });

//     const create_payment_json = {
//         "intent": "sale",
//         "payer": {
//             "payment_method": "paypal",
//         },
//         "transactions": [{
//             "item_list": {
//                 "items": items
//             },
//             "amount": {
//                 "currency": "USD",
//                 "total": (total.toFixed(2)).toString(),

//             },
//             "description": "Mô tả đơn hàng của bạn"
//         }],
//         "redirect_urls": {
//             "return_url": 'http://localhost:8888/api/order/paypal/success',
//             "cancel_url": 'http://localhost:3000/',
//         },
//     };

//     paypal.payment.create(create_payment_json, function (error, payment) {
//         if (error) {
//             throw error;
//         } else {
//             console.log('Create Payment Response');
//             for (let i = 0; i < payment.links.length; i++) {
//                 if (payment.links[i].rel === 'approval_url') {
//                     console.log(payment.links[i].href);
//                     return res.redirect(payment.links[i].href);
//                 }
//             }
//         }
//     });
// });

// const success = asyncHandler(async (req, res) => {
//     console.log('dong', req.query);
//     const payerId = req.query.PayerID;
//     const paymentId = req.query.paymentId;
//     const total = 2.78;
//     const execute_payment_json = {
//         "payer_id": payerId,
//         "transactions": [{
//             "amount": {
//                 "currency": "USD",
//                 "total": total.toString()
//             }
//         }]
//     };

//     paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
//         if (error) {
//             res.json('cancle');
//         } else {
//             console.log(JSON.stringify(payment));
//             res.json('success');
//         }
//     });
// });