'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const users = [{ userId: 0, name: 'Pratik', email: 'p@s', phone: '8523431224', isActive: 0 }, { userId: 1, name: 'Pratik', email: 'p@s', phone: '8523431224', isActive: 0 }, { userId: 2, name: 'Pratik', email: 'p@s', phone: '8523431224', isActive: 0 }];

const checkUserValidity = user => {
    for (const field in user) {
        if (userFieldValidations[field] == 'required' && !user[field]) {
            return false;
        }
    }
    return true;
};

const userFieldValidations = {
    name: 'required',
    email: 'required',
    phone: 'required',
    isActive: 'required'
};

const app = (0, _express2.default)();
app.use(_bodyParser2.default.json());
_sourceMapSupport2.default.install();

app.get('/api/users', (req, res) => {
    res.json({ _metadata: users.length, data: users });
});

app.post('/api/users', (req, res) => {
    const newUser = req.body;
    if (checkUserValidity(newUser)) {
        //Push User To Db
    }
});

app.listen(3000, () => {
    console.log('app started on port 3000');
});
//# sourceMappingURL=server.js.map