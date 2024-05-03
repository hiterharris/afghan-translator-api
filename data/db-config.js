const knex = require('knex');
const config = require('../knexfile');

const db = knex(config.development);

const find = () => {
    return db('logs')
}

const findById = (id) => {
    return db('logs')
        .where({ id: Number(id) })
}

const insert = (post) => {
    return db('logs')
        .insert(post)
        .then(ids => ({ id: ids[0] }))
}

const update = (id, post) => {
    return db('logs')
        .where({ id: Number(id) })
        .update(post)
}

const remove = (id) => {
    return db('logs')
        .where({ id: Number(id) })
        .del()
}

module.exports = {
    find,
    findById,
    insert,
    update,
    remove
}