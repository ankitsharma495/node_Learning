const CrudRepository = require('./crud-repository');
const { User } = require('../models');
const { Logger } = require('../config');

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        Logger.info('Repository: Finding user by email');
        const user = await User.findOne({ where: { email } });
        return user;
    }
}

module.exports = UserRepository;
