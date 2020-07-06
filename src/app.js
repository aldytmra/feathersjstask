const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const session = require('express-session');
const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const fs = require('fs');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const authentication = require('./authentication');

const sequelize = require('./sequelize');
const ejs = require('ejs');

const app = express(feathers());
var csrfProtection = csrf({ cookie: true })
// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser())

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.set('views', path.join(__dirname, '../views'));
//set view engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '',
    database: 'edneed'
});

const salt = '$2b$10$YicaNm7tBqCQ0O3frly8BO';
var sessionMiddleware = session({
    secret: "keyboard cat"
});

app.use(sessionMiddleware);
conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');

});

app.use('/assets', express.static(app.get('public')));

app.get('/loginadmin', csrfProtection, function (req, res, next) {
    res.render('loginadmin', {
        csrfToken: req.csrfToken()
    })
});

app.get('/loginuser', csrfProtection, function (req, res, next) {
    res.render('loginuser', {
        csrfToken: req.csrfToken()
    })
});

app.post('/logadmin', csrfProtection, function (req, res, next) {
    let sql = "SELECT * FROM admin WHERE name = ?";
    if (req.body.username) {
        let query = conn.query(sql, [req.body.username], async (err, results) => {
            console.log(results[0] == undefined)
            if (results[0] == undefined) {

                return res.json({
                    success: false,
                    msg: 'Username Not Found!',
                });

            } else {
                let compare = await bcrypt.compare(req.body.password, results[0].password);
                if (compare) {
                    req.session.username = req.body.username
                    req.session.isAdmin = true
                    req.session.save()
                    return res.json({
                        success: true,
                        msg: 'success',
                    });
                } else {
                    return res.json({
                        success: true,
                        msg: 'Password Not Match!',
                    });
                }
            }
        });
    }
});

app.post('/loguser', csrfProtection, function (req, res, next) {
    let sql = "SELECT * FROM users WHERE name = ?";
    if (req.body.username) {
        let query = conn.query(sql, [req.body.username], async (err, results) => {
            console.log(results[0] == undefined)
            if (results[0] == undefined) {

                return res.json({
                    success: false,
                    msg: 'Username Not Found!',
                });

            } else {
                let compare = await bcrypt.compare(req.body.password, results[0].password);
                if (compare) {
                    req.session.username = req.body.username
                    req.session.isUser = true
                    req.session.save()
                    return res.json({
                        success: true,
                        msg: 'success',
                    });
                } else {
                    return res.json({
                        success: true,
                        msg: 'Password Not Match!',
                    });
                }
            }
        });
    }
});

app.post('/regusers', csrfProtection, async function (req, res, next) {
    let resultHash = await bcrypt.hash(req.body.password, salt);
    let mobile = req.body.mobile;
    let sql2 = await "INSERT INTO users (name,mobile,password) VALUES ('" + req.body.username + "', '" + mobile + "', '" + resultHash + "')";
    let query2 = conn.query(sql2, async (err, data) => {
        if (err) {
            throw err
        } else {
            return res.json({
                success: true,
                msg: 'success',
            });
        }
    });
});

app.get('/registeruser', csrfProtection, function (req, res, next) {
    res.render('registeruser', {
        csrfToken: req.csrfToken()
    })
});



app.get('/dashboardadmin', csrfProtection, function (req, res, next) {
    if (!req.session.isAdmin) {
        res.redirect('/');

    } else {
        if (req.session.username) {

            function getAllCategories(callback, total, parent_id = 0, sub_mark = '', htmlArray = []) {
                let sql = `SELECT * FROM categories WHERE parent_id = '${parent_id}' ORDER BY name ASC`;
                let query = conn.query(sql, (err, results) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        if (results[0] != undefined) {
                            results.forEach((el, i) => {
                                htmlArray.push({
                                    id: el.id,
                                    name: sub_mark + el.name
                                });
                                getAllCategories(callback, total, el.id, `${sub_mark}---`, htmlArray)
                            });
                        }

                    }
                });

                if (htmlArray.length == total) {
                    callback(htmlArray)
                }
            }

            async function asyncForEach(array, callback) {
                for (let index = 0; index < array.length; index++) {
                    await callback(array[index], index, array);
                }
            }


            let sql = `SELECT *,count(*) as total FROM categories  ORDER BY name ASC`;
            let query = conn.query(sql, (err, results) => {
                if (err) {
                    console.log(err)
                }
                else {
                    getAllCategories(callback, results[0].total, 0, '', []);
                }

            });


            function callback(data) {
                console.log(data)
                res.render('dashboardadmin', {
                    username: req.session.username,
                    hal: 'Dashboard Admin',
                    csrfToken: req.csrfToken(),
                    data: data
                });
            }



        }
    }
});

app.get('/dashboarduser', csrfProtection, function (req, res, next) {
    if (!req.session.isUser) {
        res.redirect('/');

    } else {
        if (req.session.username) {

            function getAllCategories(callback, total, parent_id = 0, sub_mark = '', htmlArray = []) {
                let sql = `SELECT * FROM categories WHERE parent_id = '${parent_id}' ORDER BY name ASC`;
                let query = conn.query(sql, (err, results) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        if (results[0] != undefined) {
                            results.forEach((el, i) => {
                                htmlArray.push({
                                    id: el.id,
                                    name: sub_mark + el.name
                                });
                                getAllCategories(callback, total, el.id, `${sub_mark}---`, htmlArray)
                            });
                        }

                    }
                });

                if (htmlArray.length == total) {
                    callback(htmlArray)
                }
            }

            async function asyncForEach(array, callback) {
                for (let index = 0; index < array.length; index++) {
                    await callback(array[index], index, array);
                }
            }


            let sql = `SELECT *,count(*) as total FROM categories  ORDER BY name ASC`;
            let query = conn.query(sql, (err, results) => {
                if (err) {
                    console.log(err)
                }
                else {
                    getAllCategories(callback, results[0].total, 0, '', []);
                }

            });


            function callback(data) {
                console.log(data)
                res.render('dashboarduser', {
                    username: req.session.username,
                    hal: 'Dashboard User',
                    csrfToken: req.csrfToken(),
                    data: data
                });
            }



        }
    }
});


app.post('/addparentcategory', csrfProtection, function (req, res) {
    if (!req.session.isAdmin) {
        res.redirect('/loginadmin');
    } else {
        let sql2 = "INSERT INTO categories (parent_id,name) VALUES (0,'" + req.body.name + "')";
        let query2 = conn.query(sql2, async (err, data) => {
            if (err) {
                throw err
            } else {
                return res.json({
                    success: true,
                    msg: 'Category Success Saved!',
                });
            }
        });
    }
});

app.post('/addsubcategory', csrfProtection, function (req, res) {
    if (!req.session.isAdmin) {
        res.redirect('/loginadmin');
    } else {
        let sql2 = "INSERT INTO categories (parent_id,name) VALUES ('" + req.body.idsub + "','" + req.body.name + "')";
        let query2 = conn.query(sql2, async (err, data) => {
            if (err) {
                throw err
            } else {
                return res.json({
                    success: true,
                    msg: 'Category Success Saved!',
                });
            }
        });
    }
});

app.post('/dataeditsubcategory', csrfProtection, function (req, res) {
    if (!req.session.isAdmin) {
        res.redirect('/loginadmin');
    } else {
        let sql = `SELECT * FROM categories where id = ${req.body.idsub}`;
        if (req.session.username) {
            let query = conn.query(sql, async (err, data) => {
                if (!err) {
                    return res.json(data);
                } else {
                    res.redirect('/loginadmin');
                }
            });
        }
    }
});

app.post('/editsubcategory', csrfProtection, function (req, res) {
    if (!req.session.isAdmin) {
        res.redirect('/loginadmin');
    } else {
        let sql2 = `UPDATE categories SET name='${req.body.name}' where id='${req.body.idsub}'`;
        let query2 = conn.query(sql2, async (err, data) => {
            if (err) {
                throw err
            } else {
                return res.json({
                    success: true,
                    msg: 'Category Success Updated!',
                });
            }
        });
    }
});

app.post('/delcategory', csrfProtection, function (req, res) {
    if (!req.session.isAdmin) {
        res.redirect('/loginadmin');
    } else {
        let sql2 = `DELETE FROM categories where id='${req.body.idsub}' OR parent_id ='${req.body.idsub}'`;
        let query2 = conn.query(sql2, async (err, data) => {
            if (err) {
                throw err
            } else {
                return res.json({
                    success: true,
                    msg: 'Category Success Deleted!',
                });
            }
        });
    }
});

app.get('/p/.*', function (req, res) {
    res.send(req.params[0] + ' ' + req.params[1] + ' ' + req.params[2])
})


// // Host the public folder
// app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
app.use('/', express.static(app.get('public')));



// // Set up Plugins and providers
// app.configure(express.rest());
// app.configure(socketio());

// app.configure(sequelize);

// // Configure other middleware (see `middleware/index.js`)
// app.configure(middleware);
// app.configure(authentication);
// // Set up our services (see `services/index.js`)
// app.configure(services);
// // Set up event channels (see channels.js)
// app.configure(channels);

// // Configure a middleware for 404s and the error handler
// app.use(express.notFound());
// app.use(express.errorHandler({ logger }));

// app.hooks(appHooks);


module.exports = app;
