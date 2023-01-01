const { passwordHash } = require('../helper/password')
module.exports = async () => [
    {
        nama_lengkap: 'Lukman harun',
        email: 'lukman@admin.com',
        password: await passwordHash('Lukman@admin1'),
        role: 'admin'
    },
    {
        nama_lengkap: 'Lukman',
        email: 'lukman@user.com',
        password: await passwordHash('Lukman@user1'),
        role: 'user'
    },
];